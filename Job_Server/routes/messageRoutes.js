const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Message = require("../models/Message");
const Onboarding = require("../models/onboarding");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const User = require("../models/User"); // Assuming you have a User model with 'role' field
const Company = require("../models/company");

const isValidObjectId = (id) => {
  // Trim input to remove leading or trailing spaces
  if (!id || typeof id !== "string") return false;
  
  id = id.trim();

  if (mongoose.Types.ObjectId.isValid(id)) {
    // This double check ensures the string is exactly valid ObjectId string
    return String(new mongoose.Types.ObjectId(id)) === id;
  }
  return false;
};


// To get the count of unread messages
router.get("/unread-count", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const connections = req.user.connections || [];

    const matchStage = {
      $expr: {
        $and: [
          { $eq: [{ $toString: "$recipient" }, String(userId)] },
          { $eq: ["$read", false] },
        ],
      },
    };

    if (connections.length > 0) {
      const connectionsAsStrings = connections.map(String);
      matchStage.$expr.$and.push({
        $in: [{ $toString: "$sender" }, connectionsAsStrings],
      });
    }

    const unreadCounts = await Message.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $toString: "$sender" },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {};
    unreadCounts.forEach((item) => {
      result[item._id] = item.count;
    });

    res.json(result);
  } catch (err) {
    console.error("Error in GET /unread-count:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get the conversation of particular user by their ID
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const currentUserId = isValidObjectId(req.user._id)
      ? new mongoose.Types.ObjectId(req.user._id)
      : req.user._id;

    // Fetch messages with sender name populated
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId },
      ],
    })
      .sort("createdAt")
      .populate({
        path: "sender",
        select: "name role", // include role for employer detection
      })
      .lean();

    // Get unique sender IDs who are employers
    const employerSenderIds = [
      ...new Set(
        messages
          .filter((msg) => msg.sender && msg.sender.role === "employer")
          .map((msg) => msg.sender._id.toString())
      ),
    ];

    // Query companies logos for these employers
    const companies = await Company.find({
      createdBy: { $in: employerSenderIds },
    }).select("createdBy company_logo").lean();

    // Map employerId => companyLogo
    const companyLogoMap = {};
    companies.forEach((comp) => {
      if (comp.createdBy && comp.company_logo) {
        companyLogoMap[comp.createdBy.toString()] = comp.company_logo;
      }
    });

    // Attach onboarding profileImage and companyLogo to sender
    const formattedMessages = await Promise.all(
      messages.map(async (message) => {
        if (message.sender && message.sender._id) {
          // Attach onboarding profile image
          const onboarding = await Onboarding.findOne(
            { userId: message.sender._id },
            "profileImage"
          );
          message.sender.profileImage = onboarding?.profileImage || null;

          // Attach company logo for employers
          if (message.sender.role === "employer") {
            message.sender.companyLogo =
              companyLogoMap[message.sender._id.toString()] || null;
          }
        }
        return message;
      })
    );

    res.json(formattedMessages);
  } catch (err) {
    console.error("Error in GET /:userId", err);
    res.status(500).json({ error: err.message });
  }
});

// To post the messages between the users
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { recipient, content } = req.body;
    const senderId = req.user._id;

    let imageUrl = null;
    if (req.file) {
  imageUrl = req.file.path; // Cloudinary URL
}


    const message = new Message({
      sender: senderId,
      recipient,
      content,
      image: imageUrl,
    });
    await message.save();

    let populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name"
    );

    if (populatedMessage.sender && populatedMessage.sender._id) {
      const onboarding = await Onboarding.findOne(
        { userId: populatedMessage.sender._id },
        "profileImage"
      );
      populatedMessage = populatedMessage.toObject();
      populatedMessage.sender.profileImage = onboarding?.profileImage || null;
    }

    req.io.to(recipient).emit("new-message", populatedMessage);
    req.io.to(senderId.toString()).emit("new-message", populatedMessage);

    if (recipient !== senderId.toString()) {
      req.io.to(recipient).emit("update-unread-count", {
        senderId: senderId.toString(),
        increment: true,
      });
    }

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// To make the messages read based on their ID's
router.patch("/read/:senderId", verifyToken, async (req, res) => {
  try {
    const senderId = isValidObjectId(req.params.senderId)
      ? new mongoose.Types.ObjectId(req.params.senderId)
      : req.params.senderId;
    const recipientId = isValidObjectId(req.user._id)
      ? new mongoose.Types.ObjectId(req.user._id)
      : req.user._id;

    await Message.updateMany(
      { sender: senderId, recipient: recipientId, read: false },
      { $set: { read: true } }
    );
    req.io.to(String(recipientId)).emit("update-unread-count", {
      senderId: String(senderId),
      increment: false,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/employers-with-conversation", async (req, res) => {
  try {
    let { userId } = req.body;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid or missing user ID" });
    }

    userId = userId.trim();

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const currentUserId = new mongoose.Types.ObjectId(userId);

    // Aggregation pipeline: find distinct other users in conversations with current user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserId },
            { recipient: currentUserId }
          ]
        }
      },
      {
        $project: {
          otherUserId: {
            $cond: [
              { $eq: ["$sender", currentUserId] },
              "$recipient",
              "$sender"
            ]
          },
          content: 1,
          createdAt: 1,
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$otherUserId",
          lastMessage: { $first: "$content" },
          lastMessageTime: { $first: "$createdAt" }
        }
      }
    ]);

    const otherUserIds = conversations.map(c => c._id);

    // Fetch employer users
    const employers = await User.find({
      _id: { $in: otherUserIds },
      role: "employer"
    })
    .select("name onboarding connections role")
    .lean();

    // For each employer, find company by createdBy = employer._id and attach company_logo
    const employersWithCompanyLogo = await Promise.all(
      employers.map(async (employer) => {
        let companyLogo = null;
        const company = await Company.findOne({ createdBy: employer._id }).select("company_logo").lean();
        if (company && company.company_logo) {
          companyLogo = company.company_logo; // store path or URL as is
        }

        const convo = conversations.find(c => c._id.toString() === employer._id.toString());

        return {
          ...employer,
          companyLogo,
          lastMessage: convo?.lastMessage || "",
          lastMessageTime: convo?.lastMessageTime || null,
        };
      })
    );

    // Sort descending by lastMessageTime
    employersWithCompanyLogo.sort((a, b) => {
      if (a.lastMessageTime && b.lastMessageTime) {
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      }
      if (a.lastMessageTime) return -1;
      if (b.lastMessageTime) return 1;
      return 0;
    });

    res.json(employersWithCompanyLogo);
  } catch (error) {
    console.error("Error fetching employers with conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Example: GET /api/messages/conversations-for-employer
router.post("/conversations-for-employer", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid or missing user ID" });
    }

    const employerId = new mongoose.Types.ObjectId(userId);

    // 1. Find all messages involving this employer
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: employerId },
            { recipient: employerId },
          ],
        },
      },
      {
        $project: {
          otherUserId: {
            $cond: [
              { $eq: ["$sender", employerId] },
              "$recipient",
              "$sender",
            ],
          },
          content: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$otherUserId",
          lastMessage: { $first: "$content" },
          lastMessageTime: { $first: "$createdAt" },
        },
      },
    ]);

    const userIds = conversations.map(c => c._id);

    // 2. Fetch users who messaged this employer
    const users = await User.find({ _id: { $in: userIds } })
      .select("name role")
      .lean();

    // 3. Fetch onboarding data for users (if any)
    const onboardingData = await Onboarding.find({
      userId: { $in: userIds },
    }).lean();

    // 4. Fetch company data for users (if any)
    const companyData = await Company.find({
      createdBy: { $in: userIds },
    }).lean();

    // 5. Merge all user info into response
    const usersWithMessages = users.map(user => {
      const convo = conversations.find(c => c._id.toString() === user._id.toString());

      const onboarding = onboardingData.find(
        o => o.userId.toString() === user._id.toString()
      );

      const company = companyData.find(
        c => c.createdBy.toString() === user._id.toString()
      );

      return {
        _id: user._id,
        name: user.name,
        role: user.role,
        onboarding: onboarding || null,
        company: company || null,
        lastMessage: convo?.lastMessage || "",
        lastMessageTime: convo?.lastMessageTime || null,
      };
    });

    // 6. Sort by last message time (most recent first)
    usersWithMessages.sort((a, b) => {
      if (a.lastMessageTime && b.lastMessageTime) {
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      }
      if (a.lastMessageTime) return -1;
      if (b.lastMessageTime) return 1;
      return 0;
    });

    res.json(usersWithMessages);
  } catch (error) {
    console.error("Error in /conversations-for-employer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;

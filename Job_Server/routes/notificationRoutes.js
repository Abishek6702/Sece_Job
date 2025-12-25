const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const User = require("../models/User");
const Onboarding = require("../models/onboarding");
const Job = require("../models/job");
const Company = require("../models/company");

// To get all notifications
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "senderId",
        model: "User",
        select: "name",
      });

    const enrichedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        if (notif.type === "application_status") {
          let companyImage = null;
          let companyName = null;
          let companyId = null;

          const company = await Company.findOne({
            createdBy: notif.senderId,
          }).select("company_name company_logo");

          if (company) {
            companyImage = company.company_logo || null;
            companyName = company.company_name;
            companyId = company._id;

            console.log(
              `Notification: Rendering company logo for companyId=${companyId} name=${companyName} logo=${companyImage}`
            );
          }

          return {
            ...notif._doc,
            sender: {
              _id: companyId,
              name: companyName,
              profileImage: companyImage,
            },
          };
        } else {
          let senderObj = notif.senderId;
          let senderId;
          let senderName;
          if (
            senderObj &&
            typeof senderObj === "object" &&
            senderObj._id &&
            senderObj.name
          ) {
            senderId = senderObj._id;
            senderName = senderObj.name;
          } else {
            const user = await User.findById(senderObj).select("name");
            senderId = senderObj;
            senderName = user ? user.name : "Unknown";
          }
          const onboarding = await Onboarding.findOne({
            userId: senderId,
          }).select("profileImage");

          return {
            ...notif._doc,
            sender: {
              _id: senderId,
              name: senderName,
              profileImage: onboarding?.profileImage || null,
            },
          };
        }
      })
    );

    res.json(enrichedNotifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get the unread notification count by User ID's
router.get("/unread-count", async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const count = await Notification.countDocuments({
      userId,
      read: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To mark particular message as read by their id
router.patch("/mark-read/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// To mark particular message as un-read by their id
router.patch("/mark-unread/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: false },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// To make all the notification of particular user as read by User ID
router.patch("/mark-all-read", async (req, res) => {
  try {
    const { userId } = req.body;
    await Notification.updateMany({ userId, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

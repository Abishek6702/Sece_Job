const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Onboarding = require("../models/onboarding");

const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// Create a new post
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { content, visibility } = req.body;
 const image = req.file ? req.file.path : null;


    if (!content && !image) {
      return res.status(400).json({ error: "Content or image required" });
    }

    const newPost = new Post({
      content: content || "",
      image: image || "",
      author: req.user._id,
      visibility: visibility || "everyone",
    });

    const post = await newPost.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
});

// Get particular user's feed
router.get("/feed", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!Array.isArray(user.connections)) {
      return res.status(400).json({ error: "Invalid connections data" });
    }

    const connections = user.connections.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    connections.push(new mongoose.Types.ObjectId(req.user._id));

    const posts = await Post.find({
      $or: [
        { visibility: "everyone" },
        { visibility: "connections", author: { $in: connections } },
      ],
    })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .lean();

    const authorIds = posts.map((p) => p.author._id);
    const authorOnboardings = await Onboarding.find({
      userId: { $in: authorIds },
    }).lean();

    const onboardingMap = {};
    authorOnboardings.forEach((o) => {
      onboardingMap[o.userId.toString()] = o;
    });

    posts.forEach((post) => {
      post.author.onboarding =
        onboardingMap[post.author._id.toString()] || null;
    });

    const commentUserIds = [
      ...new Set(
        posts.flatMap((post) => post.comments.map((c) => c.user.toString()))
      ),
    ];
    const commentUserDocs = await User.find(
      { _id: { $in: commentUserIds } },
      "name"
    ).lean();
    const commentUserMap = {};
    commentUserDocs.forEach((u) => {
      commentUserMap[u._id.toString()] = u;
    });

    const commentOnboardings = await Onboarding.find({
      userId: { $in: commentUserIds },
    }).lean();
    const commentOnboardingMap = {};
    commentOnboardings.forEach((o) => {
      commentOnboardingMap[o.userId.toString()] = o;
    });

    posts.forEach((post) => {
      post.comments = post.comments.map((comment) => ({
        ...comment,
        user: {
          _id: comment.user,
          name: commentUserMap[comment.user.toString()]?.name || "User",
          onboarding: commentOnboardingMap[comment.user.toString()] || null,
        },
      }));
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Like/unlike a post
router.put("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user._id?.toString();
    const likeIndex = post.likes.findIndex(
      (like) => like && like.toString() === userId
    );

    if (likeIndex !== -1) {
      post.likes.splice(likeIndex, 1);
      await post.save();
      return res.json({ liked: false, likes: post.likes.filter(Boolean) });
    } else {
      post.likes.push(userId);
      await post.save();
      return res.json({ liked: true, likes: post.likes.filter(Boolean) });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Add comment
router.post("/:id/comment", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = {
      user: req.user._id,
      content: req.body.content,
    };

    post.comments.push(newComment);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get particular users post by ID
router.post("/my-posts", async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const posts = await Post.find({ author: userId })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .lean();

    const authorIds = posts.map((p) => p.author._id);
    const authorOnboardings = await Onboarding.find({
      userId: { $in: authorIds },
    }).lean();
    const onboardingMap = {};
    authorOnboardings.forEach((o) => {
      onboardingMap[o.userId.toString()] = o;
    });

    posts.forEach((post) => {
      post.author.onboarding =
        onboardingMap[post.author._id.toString()] || null;
    });

    const commentUserIds = [
      ...new Set(
        posts.flatMap((post) => post.comments.map((c) => c.user.toString()))
      ),
    ];
    const commentUserDocs = await User.find(
      { _id: { $in: commentUserIds } },
      "name"
    ).lean();
    const commentUserMap = {};
    commentUserDocs.forEach((u) => {
      commentUserMap[u._id.toString()] = u;
    });

    const commentOnboardings = await Onboarding.find({
      userId: { $in: commentUserIds },
    }).lean();
    const commentOnboardingMap = {};
    commentOnboardings.forEach((o) => {
      commentOnboardingMap[o.userId.toString()] = o;
    });

    posts.forEach((post) => {
      post.comments = post.comments.map((comment) => ({
        ...comment,
        user: {
          _id: comment.user,
          name: commentUserMap[comment.user.toString()]?.name || "User",
          onboarding: commentOnboardingMap[comment.user.toString()] || null,
        },
      }));
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a post only by the user created
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

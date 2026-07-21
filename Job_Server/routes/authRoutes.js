const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const Post = require("../models/Post");

const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Registration routes (MUST be before generic /:id route)
router.post('/register-employee', authController.registerEmployee);
router.post('/register-employer', authController.registerEmployer);
router.post('/register-admin', authController.registerAdmin);
router.post('/register-instructor', authController.registerInstructor);

// Login routes
router.post('/login-instructor', authController.loginInstructor);
router.post('/login', authController.login);

// OTP and verification routes
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-verification-otp', authController.resendVerificationOTP);
router.post('/send-reset-otp', authController.sendResetOTP);
router.post('/verify-reset-otp', authController.verifyResetOTP);

// Password routes
router.post('/reset-password', authController.resetPassword);
router.post('/send-change-password-otp', authController.sendChangePasswordOTP);
router.post('/verify-change-password-otp', authController.verifyChangePasswordOTP);
router.post('/change-password', authController.changePasswordWithCurrent);
router.post("/check-current-password", authController.checkCurrentPassword);

// Admin employer approval routes (MUST be before generic /:id route)
router.get("/admin/pending-employers", verifyToken, verifyAdmin, authController.getPendingEmployers);
router.get("/admin/approved-employers", verifyToken, verifyAdmin, authController.getApprovedEmployers);
router.post("/admin/approve-employer", verifyToken, verifyAdmin, authController.approveEmployer);
router.post("/admin/reject-employer", verifyToken, verifyAdmin, authController.rejectEmployer);

// Get all users
router.get("/all", verifyToken, authController.getAllUsers);

// Get first-time login count
router.get("/first-time-login-count", authController.getFirstTimeLoginCount);

// User posts (MUST be before generic /:id route)
router.get("/:id/posts", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate("author", "name onboarding")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Generic user routes (MUST be last)
router.get('/:id', authController.getUserById);

module.exports = router;

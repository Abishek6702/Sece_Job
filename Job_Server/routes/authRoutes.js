const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const Post = require("../models/Post");

const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register-employee', authController.registerEmployee);
router.post('/register-employer', authController.registerEmployer);
router.post('/register-admin', authController.registerAdmin);
router.post('/register-instructor', authController.registerInstructor);

router.post('/login-instructor', authController.loginInstructor);

router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-verification-otp', authController.resendVerificationOTP);
router.post('/send-reset-otp', authController.sendResetOTP);
router.post('/verify-reset-otp', authController.verifyResetOTP);
router.post('/reset-password', authController.resetPassword);
router.get("/all",verifyToken,authController.getAllUsers);
router.get("/first-time-login-count", authController.getFirstTimeLoginCount);

router.get('/:id', authController.getUserById);
router.post('/send-change-password-otp', authController.sendChangePasswordOTP);
router.post('/verify-change-password-otp', authController.verifyChangePasswordOTP);
router.post('/change-password', authController.changePasswordWithCurrent);
router.post("/check-current-password", authController.checkCurrentPassword);

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



module.exports = router;

const User = require("../models/User");
const OTP = require("../models/OTP");
const path = require("path");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Onboarding = require("../models/onboarding");
const Message = require("../models/Message");
const Company = require("../models/company");
const sendEmail = require("../utils/sendEmail");

// Utility to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const sendSignupOTP = async (email, name, otp) => {
  await sendEmail(email, "Verify your Email - Signup OTP", "signup", {
    name,
    otp,
  });
};

// Register new employee
exports.registerEmployee = async (req, res) => {
  await registerUser(req, res, "employee");
};

// Register new employer or company profile
exports.registerEmployer = async (req, res) => {
  await registerUser(req, res, "employer");
};

// Register admin user only allowed if email matches admin config
exports.registerAdmin = async (req, res) => {
  if (req.body.email !== process.env.ADMIN_EMAIL) {
    return res
      .status(403)
      .json({ message: "Unauthorized to create an admin account" });
  }
  await registerUser(req, res, "admin");
};

// Generic user registration function used by all roles
const registerUser = async (req, res, role) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, phone, password, role });
    await newUser.save();

    const otp = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60000),
    });

    await sendEmail(
      email,
      "Verify your Email - Signup OTP",
      "signup",
      { name, otp },
      [
        {
          filename: "top-logo.png",
          path: path.join(__dirname, "../emails/assets/top-logo.png"),
          cid: "topLogo",
        },
      ]
    );
    res
      .status(201)
      .json({ message: "OTP sent to email. Please verify your account." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify otp during the process of user registeration
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Expired OTP" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { isVerified: true } },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    await OTP.deleteOne({ email });

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "An error occurred, please try again." });
  }
};

// Otp Verified users are only allowed to login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res
        .status(400)
        .json({ message: "User not verified or does not exist" });
    }

    // Check if the password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // console.log("Applied Jobs:", user.appliedJobs);
    // Create the JWT token and include only the job IDs in appliedJobs
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        onboardingstatus: user.onboardingCompleted,
        email: user.email,
        name: user.name,
        firstTimeLogin: user.firstTimeLogin,
        appliedjobs: user.appliedJobs || [],
        connections: user.connections || [], // This contains only the job IDs (ObjectIds)
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send the response with the token
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forget passowrd otp send function
exports.sendResetOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60000),
    });

    await sendEmail(
      email,
      "Password Reset OTP",
      "forgot-password",
      { name:user.name, otp },
      [
        {
          filename: "forgot-password-logo.png",
          path: path.join(
            __dirname,
            "../emails/assets/forgot-password-logo.png"
          ),
          cid: "forgotPasswordLogo",
        },
      ]
    );
    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
};

// Forget passowrd otp verification
exports.verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password after otp verified
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logic to resend otp during signup verification
exports.resendVerificationOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60000),
    });

    await sendEmail(email, "Verification OTP", `Your OTP: ${otp}`);
    res.json({ message: "Verification OTP resent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register e-learning instructor
exports.registerInstructor = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      name,
      email,
      phone,
      password,
      role: "instructor",
    });
    await newUser.save();

    const otp = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60000),
    });

    await sendEmail(email, "Verify your Email", `Your OTP is: ${otp}`);
    res.status(201).json({
      message: "Instructor account created. OTP sent for verification.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login e-learning instructor
exports.loginInstructor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role: "instructor" });
    if (!user || !user.isVerified) {
      return res
        .status(400)
        .json({ message: "Instructor not verified or does not exist" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ message: "Instructor login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User by their ID (Employee, Employer)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "savedJobs",
      populate: {
        path: "companyId",
        model: "Company",
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const onboarding = await Onboarding.findOne({ userId: user._id });

    let companyLogo = null;
    if (user.role === "employer") {
      const company = await Company.findOne({ createdBy: user._id })
        .select("company_logo")
        .lean();
      companyLogo = company?.company_logo || null;
    }

    const response = {
      ...user.toObject(),
      onboarding: onboarding || null,
      companyLogo, // added company logo when employer
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all the user including all roles expect admin
exports.getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id; // Get current user ID

    // Fetch all users
    const users = await User.find({ _id: { $ne: currentUserId } }).populate(
      "savedJobs"
    );

    // For each user, get last message and onboarding data
    const usersWithData = await Promise.all(
      users.map(async (user) => {
        // 1. Get onboarding data
        const onboarding = await Onboarding.findOne({ userId: user._id });

        // 2. Get last message between current user and this user
        const lastMessage = await Message.findOne({
          $or: [
            { sender: currentUserId, recipient: user._id },
            { sender: user._id, recipient: currentUserId },
          ],
        })
          .sort({ createdAt: -1 }) // Get most recent first
          .limit(1);

        return {
          ...user.toObject(),
          onboarding: onboarding || null,
          lastMessage: lastMessage?.content || null,
          lastMessageTime: lastMessage?.createdAt || null,
        };
      })
    );

    res.status(200).json(usersWithData);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// User to change passowrd when they are logged in
exports.sendChangePasswordOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    await OTP.deleteMany({ email });
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60000), // 10 min
    });

    await sendEmail(
      email,
      "Password Changed Confirmation",
      "change-password",
      { name: user.name ,otp},
      [
        {
          filename: "change-password-logo.png",
          path: path.join(
            __dirname,
            "../emails/assets/change-password-logo.png"
          ),
          cid: "changePasswordLogo",
        },
      ]
    );
    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error('Error in send-change-password-otp:', error);
    res.status(500).json({ message: error.message });
  }
};

// User to change passowrd OTP when they are logged in
exports.verifyChangePasswordOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    res.json({ message: "OTP verified. Please enter your current password." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User to change passowrd when they are logged in
exports.changePasswordWithCurrent = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    // Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Change password
    user.password = newPassword;
    await user.save();

    // Remove any OTP for this email (cleanup)
    await OTP.deleteMany({ email });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User to change passowrd when they are logged in to check existing passowrd
exports.checkCurrentPassword = async (req, res) => {
  const { email, oldPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    res.json({ message: "Password correct" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// Get count of users with firstTimeLogin = true
exports.getFirstTimeLoginCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ firstTimeLogin: false });
    res.status(200).json({
      message: "Count of users with first time login",
      count
    });
  } catch (error) {
    console.error("Error fetching firstTimeLogin count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

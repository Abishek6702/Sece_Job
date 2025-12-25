const express = require("express");
const router = express.Router();
const upload = require("../middlewares/onboardFiles"); // Multer config as above
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  saveOrUpdateOnboarding,
  getOnboarding,
  updateProfileImage,
  updateResume,
  upsertBannerImage
} = require("../controllers/onboardingController");

router.post(
  "/onboarding",
  verifyToken,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  saveOrUpdateOnboarding
);

router.get("/onboarding/:userId", verifyToken, getOnboarding);

router.put(
  "/profile-image",
  verifyToken,
  upload.single("profileImage"),
  updateProfileImage
);

router.put("/resume", verifyToken, upload.single("resume"), updateResume);
router.put(
  "/banner-image",
  verifyToken,
  upload.single("banner"),
  upsertBannerImage
);

module.exports = router;

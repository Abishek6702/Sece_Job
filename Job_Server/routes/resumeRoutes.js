const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");

// POST Resume
router.post("/", resumeController.postResume);

// View Resume
router.get("/preview", resumeController.previewResume);

// Download Resume
// router.get("/download/:templateId/:userId/:resumeId", resumeController.downloadResume);

router.get("/download", resumeController.downloadResume);


module.exports = router;
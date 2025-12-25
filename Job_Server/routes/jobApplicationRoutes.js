const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadResume");
const { verifyToken } = require("../middlewares/authMiddleware");
const appCtrl = require("../controllers/jobApplicationController");

router.post("/", verifyToken, upload.single("resume"), appCtrl.createApplication);
router.get("/", verifyToken, appCtrl.getAllApplications);
router.get('/download/:id',  appCtrl.downloadResume);
router.get("/:id", verifyToken, appCtrl.getApplicationById);
router.delete("/:id", verifyToken, appCtrl.deleteApplication);
router.get("/job/:jobId", verifyToken, appCtrl.getApplicationsForJob);
router.get('/:userId/applied-jobs',verifyToken, appCtrl.getAppliedJobs);
router.patch('/bulk/status', verifyToken,appCtrl.bulkUpdateApplicationStatus);

router.patch("/:id/status", verifyToken, appCtrl.updateApplicationStatus);


module.exports = router;

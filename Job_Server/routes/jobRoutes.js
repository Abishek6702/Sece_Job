const express = require("express");
const {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
  updateJob,
} = require("../controllers/jobController");
const upload = require("../middlewares/upload");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");
const { toggleSaveJob, getSavedJobs } = require('../controllers/savedJobsController');

const router = express.Router();


router.post(
  "/",
  verifyToken,
  authorizeRoles("employer", "admin"),
  upload.fields([
    { name: "companyLogo", maxCount: 1 },
    { name: "companyImages", maxCount: 5 },
  ]),
  createJob
);


router.get("/", verifyToken, getAllJobs);

router.get('/saved', verifyToken, getSavedJobs);
router.get("/:id", verifyToken, getJobById);


router.post('/toggle-save-job',verifyToken, toggleSaveJob);


router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("employer", "admin"),
  deleteJob
);


router.put(
  "/:id",
  verifyToken,
  authorizeRoles("employer", "admin"),
  upload.fields([
    { name: "companyLogo", maxCount: 1 },
    { name: "companyImages", maxCount: 5 },
  ]),
  updateJob
);

module.exports = router;

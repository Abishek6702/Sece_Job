const express = require("express");
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  deleteCompany,
  updateCompany
} = require("../controllers/companyController");

const upload = require("../middlewares/upload");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();


router.post(
  "/",
  verifyToken,
  authorizeRoles('employer'),
  upload.fields([
    { name: "company_logo", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
  createCompany
);


router.get("/", verifyToken, getAllCompanies);


router.get("/:id", verifyToken, getCompanyById); 


router.put(
  "/:id",
  verifyToken,
  authorizeRoles('employer'),
  upload.fields([
    { name: "company_logo", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
  updateCompany
);


router.delete("/:id", verifyToken, authorizeRoles('admin', 'employer'), deleteCompany);

module.exports = router;

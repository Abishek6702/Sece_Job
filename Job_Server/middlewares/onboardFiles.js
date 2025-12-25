const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "job_portal/onboarding";
    let resource_type = "auto";

    if (file.fieldname === "resume") {
      folder = "job_portal/resumes";
      resource_type = "raw";
    }

    if (file.fieldname === "profileImage") {
      folder = "job_portal/profile_images";
    }

    if (file.fieldname === "banner") {
      folder = "job_portal/banners";
    }

    return {
      folder,
      resource_type,
      public_id: `${Date.now()}_${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

module.exports = upload;

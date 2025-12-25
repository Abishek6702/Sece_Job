const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const allowedVideoTypes = ["video/mp4", "video/avi", "video/mkv", "video/mov"];
const allowedResourceTypes = [
  "application/pdf",
  "application/zip",
  "application/octet-stream",
  "text/html",
  "image/jpeg",
  "image/png",
];

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "job_portal/others";
    let resource_type = "auto";

    if (allowedVideoTypes.includes(file.mimetype)) {
      folder = "job_portal/videos";
      resource_type = "video";
    } else if (allowedResourceTypes.includes(file.mimetype)) {
      folder = "job_portal/resources";
    } else {
      throw new Error("Unsupported file type");
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

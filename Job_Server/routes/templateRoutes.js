

const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const templatesDir = path.join(__dirname, "../templates");
const previewsDir = "/templates/previews"; // static public path
const previewsDirFs = path.join(__dirname, "../templates/previews"); // actual folder

// List all templates with preview images, path, and content
router.get("/", (req, res) => {
  fs.readdir(templatesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read templates directory" });
    }

    const templateFiles = files.filter((file) => file.endsWith(".html"));

    const templates = templateFiles.map((file) => {
      const name = file.replace(".html", "");

      // Read template file content
      const filePath = path.join(templatesDir, file);
      let data = "";
      try {
        data = fs.readFileSync(filePath, "utf-8");
      } catch (err) {
        console.error(`Error reading ${file}:`, err);
      }

      // 🔍 Detect preview image extension dynamically
      const possibleExtensions = [".png", ".jpg", ".jpeg", ".webp"];
      let previewImage = null;

      for (const ext of possibleExtensions) {
        const previewPath = path.join(previewsDirFs, `${name}${ext}`);
        if (fs.existsSync(previewPath)) {
          previewImage = `${previewsDir}/${name}${ext}`;
          break;
        }
      }

      return {
        id: file, // filename as ID
        name,
        previewImage, // ✅ now correct extension
        path: `/templates/${file}`,
        data,
      };
    });

    res.json(templates);
  });
});

module.exports = router;
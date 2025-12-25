const path = require("path");
const fs = require("fs");

function normalizeLogoPath(logoFromDB) {
  if (!logoFromDB) {
    return path.resolve(__dirname, "../emails/assets/default-company-logo.png");
  }

  // Replace Windows-style slashes with POSIX slashes
  const normalizedPath = logoFromDB.replace(/\\/g, '/');

  // Build absolute path from the project root
  const absolutePath = path.resolve(__dirname, '..', normalizedPath);

  // Fallback to default if file is missing
  if (!fs.existsSync(absolutePath)) {
    console.warn(`Company logo not found: ${absolutePath}, using default.`);
    return path.resolve(__dirname, "../emails/assets/default-company-logo.png");
  }

  return absolutePath;
}

module.exports = normalizeLogoPath;

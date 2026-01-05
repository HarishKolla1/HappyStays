const multer = require("multer");

// Upload to memory instead of multer-s3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;

require('dotenv').config();

const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY) {
  console.error("FATAL ERROR: AWS Keys are missing from process.env!");
}

// Configure S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Configure Multer for S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Create a unique filename in the 'users' folder
      const fileName = `users/${Date.now().toString()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
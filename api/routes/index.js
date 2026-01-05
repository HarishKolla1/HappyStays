const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadToS3 = require('../middlewares/uploadToS3');
const axios = require('axios');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');
// multer
// Use memoryStorage so file.buffer is available for S3
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Basic health check route
router.get('/', (req, res) => {
  res.status(200).json({
    greeting: 'Hello from HappyStays api',
  });
});

// Route to upload photo using an image URL
router.post('/upload-by-link', async (req, res) => {
  try {
    const { link } = req.body;

    const response = await axios.get(link, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    const key = `places/${Date.now()}.jpg`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
    }));

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json(imageUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload by link failed' });
  }
});
// Route to upload images from local device (supports up to 100 photos)
router.post("/upload", upload.array("photos", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    console.log("Files received by backend:", req.files.map(f => f.originalname));

    const uploadedUrls = [];

    for (const file of req.files) {
      const cleanName= file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, ''); // Replace spaces with underscores
      const key = `places/${Date.now()}-${cleanName}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: file.buffer, // buffer from multer memory storage
          ContentType: file.mimetype,
          ContentLength: file.size,
        })
      );

      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      uploadedUrls.push(fileUrl);
    }

    console.log("Uploaded file URLs:", uploadedUrls);
    res.status(200).json(uploadedUrls);
  } catch (err) {
    console.error("S3 upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});


// Mount sub-routers
router.use('/user', require('./user'));
router.use('/places', require('./place'));
router.use('/bookings', require('./booking'));


module.exports = router;

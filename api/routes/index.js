const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadToS3 = require('../middlewares/uploadToS3');
const axios = require('axios');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3');
// multer
const upload = multer({ dest: '/tmp' });

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
      ACL: 'public-read',
    }));

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json(imageUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload by link failed' });
  }
});
// Route to upload images from local device (supports up to 100 photos)
router.post(
  '/upload',
  (req, res, next) => {
    req.uploadFolder = 'places';
    next();
  },
  uploadToS3.array('photos', 10),
  async (req, res) => {
    try {
      const imageUrls = req.files.map(file => file.location);
      res.status(200).json(imageUrls);
    } catch (error) {
      res.status(500).json({ message: 'Upload failed' });
    }
  }
);


// Mount sub-routers
router.use('/user', require('./user'));
router.use('/places', require('./place'));
router.use('/bookings', require('./booking'));


module.exports = router;

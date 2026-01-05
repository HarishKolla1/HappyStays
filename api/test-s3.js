require('dotenv').config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

async function run() {
  try {
    console.log("Attempting upload to bucket:", process.env.AWS_BUCKET_NAME);
    
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: "test-image.txt",
      Body: "Hello S3!",
      ContentType: "text/plain",
      // Note: No ACL here!
    }));

    console.log("✅ Success! Check your bucket for 'test-image.txt'");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

run();
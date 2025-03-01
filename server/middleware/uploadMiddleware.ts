// middleware/uploadMiddleware.ts
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import { RequestWithUser } from '../types'; // Import the custom request type

// Configure AWS S3
const s3 = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Middleware for profile picture upload
export const uploadProfilePictureMiddleware = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME!, // Make sure to set your bucket name in environment variables
    acl: 'public-read', // Make the file publicly readable
    key: (req: RequestWithUser, file, cb) => {
      const userId = req.user?._id; // Safely access user ID from request
      if (!userId) {
        return cb(new Error('User ID not found in the request'), ''); // Pass error if no user ID
      }
      const ext = path.extname(file.originalname);
      cb(null, `profile-pictures/${userId}-${Date.now()}${ext}`); // Save file with a unique name
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null as any);
    } else {
      cb(new Error('Only JPG, JPEG, and PNG files are allowed.') as any, false);
    }
  },
});

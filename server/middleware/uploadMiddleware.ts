import multer from 'multer';
import path from 'path';
import { RequestWithUser } from '../types'; // Import the custom request type

// Middleware for profile picture upload
export const uploadProfilePictureMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/profile-pictures'); // Set the destination folder for uploaded files
    },
    filename: (req: RequestWithUser, file, cb) => {
      const userId = req.user?._id; // Safely access user ID from request
      if (!userId) {
        return cb(new Error('User ID not found in the request'), ''); // Pass error if no user ID
      }
      const ext = path.extname(file.originalname);
      cb(null, `${userId}-${Date.now()}${ext}`); // Save file with a unique name
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

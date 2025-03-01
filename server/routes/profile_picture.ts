// routes/authRoutes.ts
import express from 'express';
import passport from 'passport';
import { uploadProfilePicture } from '../controller/profileController';  // Controller import
import {
  getUserProfile,
} from '../controller/authController';
import { uploadProfilePictureMiddleware } from '../middleware/uploadMiddleware';

const router = express.Router();

// Route to upload a profile picture
router.put(
  '/profile-picture',
  passport.authenticate('jwt', { session: false }),
  uploadProfilePictureMiddleware.single('profilePicture'), // Expect 'profilePicture' field in form data
  uploadProfilePicture
);

// Route to get the logged-in user's profile
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  getUserProfile
);

export default router;

import express from 'express';
import passport from 'passport';
import {
  signup,
  login,
  getUserProfile,
  updateUser,
  deleteUser,
  getAllUsers,
  updateUserRole,
} from '../controller/authController';

const router = express.Router();

// Public Routes
router.post('/signup', signup); // Register a new user
router.post('/login', login); // Login an existing user

// Protected Routes (JWT authentication required)
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  getUserProfile
); // Get the profile of the logged-in user

router.put(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  updateUser
); // Update the profile of the logged-in user

router.delete(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  deleteUser
); // Delete the profile of the logged-in user

// Admin Routes (JWT authentication required)
router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  getAllUsers
); // Get all users (accessible only by admin)

router.put(
  '/user/:id/role',
  passport.authenticate('jwt', { session: false }),
  updateUserRole
); // Update a user's role (accessible only by admin)

router.delete(
  '/user/:id',
  passport.authenticate('jwt', { session: false }),
  deleteUser
); // Delete a user (accessible only by admin)

export default router;


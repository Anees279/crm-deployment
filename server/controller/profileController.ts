// controller/authController.ts
import { Request, Response } from 'express';
import { IUser, createUserModel } from '../model/user';
import mongoose from 'mongoose';

const UserModel = createUserModel(mongoose.connection);

// Upload profile picture to S3 and update user profile
export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)?._id;

    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save the profile picture URL from S3 in user's document
    user.profilePicture = (req.file as any).location;
    await user.save();

    return res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error uploading profile picture', error });
  }
};

// Get user profile along with profile picture URL
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUser)?._id;
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

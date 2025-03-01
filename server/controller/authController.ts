
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUserModel, IUser } from '../model/user';
import { loginConnection } from '../config/database';

const UserModel = createUserModel(loginConnection); // Create the model using the connection

// Signup function
export const signup = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: role || 'client', // Default to 'client' if no role is provided
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    return res.status(500).json({ message: 'Signup failed', error });
  }
};

// Login function
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return res.status(200).json({
      token,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error });
  }
};

// Get User Profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await UserModel.findById((req.user as { id: string }).id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

// Update User Profile
export const updateUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const user = await UserModel.findById((req.user as { id: string }).id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
    }

    await user.save();
    return res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user profile', error });
  }
};

// Delete User Profile
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id; // Get the userId from the request parameters

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (req.user && (req.user as { id: string }).id === userId) {
      return res.status(403).json({ message: 'You cannot delete your own profile' });
    }

    await user.deleteOne();
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error });
  }
};

// Admin-specific functions

// Get All Users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Only allow admins to access this route
    if (req.user && (req.user as { role: string }).role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await UserModel.find(); // Fetch all users
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Update User Role (Admin only)
export const updateUserRole = async (req: Request, res: Response) => {
  const { role } = req.body;
  const userId = req.params.id;

  try {
    // Only allow admins to access this route
    if (req.user && (req.user as { role: string }).role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the admin is trying to update their own role
    if (req.user && (req.user as { id: string }).id === userId) {
      return res.status(403).json({ message: 'You cannot change your own role' });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user role', error });
  }
};

// import { Request, Response, NextFunction } from 'express';
// import jwt, { JwtPayload } from 'jsonwebtoken';

// // Extend the Request interface to include the user property
// interface AuthenticatedRequest extends Request {
//   user?: string | JwtPayload;
// }

// const ensureAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
//   const auth = req.headers['authorization'];

//   if (!auth) {
//     return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
//   }

//   try {
//     const decoded = jwt.verify(auth, process.env.JWT_SECRET as string);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: 'Unauthorized, JWT token is wrong or expired' });
//   }
// };

// export default ensureAuthenticated;

import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { signupValidation, loginValidation } from '../middleware/AuthValidation';
import { createUserModel } from '../model/user'; // Import the user model factory function
import { loginConnection } from '../config/database'; // Import the correct MongoDB connection
import connectFlash from 'connect-flash'; // Import connect-flash

const router = express.Router();

// Get the UserModel using the correct connection
const UserModel = createUserModel(loginConnection);

router.post('/signup', signupValidation, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      req.flash('error', 'User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user using the UserModel
    const newUser = new UserModel({ name, email, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    // Flash message and response
    req.flash('success', 'User registered successfully!');
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    // Handle errors
    req.flash('error', 'Error registering user');
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login route
router.post('/login', loginValidation, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

// Logout route


// ... other code ...

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    req.flash('success', 'Logged out successfully'); // Use connect-flash for flash messages
    res.redirect('/login');
  });
});

export default router;


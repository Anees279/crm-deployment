// middlewares/authMiddleware.ts
import jwt from 'jsonwebtoken';
import { createUserModel } from '../model/user';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';

export const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const UserModel = createUserModel(req.app.get('mongooseConnection'));
    const user = await UserModel.findById((decoded as jwt.JwtPayload).id as string);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach user to req
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

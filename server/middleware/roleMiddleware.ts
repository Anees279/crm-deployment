import { Request, Response, NextFunction } from 'express';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

interface IUser {
  role: string;
}
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send('Unauthorized');
    }
    // TypeScript knows that req.user is of type IUser and contains role
    if (!roles.includes((req.user as IUser).role)) {
      return res.status(403).send('Forbidden');
    }
    next();
  };
};


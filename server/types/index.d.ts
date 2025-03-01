// types/index.ts
import { Request } from 'express';
import { IUser } from '../model/user';  // Adjust the path according to your directory structure

// Extend the Express Request interface to include the user property
export interface RequestWithUser extends Request {
  user?: IUser;  // This allows `req.user` to be typed as `IUser`
}

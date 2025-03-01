import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { createUserModel } from '../model/user';
import { loginConnection } from '../config/database';
import { IUser } from '../model/user';
const UserModel = createUserModel(loginConnection);

// JWT strategy options
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string, // Ensure JWT_SECRET is set in the environment variables
};

// Define the JWT strategy
passport.use(
  new JwtStrategy(opts, async (jwt_payload: any, done: VerifiedCallback) => {
    try {
      const user = await UserModel.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false); // No user found
      }
    } catch (error) {
      return done(error, false); // Handle errors
    }
  })
);



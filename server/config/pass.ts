import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { createUserModel } from '../model/user';

import bcrypt from 'bcrypt';
import { connection } from 'mongoose';

// Passport local strategy for login
passport.use(
  'local', // <- Pass the name 'local'
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await createUserModel(connection).findOne({ email }); // Use the correct model function
      if (!user) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);


// Serialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await createUserModel(connection).findById(id); // Use the correct model function
    done(null, user);
  } catch (error) {
    done(error);
  }
});


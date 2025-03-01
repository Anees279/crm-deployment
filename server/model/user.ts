// import mongoose, { Document, Schema, Connection } from 'mongoose';
// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

// // IUser interface representing a User document in MongoDB
// export interface IUser extends Document {
//   _id: mongoose.Types.ObjectId;  // Correctly typed as ObjectId
//   name: string;
//   email: string;
//   password: string;
//   role: 'admin' | 'employee' | 'client';
// }

// // User Schema
// const userSchema: Schema<IUser> = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['admin', 'employee', 'client'], default: 'client' },
// });

// // Function to create a User model with a specific connection
// export const createUserModel = (connection: Connection) => {
//   return connection.model<IUser>('User', userSchema);
// };

import mongoose, { Document, Schema, Connection } from 'mongoose';

// IUser interface representing a User document in MongoDB
export interface IUser extends Document {
  id: string;  // Virtual field to return 'id' instead of '_id' in API responses
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee' | 'client';
  profilePicture?: string; // Path or URL to the profile picture (optional)
}

// User Schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'employee', 'client'], default: 'client' },
    profilePicture: { type: String, default: '' }, // Store the path or URL to the profile picture
  },
  { timestamps: true } // Adding timestamps (createdAt, updatedAt)
);

// Virtual field to map _id to id in API responses
userSchema.virtual('id').get(function (this: IUser) {
  return (this._id as mongoose.Types.ObjectId).toHexString(); // Return the _id as a string
});

// Ensure virtuals are included in toJSON output
userSchema.set('toJSON', {
  virtuals: true,
});

userSchema.set('toObject', {
  virtuals: true,
});
// Function to create a User model with a specific connection
export const createUserModel = (connection: Connection) => {
  return connection.model<IUser>('User', userSchema);
};

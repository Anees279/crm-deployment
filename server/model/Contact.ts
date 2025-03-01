import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
  contactName: string;
  accountName: string;
  email: string;
  phone: string;
  owner: string;
}

const contactSchema: Schema = new mongoose.Schema({
  contactName: { type: String, required: true },
  accountName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  owner: { type: String, required: true },
});

export const createContactModel = (connection: mongoose.Connection): Model<IContact> => {
  return connection.model<IContact>('Contact', contactSchema);
};

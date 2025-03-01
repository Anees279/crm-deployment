import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClient extends Document {
  accountName: string;
  phone: string;
  website: string;
  accountOwner: string;
}

const clientSchema: Schema = new mongoose.Schema({
  accountName: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String, required: true },
  accountOwner: { type: String, required: true }
});

export const createClientModel = (connection: mongoose.Connection): Model<IClient> => {
  return connection.model<IClient>('Client', clientSchema);
};

import mongoose, { Schema, Document, Connection } from 'mongoose';

export interface ILead extends Document {
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  owner: string;
}

const leadSchema = new Schema<ILead>({
  name: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  source: { type: String, required: true },
  owner: { type: String, required: true },
});

// Dynamically create the model based on the passed connection
export const createLeadModel = (connection: Connection) => connection.model<ILead>('Lead', leadSchema);

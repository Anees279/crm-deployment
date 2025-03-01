import mongoose, { Schema, Document, Model } from 'mongoose';  // Import Model

interface ICall extends Document {
  subject: string;
  callType: string;
  callStartTime: string;
  callDuration: number;
  relatedTo: string;
  contactName: string;
  callOwner: string;
}

const CallSchema: Schema = new Schema(
  {
    subject: { type: String, required: true },
    callType: { type: String, required: true },
    callStartTime: { type: String, required: true },
    callDuration: { type: Number, required: true },
    relatedTo: { type: String, required: true },
    contactName: { type: String, required: true },
    callOwner: { type: String, required: true },
  },
  { timestamps: true }
);

// Correct the model name to 'Call' (not 'Contact')
export const createCallModel = (connection: mongoose.Connection): Model<ICall> => {
  return connection.model<ICall>('Call', CallSchema);
};

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMeeting extends Document {
  
  title: string;
  from: Date;
  to: Date;
  relatedTo: string;
  contactName: string;
  host: string;
}

const meetingSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  relatedTo: { type: String, required: true },
  contactName: { type: String, required: true },
  host: { type: String, required: true }
});

export const createMeetingModel = (connection: mongoose.Connection): Model<IMeeting> => {
  return connection.model<IMeeting>('Meeting', meetingSchema);
};

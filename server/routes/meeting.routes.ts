import express, { Request, Response, Router } from 'express';
import { createMeetingModel, IMeeting } from '../model/meeting.model';
import { Connection } from 'mongoose';

const meetingRoutes = (meetingsConnection: Connection): Router => {
  const router = express.Router();
  const Meeting = createMeetingModel(meetingsConnection);

  // GET all meetings
  router.get('/', async (req: Request, res: Response) => {
    try {
      const meetings = await Meeting.find();
      res.status(200).json(meetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ message: 'Error fetching meetings' });
    }
  });

  // POST a new meeting
 // POST a new meeting
router.post('/', async (req: Request, res: Response) => {
  try {
    const { _id, ...meetingData } = req.body; // Remove _id if present

    console.log('Processed POST request body:', meetingData); // Log the processed body

    const newMeeting = new Meeting(meetingData as IMeeting); // Use the cleaned data
    const savedMeeting = await newMeeting.save();
    
    res.status(201).json(savedMeeting);
  } catch (error) {
    console.error('Error adding meeting:', error); // Log the full error for debugging
    res.status(500).json({ message: 'Error adding meeting', error });
  }
});


  // DELETE a meeting by ID
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await Meeting.findByIdAndDelete(id);
      res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
      console.error("Error deleting meeting:", error);
      res.status(500).json({ message: 'Error deleting meeting' });
    }
  });

  return router;
};

export default meetingRoutes;

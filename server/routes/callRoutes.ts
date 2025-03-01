
import express, { Request, Response, Router } from 'express';
import { createCallModel } from '../model/callModel';

import { Connection } from 'mongoose';

const callRoutes = (callsConnection: Connection): Router => {
  const router = express.Router();
  const Call = createCallModel(callsConnection);

  // GET all calls
  router.get('/', async (req: Request, res: Response) => {
    try {
      const calls = await Call.find();
      res.status(200).json(calls);
    } catch (error) {
      console.error("Error fetching calls:", error);
      res.status(500).json({ message: 'Error fetching calls' });
    }
  });

  // POST a new call
  router.post('/', async (req: Request, res: Response) => {
    try {
      // Ensure _id is not included or is valid in the request body
      const { _id, ...callData } = req.body;  // Remove _id from the body, if present
  
      if (_id) {
        return res.status(400).json({ message: 'Do not include _id in the request body.' });
      }
  
      const newCall = new Call(callData);  // Mongoose will automatically generate an _id
      const savedCall = await newCall.save();
      
      res.status(201).json(savedCall);
    } catch (error) {
      console.error("Error adding call:", error);
      res.status(500).json({ message: 'Error adding call', error });
    }
  });

  // DELETE a call by ID
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await Call.findByIdAndDelete(id);
      res.status(200).json({ message: 'Call deleted successfully' });
    } catch (error) {
      console.error("Error deleting call:", error);
      res.status(500).json({ message: 'Error deleting call' });
    }
  });

  return router;
};

export default callRoutes;

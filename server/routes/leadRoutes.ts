import express, { Request, Response, Router } from 'express';
import { Connection } from 'mongoose';
import { createLeadModel, ILead } from '../model/Lead';

const leadRoutes = (leadConnection: Connection): Router => {
  const router = express.Router();
  const Lead = createLeadModel(leadConnection); // Use the dynamically created Lead model

  // GET all leads
  router.get('/', async (req: Request, res: Response) => {
    try {
      const leads = await Lead.find();
      res.status(200).json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: 'Error fetching leads' });
    }
  });

  // POST a new lead
  router.post('/', async (req: Request, res: Response) => {
    try {
      const newLead = new Lead(req.body as ILead); // Use request body for lead details
      const savedLead = await newLead.save();
      res.status(201).json(savedLead);
    } catch (error) {
      console.error("Error adding lead:", error);
      res.status(500).json({ message: 'Error adding lead' });
    }
  });

  // DELETE a lead by ID
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedLead = await Lead.findByIdAndDelete(id);
      
      if (!deletedLead) {
        return res.status(404).json({ message: 'Lead not found' });
      }

      res.status(200).json({ message: 'Lead deleted successfully' });
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ message: 'Error deleting lead' });
    }
  });

  return router;
};

export default leadRoutes;

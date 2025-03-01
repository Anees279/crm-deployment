import express, { Request, Response, Router } from 'express';
import { createClientModel, IClient } from '../model/accountModel';
import { Connection } from 'mongoose';

const clientRoutes = (clientConnection: Connection): Router => {
  const router = express.Router();
  const Client = createClientModel(clientConnection);

  // GET all clients
  router.get('/', async (req: Request, res: Response) => {
    try {
      const clients = await Client.find();
      res.status(200).json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: 'Error fetching clients' });
    }
  });


router.post('/', async (req: Request, res: Response) => {
  try {
    const { _id, ...ClientData } = req.body; // Remove _id if present

    console.log('Processed POST request body:', ClientData); // Log the processed body

    const newClient = new Client(ClientData as IClient); // Use the cleaned data
    const savedClient = await newClient.save();
    
    res.status(201).json(savedClient);
  } catch (error) {
    console.error('Error adding Client:', error); // Log the full error for debugging
    res.status(500).json({ message: 'Error adding Client', error });
  }
});

  // DELETE a client by ID
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await Client.findByIdAndDelete(id);
      res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).json({ message: 'Error deleting client' });
    }
  });

  return router;
};

export default clientRoutes;

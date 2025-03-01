import express, { Request, Response, Router } from 'express';
import { Connection } from 'mongoose';
import { createContactModel, IContact } from '../model/Contact';

const contactRoutes = (contactConnection: Connection): Router => {
  const router = express.Router();
  const Contact = createContactModel(contactConnection);

  // GET all contacts
  router.get('/', async (req: Request, res: Response) => {
    try {
      const contacts = await Contact.find();
      res.status(200).json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: 'Error fetching contacts' });
    }
  });

  // POST a new contact
  router.post('/', async (req: Request, res: Response) => {
    try {
      const newContact = new Contact(req.body as IContact);
      const savedContact = await newContact.save();
      res.status(201).json(savedContact);
    } catch (error) {
      console.error("Error adding contact:", error);
      res.status(500).json({ message: 'Error adding contact' });
    }
  });

  // DELETE a contact by ID
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await Contact.findByIdAndDelete(id);
      res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ message: 'Error deleting contact' });
    }
  });

  return router;
};

export default contactRoutes;

import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import expressSession from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import './config/passport.config';
import facebookRouter from './routes/facebook/zipickaget';
import voxidigify from './routes/facebook/voxdigifyget';
import Jurisprime from './routes/facebook/jurisprimeget';
import documents from './routes/facebook/Documentsget';
import visaprocessing from './routes/facebook/Visa_Processingget';
import realestate from './routes/facebook/realestateget';
import bussines from './routes/facebook/Businessget';
import instagramRoutes from './routes/instagram/authRoutes';

// Import database connections
import { callsConnection, meetingsConnection, clientConnection, loginConnection } from './config/database';

// Import routes
import callRoutes from './routes/callRoutes';
import meetingRoutes from './routes/meeting.routes';
import clientRoutes from './routes/accountRoutes';
import contactRoutes from './routes/contactRoutes';
import leadRoutes from './routes/leadRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/profile_picture';
import mediaRoutes from './routes/facebook/zipicka';
import voxdigifypost from './routes/facebook/voxdigify';
import jurisprimepost from './routes/facebook/juris_prime';
import documentspost from './routes/facebook/Documents_Attestation_Services';
import visaprocessingpost from './routes/facebook/Visa_Processing';
import realestategpost from './routes/facebook/realestate';
import bussinesspost from './routes/facebook/bussiness';

// Instagram
import insta from './routes/instagram/authRoutes';

dotenv.config(); // Load environment variables

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Determine if the environment is production or development
const isProduction = process.env.NODE_ENV === 'production';

// Session and Flash middleware
app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  store: isProduction
    ? MongoStore.create({
        mongoUrl: process.env.MONGO_URL || 'mongodb+srv://anees:Anees279%40@cluster0.1jchs.mongodb.net/anees',
        ttl: 14 * 24 * 60 * 60, // 14 days expiration
      })
    : undefined, // Use MemoryStore in development
  cookie: {
    secure: isProduction, // Only send secure cookies in production
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
  }
}));

app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());  // Add session management for passport

// Flash messages available globally
app.use((req, res, next) => {
  res.locals.successMessages = req.flash('success');
  res.locals.errorMessages = req.flash('error');
  next();
});

// Use Routes with respective connections
app.use('/api/calls', callRoutes(callsConnection));
app.use('/api/meetings', meetingRoutes(meetingsConnection));
app.use('/api/clients', clientRoutes(clientConnection));
app.use('/api/contacts', contactRoutes(clientConnection));
app.use('/api/leads', leadRoutes(clientConnection));
app.use('/auth', authRoutes); // Authentication routes
app.use('/api', userRoutes);
app.use('/api/facebook', facebookRouter);
app.use('/api', mediaRoutes);
app.use('/api/voxdigify', voxidigify);
app.use('/api/voxdigifypost', voxdigifypost);
app.use('/api/jurisprime', Jurisprime);
app.use('/api/jurisprimepost', jurisprimepost);
app.use('/api/documents', documents);
app.use('/api/documentspost', documentspost);
app.use('/api/visaprocessing', visaprocessing);
app.use('/api/visaprocessingpost', visaprocessingpost);
app.use('/api/realestate', realestate);
app.use('/api/realestategpost', realestategpost);
app.use('/api/bussines', bussines);
app.use('/api/bussinessgpost', bussinesspost);

// Instagram
app.use('/api/instagram', instagramRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Export the Express app to be used by Vercel
export default app;

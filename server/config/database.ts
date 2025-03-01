import mongoose, { Connection } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Helper function to check if the environment variable is missing
const checkUri = (uri: string | undefined, dbName: string): string => {
  if (!uri) {
    const errorMessage = `MongoDB URI for ${dbName} is missing`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  return uri;
};

// Create MongoDB connections using mongoose.createConnection
const createConnection = (uri: string, dbName: string): Connection => {
  // Check if the URI is valid
  const validatedUri = checkUri(uri, dbName);

  const connection: Connection = mongoose.createConnection(validatedUri);

  // Event listeners for each connection
  connection.on('connected', () => {
    console.log(`Connected to MongoDB at ${validatedUri}`);
  });

  connection.on('error', (err) => {
    console.error(`Error connecting to MongoDB at ${validatedUri}:`, err);
  });

  return connection;
};

// Connections for different databases using createConnection
export const callsConnection = createConnection(process.env.MONGODB_URI!, 'MONGODB_URI');
export const meetingsConnection = createConnection(process.env.MONGODB_MEETINGS_URI!, 'MONGODB_URI_MEETINGS');
export const clientConnection = createConnection(process.env.MONGODB_ACCOUNT_URI!, 'MONGODB_ACCOUNT_URI');
export const contactConnection = createConnection(process.env.MONGODB_CONTACT_URI!, 'MONGODB_CONTACT_URI');
export const leadConnection = createConnection(process.env.MONGODB_LEAD_URI!, 'MONGODB_LEAD_URI');
export const loginConnection = createConnection(process.env.MONGODB_LOGIN_URI!, 'MONGODB_LOGIN_URI');

// config.ts
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Export configuration
export const config = {
  accessToken: process.env.ACCESS_TOKEN_INSTAGRAM,
  instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
};

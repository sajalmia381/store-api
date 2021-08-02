import dotenv from 'dotenv';

dotenv.config();

export const {
  APP_PORT,
  APP_HOST,
  DB_URL,
  DEBUG_MODE,
  SECRET_KEY,
  REFRESH_KEY
} = process.env;
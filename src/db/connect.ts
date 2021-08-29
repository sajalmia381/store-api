import mongoose from "mongoose";

import logger from '../logger';
import { DB_URL } from "../config";

// console.log(DB_URL)

export default function () {
  const dbUrl: string = DB_URL || 'mongodb://localhost:27017/store-api';

  return mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      logger.info("Database connected...")
    })
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    })
}
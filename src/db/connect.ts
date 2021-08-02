import mongoose from "mongoose";

import logger from '../logger';
import { DB_URL } from "../config";

// console.log(DB_URL)

export default function () {
  const dbUlr: string = DB_URL || 'mongodb://localhost:27017/store-api';

  return mongoose.connect(dbUlr, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      logger.info("Database connected...")
    })
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    })
}
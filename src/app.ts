import express from 'express';
import { APP_PORT } from './config';
import dbConnect from './db/connect';
import logger from './logger';
import errorHandler from './middlewares/errorHandler';

import routes from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))


app.listen(APP_PORT, () => {
  logger.info(`Server listen at http://localhost:${APP_PORT}`)
  
  // Database
  dbConnect();
  
  // Routes
  routes(app);
  
  // error handler
  app.use(errorHandler);
  
})
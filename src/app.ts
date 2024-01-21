import { APP_PORT } from './config';
import dbConnect from './db/connect';
import logger from './logger';
import createServer from './server';

const app = createServer();

app.listen(APP_PORT, () => {
  logger.info(`Server listen at http://localhost:${APP_PORT}`)

  // Database
  dbConnect();
})
import express from 'express';
import { APP_PORT } from '../config';
import connect from './db/connect';
import logger from './logger';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))


app.listen(APP_PORT, () => {
  logger.info(`Server listen at http://localhost:${APP_PORT}`)

  connect();
})
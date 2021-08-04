import express from 'express';
import { APP_PORT } from './config';
import dbConnect from './db/connect';
import logger from './logger';
import errorHandler from './middlewares/errorHandler';

import staticRoutes from './static/static.route';
import routes from './routes';
import path from 'path';

const app = express();

// Static Site Start
app.engine('.html', require('ejs').__express);
app.use('/static', express.static(path.join(__dirname, 'static/public')));
app.set('views', path.join(__dirname, 'static/views'));
app.set('view engine', 'html');
// Static Site End

app.use(express.json());
app.use(express.urlencoded({ extended: false }))


app.listen(APP_PORT || 8000, () => {
  logger.info(`Server listen at http://localhost:${APP_PORT || 8000}`)
  
  // Database
  dbConnect();
  
  // Static site route
  app.use(staticRoutes)
  
  // Routes
  routes(app);
  
  // error handler
  app.use(errorHandler);
  
})
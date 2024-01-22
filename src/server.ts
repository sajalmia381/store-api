import cors from 'cors';
import express from 'express';
import path from 'path';
import errorHandler from './middlewares/errorHandler';
import loggerMiddleware from './middlewares/logger';
import routes from './routes';

function createServer() {
  const app = express();

  app.use(loggerMiddleware);

  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
    })
  );

  // Static Site Start
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  // Static Site End

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Routes
  routes(app);

  // error handler
  app.use(errorHandler);

  return app;
}

export default createServer;

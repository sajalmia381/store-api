import { Express, Request, Response } from 'express';

import authRoutes from './auth.route'; 

export default function (app: Express) {
  app.get('/health-check', (req: Request, res: Response) => res.sendStatus(200));
  
  // Auth routes
  app.use('/api/auth', authRoutes)
}
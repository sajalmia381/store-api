import { Express, Request, response, Response } from 'express';

export default function (app: Express) {
  app.get('/health-check', (req: Request, res, Response) => res.sendStatus(2000));


}
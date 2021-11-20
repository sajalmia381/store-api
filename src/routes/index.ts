import { Express, Request, Response } from 'express';

import authRoutes from './auth.route';
import userRoutes from './user.routes';
import productRoutes from './product.route';
import categoryRoutes from './category.route';
import imageRoute from './image.route';
import cartRoute from './cart.route';

const API_PREFIX = '/api'

export default function (app: Express) {
  app.get('/health-check', (req: Request, res: Response) => res.sendStatus(200));
  
  // Auth routes
  app.use(API_PREFIX + '/auth', authRoutes);
  // User routes
  app.use(API_PREFIX + '/users', userRoutes);
  // Product Routes
  app.use(API_PREFIX + '/products', productRoutes)
  // Image
  app.use(API_PREFIX + '/images', imageRoute)
  // Cart
  app.use(API_PREFIX + '/carts', cartRoute)
  // Category
  app.use(API_PREFIX + '', categoryRoutes)
}
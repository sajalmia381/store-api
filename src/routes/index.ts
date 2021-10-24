import { Express, Request, Response } from 'express';

import authRoutes from './auth.route';
import userRoutes from './user.routes';
import productRoutes from './product.route';
import categoryRoutes from './category.route';
import imageRoute from './image.route';
import cartRoute from './cart.route';

export default function (app: Express) {
  app.get('/health-check', (req: Request, res: Response) => res.sendStatus(200));
  
  // Auth routes
  app.use('/api/auth', authRoutes);
  // User routes
  app.use('/api/users', userRoutes);
  // Product Routes
  app.use('/api/products', productRoutes)
  // Image
  app.use('/api/images', imageRoute)
  // Cart
  app.use('/api/carts', cartRoute)
  // Category
  app.use('/api', categoryRoutes)
}
import { Express, Request, Response } from 'express';

import authRoutes from './auth.route';
import userRoutes from './user.routes';
import productRoutes from './product.route';
import categoryRoutes from './category.route';
import imageRoute from './image.route';
import cartRoute from './cart.route';
import todoRoute from './todo.route';

export default function (app: Express) {
  app.get('/health-check', (req: Request, res: Response) => res.sendStatus(200));
  
  // Auth routes
  app.use('/auth', authRoutes);
  // User routes
  app.use('/users', userRoutes);
  // Product Routes
  app.use('/products', productRoutes)
  // Image
  app.use('/images', imageRoute)
  // Cart
  app.use('/carts', cartRoute)
  // Category
  app.use('categories', categoryRoutes)
  // Todo
  app.use('/todos', todoRoute)
}
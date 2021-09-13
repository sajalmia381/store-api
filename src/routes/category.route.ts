import { Router } from 'express';
import { categoryController } from '../controllers';
import attachUser from '../middlewares/attachUser';

const router = Router();

router.get('/categories', categoryController.categories);

router.post('/categories', attachUser, categoryController.create);

router.get('/categories/:slug', categoryController.single);

router.put('/categories/:slug', attachUser, categoryController.update);

router.delete('/categories/:slug', attachUser, categoryController.delete);

export default router;
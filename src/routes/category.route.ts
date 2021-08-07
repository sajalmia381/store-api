import { Router } from 'express';
import { categoryController } from '../controllers';
import attachUser from '../middlewares/attachUser';

const router = Router();

router.get('/categories', categoryController.categories);

router.post('/category', attachUser, categoryController.create);

router.get('/category/:slug', categoryController.single);

router.put('/category/:slug', attachUser, categoryController.update);

router.delete('/category/:slug', attachUser, categoryController.delete);

export default router;
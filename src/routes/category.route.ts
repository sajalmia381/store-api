import { Router } from 'express';
import { categoryController } from '../controllers';
import attachUser from '../middlewares/attachUser';

const router = Router();

router.get('/', categoryController.categories);

router.post('/', attachUser, categoryController.create);

router.get('/:slug', categoryController.single);

router.put('/:slug', attachUser, categoryController.update);

router.delete('/:slug', attachUser, categoryController.delete);

export default router;
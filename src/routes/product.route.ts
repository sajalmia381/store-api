import { Router } from "express";
import { productController } from "../controllers";
import attachUser from "../middlewares/attachUser";
import authorizationHandler from "../middlewares/authorizationHandler";

const router = Router();

router.get('/', productController.list);

router.post('/', attachUser, productController.create);

router.get('/:slug', productController.description);

router.put('/:slug', attachUser, productController.update);

router.delete('/:slug', attachUser, productController.destroy);

export default router;
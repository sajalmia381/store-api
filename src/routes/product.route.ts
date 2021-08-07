import { Router } from "express";
import { productController } from "../controllers";
import authorizationHandler from "../middlewares/authorizationHandler";

const router = Router();

router.get('/', productController.list);

router.post('/', authorizationHandler, productController.create);

router.get('/:slug', productController.description);

router.get('/:slug', productController.destroy);

export default router;
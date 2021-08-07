import { Router } from "express";
import { productController } from "../controllers";
import authorizationHandler from "../middlewares/authorizationHandler";

const router = Router();

router.get('/', productController.productList);
router.post('/', authorizationHandler, productController.productCreate)
router.get('/:slug', productController.productDescription)


export default router;
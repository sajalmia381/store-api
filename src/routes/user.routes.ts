import { Router } from "express";
import { userController } from "../controllers";
import attachUser from "../middlewares/attachUser";

const router = Router();

router.get('/', attachUser, userController.list);

router.post('/', attachUser, userController.create);

router.get('/:id', userController.description);

router.put('/:id', attachUser, userController.update);

router.delete('/:id', attachUser, userController.destroy);

export default router;
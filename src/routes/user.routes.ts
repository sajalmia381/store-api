import { Router } from "express";
import userController from "../controllers/user.controller";
import attachUser from "../middlewares/attachUser";

const router = Router();

router.get('/', attachUser, userController.userList);

router.post('/', attachUser, userController.userCreate);

router.get('/:id', userController.userDescription);

router.put('/:id', attachUser, userController.userUpdate);


export default router;
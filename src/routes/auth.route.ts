import { Router } from "express";
import { authController } from "../controllers";
import attachUser from "../middlewares/attachUser";

const router = Router();

router.post('/login', authController.login);

router.post('/register', attachUser, authController.register);

router.post('/refresh', attachUser, authController.refreshToken)

export default router;
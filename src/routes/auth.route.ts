import { Router } from "express";
import { authController } from "../controllers";

const router = Router();

router.post('/login', authController.login);

router.post('/register', authController.register);

router.post('/refresh', authController.refreshToken)

export default router;
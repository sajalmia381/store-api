import { Router } from "express";
import { todoController } from "../controllers";

const router = Router();

router.get("/", todoController.list);
router.post("/", todoController.create);

export default router;

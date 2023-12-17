import { Router } from "express";
import { todoController } from "../controllers";
import attachUser from "../middlewares/attachUser";

const router = Router();

router.get("/", todoController.list);
router.post("/", attachUser, todoController.create);
router.put("/:id", attachUser, todoController.update);
router.delete("/:id", attachUser, todoController.destroy);

export default router;

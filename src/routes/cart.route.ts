import { Router } from "express";
import { cartController } from "../controllers";
import attachUser from "../middlewares/attachUser";

const app = Router();

// Authenticated User
app.get("/cart", attachUser, cartController.getByUser);
app.post("/cart/add", attachUser, cartController.updateByUser);
app.put("/cart/update", attachUser, cartController.updateByUser);
app.delete("/cart/remove", attachUser, cartController.removeProductByUser);

// Dashboard
app.get("/carts", cartController.list);
app.post("/carts", cartController.create);
app.get("/carts/:id", cartController.description);
app.put("/carts/:id", attachUser, cartController.update);
app.delete("/carts/:id", attachUser, cartController.destroy);

export default app;

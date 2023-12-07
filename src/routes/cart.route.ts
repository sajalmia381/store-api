import { Router } from "express";
import { cartController } from "../controllers";
import attachUser from "../middlewares/attachUser";

const app = Router();

// Authenticated User
app.get("/cart", attachUser, cartController.gerRequestUserCart);
app.post("/cart/add", attachUser, cartController.updateRequestUserCart);
app.put("/cart/update", attachUser, cartController.updateRequestUserCart);
app.delete("/cart/remove", attachUser, cartController.removeProductRequestUserCart);

// Dashboard
app.get("/carts", cartController.list);
app.post("/carts", attachUser, cartController.create);
app.get("/carts/:id", cartController.description);
app.put("/carts/:id", attachUser, attachUser, cartController.update);
app.delete("/carts/:id", attachUser, attachUser, cartController.destroy);

export default app;

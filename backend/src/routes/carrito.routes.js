import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getCarritoActual,
  addItemToCarrito,
  updateItemCantidad,
  removeItemFromCarrito,
  clearCarrito,
} from "../controllers/carrito.controller.js";

const router = Router();

router.use(authMiddleware); // todo el carrito requiere usuario logueado

router.get("/", getCarritoActual);              // GET carrito actual
router.post("/items", addItemToCarrito);        // POST agregar item
router.put("/items/:itemId", updateItemCantidad); // PUT actualizar cantidad
router.delete("/items/:itemId", removeItemFromCarrito); // DELETE item
router.delete("/", clearCarrito);               // DELETE vaciar carrito

export default router;


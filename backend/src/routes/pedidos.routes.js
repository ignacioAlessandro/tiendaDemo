import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  checkoutPedido,
  getMisPedidos,
  getPedidoById,
} from "../controllers/pedidos.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/checkout", checkoutPedido);  // confirmar compra
router.get("/", getMisPedidos);           // listado del usuario
router.get("/:id", getPedidoById);        // detalle opcional

export default router;

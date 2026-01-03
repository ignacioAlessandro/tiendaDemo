import { Router } from "express";
import {
  getAllProductos,
  getProductoById,
  getProductosRecomendados,
} from "../controllers/productos.controller.js";

const router = Router();

// Listado
router.get("/", getAllProductos);

// Recomendados por subcategoria
router.get("/recomendados", getProductosRecomendados);

// Detalle por ID
router.get("/:id", getProductoById);

export default router;

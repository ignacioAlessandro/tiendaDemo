import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getPerfil } from "../controllers/usuarios.controller.js";

const router = express.Router();

router.get("/me", authMiddleware, getPerfil);

export default router;

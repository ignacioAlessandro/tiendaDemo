import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import productosRoutes from "./routes/productos.routes.js";
import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import carritoRoutes from "./routes/carrito.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js"; // 👈 NUEVO

const app = express();

// Middlewares base
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limit SOLO para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

// Rutas
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/pedidos", pedidosRoutes); // 👈 NUEVO

// Healthcheck
app.get("/", (req, res) => {
  res.send("✅ API TIENDA DEMO OPERATIVA");
});

export default app;

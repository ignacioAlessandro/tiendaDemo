// backend/src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const ACCESS_SECRET =
  process.env.JWT_SECRET || "dev-access-secret-cambiar-en-produccion";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, ACCESS_SECRET);

    const user = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        documento: true,
        telefono: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    req.userId = user.id;
    req.user = user;

    next();
  } catch (err) {
    console.error("Error en authMiddleware:", err);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

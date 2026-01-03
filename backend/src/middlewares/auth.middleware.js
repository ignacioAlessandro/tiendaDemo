// backend/src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // Dejamos info útil en la request
    req.userId = user.id;
    req.user = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      documento: user.documento,
      telefono: user.telefono,
    };

    next();
  } catch (err) {
    console.error("Error en authMiddleware:", err);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

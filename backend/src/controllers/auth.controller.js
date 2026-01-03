import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { generateAccessToken, generateRefreshToken } from "../config/jwt.js";

const buildUserResponse = (user) => ({
  id: user.id,
  nombre: user.nombre,
  apellido: user.apellido,
  email: user.email,
  telefono: user.telefono,
  documento: user.documento,
  creadoAt: user.creadoAt,
});

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res
        .status(400)
        .json({ error: "Nombre, apellido, email y contraseña son obligatorios" });
    }

    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        email,
        passwordHash: hashedPassword,
        telefono: telefono || null,
      },
    });

    const token = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return res.status(201).json({
      user: buildUserResponse(user),
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({ error: "Error al registrarse" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }

    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return res.json({
      user: buildUserResponse(user),
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// GET /api/auth/me
export const me = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        documento: true,
        creadoAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Error en /auth/me:", error);
    return res.status(500).json({ error: "Error al obtener el perfil" });
  }
};

import prisma from "../config/prisma.js";

export const getPerfil = async (req, res) => {
  const user = await prisma.usuario.findUnique({
    where: { id: req.userId },
    select: { id: true, nombre: true, email: true },
  });

  res.json(user);
};

import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, setTokenCookie } from '../../../lib/auth';
export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end();
  const { nombre, email, password, documento, telefono } = req.body;
  if (!email || !nombre) return res.status(400).json({ error: 'faltan datos' });
  const existing = await prisma.usuario.findUnique({ where: { email }});
  if (existing) return res.status(400).json({ error: 'email ya registrado' });
  const passwordHash = password ? await bcrypt.hash(password,10) : null;
  const user = await prisma.usuario.create({ data: { nombre, email, passwordHash, documento, telefono }});
  const token = signToken({ userId: user.id, email: user.email });
  setTokenCookie(res, token);
  res.json({ ok:true, user: { id: user.id, email: user.email, nombre: user.nombre }});
}

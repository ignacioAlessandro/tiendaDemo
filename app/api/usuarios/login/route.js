import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, setTokenCookie } from '../../../lib/auth';
export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  const user = await prisma.usuario.findUnique({ where: { email }});
  if (!user || !user.passwordHash) return res.status(401).json({ error: 'usuario no encontrado' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'credenciales inválidas' });
  const token = signToken({ userId: user.id, email: user.email });
  setTokenCookie(res, token);
  res.json({ ok:true, user: { id: user.id, email: user.email, nombre: user.nombre }});
}

import prisma from '../../lib/prisma';
import { verifyToken } from '../../lib/auth';
import cookie from 'cookie';
export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end();
  const { items, emailInvitado } = req.body;
  if (!items || !Array.isArray(items) || items.length===0) return res.status(400).json({ error:'sin items' });
  let total = 0;
  for (const it of items){
    const p = await prisma.producto.findUnique({ where: { id: it.productoId }});
    if (!p) { total += it.precio_cents * it.cantidad; continue; }
    if (p.stock < it.cantidad) return res.status(400).json({ error:`stock insuficiente ${p.nombre}`});
    total += p.precio_cents * it.cantidad;
  }
  let usuarioId = null;
  const cookies = cookie.parse(req.headers.cookie||'');
  if (cookies.token){ const payload = verifyToken(cookies.token); if (payload && payload.userId) usuarioId = payload.userId; }
  const orden = await prisma.orden.create({ data: { usuarioId, emailInvitado: usuarioId?null:emailInvitado, total_cents: total, estado:'pendiente', items: { create: items.map(i=>({ productoId: i.productoId, cantidad: i.cantidad, precio_unit_cents: i.precio_cents })) } }, include: { items:true } });
  res.json({ ok:true, orden });
}

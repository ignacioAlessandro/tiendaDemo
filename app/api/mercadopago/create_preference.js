import mercadopago from 'mercadopago';
import prisma from '../../../lib/prisma';
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);
export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).end();
  const { ordenId } = req.body; if (!ordenId) return res.status(400).json({ error:'ordenId requerido' });
  const orden = await prisma.orden.findUnique({ where: { id: ordenId }, include: { items: { include: { producto: true }}}});
  if (!orden) return res.status(404).json({ error:'orden no encontrada' });
  const items = orden.items.map(it=>({ title: it.producto? it.producto.nombre : 'Item', unit_price: it.precio_unit_cents/100, quantity: it.cantidad, currency_id: 'ARS' }));
  const preference = { items, external_reference: orden.id, notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/webhook`, payment_methods: { excluded_payment_types: [{ id: 'atm' }] } };
  try { const mpResp = await mercadopago.preferences.create(preference); await prisma.orden.update({ where: { id: orden.id }, data: { mp_preference_id: mpResp.body.id }}); res.json({ init_point: mpResp.body.init_point, sandbox_init_point: mpResp.body.sandbox_init_point, preference_id: mpResp.body.id }); } catch (err){ console.error(err); res.status(500).json({ error:'error creando preferencia' }); }
}

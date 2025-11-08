import prisma from '../../../lib/prisma';
import mercadopago from 'mercadopago';
import { sendOrderConfirmation } from '../../../lib/mailer';
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);
export default async function handler(req,res){
  const mpBody = req.body; try{
    let paymentId = null; if (mpBody.id) paymentId = mpBody.id; if (mpBody.data && mpBody.data.id) paymentId = mpBody.data.id; if (!paymentId) return res.status(200).send('no payment id');
    const mpPayment = await mercadopago.payment.get(paymentId);
    const { status, external_reference, id } = mpPayment.body;
    if (external_reference){ const orden = await prisma.orden.findUnique({ where: { id: external_reference }}); if (!orden) return res.status(404).send('orden no encontrada');
      if (status === 'approved') { await prisma.orden.update({ where: { id: orden.id }, data: { estado:'pagada', mp_payment_id: id }}); const toEmail = orden.usuarioId ? (await prisma.usuario.findUnique({ where: { id: orden.usuarioId }})).email : orden.emailInvitado; if (toEmail) await sendOrderConfirmation(toEmail, orden); }
      else if (status === 'pending') { await prisma.orden.update({ where: { id: orden.id }, data: { estado:'pendiente', mp_payment_id: id }}); }
      else { await prisma.orden.update({ where: { id: orden.id }, data: { estado:'cancelada', mp_payment_id: id }}); }
    }
    res.status(200).send('ok');
  } catch(err){ console.error(err); res.status(500).send('error webhook'); }
}

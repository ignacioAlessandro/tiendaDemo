import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
});
export async function sendOrderConfirmation(toEmail, order) {
  const html = `<p>Gracias por tu compra. Orden: ${order.id} - Total: ${(order.total_cents/100).toFixed(2)}</p>`;
  await transporter.sendMail({ from: process.env.GMAIL_USER, to: toEmail, subject: 'Confirmación de pedido', html });
}

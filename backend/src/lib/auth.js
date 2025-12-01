import jwt from 'jsonwebtoken';
import cookie from 'cookie';
const JWT_SECRET = process.env.JWT_SECRET;
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
export function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch (e) { return null; }
}
export function setTokenCookie(res, token) {
  res.setHeader('Set-Cookie', cookie.serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/' 
  }));
}
export function clearTokenCookie(res) {
  res.setHeader('Set-Cookie', cookie.serialize('token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 0, path: '/' }));
}

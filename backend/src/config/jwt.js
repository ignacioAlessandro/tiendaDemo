// backend/src/config/jwt.js
import jwt from "jsonwebtoken";

const ACCESS_SECRET =
  process.env.JWT_SECRET || "dev-access-secret-cambiar-en-produccion";
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev-refresh-secret-cambiar-en-produccion";

const ACCESS_EXPIRES = process.env.JWT_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "7d";

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  });
};

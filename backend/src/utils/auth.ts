import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'superrefreshsecret';

export const generateAccessToken = (userId: string, organizationId: string) => {
  return jwt.sign({ userId, organizationId }, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string, organizationId: string) => {
  return jwt.sign({ userId, organizationId }, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};

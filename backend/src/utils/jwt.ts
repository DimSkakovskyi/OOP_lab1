import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface JwtPayload {
  id: number;
  login: string;
  role: 'CLIENT' | 'ADMIN';
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function hashPasswordLikeFrontend(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function generateAccountNumber(): string {
  const timestampPart = Date.now().toString().slice(-8);
  const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
  return `ACC${timestampPart}${randomPart}`;
}

export function generateCardNumber(): string {
  const base = `411111${Date.now().toString().slice(-6)}${Math.floor(
    1000 + Math.random() * 9000
  )}`;
  return base.slice(0, 16);
}


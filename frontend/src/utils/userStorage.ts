import type { User } from '../types/auth';

export function saveUser(user: User): void {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem('user');

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function removeStoredUser(): void {
  localStorage.removeItem('user');
}
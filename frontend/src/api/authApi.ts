import api from './axios';
import type { AuthResponse } from '../types/auth';

export async function loginRequest(login: string, passwordHash: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', {
    login,
    password: passwordHash,
  });

  return response.data;
}

export async function registerRequest(login: string, passwordHash: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', {
    login,
    password: passwordHash,
  });

  return response.data;
}
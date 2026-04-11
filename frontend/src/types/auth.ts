export interface User {
  id: number;
  login: string;
  role: 'CLIENT' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}
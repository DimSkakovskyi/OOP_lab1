import { useMemo, useState, type ReactNode } from 'react';
import type { User } from '../types/auth';
import { getToken, removeToken, saveToken } from '../utils/token';
import { AuthContext } from './AuthContext';

function getStoredUser(): User | null {
  const raw = localStorage.getItem('user');

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<User | null>(() => {
    const storedToken = getToken();
    return storedToken ? getStoredUser() : null;
  });

  const login = (newToken: string, newUser: User) => {
    saveToken(newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
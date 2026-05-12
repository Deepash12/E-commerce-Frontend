import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api/services';
import type { User, LoginRequest } from '../types';
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<any>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role') || undefined;
    if (token && username) setUser({ token, username, role });
    setLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await authAPI.login(data);
    const { token, username } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    const decoded: any = jwtDecode(token);
    const newUser = { token, username, role: decoded?.role };
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: user?.role === 'ROLE_ADMIN', login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth error');
  return ctx;
};
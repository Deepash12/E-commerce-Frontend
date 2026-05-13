// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { authAPI } from '../api/service';
// import type { User, LoginRequest } from '../types';
// import { jwtDecode } from "jwt-decode";

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   isAdmin: boolean;
//   login: (data: LoginRequest) => Promise<any>;
//   logout: () => Promise<void>;
//   setUser: React.Dispatch<React.SetStateAction<User | null>>;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const username = localStorage.getItem('username');
//     const role = localStorage.getItem('role') || undefined;
//     if (token && username) setUser({ token, username, role });
//     setLoading(false);
//   }, []);

//   const login = async (data: LoginRequest) => {
//     const res = await authAPI.login(data);
//     const { token, username } = res.data;
//     localStorage.setItem('token', token);
//     localStorage.setItem('username', username);
//     const decoded: any = jwtDecode(token);
//     const newUser = { token, username, role: decoded?.role };
//     setUser(newUser);
//     return newUser;
//   };

//   const logout = async () => {
//     localStorage.clear();
//     setUser(null);
//     window.location.href = "/login";
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, isAdmin: user?.role === 'ROLE_ADMIN', login, logout, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth error');
//   return ctx;
// };

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "../api/service";
import type { User, LoginRequest } from "../types";
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

const normalizeRole = (role?: string | null) => {
  if (!role) return undefined;

  if (role === "ADMIN") return "ROLE_ADMIN";
  if (role === "ROLE_ADMIN") return "ROLE_ADMIN";

  if (role === "USER") return "ROLE_USER";
  if (role === "ROLE_USER") return "ROLE_USER";

  return role;
};

const getRoleFromToken = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);

    return normalizeRole(
      decoded?.role ||
        decoded?.roles?.[0] ||
        decoded?.authorities?.[0] ||
        decoded?.auth
    );
  } catch (error) {
    console.error("Token decode failed:", error);
    return undefined;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    let role = normalizeRole(localStorage.getItem("role"));

    if (token && username) {
      if (!role) {
        role = getRoleFromToken(token);
        if (role) {
          localStorage.setItem("role", role);
        }
      }

      setUser({
        token,
        username,
        role,
      });
    }

    setLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await authAPI.login(data);

    const responseData = res.data?.data ?? res.data;

    const token = responseData.token || responseData.accessToken;
    const refreshToken = responseData.refreshToken;
    const username = responseData.username;

    const role =
      normalizeRole(responseData.role) ||
      normalizeRole(responseData.roles?.[0]) ||
      getRoleFromToken(token);

    if (!token) {
      throw new Error("Token not received from login API");
    }

    localStorage.setItem("token", token);

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    if (username) {
      localStorage.setItem("username", username);
    }

    if (role) {
      localStorage.setItem("role", role);
    }

    const newUser = {
      token,
      username,
      role,
    };

    setUser(newUser);

    return newUser;
  };

  const logout = async () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  const isAdmin = user?.role === "ROLE_ADMIN" || user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth error");
  return ctx;
};
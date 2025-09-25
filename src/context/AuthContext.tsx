// src/context/AuthContext.tsx
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
// import api from '@/lib/api'; // <--- УДАЛЕНО

interface User {
  id: string;
  email: string;
  nickname: string;
  role: 'user' | 'business' | 'moderator' | 'admin';
  // Добавьте другие поля, если они приходят с бэкенда
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Функция для декодирования токена
const decodeToken = (token: string): User | null => {
  try {
    // Бэкенд возвращает sub, email, role, nickname в токене
    const decoded: { sub: string; email: string; role: User['role'], nickname: string } = jwtDecode(token);
    return { id: decoded.sub, email: decoded.email, role: decoded.role, nickname: decoded.nickname };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем токен при загрузке приложения
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const decodedUser = decodeToken(accessToken);
      setUser(decodedUser);
    }
    setIsLoading(false);
  }, []);
  
  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    const decodedUser = decodeToken(accessToken);
    setUser(decodedUser);
  };
  
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    // Перенаправляем на главную или страницу входа
    window.location.href = '/';
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
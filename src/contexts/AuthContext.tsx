import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('lumina_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user session');
        localStorage.removeItem('lumina_user');
      }
    }
  }, []);

  const login = async (email: string, password = 'password') => {
    const response = await authApi.login(email, password);
    
    if (response.success) {
      const userData = response.data;
      // Store user + token
      // In types.ts User doesn't have token, but API response does. 
      // We store the full response in localStorage for the client.ts to read,
      // but state 'user' adheres to the User type (sans token usually, or we extend it).
      // For simplicity here we cast or store as is.
      const userWithToken = { ...userData };
      
      setUser(userWithToken);
      localStorage.setItem('lumina_user', JSON.stringify(userWithToken));
    } else {
      throw new Error(response.error?.message || 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lumina_user');
    window.location.href = '/';
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
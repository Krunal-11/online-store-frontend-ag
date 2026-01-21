'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, AuthState } from '@/types';
import api from '@/lib/api';

interface AuthContextType extends AuthState {
  login: (phone: string, otp: string) => Promise<{ success: boolean; isNewUser?: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          }
        } catch {
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const sendOtp = useCallback(async (phone: string) => {
    try {
      const response = await api.post('/auth/send-otp', { phone });
      return { success: response.data.success };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      return { success: false, error: errorMessage };
    }
  }, []);

  const login = useCallback(async (phone: string, otp: string) => {
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp });
      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, isNewUser: response.data.isNewUser };
      }
      return { success: false, error: response.data.message };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      const response = await api.put('/auth/profile', data);
      if (response.data.success) {
        // Merge the updated data with existing user
        setUser(prev => prev ? { ...prev, ...response.data.user } : response.data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateProfile,
        sendOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

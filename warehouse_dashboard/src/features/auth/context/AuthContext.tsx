'use client';

import { getApiBaseUrl } from '@/lib/api';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthContextType } from '../types/auth';
import { AppRole } from '@/config/permissions';
import { SESSION_STORAGE_KEYS } from '../constants/authConfig';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // ตรวจสอบ session กับเซิร์ฟเวอร์ Backend (/api/v1/auth/me) เป็น Single Source of Truth
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/me`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success' && data.user) {
          setUser(data.user);
          setExpiresAt(data.expiresAt || null);
          return;
        }
      }

      // หากไม่มี session หรือหมดอายุ
      setUser(null);
      setExpiresAt(null);
      setToken(null);
      try {
        localStorage.removeItem(SESSION_STORAGE_KEYS.token);
        localStorage.removeItem(SESSION_STORAGE_KEYS.user);
      } catch {}
    } catch (err) {
      console.warn('[AuthContext] Session verification failed:', err);
      setUser(null);
      setExpiresAt(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    const handleRolesUpdated = () => {
      checkSession();
    };
    window.addEventListener('ku_roles_updated', handleRolesUpdated);
    return () => window.removeEventListener('ku_roles_updated', handleRolesUpdated);
  }, [checkSession]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${getApiBaseUrl()}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error('[AuthContext] Logout error:', e);
    } finally {
      setUser(null);
      setToken(null);
      setExpiresAt(null);
      try {
        localStorage.removeItem(SESSION_STORAGE_KEYS.token);
        localStorage.removeItem(SESSION_STORAGE_KEYS.user);
      } catch {}
      // Clear all auth cookies
      if (typeof document !== 'undefined') {
        document.cookie = 'ku_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'user_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'intranet_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ku_auth_logout'));
        window.dispatchEvent(new CustomEvent('ku_roles_updated'));
        const ADMIN_PATHS = ['/manage', '/evaluation', '/monitoring', '/kpi', '/user-roles', '/admin'];
        if (ADMIN_PATHS.some((p) => window.location.pathname.startsWith(p))) {
          window.location.replace('/overview');
        }
      }
    }
  }, []);

  // ตัวนับเวลา Session Timer อัตโนมัติ: หากหมดอายุ ให้ logout ทันที
  useEffect(() => {
    if (!expiresAt || !user) return;

    const checkTimer = () => {
      const now = Date.now();
      if (now >= expiresAt) {
        console.warn('[AuthContext] Session expired. Logging out...');
        logout();
      }
    };

    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, user, logout]);

  const loginWithCredentials = async (
    username: string,
    password: string,
    otp?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, otp }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.status === 'success' && data.user) {
        setUser(data.user);
        setExpiresAt(data.expiresAt || null);
        if (data.token) {
          setToken(data.token);
        }
        setIsLoginModalOpen(false);

        // ล้าง token/user ใน localStorage เพื่อไม่ให้ใช้ตัดสินสิทธิ์ฝั่ง client
        try {
          localStorage.removeItem(SESSION_STORAGE_KEYS.token);
          localStorage.removeItem(SESSION_STORAGE_KEYS.user);
        } catch {}

        return { success: true };
      }

      return {
        success: false,
        error: data.error || data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
      };
    } catch (err: any) {
      console.error('[AuthContext] Login error:', err);
      return {
        success: false,
        error: err.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อกับเซิร์ฟเวอร์',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithMock = async (_role: AppRole) => {
    // Disabled in Phase D as requested: provider mock is turned off
    console.warn('[AuthContext] Mock login is disabled in Phase D');
  };

  const isAdmin = user?.role === 'admin';

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        expiresAt,
        loginWithMock,
        loginWithCredentials,
        logout,
        openLoginModal,
        closeLoginModal,
        isLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

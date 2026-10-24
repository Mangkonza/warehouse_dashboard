'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { User, AuthContextType } from '../types/auth';
import { ADMIN_ACCOUNTS, ADMIN_TEST_CREDENTIALS, SESSION_STORAGE_KEYS } from '../constants/authConfig';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const isAccountAdmin = (u: User | null): boolean => {
  if (!u) return false;
  if (u.role === 'admin') return true;
  const acc = (u.nontriAccount || '').toLowerCase().trim();
  return ADMIN_ACCOUNTS.includes(acc) || acc.includes('admin');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem(SESSION_STORAGE_KEYS.token);
    const savedUser = localStorage.getItem(SESSION_STORAGE_KEYS.user);

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        const parsed: User = JSON.parse(savedUser);
        if (isAccountAdmin(parsed)) {
          parsed.role = 'admin';
          parsed.typePerson = 'ผู้ดูแลระบบ';
          localStorage.setItem(SESSION_STORAGE_KEYS.user, JSON.stringify(parsed));
        }
        setUser(parsed);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const loginWithMock = async (role: 'admin' | 'viewer') => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/auth/mock-login', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });

      if (res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem(SESSION_STORAGE_KEYS.token, res.token);
        localStorage.setItem(SESSION_STORAGE_KEYS.user, JSON.stringify(res.user));
        setIsLoginModalOpen(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบว่า Backend กำลังทำงาน');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithCredentials = async (
    username: string,
    password: string,
    otp?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const normalizedUser = String(username).trim();
      const normalizedPass = String(password).trim();
      const normalizedOtp = otp ? String(otp).trim() : '';

      // SECURITY: Local fallback check matching existing behavior
      if (normalizedUser.toLowerCase() === ADMIN_TEST_CREDENTIALS.username) {
        if (normalizedPass.toLowerCase() !== ADMIN_TEST_CREDENTIALS.password) {
          return { success: false, error: 'รหัสผ่านไม่ถูกต้อง (รหัสผ่านคือ Admin)' };
        }
        if (normalizedOtp && normalizedOtp !== ADMIN_TEST_CREDENTIALS.otp) {
          return { success: false, error: 'รหัส One-time code (OTP) ไม่ถูกต้อง (ระบุ: 111111)' };
        }
      }

      // พยายามส่งไปหา Backend
      try {
        const res = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username, password, otp }),
        });

        if (res.token && res.user) {
          if (isAccountAdmin(res.user) || normalizedUser.toLowerCase() === 'admin') {
            res.user.role = 'admin';
            res.user.typePerson = 'ผู้ดูแลระบบ';
            res.user.nontriAccount = 'Admin';
          }
          setToken(res.token);
          setUser(res.user);
          localStorage.setItem(SESSION_STORAGE_KEYS.token, res.token);
          localStorage.setItem(SESSION_STORAGE_KEYS.user, JSON.stringify(res.user));
          setIsLoginModalOpen(false);
          return { success: true };
        }
      } catch (backendErr) {
        // Fallback Client-side Login หาก Backend ยังไม่พร้อม หรือรันแบบ Standalone
        if (
          normalizedUser.toLowerCase() === ADMIN_TEST_CREDENTIALS.username &&
          normalizedPass.toLowerCase() === ADMIN_TEST_CREDENTIALS.password &&
          (!normalizedOtp || normalizedOtp === ADMIN_TEST_CREDENTIALS.otp)
        ) {
          const adminUser: User = {
            id: 'ku-admin-local',
            nontriAccount: 'Admin',
            nameTh: 'ผู้ดูแลระบบ (Admin)',
            email: 'admin@ku.th',
            facultyName: 'คณะวิศวกรรมศาสตร์ กำแพงแสน',
            departmentName: 'สำนักงานเลขานุการ คณะวิศวกรรมศาสตร์',
            typePerson: 'ผู้ดูแลระบบ',
            role: 'admin',
          };
          const mockToken = 'mock_jwt_token_admin_2026';
          setToken(mockToken);
          setUser(adminUser);
          localStorage.setItem(SESSION_STORAGE_KEYS.token, mockToken);
          localStorage.setItem(SESSION_STORAGE_KEYS.user, JSON.stringify(adminUser));
          setIsLoginModalOpen(false);
          return { success: true };
        }
        throw backendErr;
      }

      return { success: false, error: 'เข้าสู่ระบบไม่สำเร็จ ข้อมูลไม่ครบถ้วน' };
    } catch (err: any) {
      console.error('Login error:', err);
      return {
        success: false,
        error: err.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(SESSION_STORAGE_KEYS.token);
    localStorage.removeItem(SESSION_STORAGE_KEYS.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin: isAccountAdmin(user),
        loginWithMock,
        loginWithCredentials,
        logout,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
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

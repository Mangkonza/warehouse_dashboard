'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from './api';

export interface User {
  id: string;
  nontriAccount: string;
  email?: string;
  nameTh: string;
  departmentName?: string;
  facultyName?: string;
  typePerson?: string;
  role: 'admin' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  loginWithMock: (role: 'admin' | 'viewer') => Promise<void>;
  loginWithCredentials: (username: string, password: string, otp?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_ACCOUNTS = ['b6520503525', 'b6400000000', 'admin.eng', 'admin', 'test_admin'];

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
    const savedToken = localStorage.getItem('ku_token');
    const savedUser = localStorage.getItem('ku_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        const parsed: User = JSON.parse(savedUser);
        if (isAccountAdmin(parsed)) {
          parsed.role = 'admin';
          parsed.typePerson = 'ผู้ดูแลระบบ';
          localStorage.setItem('ku_user', JSON.stringify(parsed));
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
        localStorage.setItem('ku_token', res.token);
        localStorage.setItem('ku_user', JSON.stringify(res.user));
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

      // ตรวจสอบเงื่อนไข Admin: username: Admin, password: Admin, otp: 111111
      if (normalizedUser.toLowerCase() === 'admin') {
        if (normalizedPass.toLowerCase() !== 'admin') {
          return { success: false, error: 'รหัสผ่านไม่ถูกต้อง (รหัสผ่านคือ Admin)' };
        }
        if (normalizedOtp && normalizedOtp !== '111111') {
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
          localStorage.setItem('ku_token', res.token);
          localStorage.setItem('ku_user', JSON.stringify(res.user));
          setIsLoginModalOpen(false);
          return { success: true };
        }
      } catch (backendErr) {
        // Fallback Client-side Login หาก Backend ยังไม่พร้อม หรือรันแบบ Standalone
        if (normalizedUser.toLowerCase() === 'admin' && normalizedPass.toLowerCase() === 'admin' && (!normalizedOtp || normalizedOtp === '111111')) {
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
          localStorage.setItem('ku_token', mockToken);
          localStorage.setItem('ku_user', JSON.stringify(adminUser));
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
    localStorage.removeItem('ku_token');
    localStorage.removeItem('ku_user');
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

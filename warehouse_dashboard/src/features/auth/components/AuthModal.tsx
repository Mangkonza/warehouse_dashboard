'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaRedo, FaTimes, FaLock, FaUser } from 'react-icons/fa';

export interface AuthModalProps {
  forceOpen?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ forceOpen = false }) => {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');
  const bgUrl = `${basePath}/bg9.jpg`;
  React.useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyMargin = document.body.style.margin;
    const originalBodyPadding = document.body.style.padding;
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlGutter = document.documentElement.style.scrollbarGutter;

    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0px';
    document.body.style.padding = '0px';
    document.body.style.backgroundColor = '#121518';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.scrollbarGutter = 'auto';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.margin = originalBodyMargin;
      document.body.style.padding = originalBodyPadding;
      document.body.style.backgroundColor = originalBodyBg;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.scrollbarGutter = originalHtmlGutter;
    };
  }, []);
  const { user, isLoginModalOpen, closeLoginModal, loginWithCredentials, isLoading } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // ตรวจสอบสถานะการเปิด Modal (หาก forceOpen=true บนหน้า /login จะแสดงเสมอ)
  if (!forceOpen) {
    if (isLoading) return null;
    if (user && !isLoginModalOpen) return null;
    if (!user && !isLoginModalOpen) return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (step === 1) {
      if (!username.trim()) {
        setErrorMsg('กรุณากรอกชื่อผู้ใช้งาน (Username)');
        return;
      }
      if (!password) {
        setErrorMsg('กรุณากรอกรหัสผ่าน (Password)');
        return;
      }

      // ไป Step 2: One-time code (OTP)
      setStep(2);
      return;
    }

    if (!otp.trim()) {
      setErrorMsg('กรุณากรอกรหัส One-time code (OTP)');
      return;
    }

    // Step 2: ตรวจสอบและล็อกอินผ่าน Backend
    const result = await loginWithCredentials(username, password, otp);
    if (!result.success) {
      setErrorMsg(result.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      setStep(1);
    } else {
      // ล็อกอินสำเร็จ นำทางไปยัง returnUrl หรือ /overview ทันที
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const rawReturnUrl = params?.get('returnUrl');
      const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');
      const defaultUrl = `${basePath}/overview`;
      const targetUrl =
        rawReturnUrl && rawReturnUrl.startsWith('/') && !rawReturnUrl.startsWith('//')
          ? (rawReturnUrl.startsWith(basePath) ? rawReturnUrl : `${basePath}${rawReturnUrl}`)
          : defaultUrl;
      window.location.href = targetUrl;
    }
  };

  const handleRestart = () => {
    setStep(1);
    setErrorMsg('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: '#121518',
        backgroundImage: `url('${bgUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        boxSizing: 'border-box',
        margin: 0,
      }}
    >
      {/* Dark overlay เพื่อให้อ่านง่ายและชัดเจน */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          pointerEvents: 'none',
        }}
      />

      {/* กล่อง Login สีขาว ตรงกลางจอ */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '390px',
          padding: '36px 32px 32px 32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          zIndex: 10,
          boxSizing: 'border-box',
        }}
      >
        {/* ปุ่มปิด (กรณีเปิดเป็น Popup Modal บนหน้าเว็บ) */}
        {!forceOpen && closeLoginModal && (
          <button
            onClick={closeLoginModal}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              fontSize: '16px',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaTimes />
          </button>
        )}

        {/* หัวข้อ Login เรียบหรู */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#e6f4f1',
              color: '#00675a',
              fontSize: '22px',
              marginBottom: '12px',
            }}
          >
            <FaLock />
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#00675a',
              letterSpacing: '-0.5px',
              lineHeight: '1.2',
            }}
          >
            Login
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
            เข้าสู่ระบบบริหารจัดการข้อมูล
          </div>
        </div>

        {/* กล่องแสดง Error */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px',
              textAlign: 'center',
              fontWeight: 500,
              lineHeight: '1.4',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Step 1: Username & Password */}
        {step === 1 ? (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ fontSize: '12.5px', color: '#00675a', fontWeight: 600, marginBottom: '6px', textAlign: 'left' }}>
              Step 1/2: ชื่อผู้ใช้งาน (Username)
            </div>

            <div style={{ marginBottom: '14px' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="กรอกชื่อผู้ใช้งาน"
                autoFocus
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0 14px',
                  fontSize: '14.5px',
                  color: '#1a202c',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border 0.2s',
                }}
                onFocus={(e) => (e.target.style.border = '1.5px solid #00675a')}
                onBlur={(e) => (e.target.style.border = '1px solid #cbd5e1')}
              />
            </div>

            <div style={{ fontSize: '12.5px', color: '#00675a', fontWeight: 600, marginBottom: '6px', textAlign: 'left' }}>
              รหัสผ่าน (Password)
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน"
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0 14px',
                  fontSize: '14.5px',
                  color: '#1a202c',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border 0.2s',
                }}
                onFocus={(e) => (e.target.style.border = '1.5px solid #00675a')}
                onBlur={(e) => (e.target.style.border = '1px solid #cbd5e1')}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: '#00675a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 103, 90, 0.3)',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#004f44')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00675a')}
            >
              Sign In
            </button>
          </form>
        ) : (
          /* Step 2: One-time code (OTP) */
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '14.5px', color: '#1a202c', fontWeight: 700, textAlign: 'left' }}>
                {username}
              </div>
              <button
                type="button"
                onClick={handleRestart}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaRedo style={{ fontSize: '10px' }} /> เปลี่ยนบัญชี
              </button>
            </div>

            <div style={{ fontSize: '12.5px', color: '#00675a', fontWeight: 600, marginBottom: '6px', textAlign: 'left' }}>
              Step 2/2: One-time code (OTP)
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="กรอกรหัส 6 หลัก"
                autoFocus
                maxLength={6}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0 14px',
                  fontSize: '18px',
                  letterSpacing: '4px',
                  textAlign: 'center',
                  color: '#1a202c',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border 0.2s',
                }}
                onFocus={(e) => (e.target.style.border = '1.5px solid #00675a')}
                onBlur={(e) => (e.target.style.border = '1px solid #cbd5e1')}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: '#00675a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 103, 90, 0.3)',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#004f44')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00675a')}
            >
              Confirm & Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

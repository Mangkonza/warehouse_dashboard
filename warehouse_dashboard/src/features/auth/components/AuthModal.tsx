'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaRedo, FaTimes } from 'react-icons/fa';

export interface AuthModalProps {
  forceOpen?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ forceOpen = false }) => {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');
  const bgUrl = `${basePath}/bg9.jpg`;


  const { user, isLoginModalOpen, closeLoginModal, loginWithCredentials, isLoading } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const isOpen = forceOpen || isLoginModalOpen;

  React.useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyMargin = document.body.style.margin;
    const originalBodyPadding = document.body.style.padding;
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlGutter = document.documentElement.style.scrollbarGutter;

    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0px';
    document.body.style.padding = '0px';
    if (forceOpen) {
      document.body.style.backgroundColor = '#121518';
    }
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
  }, [isOpen, forceOpen]);

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
        setErrorMsg('กรุณากรอกชื่อผู้ใช้เครือข่ายนนทรี');
        return;
      }
      if (!password) {
        setErrorMsg('กรุณากรอกรหัสผ่าน');
        return;
      }

      // ไป Step 2: One-time code (ตรงตาม Screenshot 2 ของ มก.)
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
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        boxSizing: 'border-box',
        margin: 0,
      }}
    >
      {/* Dark overlay บางๆ เพื่อความคมชัด */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          pointerEvents: 'none',
        }}
      />

      {/* กล่อง Login สีขาว ตรงกลางจอ (สไตล์เดิมของระบบ) */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '390px',
          padding: '36px 36px 32px 36px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
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

        {/* หัวข้อ Login (ตัวอักษรสีเขียว สไตล์เดิม) */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              fontSize: '34px',
              fontWeight: 800,
              color: '#00675a',
              letterSpacing: '-0.4px',
              marginTop: '6px',
              fontFamily: 'inherit',
            }}
          >
            Login
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              marginBottom: '14px',
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Step 1: Username & Password */}
        {step === 1 ? (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ fontSize: '12.5px', color: '#00675a', fontWeight: 600, marginBottom: '8px', textAlign: 'left' }}>
              Step 1/2: username
            </div>

            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=""
                autoFocus
                style={{
                  width: '100%',
                  height: '42px',
                  backgroundColor: '#e8f0fe',
                  border: '1px solid #d4e3fc',
                  borderRadius: '6px',
                  padding: '0 12px',
                  fontSize: '14.5px',
                  color: '#1a202c',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                style={{
                  width: '100%',
                  height: '42px',
                  backgroundColor: '#e8f0fe',
                  border: '1px solid #d4e3fc',
                  borderRadius: '6px',
                  padding: '0 12px',
                  fontSize: '14.5px',
                  color: '#1a202c',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ textAlign: 'left' }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: '#00675a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 26px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s ease',
                  boxShadow: '0 2px 6px rgba(0, 103, 90, 0.25)',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#004f44')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00675a')}
              >
                Sign In
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: One-time code (OTP) สไตล์เดิม */
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ fontSize: '14.5px', color: '#1a202c', fontWeight: 700, marginBottom: '6px', textAlign: 'left' }}>
              {username}
            </div>

            <div style={{ textAlign: 'left', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={handleRestart}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '11.5px',
                  color: '#334155',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <FaRedo style={{ fontSize: '9px' }} /> Restart login
              </button>
            </div>

            <div style={{ fontSize: '12.5px', color: '#00675a', fontWeight: 600, marginBottom: '8px', textAlign: 'left' }}>
              Step 2/2: One-time code
            </div>

            <div style={{ marginBottom: '18px' }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder=""
                autoFocus
                maxLength={6}
                style={{
                  width: '100%',
                  height: '42px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0 12px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1a202c',
                  outline: 'none',
                  boxSizing: 'border-box',
                  letterSpacing: '2px',
                }}
              />
            </div>

            <div style={{ textAlign: 'left' }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: '#00675a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 26px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s ease',
                  boxShadow: '0 2px 6px rgba(0, 103, 90, 0.25)',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#004f44')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00675a')}
              >
                {isLoading ? 'Verifying...' : 'Sign In'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

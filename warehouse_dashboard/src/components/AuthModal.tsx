'use client';

import React, { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { FaRedo } from 'react-icons/fa';

export const AuthModal: React.FC = () => {
  const { user, isLoginModalOpen, loginWithCredentials, isLoading } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // ต้องล็อกอินก่อนเท่านั้น: ถ้ายังไม่มี user หรือสถานะเปิด modal อยู่ ให้แสดงเสมอ
  if (isLoading) return null;
  if (user && !isLoginModalOpen) return null;

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

    // Step 2: ตรวจสอบและล็อกอิน
    const result = await loginWithCredentials(username, password);
    if (!result.success) {
      setErrorMsg(result.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      setStep(1);
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
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundImage: "url('/bg9.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay บางๆ เพื่อความคมชัด */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          pointerEvents: 'none',
        }}
      />

      {/* กล่อง Login สีขาว ตรงกลางจอ (ตรงตาม Screenshot 1 และ Screenshot 2) */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '385px',
          padding: '36px 36px 32px 36px',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.28)',
          zIndex: 10,
          boxSizing: 'border-box',
        }}
      >
        {/* โลโก้ KU 80 ฉลองครบรอบ 80 ปี มก. */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src="/KU-english-80-1024x1024.png"
            alt="Kasetsart University 80th Anniversary"
            style={{
              height: '92px',
              width: 'auto',
              display: 'block',
              margin: '0 auto',
              objectFit: 'contain',
            }}
          />

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
            ALL-Login
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              marginBottom: '14px',
              textAlign: 'center',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Step 1: Username & Password (ตรงตาม Screenshot 1) */}
        {step === 1 ? (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ fontSize: '12.5px', color: '#00675a', fontWeight: 500, marginBottom: '8px', textAlign: 'left' }}>
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
                  borderRadius: '4px',
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
                  borderRadius: '4px',
                  padding: '0 12px',
                  fontSize: '14.5px',
                  color: '#1a202c',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '22px' }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: '#00675a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '7px 24px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#004f44')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00675a')}
              >
                Sign In
              </button>
            </div>

            {/* ลิงก์ช่วยเหลือ (ตรงตาม Screenshot 1) */}
            <div style={{ fontSize: '11px', lineHeight: '1.7', color: '#4b5563', textAlign: 'left' }}>
              <div><a href="https://accounts.ku.ac.th" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Forgotten Password</a></div>
              <div><a href="https://accounts.ku.ac.th" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Personal information verification</a></div>
              <div><a href="https://accounts.ku.ac.th" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>ยกเลิก MFA ชั่วคราว</a></div>
              <div>กรณีไม่สามารถดำเนินการได้สามารถติดต่อแก้ไขปัญหาได้ที่ <a href="https://ocs.ku.ac.th" target="_blank" rel="noreferrer" style={{ color: '#00675a', fontWeight: 600 }}>Helpdesk</a></div>
            </div>
          </form>
        ) : (
          /* Step 2: One-time code (ตรงตาม Screenshot 2) */
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ fontSize: '14.5px', color: '#1a202c', fontWeight: 600, marginBottom: '6px', textAlign: 'left' }}>
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

            <div style={{ fontSize: '12.5px', color: '#00675a', fontWeight: 500, marginBottom: '8px', textAlign: 'left' }}>
              Step 2/2: One-time code
            </div>

            <div style={{ marginBottom: '18px' }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder=""
                autoFocus
                style={{
                  width: '100%',
                  height: '42px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '0 12px',
                  fontSize: '15px',
                  color: '#1a202c',
                  outline: 'none',
                  boxSizing: 'border-box',
                  letterSpacing: '1px',
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
                  borderRadius: '4px',
                  padding: '7px 24px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#004f44')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00675a')}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ข้อความลิขสิทธิ์ด้านล่าง (ตรงตาม Screenshot 1 และ Screenshot 2) */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#ffffff',
          textShadow: '0 1px 3px rgba(0,0,0,0.85)',
          padding: '0 16px',
          fontWeight: 500,
          pointerEvents: 'none',
        }}
      >
        ©2023-2025 สำนักบริการคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์ | Office of Computer Services,{' '}
        <span style={{ color: '#4ade80', fontWeight: 700 }}>Kasetsart University</span>
      </div>
    </div>
  );
};

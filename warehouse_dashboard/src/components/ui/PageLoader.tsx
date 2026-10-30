'use client';

import React, { useState, useEffect } from 'react';
import { Spinner } from './Spinner';

interface PageLoaderProps {
  message?: string;
  isFadingOut?: boolean;
}

export function PageLoader({
  message = 'กำลังโหลด...',
  isFadingOut = false,
}: PageLoaderProps) {
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true);
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      role="status"
      aria-busy="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#121518',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.3s ease-out',
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Spinner size="lg" label={message} />

        <div
          style={{
            fontSize: '14.5px',
            fontWeight: 500,
            color: '#94a3b8',
            letterSpacing: '0.3px',
          }}
        >
          {message}
        </div>

        {/* หากโหลดเกิน 10 วินาที แสดงคำแนะนำและปุ่มรีโหลด */}
        {isTimedOut && (
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              animation: 'fadeIn 0.4s ease-in',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                color: '#f87171',
                margin: 0,
                textAlign: 'center',
              }}
            >
              การเชื่อมต่อใช้เวลานานกว่าปกติ กรุณาลองใหม่อีกครั้ง
            </p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
              style={{
                padding: '8px 18px',
                backgroundColor: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

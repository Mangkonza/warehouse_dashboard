'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useSsoUserSafe } from '@/features/auth';
import { AuthModal } from '@/features/auth/components/AuthModal';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: isAuthLoading } = useAuth();
  const sso = useSsoUserSafe();
  const ssoUser = sso?.user;
  const isSsoLoading = sso?.status === 'loading';

  const rawReturnUrl = searchParams.get('returnUrl');
  // ป้องกัน open redirect: ตรวจสอบว่า returnUrl ต้องขึ้นต้นด้วย / และไม่ใช่ //
  const returnUrl =
    rawReturnUrl && rawReturnUrl !== '/' && rawReturnUrl.startsWith('/') && !rawReturnUrl.startsWith('//')
      ? rawReturnUrl
      : '/overview';

  const isAuthenticated = Boolean(user || ssoUser);

  useEffect(() => {
    if (!isAuthLoading && !isSsoLoading && isAuthenticated) {
      window.location.replace(returnUrl);
    }
  }, [isAuthenticated, isAuthLoading, isSsoLoading, returnUrl]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        backgroundColor: '#121518',
        backgroundImage: "url('/bg9.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
        }}
      />
      <AuthModal forceOpen />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#121518' }} />}>
      <LoginContent />
    </Suspense>
  );
}

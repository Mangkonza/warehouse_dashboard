'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { AuthModal } from '@/features/auth/components/AuthModal';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, openLoginModal } = useAuth();

  const rawReturnUrl = searchParams.get('returnUrl');
  // ป้องกัน open redirect: ตรวจสอบว่า returnUrl ต้องขึ้นต้นด้วย / และไม่ใช่ //
  const returnUrl = rawReturnUrl && rawReturnUrl.startsWith('/') && !rawReturnUrl.startsWith('//')
    ? rawReturnUrl
    : '/overview';

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(returnUrl);
    } else if (!isLoading && !user) {
      openLoginModal();
    }
  }, [user, isLoading, router, returnUrl, openLoginModal]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#121518',
        backgroundImage: "url('/bg9.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
        }}
      />
      <AuthModal />
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

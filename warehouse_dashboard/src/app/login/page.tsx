'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { AuthModal } from '@/features/auth/components/AuthModal';

function LoginContent() {
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();

  const rawReturnUrl = searchParams.get('returnUrl');
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');
  const defaultUrl = `${basePath}/overview`;
  const returnUrl =
    rawReturnUrl && rawReturnUrl.startsWith('/') && !rawReturnUrl.startsWith('//')
      ? (rawReturnUrl.startsWith(basePath) ? rawReturnUrl : `${basePath}${rawReturnUrl}`)
      : defaultUrl;

  React.useEffect(() => {
    if (!isLoading && user) {
      window.location.replace(returnUrl);
    }
  }, [user, isLoading, returnUrl]);

  return <AuthModal forceOpen />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100%', backgroundColor: '#121518' }} />}>
      <LoginContent />
    </Suspense>
  );
}

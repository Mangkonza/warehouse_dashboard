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
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');
  const defaultUrl = `${basePath}/overview`;
  const returnUrl =
    rawReturnUrl && rawReturnUrl.startsWith('/') && !rawReturnUrl.startsWith('//')
      ? (rawReturnUrl.startsWith(basePath) ? rawReturnUrl : `${basePath}${rawReturnUrl}`)
      : defaultUrl;

  const isAuthenticated = Boolean(user || ssoUser);

  React.useEffect(() => {
    if (!isAuthLoading && !isSsoLoading && isAuthenticated) {
      window.location.replace(returnUrl);
    }
  }, [isAuthenticated, isAuthLoading, isSsoLoading, returnUrl]);

  return <AuthModal forceOpen />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100%', backgroundColor: '#121518' }} />}>
      <LoginContent />
    </Suspense>
  );
}

'use client';

import React from 'react';
import { AuthProvider, AuthModal } from '@/features/auth';
import { TimeFilterProvider } from '@/features/time-filter';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TimeFilterProvider>
        {children}
        <AuthModal />
      </TimeFilterProvider>
    </AuthProvider>
  );
}

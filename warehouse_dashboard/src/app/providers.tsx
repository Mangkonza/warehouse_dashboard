'use client';

import React from 'react';
import { AuthProvider, AuthModal, SsoUserProvider } from '@/features/auth';
import { TimeFilterProvider } from '@/features/time-filter';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SsoUserProvider>
      <AuthProvider>
        <TimeFilterProvider>
          <TooltipProvider>
            {children}
            <AuthModal />
          </TooltipProvider>
        </TimeFilterProvider>
      </AuthProvider>
    </SsoUserProvider>
  );
}

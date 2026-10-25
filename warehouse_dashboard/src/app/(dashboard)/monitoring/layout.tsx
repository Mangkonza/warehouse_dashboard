import React from 'react';
import { enforceServerRole } from '@/lib/serverAuth';

export default async function MonitoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforceServerRole('monitoring');
  return <>{children}</>;
}

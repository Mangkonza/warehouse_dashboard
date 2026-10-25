import React from 'react';
import { enforceServerRole } from '@/lib/serverAuth';

export default async function KpiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforceServerRole('kpi');
  return <>{children}</>;
}

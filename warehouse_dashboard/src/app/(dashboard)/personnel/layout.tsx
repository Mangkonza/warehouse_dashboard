import React from 'react';
import { enforceServerRole } from '@/lib/serverAuth';

export default async function PersonnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforceServerRole('personnel');
  return <>{children}</>;
}

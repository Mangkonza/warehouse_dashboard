import React from 'react';
import { enforceServerRole } from '@/lib/serverAuth';

export default async function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforceServerRole('manage');
  return <>{children}</>;
}

import React from 'react';
import { enforceServerRole } from '@/lib/serverAuth';

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforceServerRole('studio');
  return <>{children}</>;
}

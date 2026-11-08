import React from 'react';
import { enforceServerRole } from '@/lib/serverAuth';

export default async function UserRolesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforceServerRole('user_roles');
  return <>{children}</>;
}

import React from 'react';
import { enforceServerRole } from '@/lib/serverAuth';

export default async function EvaluationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforceServerRole('evaluation');
  return <>{children}</>;
}

'use client';

import { useSsoUser } from '@/features/auth';

export default function UserPage() {
  const { user, status, logout } = useSsoUser();

  if (status === 'loading') {
    return <main style={{ padding: '2rem' }}>Loading user session...</main>;
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>User Dashboard</h1>
      <p>Name: {user?.name || user?.nontriId || 'Unknown'}</p>
      <p>Email: {user?.email || 'None'}</p>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </main>
  );
}

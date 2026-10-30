import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>403 - Forbidden</h1>
      <p>You do not have permission to access this area.</p>
      <p>
        <Link href="/overview">Back to Overview</Link>
      </p>
    </main>
  );
}

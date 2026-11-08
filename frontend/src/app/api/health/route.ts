import { jsonNoStore } from '@/lib/auth/httpResponse';

export const dynamic = 'force-dynamic';

export async function GET() {
  return jsonNoStore({ status: 'ok' }, { status: 200 });
}

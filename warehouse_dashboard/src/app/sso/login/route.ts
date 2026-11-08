import { getLoginUrl } from '@/lib/auth/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const loginUrl = getLoginUrl();
    return Response.redirect(loginUrl, 307);
  } catch (err: any) {
    console.error('[SSO Login] Error:', err);
    const fallbackUrl = process.env.ENG_LOGIN_URL || 'https://office.eng.kps.ku.ac.th/eng-main/home';
    return Response.redirect(fallbackUrl, 307);
  }
}

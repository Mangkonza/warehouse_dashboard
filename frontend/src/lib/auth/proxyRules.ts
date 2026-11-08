/**
 * Pure decision rules for Proxy (Next.js 16).
 * Handles SSO route redirection for /admin/* and /user/*:
 *  - exchangeToken + intranetToken in query -> redirect to /api/auth/portal-session with clean `next`
 *  - missing USER_SESSION cookie -> redirect to /sso/login
 *  - USER_SESSION present -> allow (server layout guards enforce cryptographic verification & roles)
 */
import { APP_ROUTES, stripBasePath, withBasePath } from './paths';
import { sanitizeNextPath, stripTokenParams } from './safeRedirect';

export interface SsoRuleInput {
  pathname: string;
  searchParams: URLSearchParams;
  hasUserSession: boolean;
}

export type SsoRuleResult =
  | { action: 'redirect_portal_session'; destination: string; next: string }
  | { action: 'redirect_sso_login'; destination: string }
  | { action: 'allow' }
  | { action: 'pass_to_legacy' };

/**
 * Checks whether an app-relative path is within SSO protection (/admin or /user).
 */
export function isSsoPath(pathname: string): boolean {
  const p = stripBasePath(pathname);
  return p === '/admin' || p.startsWith('/admin/') || p === '/user' || p.startsWith('/user/');
}

/**
 * Evaluates proxy rules for an incoming request.
 */
export function evaluateSsoRules(input: SsoRuleInput): SsoRuleResult {
  const appPath = stripBasePath(input.pathname);

  if (!isSsoPath(appPath)) {
    return { action: 'pass_to_legacy' };
  }

  const exchangeToken = input.searchParams.get('exchangeToken')?.trim();
  const intranetToken = input.searchParams.get('intranetToken')?.trim();

  // 1. Portal returned user with tokens -> redirect to portal-session with clean `next`
  if (exchangeToken && intranetToken) {
    const cleanParams = stripTokenParams(input.searchParams);
    const queryString = cleanParams.toString();
    const cleanNextPath = queryString ? `${appPath}?${queryString}` : appPath;
    const safeNext = sanitizeNextPath(cleanNextPath, appPath);

    const forwardParams = new URLSearchParams();
    forwardParams.set('exchangeToken', exchangeToken);
    forwardParams.set('intranetToken', intranetToken);
    forwardParams.set('next', safeNext);

    const destination = `${withBasePath(APP_ROUTES.portalSession)}?${forwardParams.toString()}`;
    return {
      action: 'redirect_portal_session',
      destination,
      next: safeNext,
    };
  }

  // 2. Cookie presence check (NOT a security boundary, layout guard verifies signature)
  if (!input.hasUserSession) {
    return {
      action: 'redirect_sso_login',
      destination: withBasePath(APP_ROUTES.ssoLogin),
    };
  }

  return { action: 'allow' };
}

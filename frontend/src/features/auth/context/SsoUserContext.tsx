'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { SessionUser } from '@/lib/auth/profile';
import { APP_ROUTES, withBasePath } from '@/lib/auth/paths';

export const AUTH_QUERY_PARAMS = ['exchangeToken', 'intranetToken', 'accessToken'] as const;

/**
 * Pure function removing sensitive auth tokens from a URL string, preserving all other parameters.
 */
export function stripAuthParams(urlStr: string): string {
  if (!urlStr) return urlStr;

  const dummyBase = 'http://localhost';
  const isRelative = !/^https?:\/\//i.test(urlStr);
  let parsed: URL;
  try {
    parsed = new URL(urlStr, dummyBase);
  } catch {
    return urlStr;
  }

  let modified = false;
  for (const param of AUTH_QUERY_PARAMS) {
    if (parsed.searchParams.has(param)) {
      parsed.searchParams.delete(param);
      modified = true;
    }
  }

  if (!modified) {
    return urlStr;
  }

  if (isRelative) {
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  }
  return parsed.toString();
}

export type SsoAuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface SsoUserContextValue {
  user: SessionUser | null;
  status: SsoAuthStatus;
  refresh: () => Promise<void>;
  logout: () => void;
}

const SsoUserContext = createContext<SsoUserContextValue | undefined>(undefined);

export function SsoUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<SsoAuthStatus>('loading');

  const refresh = useCallback(async () => {
    try {
      const sessionUrl = withBasePath(APP_ROUTES.session);
      const res = await fetch(sessionUrl, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.authenticated && data?.user) {
          setUser(data.user);
          setStatus('authenticated');
          return;
        }
      }

      setUser(null);
      setStatus('unauthenticated');
    } catch {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  const logout = useCallback(() => {
    const logoutUrl = withBasePath(APP_ROUTES.ssoLogout);
    window.location.href = logoutUrl;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const cleanUrl = stripAuthParams(window.location.href);
      if (cleanUrl !== window.location.href) {
        window.history.replaceState(window.history.state, '', cleanUrl);
      }
    }
    refresh();
  }, [refresh]);

  return (
    <SsoUserContext.Provider value={{ user, status, refresh, logout }}>
      {children}
    </SsoUserContext.Provider>
  );
}

export function useSsoUser(): SsoUserContextValue {
  const context = useContext(SsoUserContext);
  if (!context) {
    throw new Error('useSsoUser must be used within an SsoUserProvider');
  }
  return context;
}

export function useSsoUserSafe(): SsoUserContextValue | null {
  return useContext(SsoUserContext) || null;
}

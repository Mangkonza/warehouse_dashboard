/**
 * Authentication Configuration
 * Authentication & authorization are validated server-side via session cookies.
 */

export const SESSION_STORAGE_KEYS = {
  token: 'ku_token',
  user: 'ku_user',
} as const;

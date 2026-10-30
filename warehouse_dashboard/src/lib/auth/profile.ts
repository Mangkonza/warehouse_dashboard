/**
 * Maps the central `me` response into our minimal session user.
 * Field precedence per ALL_LOGIN_DOC/README.md §7.
 */

export interface SessionUser {
  nontriId: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string | null;
  faculty: string | null;
}

const MAX_FIELD_LENGTH = 256;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pick(obj: Record<string, unknown>, keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) return trimmed.slice(0, MAX_FIELD_LENGTH);
    }
  }
  return null;
}

/** Returns `profile` or `user` object from the `me` body, or null if neither is an object. */
export function extractCentralUser(body: unknown): Record<string, unknown> | null {
  if (!isPlainObject(body)) return null;
  if (isPlainObject(body.profile)) return body.profile;
  if (isPlainObject(body.user)) return body.user;
  return null;
}

export function buildSessionUser(raw: Record<string, unknown>, nontriId: string): SessionUser {
  const firstName = pick(raw, ['first-name', 'givenname']);
  const lastName = pick(raw, ['last-name', 'surname']);
  const combined = [firstName, lastName].filter(Boolean).join(' ').trim();
  return {
    nontriId,
    firstName,
    lastName,
    name: pick(raw, ['thainame']) ?? (combined || null),
    email: pick(raw, ['google-mail', 'office365-mail', 'userprincipalname']),
    faculty: pick(raw, ['faculty']),
  };
}

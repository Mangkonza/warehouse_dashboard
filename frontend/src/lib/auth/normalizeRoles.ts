/**
 * Normalizes the `get-role` response into a de-duplicated string[] of role names.
 *
 * Accepted shapes (per ALL_LOGIN_DOC/README.md §5):
 *  - string[]                                   → ["admin", "user"]
 *  - object[] with role|roleName|name|role_name|roleCode
 *  - outer object: first present key of roles → data → role
 *    (value may be array, string, or a nested object of the same outer shape)
 *  - a bare string at the root is NOT a role
 * Case and surrounding characters are preserved exactly (no trim, no lowercasing),
 * so authorization compares role names byte-for-byte. Empty strings are dropped.
 */

const ITEM_ROLE_KEYS = ['role', 'roleName', 'name', 'role_name', 'roleCode'] as const;
const OUTER_KEYS = ['roles', 'data', 'role'] as const;
const MAX_DEPTH = 4;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function roleFromItem(item: unknown): string | null {
  if (typeof item === 'string') return item.length > 0 ? item : null;
  if (isPlainObject(item)) {
    for (const key of ITEM_ROLE_KEYS) {
      const value = item[key];
      if (typeof value === 'string' && value.length > 0) return value;
    }
  }
  return null;
}

function fromArray(items: unknown[]): string[] {
  const out: string[] = [];
  for (const item of items) {
    const role = roleFromItem(item);
    if (role !== null) out.push(role);
  }
  return out;
}

function fromOuterObject(obj: Record<string, unknown>, depth: number): string[] {
  for (const key of OUTER_KEYS) {
    const value = obj[key];
    if (value === undefined || value === null) continue;
    if (typeof value === 'string') return value.length > 0 ? [value] : [];
    if (Array.isArray(value)) return fromArray(value);
    if (isPlainObject(value)) {
      if (depth >= MAX_DEPTH) return [];
      // A nested object may itself be a single role item ({ roleName: "admin" }) or another outer wrapper.
      const nested = fromOuterObject(value, depth + 1);
      if (nested.length > 0) return nested;
      const single = roleFromItem(value);
      return single !== null ? [single] : [];
    }
    return [];
  }
  return [];
}

export function normalizeRoles(input: unknown): string[] {
  let roles: string[];
  if (Array.isArray(input)) roles = fromArray(input);
  else if (isPlainObject(input)) roles = fromOuterObject(input, 0);
  else roles = []; // bare string / number / null at root → no roles
  return Array.from(new Set(roles));
}

/** Exact, case-sensitive membership check. */
export function hasRole(roles: readonly string[], role: string): boolean {
  return roles.includes(role);
}

export const ROLE_ADMIN = 'admin';
export const ROLE_USER = 'user';

export type ProtectedArea = 'admin' | 'user';

/** /admin → exact "admin"; /user → "user" or "admin"; empty roles → denied. */
export function canAccess(area: ProtectedArea, roles: readonly string[]): boolean {
  if (roles.length === 0) return false;
  if (area === 'admin') return hasRole(roles, ROLE_ADMIN);
  return hasRole(roles, ROLE_USER) || hasRole(roles, ROLE_ADMIN);
}

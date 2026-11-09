import crypto from 'crypto';

/**
 * Hashes a plain-text password using PBKDF2 (SHA-512) with a random salt.
 * Output format: pbkdf2$<salt>$<hex_hash>
 */
export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(plain, salt, 10000, 64, 'sha512').toString('hex');
  return `pbkdf2$${salt}$${hash}`;
}

/**
 * Verifies a plain-text password against a stored password.
 * Supports:
 * 1. pbkdf2$<salt>$<hash> (Standard secure hash)
 * 2. SHA-256 (64 hex characters)
 * 3. Plaintext fallback (for backward compatibility)
 */
export function verifyPassword(plain: string, stored: string): boolean {
  if (!stored || !plain) return false;

  // 1. Direct plaintext match (fallback)
  if (stored === plain) return true;

  // 2. PBKDF2 hash
  if (stored.startsWith('pbkdf2$')) {
    const parts = stored.split('$');
    if (parts.length === 3) {
      const [, salt, hash] = parts;
      try {
        const computed = crypto.pbkdf2Sync(plain, salt, 10000, 64, 'sha512').toString('hex');
        const hashBuf = Buffer.from(hash, 'hex');
        const compBuf = Buffer.from(computed, 'hex');
        if (hashBuf.length === compBuf.length) {
          return crypto.timingSafeEqual(hashBuf, compBuf);
        }
      } catch (err) {
        console.error('[verifyPassword] Error computing hash:', err);
      }
    }
    return false;
  }

  // 3. SHA-256 hash match
  try {
    const sha256 = crypto.createHash('sha256').update(plain).digest('hex');
    if (stored.toLowerCase() === sha256.toLowerCase()) return true;
  } catch {}

  return false;
}

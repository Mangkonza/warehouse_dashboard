import { Request, Response, NextFunction } from 'express';

interface AttemptRecord {
  count: number;
  resetAt: number;
}

const loginAttempts = new Map<string, AttemptRecord>();
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

// Clean up expired keys periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of loginAttempts.entries()) {
    if (now > record.resetAt) {
      loginAttempts.delete(key);
    }
  }
}, 60 * 1000).unref();

export function loginRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const username = String(req.body?.username || '').trim().toLowerCase() || 'unknown';
  const key = `${ip}:${username}`;
  const now = Date.now();

  const record = loginAttempts.get(key);

  if (record) {
    if (now > record.resetAt) {
      loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
      next();
      return;
    }

    if (record.count >= MAX_ATTEMPTS) {
      const waitSeconds = Math.ceil((record.resetAt - now) / 1000);
      res.status(429).json({
        status: 'error',
        message: 'คุณพยายามเข้าสู่ระบบเกินกำหนด กรุณารอ 5 นาที',
        retryAfterSeconds: waitSeconds,
      });
      return;
    }

    record.count += 1;
  } else {
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  }

  next();
}

export function resetLoginAttempts(req: Request): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const username = String(req.body?.username || '').trim().toLowerCase() || 'unknown';
  const key = `${ip}:${username}`;
  loginAttempts.delete(key);
}

import { Request, Response, NextFunction } from 'express';

export function cookieParser(req: Request, _res: Response, next: NextFunction) {
  const list: Record<string, string> = {};
  const cookieHeader = req.headers.cookie;

  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      const name = parts.shift()?.trim();
      if (name) {
        list[name] = decodeURIComponent(parts.join('=').trim());
      }
    });
  }

  (req as any).cookies = list;
  next();
}

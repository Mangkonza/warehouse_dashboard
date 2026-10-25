import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { JWTPayload, AuthUser } from '../types/index.js';
import { prisma } from '../db/prisma.js';
import { AppRole, AppResource, canAccess, ROLE_HIERARCHY } from '../config/permissions.js';
import { verifySession, SESSION_COOKIE_NAME } from '../utils/sessionCookie.js';

/**
 * requireSession: ตรวจสอบ Session Cookie (ku_session)
 * หากไม่มีหรือหมดอายุ ตอบกลับ HTTP 401
 */
export async function requireSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  const cookies = (req as any).cookies || {};
  const sessionCookie = cookies[SESSION_COOKIE_NAME];

  let username: string | null = null;

  // 1. ตรวจสอบ ku_session Cookie
  if (sessionCookie) {
    const session = verifySession(sessionCookie);
    if (session) {
      username = session.username;
    }
  }

  // 2. Fallback: ตรวจสอบ Authorization: Bearer JWT (หากมี legacy client)
  if (!username) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
        if (decoded && decoded.nontriAccount) {
          username = decoded.nontriAccount.toLowerCase().trim();
        }
      } catch {
        // Token invalid
      }
    }
  }

  // หากไม่มี session หรือ token ที่ถูกต้อง
  if (!username) {
    res.status(401).json({
      status: 'error',
      message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
    });
    return;
  }

  // 3. ดึงบทบาทล่าสุดสด ๆ จากฐานข้อมูล user_roles
  try {
    const userRoleRecord = await prisma.userRole.findUnique({
      where: { username },
    });
    const role: AppRole = (userRoleRecord?.role as AppRole) || 'user';

    req.user = {
      id: `ku-${username}`,
      nontriAccount: username,
      role,
      nameTh: userRoleRecord?.displayName || username,
    };

    next();
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์กับฐานข้อมูล',
    });
  }
}

/**
 * requireRole: ตรวจสอบสิทธิ์การเข้าถึงทรัพยากร (RBAC)
 * ส่งได้ทั้ง AppResource (เช่น 'overview', 'kpi', 'manage') หรือ AppRole
 */
export function requireRole(resourceOrRole: AppResource | AppRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
      });
      return;
    }

    const userRole = req.user.role || 'user';

    // กรณีส่งเป็น Resource name
    let hasPermission = false;
    if (resourceOrRole in ROLE_HIERARCHY) {
      hasPermission = ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[resourceOrRole as AppRole];
    } else {
      hasPermission = canAccess(userRole, resourceOrRole as AppResource);
    }

    if (!hasPermission) {
      res.status(403).json({
        status: 'error',
        message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลในส่วนนี้',
      });
      return;
    }

    next();
  };
}

// Backwards-compatibility aliases
export const authenticateJWT = requireSession;
export const requireAdmin = requireRole('manage');

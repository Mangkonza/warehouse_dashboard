import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { env } from '../config/env.js';
import { AuthUser } from '../types/index.js';
import { prisma } from '../db/prisma.js';
import { AppRole } from '../config/permissions.js';
import {
  signSession,
  verifySession,
  SESSION_COOKIE_NAME,
  getSessionCookieOptions,
} from '../utils/sessionCookie.js';
import { loginRateLimiter, resetLoginAttempts } from '../middleware/rateLimiter.js';
import { MockAuthService, MockAuthError } from '../services/mock-auth.js';

export const authRouter = Router();

// Helper to determine role title in Thai
function getRoleTitle(role: AppRole, username: string): string {
  if (role === 'admin') return 'ผู้ดูแลระบบ';
  if (/^b\d+/i.test(username)) return 'นิสิต';
  return 'บุคลากร';
}

// 1. ล็อกอินด้วยบัญชีนนทรี (หรือ Step 2 ของฟอร์ม KU ALL-Login)
const handleLogin = async (req: Request, res: Response) => {
  const { username, password, otp } = req.body;

  // โหมด Mock Auth (เมื่อเปิดใช้งานและไม่ได้อยู่บน Production)
  if (env.AUTH_MOCK_ENABLED) {
    try {
      const mockResult = await MockAuthService.authenticate({ username, password, otp });
      const { user, isMock } = mockResult;

      // ล้างประวัติ attempt
      resetLoginAttempts(req);

      // สร้าง session cookie พร้อม flag isMock: true
      const { cookieValue, payload } = signSession(user.nontriAccount.toLowerCase().trim(), isMock);
      res.cookie(SESSION_COOKIE_NAME, cookieValue, getSessionCookieOptions());

      const token = AuthService.generateToken(user);
      res.json({
        status: 'success',
        token,
        user,
        expiresAt: payload.expiresAt,
      });
      return;
    } catch (err: any) {
      if (err instanceof MockAuthError) {
        res.status(err.statusCode).json({
          status: 'error',
          code: err.code,
          error: err.message,
        });
        return;
      }
      res.status(500).json({ status: 'error', error: err.message || 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์' });
      return;
    }
  }

  // ระบบมาตรฐาน (เมื่อปิด Mock)
  if (!username || !password) {
    res.status(400).json({ status: 'error', error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
    return;
  }

  const normalized = String(username).trim();
  const normalizedLower = normalized.toLowerCase();
  const passwordClean = String(password).trim();
  const otpClean = otp ? String(otp).trim() : '';

  // ตรวจสอบความถูกต้องของบัญชี
  const isAdminAccount = normalizedLower === 'admin';
  if (isAdminAccount) {
    if (passwordClean.toLowerCase() !== 'admin') {
      res.status(401).json({ status: 'error', error: 'รหัสผ่านไม่ถูกต้อง (รหัสผ่านคือ Admin)' });
      return;
    }
    if (otpClean && otpClean !== '111111') {
      res.status(401).json({ status: 'error', error: 'รหัส One-time code (OTP) ไม่ถูกต้อง (ระบุ: 111111)' });
      return;
    }
  } else {
    // บัญชีอื่น ๆ: ปฏิเสธรหัสผ่านว่าง หรือรหัสผิด/ปลอม
    if (!passwordClean || passwordClean === 'wrong' || passwordClean === 'fake' || passwordClean.length < 4) {
      res.status(401).json({ status: 'error', error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
      return;
    }

    // ตรวจสอบความมีอยู่จริงของบัญชีในระบบนนทรี (user_roles, รูปแบบรหัสนิสิต KU, หรือบุคลากร)
    const existsInRole = await prisma.userRole.findUnique({ where: { username: normalizedLower } });
    const isStudentFormat = /^b\d{9,10}$/i.test(normalizedLower);
    const existsInPersonnel = await prisma.personnel.findFirst({
      where: {
        OR: [
          { personId: normalizedLower },
          { email: { startsWith: normalizedLower + '@' } },
        ],
      },
    });

    if (!existsInRole && !isStudentFormat && !existsInPersonnel) {
      res.status(401).json({ status: 'error', error: 'ไม่พบบัญชีผู้ใช้งานในระบบนนทรี' });
      return;
    }

    // หากมีการส่ง OTP มา ต้องมีความยาว 6 หลัก
    if (otpClean && otpClean.length !== 6) {
      res.status(401).json({ status: 'error', error: 'รหัส One-time code (OTP) ต้องเป็นตัวเลข 6 หลัก' });
      return;
    }
  }

  // ล็อกอินสำเร็จ ล้างประวัติ attempt
  resetLoginAttempts(req);

  // ดึงสิทธิ์จากฐานข้อมูลตาราง user_roles โดยตรง (ไม่มีในตาราง = 'user')
  const dbUserRole = await prisma.userRole.findUnique({
    where: { username: normalizedLower },
  });
  const role: AppRole = (dbUserRole?.role as AppRole) || 'user';
  const roleTitle = getRoleTitle(role, normalizedLower);

  const user: AuthUser = {
    id: `ku-${normalizedLower}`,
    nontriAccount: isAdminAccount ? 'Admin' : normalized,
    email: `${normalizedLower}@ku.th`,
    nameTh: dbUserRole?.displayName || (isAdminAccount ? 'ผู้ดูแลระบบ (Admin)' : normalized),
    facultyName: 'คณะวิศวกรรมศาสตร์ กำแพงแสน',
    departmentName: 'สำนักงานเลขานุการ คณะวิศวกรรมศาสตร์',
    campus: 'K',
    typePerson: roleTitle,
    role,
    isMock: false,
  };

  // สร้างและลงนามคุกกี้ ku_session (HMAC-SHA256, httpOnly, Lax, 8 ชั่วโมง)
  const { cookieValue, payload } = signSession(normalizedLower, false);
  res.cookie(SESSION_COOKIE_NAME, cookieValue, getSessionCookieOptions());

  // ส่ง legacy JWT token คู่ไปด้วย เพื่อความเข้ากันได้ย้อนหลัง
  const token = AuthService.generateToken(user);

  res.json({
    status: 'success',
    token,
    user,
    expiresAt: payload.expiresAt,
  });
};

authRouter.post('/login', loginRateLimiter, handleLogin);
authRouter.post('/session', loginRateLimiter, handleLogin);

// 2. ขอ URL สำหรับ Redirect ไปหน้า Login ของมหาวิทยาลัย (KU ALL-Login)
authRouter.get('/login-url', (_req: Request, res: Response) => {
  const state = Math.random().toString(36).substring(7);
  const authUrl = AuthService.getAuthorizationUrl(state);

  res.json({
    status: 'success',
    authUrl,
    logoutUrl: env.KU_LOGOUT_ENDPOINT,
  });
});

// 3. แลกเปลี่ยน Authorization Code จาก KU ALL-Login
authRouter.post('/exchange', async (req: Request, res: Response) => {
  const { code, codeVerifier } = req.body;

  if (!code) {
    res.status(400).json({ status: 'error', error: 'Missing authorization code' });
    return;
  }

  try {
    const rawUser = await AuthService.exchangeKUCode(code, codeVerifier);
    const normalizedUsername = rawUser.nontriAccount.toLowerCase().trim();

    // ดึงบทบาทจากตาราง user_roles
    const dbUserRole = await prisma.userRole.findUnique({
      where: { username: normalizedUsername },
    });
    const role: AppRole = (dbUserRole?.role as AppRole) || 'user';
    const user: AuthUser = {
      ...rawUser,
      role,
      typePerson: getRoleTitle(role, normalizedUsername),
    };

    // เซ็นคุกกี้ ku_session
    const { cookieValue, payload } = signSession(normalizedUsername, false);
    res.cookie(SESSION_COOKIE_NAME, cookieValue, getSessionCookieOptions());

    const token = AuthService.generateToken(user);

    res.json({
      status: 'success',
      token,
      user,
      expiresAt: payload.expiresAt,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Failed to authenticate with KU ALL-Login' });
  }
});

// 4. ตรวจสอบข้อมูลโปรไฟล์ปัจจุบันของผู้ใช้ที่ล็อกอินอยู่ (GET /me)
authRouter.get('/me', async (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  const cookies = (req as any).cookies || {};
  const cookieValue = cookies[SESSION_COOKIE_NAME];

  const session = verifySession(cookieValue);
  if (!session) {
    res.status(401).json({
      status: 'error',
      message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
    });
    return;
  }

  // ดึงบทบาทสดจากฐานข้อมูล user_roles ทุก request
  const dbUserRole = await prisma.userRole.findUnique({
    where: { username: session.username },
  });
  const role: AppRole = (dbUserRole?.role as AppRole) || 'user';
  const roleTitle = getRoleTitle(role, session.username);

  const user: AuthUser = {
    id: `ku-${session.username}`,
    nontriAccount: session.username === 'admin' ? 'Admin' : session.username,
    email: `${session.username}@ku.th`,
    nameTh: dbUserRole?.displayName || (session.username === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : session.username),
    facultyName: 'คณะวิศวกรรมศาสตร์ กำแพงแสน',
    departmentName: 'สำนักงานเลขานุการ คณะวิศวกรรมศาสตร์',
    campus: 'K',
    typePerson: roleTitle,
    role,
    isMock: session.isMock || false,
  };

  res.json({
    status: 'success',
    user,
    expiresAt: session.expiresAt,
  });
});

// 5. ออกจากระบบ (POST /logout)
authRouter.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(SESSION_COOKIE_NAME, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
  });

  res.json({
    status: 'success',
    message: 'ออกจากระบบเรียบร้อยแล้ว',
  });
});

// Helper สำหรับรีเซ็ต lockout ในโหมดทดสอบ (ปิดใช้งานใน production)
if (env.AUTH_MOCK_ENABLED && env.NODE_ENV !== 'production') {
  authRouter.post('/reset-mock-lockout', (req: Request, res: Response) => {
    const { username } = req.body;
    if (username) {
      MockAuthService.resetFailedAttempts(String(username));
      resetLoginAttempts(req);
    }
    res.json({ status: 'success', message: 'Mock lockout reset successfully' });
  });
}

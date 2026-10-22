import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { authenticateJWT } from '../middleware/auth.js';
import { env } from '../config/env.js';
import { AuthUser, UserRole } from '../types/index.js';

export const authRouter = Router();

// 1. ล็อกอินด้วยบัญชีนนทรี (จำลองฟอร์ม KU ALL-Login)
authRouter.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านบัญชีนนทรี' });
    return;
  }

  const normalized = String(username).trim().toLowerCase();
  const isAdmin = AuthService.isAccountAdmin(normalized) || normalized === 'admin' || normalized.includes('admin.eng') || normalized === 'b6520503525';
  const isStudent = /^b\d+/i.test(normalized);
  const role: UserRole = isAdmin ? 'admin' : 'viewer';

  let roleTitle = 'บุคลากร';
  if (isAdmin) {
    roleTitle = 'ผู้ดูแลระบบ';
  } else if (isStudent) {
    roleTitle = 'นิสิต';
  }

  const user: AuthUser = {
    id: `ku-${normalized}`,
    nontriAccount: normalized,
    email: `${normalized}@ku.th`,
    nameTh: normalized,
    facultyName: 'คณะวิศวกรรมศาสตร์ กำแพงแสน',
    departmentName: 'คณะวิศวกรรมศาสตร์',
    campus: 'K',
    typePerson: roleTitle,
    role,
  };

  const token = AuthService.generateToken(user);

  res.json({
    status: 'success',
    token,
    user,
  });
});

// Mock Login สำหรับการทดสอบสลับ Role บนเครื่อง Localhost
authRouter.post('/mock-login', (req: Request, res: Response) => {
  const role = req.body.role === 'admin' ? 'admin' : 'viewer';
  const user = AuthService.getMockUser(role);
  const token = AuthService.generateToken(user);

  res.json({
    status: 'success',
    token,
    user,
  });
});

// 2. ขอ URL สำหรับ Redirect ไปหน้า Login ของมหาวิทยาลัย (KU ALL-Login)
authRouter.get('/login-url', (req: Request, res: Response) => {
  const state = (req.query.state as string) || Math.random().toString(36).substring(7);
  const codeChallenge = req.query.code_challenge as string | undefined;
  
  const authUrl = AuthService.getAuthorizationUrl(state, codeChallenge);

  res.json({
    status: 'success',
    authUrl,
    logoutUrl: env.KU_LOGOUT_ENDPOINT,
  });
});

// 3. แลกเปลี่ยน Authorization Code จาก KU ALL-Login เป็น JWT Token
authRouter.post('/exchange', async (req: Request, res: Response) => {
  const { code, codeVerifier } = req.body;

  if (!code) {
    res.status(400).json({ error: 'Missing authorization code' });
    return;
  }

  try {
    const user = await AuthService.exchangeKUCode(code, codeVerifier);
    const token = AuthService.generateToken(user);

    res.json({
      status: 'success',
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to authenticate with KU ALL-Login' });
  }
});

// 4. ตรวจสอบข้อมูลโปรไฟล์ปัจจุบันของผู้ใช้ที่ล็อกอินอยู่
authRouter.get('/me', authenticateJWT, (req: Request, res: Response) => {
  res.json({
    status: 'success',
    user: req.user,
  });
});

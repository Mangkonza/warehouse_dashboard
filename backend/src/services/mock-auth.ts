// TODO: [MOCK AUTH] ลบไฟล์นี้เมื่อเปิดใช้ระบบ KU ALL-Login จริงเต็มรูปแบบ
import crypto from 'crypto';
import { env } from '../config/env.js';
import { prisma } from '../db/prisma.js';
import { AuthUser } from '../types/index.js';
import { AppRole } from '../config/permissions.js';

export interface MockAuthResult {
  user: AuthUser;
  isMock: true;
}

export class MockAuthError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode = 401, code?: string) {
    super(message);
    this.name = 'MockAuthError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

// Memory cache for super_admin failed attempts lockout
interface LockoutEntry {
  attempts: number;
  lockedUntil: number;
}
const failedAttemptsMap = new Map<string, LockoutEntry>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function safeCompare(input: string, expected: string): boolean {
  if (!input || !expected) return false;
  const hashA = crypto.createHash('sha256').update(input).digest();
  const hashB = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function checkLockout(username: string): void {
  const entry = failedAttemptsMap.get(username);
  if (!entry) return;

  const now = Date.now();
  if (entry.lockedUntil > now) {
    const remainingSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    throw new MockAuthError(
      `บัญชีนี้ถูกระงับชั่วคราวเนื่องจากกรอกรหัสผ่านผิดเกินกำหนด กรุณาลองใหม่ในอีก ${remainingSeconds} วินาที (5 นาที)`,
      429,
      'ACCOUNT_LOCKED'
    );
  }

  // Reset if lockout expired
  if (entry.lockedUntil <= now && entry.attempts >= MAX_FAILED_ATTEMPTS) {
    failedAttemptsMap.delete(username);
  }
}

function recordFailedAttempt(username: string): void {
  const now = Date.now();
  const entry = failedAttemptsMap.get(username) || { attempts: 0, lockedUntil: 0 };
  entry.attempts += 1;

  if (entry.attempts >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    failedAttemptsMap.set(username, entry);
    throw new MockAuthError(
      'คุณกรอกรหัสผ่านหรือ OTP ผิดติดต่อกัน 5 ครั้ง บัญชีถูกระงับชั่วคราว 5 นาที',
      429,
      'ACCOUNT_LOCKED'
    );
  }

  failedAttemptsMap.set(username, entry);
}

function resetFailedAttempts(username: string): void {
  failedAttemptsMap.delete(username);
}

export class MockAuthService {
  /**
   * ล้างประวัติ failed attempts สำหรับการทดสอบ (เฉพาะเมื่อเปิด mock และไม่ใช่ production)
   */
  static resetFailedAttempts(username: string): void {
    if (env.AUTH_MOCK_ENABLED && env.NODE_ENV !== 'production') {
      resetFailedAttempts(username.toLowerCase().trim());
    }
  }

  /**
   * ดำเนินการตรวจสอบการล็อกอินด้วยระบบ Mock
   */
  static async authenticate(credentials: {
    username?: string;
    password?: string;
    otp?: string;
  }): Promise<MockAuthResult> {
    // 1. ตรวจสอบ Runtime Flags อย่างเข้มงวด
    if (!env.AUTH_MOCK_ENABLED || env.NODE_ENV === 'production') {
      throw new MockAuthError(
        'โหมดทดสอบ (Mock Auth) ถูกปิดการใช้งาน หรือระบบกำลังทำงานบน Production',
        403,
        'MOCK_AUTH_DISABLED'
      );
    }

    const { username, password, otp } = credentials;
    if (!username) {
      throw new MockAuthError('กรุณากรอกชื่อผู้ใช้', 400, 'MISSING_USERNAME');
    }

    const normalized = String(username).toLowerCase().trim();

    // 2. ตรวจสอบรูปแบบ Regex ^b\d{10}$
    const validRegex = /^b\d{10}$/;
    if (!validRegex.test(normalized)) {
      throw new MockAuthError(
        'ชื่อผู้ใช้ต้องขึ้นต้นด้วย b ตามด้วยตัวเลข 10 หลัก (เช่น b0123456789)',
        400,
        'INVALID_USERNAME_FORMAT'
      );
    }

    // -------------------------------------------------------------
    // กลุ่มที่ 2: บัญชี Super Admin (b0123456789 และ b6520503525)
    // -------------------------------------------------------------
    if (normalized === 'b0123456789' || normalized === 'b6520503525') {
      checkLockout(normalized);

      let expectedPassword = '';
      let expectedOtp = '';

      if (normalized === 'b0123456789') {
        expectedPassword = env.MOCK_SUPER_ADMIN_B0123456789_PASSWORD || 'Admin@1234';
        expectedOtp = env.MOCK_SUPER_ADMIN_B0123456789_OTP || '123456';
      } else if (normalized === 'b6520503525') {
        // บัญชีจริงของผู้ใช้: ต้องอ่านค่าจาก .env เท่านั้น ห้ามมี fallback
        const envPass = process.env.MOCK_SUPER_ADMIN_B6520503525_PASSWORD;
        const envOtp = process.env.MOCK_SUPER_ADMIN_B6520503525_OTP;

        if (!envPass || !envOtp) {
          throw new MockAuthError(
            'ไม่สามารถเข้าสู่ระบบด้วยบัญชี Super Admin นี้ได้ เนื่องจากยังไม่ได้กำหนดค่ารหัสผ่านใน Environment (MOCK_SUPER_ADMIN_B6520503525_PASSWORD / OTP)',
            401,
            'SUPER_ADMIN_CREDENTIALS_UNSET'
          );
        }

        expectedPassword = envPass;
        expectedOtp = envOtp;
      }

      // ตรวจสอบ Password และ OTP ด้วย constant-time comparison
      const isPasswordValid = safeCompare(String(password || '').trim(), expectedPassword);
      const isOtpValid = safeCompare(String(otp || '').trim(), expectedOtp);

      if (!isPasswordValid || !isOtpValid) {
        recordFailedAttempt(normalized);
        throw new MockAuthError('รหัสผ่านหรือ OTP สำหรับ Super Admin ไม่ถูกต้อง', 401, 'INVALID_CREDENTIALS');
      }

      // ผ่านการตรวจสอบ ล้างประวัติ failed attempts
      resetFailedAttempts(normalized);

      // ดึงข้อมูลแสดงผล
      const dbRole = await prisma.userRole.findUnique({
        where: { username: normalized },
      });

      const user: AuthUser = {
        id: `ku-${normalized}`,
        nontriAccount: normalized,
        email: `${normalized}@ku.th`,
        nameTh: dbRole?.displayName || (normalized === 'b0123456789' ? 'Admin' : 'Admin'),
        facultyName: 'คณะวิศวกรรมศาสตร์ กำแพงแสน',
        departmentName: 'สำนักงานเลขานุการ คณะวิศวกรรมศาสตร์',
        campus: 'K',
        typePerson: 'ผู้ดูแลระบบ',
        role: 'admin',
        isMock: true,
      };

      return { user, isMock: true };
    }

    // -------------------------------------------------------------
    // กลุ่มที่ 1: Free Login (ผู้ใช้ทั่วไป)
    // -------------------------------------------------------------
    // กฎข้อ 1: กรอก password/OTP อะไรก็ได้เพื่อทดสอบ UX (ยกเว้น protected accounts ถูกแยกไว้ข้างบนแล้ว)
    // กฎข้อ 2: ได้ role = 'user' เสมอ ยกเว้นถ้า MOCK_TRUST_DB_ROLES=true ให้ lookup ใน user_roles
    let userRole: AppRole = 'user';

    if (env.MOCK_TRUST_DB_ROLES) {
      const dbRecord = await prisma.userRole.findUnique({
        where: { username: normalized },
      });
      if (dbRecord && dbRecord.role === 'admin') {
        userRole = 'admin';
      }
    }

    const dbRecord = await prisma.userRole.findUnique({
      where: { username: normalized },
    });

    const user: AuthUser = {
      id: `ku-${normalized}`,
      nontriAccount: normalized,
      email: `${normalized}@ku.th`,
      nameTh: dbRecord?.displayName || `ผู้ใช้งานทดสอบ (${normalized})`,
      facultyName: 'คณะวิศวกรรมศาสตร์ กำแพงแสน',
      departmentName: 'สำนักงานเลขานุการ คณะวิศวกรรมศาสตร์',
      campus: 'K',
      typePerson: userRole === 'admin' ? 'ผู้ดูแลระบบ' : 'นิสิต/บุคลากร',
      role: userRole,
      isMock: true,
    };

    return { user, isMock: true };
  }
}

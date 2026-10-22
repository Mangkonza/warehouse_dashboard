import jwt from 'jsonwebtoken';
import { env, adminAccounts } from '../config/env.js';
import { AuthUser, JWTPayload, KUUserProfile, UserRole } from '../types/index.js';

export class AuthService {
  static generateToken(user: AuthUser): string {
    const payload: JWTPayload = {
      sub: user.id,
      nontriAccount: user.nontriAccount,
      email: user.email,
      nameTh: user.nameTh,
      facultyName: user.facultyName,
      departmentName: user.departmentName,
      campus: user.campus,
      typePerson: user.typePerson,
      role: user.role,
    };

    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '8h' }); // KU ALL-Login session 8 hours
  }

  static isAccountAdmin(nontriAccount: string): boolean {
    const normalized = nontriAccount.trim().toLowerCase();
    return adminAccounts.includes(normalized);
  }

  static getAuthorizationUrl(state: string, codeChallenge?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: env.KU_CLIENT_ID,
      redirect_uri: env.KU_REDIRECT_URI,
      scope: env.KU_SCOPE,
      state,
    });

    if (codeChallenge) {
      params.append('code_challenge', codeChallenge);
      params.append('code_challenge_method', 'S256');
    }

    return `${env.KU_AUTH_ENDPOINT}?${params.toString()}`;
  }

  static getMockUser(role: UserRole = 'viewer'): AuthUser {
    if (role === 'admin') {
      return {
        id: 'admin-001',
        nontriAccount: 'admin.eng',
        email: 'admin.eng@ku.th',
        nameTh: 'ผู้ดูแลระบบ คณะวิศวกรรมศาสตร์ กำแพงแสน',
        facultyName: 'คณะวิศวกรรมศาสตร์ กำแพงแสน',
        departmentName: 'สำนักงานเลขานุการ',
        campus: 'K',
        typePerson: '2',
        role: 'admin',
      };
    }

    return {
      id: 'viewer-001',
      nontriAccount: 'somchai.k',
      email: 'somchai.k@ku.th',
      nameTh: 'อ.ดร.สมชาย ใจดี',
      facultyName: 'คณะวิศวกรรมศาสตร์ กำแพงแสน',
      departmentName: 'ภาควิชาวิศวกรรมคอมพิวเตอร์',
      campus: 'K',
      typePerson: '1',
      role: 'viewer',
    };
  }

  static async exchangeKUCode(code: string, codeVerifier?: string): Promise<AuthUser> {
    // โหมดเชื่อมต่อระบบจริงกับ OCS KU Keycloak
    if (env.KU_CLIENT_ID && env.KU_CLIENT_ID !== 'mock_ku_client_id') {
      const bodyParams = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: env.KU_CLIENT_ID,
        client_secret: env.KU_CLIENT_SECRET,
        redirect_uri: env.KU_REDIRECT_URI,
        code,
      });

      if (codeVerifier) {
        bodyParams.append('code_verifier', codeVerifier);
      }

      const tokenRes = await fetch(env.KU_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: bodyParams.toString(),
      });

      const tokenData = (await tokenRes.json()) as any;
      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error(`KU Token Exchange failed: ${tokenData.error_description || tokenData.error || 'Unknown error'}`);
      }

      const userRes = await fetch(env.KU_USERINFO_ENDPOINT, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (!userRes.ok) {
        throw new Error('Failed to retrieve user profile from KU ALL-Login');
      }

      const profile = (await userRes.json()) as KUUserProfile;

      const nontriAccount = (
        profile.userprincipalname ||
        profile.uid ||
        profile['google-mail']?.split('@')[0] ||
        profile.mail?.split('@')[0] ||
        'unknown'
      ).toLowerCase();

      const nameTh =
        profile.thainame ||
        [profile.thaiprename, profile['first-name'], profile['last-name']].filter(Boolean).join(' ') ||
        profile.cn ||
        'ผู้ใช้งาน มก.';

      const role: UserRole = this.isAccountAdmin(nontriAccount) ? 'admin' : 'viewer';

      return {
        id: profile.sub || `ku-${nontriAccount}`,
        nontriAccount,
        email: profile['google-mail'] || profile.mail || `${nontriAccount}@ku.th`,
        nameTh,
        facultyName: profile.faculty || 'คณะวิศวกรรมศาสตร์ กำแพงแสน',
        departmentName: profile.department,
        campus: profile.campus,
        typePerson: String(profile['type-person'] || ''),
        role,
      };
    }

    // โหมดทดสอบ Sandbox
    const mockNontri = code.startsWith('admin') ? 'admin.eng' : `user_${code.substring(0, 8)}`;
    const role: UserRole = this.isAccountAdmin(mockNontri) ? 'admin' : 'viewer';

    return {
      id: `ku-${mockNontri}`,
      nontriAccount: mockNontri,
      email: `${mockNontri}@ku.th`,
      nameTh: role === 'admin' ? 'ผู้ดูแลระบบ คณะวิศวกรรมศาสตร์ กำแพงแสน' : 'อาจารย์/บุคลากร มก.',
      facultyName: 'คณะวิศวกรรมศาสตร์ กำแพงแสน',
      departmentName: 'ภาควิชาวิศวกรรมคอมพิวเตอร์',
      campus: 'K',
      typePerson: role === 'admin' ? '2' : '1',
      role,
    };
  }
}


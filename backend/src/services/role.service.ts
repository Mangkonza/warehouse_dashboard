import { prisma } from '../db/prisma.js';
import { AppRole } from '../config/permissions.js';

export const PROTECTED_ADMINS = ['b6520503525', 'b0123456789'];

export class RoleError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode = 400, code?: string) {
    super(message);
    this.name = 'RoleError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function validateUsernameFormat(username: string): string {
  const normalized = String(username || '').toLowerCase().trim();

  // บัญชีระบบที่ได้รับการยกเว้น
  if (PROTECTED_ADMINS.includes(normalized)) {
    return normalized;
  }

  // รูปแบบ b ตามด้วยตัวเลข 10 หลัก
  const validRegex = /^b\d{10}$/;
  if (!validRegex.test(normalized)) {
    throw new RoleError(
      'ชื่อผู้ใช้ต้องขึ้นต้นด้วย b ตามด้วยตัวเลข 10 หลัก (เช่น b6520503525)',
      400,
      'INVALID_USERNAME_FORMAT'
    );
  }

  return normalized;
}

export class RoleService {
  /**
   * ดึงรายการบทบาทผู้ใช้ (สำหรับหน้าจัดการสิทธิ์ผู้ใช้ แสดงเฉพาะ admin)
   */
  static async listRoles(params: {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    // ถ้าไม่ได้ระบุ role เป็นพิเศษ ให้ดึง admin เป็นค่าเริ่มต้นตามระบบ 2 บทบาท
    if (params.role && params.role !== 'all') {
      where.role = params.role;
    } else {
      where.role = 'admin';
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { username: { contains: q, mode: 'insensitive' } },
        { displayName: { contains: q, mode: 'insensitive' } },
        { note: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.userRole.count({ where }),
      prisma.userRole.findMany({
        where,
        orderBy: [{ isProtected: 'desc' }, { grantedAt: 'desc' }],
        skip,
        take: limit,
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * เพิ่มบทบาทผู้ดูแลระบบ (Admin) ใหม่
   */
  static async grantRole(
    actor: { username: string; role: AppRole },
    data: {
      username: string;
      role?: AppRole;
      displayName?: string;
      note?: string;
    }
  ) {
    if (actor.role !== 'admin') {
      throw new RoleError('เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถเพิ่มสิทธิ์ได้', 403, 'INSUFFICIENT_PRIVILEGE');
    }

    const targetUsername = validateUsernameFormat(data.username);
    const targetRole: AppRole = data.role === 'user' ? 'user' : 'admin';

    // กฎ: ห้ามเปลี่ยนสิทธิ์ตัวเอง
    if (actor.username.toLowerCase() === targetUsername) {
      throw new RoleError('ไม่อนุญาตให้แก้ไขสิทธิ์ของตนเอง', 403, 'SELF_MODIFICATION_FORBIDDEN');
    }

    // กฎ: ตรวจสอบบัญชีที่มีอยู่แล้ว
    const existing = await prisma.userRole.findUnique({
      where: { username: targetUsername },
    });

    if (existing) {
      if (existing.role === 'admin') {
        throw new RoleError(
          `บัญชี "${targetUsername}" ได้รับสิทธิ์ผู้ดูแลระบบอยู่แล้ว`,
          409,
          'USER_ROLE_EXISTS'
        );
      }
    }

    // กฎ: ห้ามตั้งค่า is_protected = true ผ่าน API/UI (บังคับเป็น false เสมอ)
    return prisma.$transaction(async (tx) => {
      const saved = await tx.userRole.upsert({
        where: { username: targetUsername },
        update: {
          role: targetRole,
          displayName: data.displayName?.trim() || null,
          note: data.note?.trim() || null,
          grantedBy: actor.username,
          isProtected: false, // ห้ามให้สิทธิ์ protected ผ่าน API
        },
        create: {
          username: targetUsername,
          role: targetRole,
          displayName: data.displayName?.trim() || null,
          note: data.note?.trim() || null,
          grantedBy: actor.username,
          isProtected: false, // ห้ามให้สิทธิ์ protected ผ่าน API
        },
      });

      await tx.roleAuditLog.create({
        data: {
          actorUsername: actor.username,
          action: 'GRANT_ROLE',
          targetUsername,
          oldRole: existing?.role || null,
          newRole: targetRole,
        },
      });

      return saved;
    });
  }

  /**
   * แก้ไขข้อมูลหรือบทบาทผู้ใช้
   */
  static async changeRole(
    actor: { username: string; role: AppRole },
    targetUsernameRaw: string,
    data: {
      role?: AppRole;
      displayName?: string;
      note?: string;
    }
  ) {
    if (actor.role !== 'admin') {
      throw new RoleError('เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถแก้ไขสิทธิ์ได้', 403, 'INSUFFICIENT_PRIVILEGE');
    }

    const targetUsername = validateUsernameFormat(targetUsernameRaw);

    // กฎ: ห้ามแก้ไขสิทธิ์ตัวเอง
    if (actor.username.toLowerCase() === targetUsername) {
      throw new RoleError('ไม่อนุญาตให้แก้ไขสิทธิ์ของตนเอง', 403, 'SELF_MODIFICATION_FORBIDDEN');
    }

    const existing = await prisma.userRole.findUnique({
      where: { username: targetUsername },
    });

    if (!existing) {
      throw new RoleError('ไม่พบข้อมูลบทบาทของผู้ใช้นี้ในระบบ', 404, 'USER_ROLE_NOT_FOUND');
    }

    // กฎ: ห้ามแก้ไข/ลดระดับบัญชีที่เป็น Protected Account
    if (existing.isProtected || PROTECTED_ADMINS.includes(targetUsername)) {
      throw new RoleError(
        'ไม่สามารถแก้ไขหรือลดสิทธิ์ของบัญชีที่ได้รับการปกป้อง (Protected Account) ได้',
        403,
        'PROTECTED_ACCOUNT'
      );
    }

    const newRole: AppRole = data.role === 'user' ? 'user' : 'admin';

    // กฎ: ห้ามถอน/ลดสิทธิ์ admin คนสุดท้าย
    if (existing.role === 'admin' && newRole === 'user') {
      const adminCount = await prisma.userRole.count({
        where: { role: 'admin' },
      });
      if (adminCount <= 1) {
        throw new RoleError(
          'ไม่สามารถลดสิทธิ์ผู้ดูแลระบบคนสุดท้ายได้ (ต้องมี Admin อย่างน้อย 1 คน)',
          403,
          'LAST_ADMIN_PROTECTED'
        );
      }
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.userRole.update({
        where: { username: targetUsername },
        data: {
          role: newRole,
          displayName: data.displayName !== undefined ? data.displayName.trim() : undefined,
          note: data.note !== undefined ? data.note.trim() : undefined,
          grantedBy: actor.username,
        },
      });

      await tx.roleAuditLog.create({
        data: {
          actorUsername: actor.username,
          action: 'CHANGE_ROLE',
          targetUsername,
          oldRole: existing.role,
          newRole,
        },
      });

      return updated;
    });
  }

  /**
   * ถอนสิทธิ์ผู้ดูแลระบบ (เพิกถอนสิทธิ์กลับเป็น user)
   */
  static async revokeRole(
    actor: { username: string; role: AppRole },
    targetUsernameRaw: string
  ) {
    if (actor.role !== 'admin') {
      throw new RoleError('เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถเพิกถอนสิทธิ์ได้', 403, 'INSUFFICIENT_PRIVILEGE');
    }

    const targetUsername = validateUsernameFormat(targetUsernameRaw);

    // กฎ: ห้ามถอนสิทธิ์ตัวเอง
    if (actor.username.toLowerCase() === targetUsername) {
      throw new RoleError('ไม่อนุญาตให้เพิกถอนสิทธิ์ของตนเอง', 403, 'SELF_MODIFICATION_FORBIDDEN');
    }

    const existing = await prisma.userRole.findUnique({
      where: { username: targetUsername },
    });

    if (!existing) {
      throw new RoleError('ไม่พบข้อมูลบทบาทของผู้ใช้นี้ในระบบ', 404, 'USER_ROLE_NOT_FOUND');
    }

    // กฎ: ห้ามถอนสิทธิ์บัญชีที่เป็น Protected Account
    if (existing.isProtected || PROTECTED_ADMINS.includes(targetUsername)) {
      throw new RoleError(
        'ไม่สามารถเพิกถอนสิทธิ์ของบัญชีที่ได้รับการปกป้อง (Protected Account) ได้',
        403,
        'PROTECTED_ACCOUNT'
      );
    }

    // กฎ: ห้ามถอน admin คนสุดท้าย
    if (existing.role === 'admin') {
      const adminCount = await prisma.userRole.count({
        where: { role: 'admin' },
      });
      if (adminCount <= 1) {
        throw new RoleError(
          'ไม่สามารถเพิกถอนสิทธิ์ผู้ดูแลระบบคนสุดท้ายได้ (ต้องมี Admin อย่างน้อย 1 คน)',
          403,
          'LAST_ADMIN_PROTECTED'
        );
      }
    }

    return prisma.$transaction(async (tx) => {
      await tx.userRole.delete({
        where: { username: targetUsername },
      });

      await tx.roleAuditLog.create({
        data: {
          actorUsername: actor.username,
          action: 'REVOKE_ROLE',
          targetUsername,
          oldRole: existing.role,
          newRole: 'user',
        },
      });

      return { success: true, message: `เพิกถอนสิทธิ์ ${targetUsername} เรียบร้อยแล้ว` };
    });
  }

  /**
   * ดึงประวัติการเปลี่ยนสิทธิ์ (Audit Logs) เรียงลำดับใหม่สุดก่อน
   */
  static async getAuditLogs(limit = 100) {
    const logs = await prisma.roleAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs.map((log) => ({
      ...log,
      id: String(log.id),
    }));
  }
}

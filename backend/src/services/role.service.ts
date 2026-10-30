import { prisma } from '../db/prisma.js';
import { AppRole } from '../config/permissions.js';

export const PROTECTED_ADMINS = ['b6520503525', 'b0123456789', 'b6500000001'];

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

  if (!normalized) {
    throw new RoleError('กรุณาระบุชื่อบัญชีผู้ใช้', 400, 'INVALID_USERNAME_FORMAT');
  }

  // บัญชีระบบที่ได้รับการยกเว้น
  if (PROTECTED_ADMINS.includes(normalized) || normalized === 'admin') {
    return normalized;
  }

  // รูปแบบ b ตามด้วยตัวเลข 9-10 หลัก
  const validRegex = /^b\d{9,10}$/;
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
   * ดึงรายการบทบาทผู้ใช้ (รองรับทั้ง admin และ user)
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

    if (params.role && params.role !== 'all') {
      where.role = params.role;
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
        orderBy: [{ role: 'asc' }, { grantedAt: 'desc' }],
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
   * เพิ่มบทบาทผู้ดูแลระบบ (Admin) หรือผู้ใช้งาน (User)
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

    if (existing && existing.role === targetRole) {
      throw new RoleError(
        `บัญชี "${targetUsername}" มีสิทธิ์ ${targetRole === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'ผู้ใช้งานทั่วไป (User)'} อยู่แล้ว`,
        409,
        'USER_ROLE_EXISTS'
      );
    }

    return prisma.$transaction(async (tx) => {
      const saved = await tx.userRole.upsert({
        where: { username: targetUsername },
        update: {
          role: targetRole,
          displayName: data.displayName?.trim() || existing?.displayName || null,
          note: data.note?.trim() || existing?.note || null,
          grantedBy: actor.username,
          isProtected: false,
        },
        create: {
          username: targetUsername,
          role: targetRole,
          displayName: data.displayName?.trim() || null,
          note: data.note?.trim() || null,
          grantedBy: actor.username,
          isProtected: false,
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
   * แก้ไขข้อมูลหรือบทบาทผู้ใช้ (รวมถึงการลดสิทธิ์จาก Admin เป็น User หรือเพิ่มจาก User เป็น Admin)
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

    const targetUsername = String(targetUsernameRaw || '').toLowerCase().trim();

    const existing = await prisma.userRole.findUnique({
      where: { username: targetUsername },
    });

    if (!existing) {
      throw new RoleError('ไม่พบข้อมูลบทบาทของผู้ใช้นี้ในระบบ', 404, 'USER_ROLE_NOT_FOUND');
    }

    const newRole: AppRole = data.role === 'user' ? 'user' : data.role === 'admin' ? 'admin' : (existing.role as AppRole);
    const isRoleChanging = newRole !== existing.role;

    // กฎ: ห้ามลดระดับสิทธิ์ตัวเอง (แต่สามารถแก้ไขชื่อ-นามสกุลและหมายเหตุของตนเองได้)
    if (actor.username.toLowerCase() === targetUsername && isRoleChanging) {
      throw new RoleError('ไม่อนุญาตให้ลดระดับสิทธิ์ของบัญชีตนเองที่กำลังใช้งานอยู่', 403, 'SELF_MODIFICATION_FORBIDDEN');
    }

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
          isProtected: newRole === 'user' ? false : existing.isProtected,
          displayName: data.displayName !== undefined ? (data.displayName.trim() || null) : undefined,
          note: data.note !== undefined ? (data.note.trim() || null) : undefined,
          ...(isRoleChanging ? { grantedBy: actor.username } : {}),
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
   * ลบรายการ/ถอนสิทธิ์ผู้ดูแลระบบ (เพิกถอนสิทธิ์กลับเป็น user และลบออกจากตาราง)
   */
  static async revokeRole(
    actor: { username: string; role: AppRole },
    targetUsernameRaw: string
  ) {
    if (actor.role !== 'admin') {
      throw new RoleError('เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถเพิกถอนสิทธิ์ได้', 403, 'INSUFFICIENT_PRIVILEGE');
    }

    const targetUsername = String(targetUsernameRaw || '').toLowerCase().trim();

    // กฎ: ห้ามถอนสิทธิ์ตัวเอง
    if (actor.username.toLowerCase() === targetUsername) {
      throw new RoleError('ไม่อนุญาตให้ลบบัญชีของตนเองที่กำลังใช้งานอยู่', 403, 'SELF_MODIFICATION_FORBIDDEN');
    }

    const existing = await prisma.userRole.findUnique({
      where: { username: targetUsername },
    });

    if (!existing) {
      throw new RoleError('ไม่พบข้อมูลบทบาทของผู้ใช้นี้ในระบบ', 404, 'USER_ROLE_NOT_FOUND');
    }

    // กฎ: ห้ามถอน admin คนสุดท้าย
    if (existing.role === 'admin') {
      const adminCount = await prisma.userRole.count({
        where: { role: 'admin' },
      });
      if (adminCount <= 1) {
        throw new RoleError(
          'ไม่สามารถลบผู้ดูแลระบบคนสุดท้ายได้ (ต้องมี Admin อย่างน้อย 1 คน)',
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

      return { success: true, message: `ลบรายการและเพิกถอนสิทธิ์ของ ${targetUsername} เรียบร้อยแล้ว` };
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

import { prisma } from '../db/prisma.js';
import { extractNumericId } from '../utils/sanitize.js';

export function formatPersonnel(p: any) {
  if (!p) return null;
  const deptName = p.department?.nameTh || p.departmentCode || '';
  return {
    _id: p.personId || String(p.id),
    id: p.personId || String(p.id),
    dbId: p.id,
    person_id: p.personId || String(p.id),
    name: p.nameTh,
    name_th: p.nameTh,
    name_en: p.nameEn || '',
    clean_name: p.nameTh.replace(/^(ศ\.|รศ\.|ผศ\.|อ\.|ดร\.|นาย|นาง|นางสาว|\s+)+/gi, '').trim(),
    title_th: p.titleTh || '',
    position: p.position || '',
    department: deptName,
    department_code: p.departmentCode || '',
    email: p.email || '',
    image_url: '',
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

async function resolveDepartmentCode(deptInput?: string | null): Promise<string | null> {
  if (!deptInput) return null;
  const clean = String(deptInput).trim();
  if (!clean) return null;
  const exact = await prisma.department.findUnique({ where: { code: clean } });
  if (exact) return exact.code;

  const norm = clean.replace('ภาควิชา', '').trim();
  const matched = await prisma.department.findFirst({
    where: {
      OR: [
        { nameTh: { contains: norm, mode: 'insensitive' } },
        { code: { equals: clean, mode: 'insensitive' } },
      ],
    },
  });
  return matched ? matched.code : null;
}

export class PersonnelService {
  static async getAll(department?: string, search?: string) {
    const where: any = {};

    if (department && department !== 'all') {
      const normDept = department.replace('ภาควิชา', '').trim();
      where.OR = [
        { departmentCode: department },
        { department: { nameTh: { contains: normDept, mode: 'insensitive' } } },
      ];
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { nameTh: { contains: q, mode: 'insensitive' } },
        { nameEn: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { personId: { contains: q, mode: 'insensitive' } },
      ];
    }

    const list = await prisma.personnel.findMany({
      where,
      include: { department: true },
      orderBy: { id: 'asc' },
    });

    return list.map(formatPersonnel);
  }

  static async getById(identifier: string | number) {
    const numId = extractNumericId(identifier);
    if (numId !== null) {
      const byId = await prisma.personnel.findUnique({
        where: { id: numId },
        include: { department: true },
      });
      if (byId) return formatPersonnel(byId);
    }

    const byPersonId = await prisma.personnel.findUnique({
      where: { personId: String(identifier) },
      include: { department: true },
    });
    return formatPersonnel(byPersonId);
  }

  static async getDepartments() {
    const depts = await prisma.department.findMany({
      include: {
        _count: {
          select: { personnel: true },
        },
      },
    });

    return depts.map((d) => ({
      name: d.nameTh,
      code: d.code,
      count: d._count.personnel,
    }));
  }

  static async match(rawName: string) {
    if (!rawName) return null;
    const clean = rawName
      .replace(/\(หัวหน้าโครงการ\)/gi, '')
      .replace(/และคณะ/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    const matched = await prisma.personnel.findFirst({
      where: {
        OR: [
          { nameTh: { equals: clean, mode: 'insensitive' } },
          { nameTh: { equals: rawName, mode: 'insensitive' } },
          { nameTh: { contains: clean, mode: 'insensitive' } },
        ],
      },
      include: { department: true },
    });

    return formatPersonnel(matched);
  }

  static async create(body: any) {
    const name = String(body.name || body.nameTh || body.name_th || '').trim();
    if (!name) {
      const err: any = new Error('กรุณาระบุชื่อบุคลากร');
      err.status = 400;
      throw err;
    }

    const deptCode = await resolveDepartmentCode(body.departmentCode || body.department_code || body.department);

    const created = await prisma.personnel.create({
      data: {
        personId: body.personId || body.person_id || body.id || null,
        titleTh: body.titleTh || body.title_th || null,
        nameTh: name,
        nameEn: body.nameEn || body.name_en || null,
        position: body.position || null,
        departmentCode: deptCode,
        email: body.email || null,
      },
      include: { department: true },
    });

    return formatPersonnel(created);
  }

  static async update(identifier: string | number, body: any) {
    let existingId: number | null = null;
    const numId = extractNumericId(identifier);
    if (numId !== null) {
      const found = await prisma.personnel.findUnique({ where: { id: numId } });
      if (found) existingId = found.id;
    }
    if (!existingId) {
      const found = await prisma.personnel.findUnique({ where: { personId: String(identifier) } });
      if (found) existingId = found.id;
    }
    if (!existingId) {
      const err: any = new Error('ไม่พบข้อมูลบุคลากร');
      err.status = 404;
      throw err;
    }

    const rawDept = body.departmentCode || body.department_code || body.department;
    const deptCode = rawDept !== undefined ? await resolveDepartmentCode(rawDept) : undefined;

    const updated = await prisma.personnel.update({
      where: { id: existingId },
      data: {
        ...(body.name || body.nameTh || body.name_th ? { nameTh: String(body.name || body.nameTh || body.name_th).trim() } : {}),
        ...(body.nameEn || body.name_en ? { nameEn: String(body.nameEn || body.name_en).trim() } : {}),
        ...(body.titleTh || body.title_th ? { titleTh: String(body.titleTh || body.title_th).trim() } : {}),
        ...(body.position !== undefined ? { position: body.position } : {}),
        ...(deptCode !== undefined ? { departmentCode: deptCode } : {}),
        ...(body.email !== undefined ? { email: body.email } : {}),
      },
      include: { department: true },
    });

    return formatPersonnel(updated);
  }

  static async delete(identifier: string | number) {
    let existingId: number | null = null;
    const numId = extractNumericId(identifier);
    if (numId !== null) {
      const found = await prisma.personnel.findUnique({ where: { id: numId } });
      if (found) existingId = found.id;
    }
    if (!existingId) {
      const found = await prisma.personnel.findUnique({ where: { personId: String(identifier) } });
      if (found) existingId = found.id;
    }
    if (!existingId) {
      const err: any = new Error('ไม่พบข้อมูลบุคลากร');
      err.status = 404;
      throw err;
    }

    await prisma.personnel.delete({ where: { id: existingId } });
    return { id: identifier };
  }
}

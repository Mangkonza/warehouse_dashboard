import { prisma } from '../db/prisma.js';

export class IpRepository {
  static async findAll(params: {
    search?: string;
    type?: string;
    department?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const { search, type, department, status, page, limit } = params;

    const where: any = {};

    if (type && type !== 'all') {
      where.type = type;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (department && department !== 'all') {
      where.OR = [
        { departmentCode: department },
        { departments: { some: { departmentCode: department } } },
      ];
    }

    if (search) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { creatorName: { contains: q, mode: 'insensitive' } },
        { applicationNumber: { contains: q, mode: 'insensitive' } },
        { registrationNumber: { contains: q, mode: 'insensitive' } },
        { workCategory: { contains: q, mode: 'insensitive' } },
        { workCharacter: { contains: q, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.intellectualProperty.count({ where });

    const items = await prisma.intellectualProperty.findMany({
      where,
      include: {
        inventors: true,
        departments: {
          include: { department: true },
        },
      },
      orderBy: { id: 'desc' },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit || undefined,
    });

    return { total, items };
  }

  static async findById(id: number) {
    return prisma.intellectualProperty.findUnique({
      where: { id },
      include: {
        inventors: true,
        departments: {
          include: { department: true },
        },
      },
    });
  }

  static async findByLegacyId(legacyId: string) {
    return prisma.intellectualProperty.findUnique({
      where: { legacyId },
      include: {
        inventors: true,
        departments: {
          include: { department: true },
        },
      },
    });
  }

  static async checkDuplicateRegistrationNumber(type: string, regNo: string, excludeId?: number) {
    if (!regNo || !regNo.trim()) return false;
    const where: any = {
      type,
      registrationNumber: regNo.trim(),
    };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    const count = await prisma.intellectualProperty.count({ where });
    return count > 0;
  }

  static async create(data: {
    title: string;
    type: string;
    workCategory?: string | null;
    workCharacter?: string | null;
    creatorName?: string | null;
    departmentCode?: string | null;
    applicationNumber?: string | null;
    registrationNumber?: string | null;
    filingDate?: Date | null;
    protectionStart?: Date | null;
    protectionEnd?: Date | null;
    supportAmount?: number;
    status?: string | null;
    fiscalYear?: number | null;
    remarks?: string | null;
    inventorsList?: string[];
    departmentsList?: string[];
  }) {
    return prisma.$transaction(async (tx) => {
      const created = await tx.intellectualProperty.create({
        data: {
          title: data.title,
          type: data.type,
          workCategory: data.workCategory || null,
          workCharacter: data.workCharacter || null,
          creatorName: data.creatorName || null,
          departmentCode: data.departmentCode || null,
          applicationNumber: data.applicationNumber || null,
          registrationNumber: data.registrationNumber || null,
          filingDate: data.filingDate || null,
          protectionStart: data.protectionStart || null,
          protectionEnd: data.protectionEnd || null,
          supportAmount: data.supportAmount || 0,
          status: data.status || 'ยื่นคำขอแล้ว',
          fiscalYear: data.fiscalYear || null,
          remarks: data.remarks || null,
        },
      });

      // Update legacy_id to ip_<id>
      const updatedWithLegacy = await tx.intellectualProperty.update({
        where: { id: created.id },
        data: { legacyId: `ip_${created.id}` },
      });

      // Create inventors
      if (data.inventorsList && data.inventorsList.length > 0) {
        for (let i = 0; i < data.inventorsList.length; i++) {
          await tx.ipInventor.create({
            data: {
              ipId: created.id,
              personName: data.inventorsList[i],
              isLead: i === 0,
            },
          });
        }
      }

      // Create departments
      if (data.departmentsList && data.departmentsList.length > 0) {
        for (const dept of data.departmentsList) {
          await tx.ipDepartment.create({
            data: {
              ipId: created.id,
              departmentCode: dept,
            },
          });
        }
      }

      return tx.intellectualProperty.findUnique({
        where: { id: created.id },
        include: {
          inventors: true,
          departments: { include: { department: true } },
        },
      });
    });
  }

  static async update(
    id: number,
    data: {
      title?: string;
      type?: string;
      workCategory?: string | null;
      workCharacter?: string | null;
      creatorName?: string | null;
      departmentCode?: string | null;
      applicationNumber?: string | null;
      registrationNumber?: string | null;
      filingDate?: Date | null;
      protectionStart?: Date | null;
      protectionEnd?: Date | null;
      supportAmount?: number;
      status?: string | null;
      fiscalYear?: number | null;
      remarks?: string | null;
      inventorsList?: string[];
      departmentsList?: string[];
    }
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.intellectualProperty.update({
        where: { id },
        data: {
          ...(data.title !== undefined ? { title: data.title } : {}),
          ...(data.type !== undefined ? { type: data.type } : {}),
          workCategory: data.workCategory !== undefined ? data.workCategory : undefined,
          workCharacter: data.workCharacter !== undefined ? data.workCharacter : undefined,
          creatorName: data.creatorName !== undefined ? data.creatorName : undefined,
          departmentCode: data.departmentCode !== undefined ? data.departmentCode : undefined,
          applicationNumber: data.applicationNumber !== undefined ? data.applicationNumber : undefined,
          registrationNumber: data.registrationNumber !== undefined ? data.registrationNumber : undefined,
          filingDate: data.filingDate !== undefined ? data.filingDate : undefined,
          protectionStart: data.protectionStart !== undefined ? data.protectionStart : undefined,
          protectionEnd: data.protectionEnd !== undefined ? data.protectionEnd : undefined,
          supportAmount: data.supportAmount !== undefined ? data.supportAmount : undefined,
          status: data.status !== undefined ? data.status : undefined,
          fiscalYear: data.fiscalYear !== undefined ? data.fiscalYear : undefined,
          remarks: data.remarks !== undefined ? data.remarks : undefined,
        },
      });

      if (data.inventorsList !== undefined) {
        await tx.ipInventor.deleteMany({ where: { ipId: id } });
        for (let i = 0; i < data.inventorsList.length; i++) {
          await tx.ipInventor.create({
            data: {
              ipId: id,
              personName: data.inventorsList[i],
              isLead: i === 0,
            },
          });
        }
      }

      if (data.departmentsList !== undefined) {
        await tx.ipDepartment.deleteMany({ where: { ipId: id } });
        for (const dept of data.departmentsList) {
          await tx.ipDepartment.create({
            data: {
              ipId: id,
              departmentCode: dept,
            },
          });
        }
      }

      return tx.intellectualProperty.findUnique({
        where: { id },
        include: {
          inventors: true,
          departments: { include: { department: true } },
        },
      });
    });
  }

  static async delete(id: number) {
    return prisma.intellectualProperty.delete({
      where: { id },
    });
  }
}

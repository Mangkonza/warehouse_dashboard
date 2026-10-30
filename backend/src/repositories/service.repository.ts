import { prisma } from '../db/prisma.js';

export class ServiceRepository {
  static async findAll(params: {
    search?: string;
    category?: string;
    department?: string;
    year?: number;
    page?: number;
    limit?: number;
  } = {}) {
    const { search, category, department, year, page, limit } = params;

    const where: any = {};

    if (category && category !== 'all') {
      where.serviceCategory = category;
    }

    if (department && department !== 'all') {
      where.departmentCode = department;
    }

    if (year) {
      where.fiscalYear = year;
    }

    if (search) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { providerName: { contains: q, mode: 'insensitive' } },
        { targetGroup: { contains: q, mode: 'insensitive' } },
        { serviceCategory: { contains: q, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.academicService.count({ where });

    const items = await prisma.academicService.findMany({
      where,
      include: {
        department: true,
        provider: true,
      },
      orderBy: { id: 'desc' },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit || undefined,
    });

    return { total, items };
  }

  static async findById(id: number) {
    return prisma.academicService.findUnique({
      where: { id },
      include: {
        department: true,
        provider: true,
      },
    });
  }

  static async findByLegacyId(legacyId: string) {
    return prisma.academicService.findUnique({
      where: { legacyId },
      include: {
        department: true,
        provider: true,
      },
    });
  }

  static async create(data: {
    name: string;
    serviceCategory: string;
    providerName?: string | null;
    providerPersonnelId?: number | null;
    departmentCode?: string | null;
    targetGroup?: string | null;
    hoursSpent?: number;
    attendeesCount?: number;
    date?: Date | null;
    startDate?: Date | null;
    endDate?: Date | null;
    fiscalYear?: number | null;
  }) {
    const created = await prisma.academicService.create({
      data: {
        name: data.name,
        serviceCategory: data.serviceCategory,
        providerName: data.providerName || null,
        providerPersonnelId: data.providerPersonnelId || null,
        departmentCode: data.departmentCode || null,
        targetGroup: data.targetGroup || null,
        hoursSpent: data.hoursSpent || 0,
        attendeesCount: data.attendeesCount || 0,
        date: data.date || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        fiscalYear: data.fiscalYear || null,
      },
    });

    // Update legacy_id to srv_<id>
    return prisma.academicService.update({
      where: { id: created.id },
      data: { legacyId: `srv_${created.id}` },
      include: {
        department: true,
        provider: true,
      },
    });
  }

  static async update(
    id: number,
    data: {
      name?: string;
      serviceCategory?: string;
      providerName?: string | null;
      providerPersonnelId?: number | null;
      departmentCode?: string | null;
      targetGroup?: string | null;
      hoursSpent?: number;
      attendeesCount?: number;
      date?: Date | null;
      startDate?: Date | null;
      endDate?: Date | null;
      fiscalYear?: number | null;
    }
  ) {
    return prisma.academicService.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.serviceCategory !== undefined ? { serviceCategory: data.serviceCategory } : {}),
        providerName: data.providerName !== undefined ? data.providerName : undefined,
        providerPersonnelId: data.providerPersonnelId !== undefined ? data.providerPersonnelId : undefined,
        departmentCode: data.departmentCode !== undefined ? data.departmentCode : undefined,
        targetGroup: data.targetGroup !== undefined ? data.targetGroup : undefined,
        hoursSpent: data.hoursSpent !== undefined ? data.hoursSpent : undefined,
        attendeesCount: data.attendeesCount !== undefined ? data.attendeesCount : undefined,
        date: data.date !== undefined ? data.date : undefined,
        startDate: data.startDate !== undefined ? data.startDate : undefined,
        endDate: data.endDate !== undefined ? data.endDate : undefined,
        fiscalYear: data.fiscalYear !== undefined ? data.fiscalYear : undefined,
      },
      include: {
        department: true,
        provider: true,
      },
    });
  }

  static async delete(id: number) {
    return prisma.academicService.delete({
      where: { id },
    });
  }
}

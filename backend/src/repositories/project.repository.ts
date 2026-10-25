import { prisma } from '../db/prisma.js';
import { parseSafeDate, parseSafeNumber, parseSafeInt, extractNumericId, parseSafeStringOrArray, parseSafeJsonOrString } from '../utils/sanitize.js';

export class ProjectRepository {
  // ==========================================
  // Research Projects
  // ==========================================

  static async findResearchAll(params: {
    search?: string;
    department?: string;
    status?: string;
    year?: number;
    page?: number;
    limit?: number;
  } = {}) {
    const { search, department, status, year, page, limit } = params;
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }
    if (department && department !== 'all') {
      where.OR = [
        { headDepartmentCode: department },
        { departments: { some: { departmentCode: department } } },
      ];
    }
    if (year) {
      where.fiscalYear = year;
    }
    if (search) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { code: { contains: q, mode: 'insensitive' } },
        { headName: { contains: q, mode: 'insensitive' } },
        { fundSource: { contains: q, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.researchProject.count({ where });
    const items = await prisma.researchProject.findMany({
      where,
      include: {
        members: true,
        departments: { include: { department: true } },
      },
      orderBy: { id: 'desc' },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit || undefined,
    });

    return { total, items };
  }

  static async findResearchById(identifier: string | number) {
    const numId = extractNumericId(identifier);
    if (numId !== null) {
      const item = await prisma.researchProject.findUnique({
        where: { id: numId },
        include: {
          members: true,
          departments: { include: { department: true } },
        },
      });
      if (item) return item;
    }
    const str = String(identifier);
    const byLegacy = await prisma.researchProject.findUnique({
      where: { legacyId: str },
      include: {
        members: true,
        departments: { include: { department: true } },
      },
    });
    if (byLegacy) return byLegacy;

    return prisma.researchProject.findFirst({
      where: {
        OR: [
          { code: str },
          { legacyId: str },
        ],
      },
      include: {
        members: true,
        departments: { include: { department: true } },
      },
    });
  }

  static async createResearch(data: any) {
    return prisma.$transaction(async (tx) => {
      const created = await tx.researchProject.create({
        data: {
          code: data.code || data.id || null,
          name: data.name,
          nameEn: data.nameEn || data.name_en || null,
          headName: data.headName || data.head || null,
          headDepartmentCode: data.headDepartmentCode || data.departmentCode || data.department || null,
          status: data.status || 'กำลังดำเนินการ',
          budgetInternal: parseSafeNumber(data.budgetInternal ?? data.budget_internal ?? data.budget, 0),
          budgetExternal: parseSafeNumber(data.budgetExternal ?? data.budget_external, 0),
          fundSource: data.fundSource || data.fund_source || null,
          fundType: data.fundType || data.fund_type || null,
          collaborationType: parseSafeStringOrArray(data.collaborationType ?? data.collaboration_type),
          projectNature: parseSafeStringOrArray(data.projectNature ?? data.project_nature),
          startDate: parseSafeDate(data.startDate || data.start_date),
          endDate: parseSafeDate(data.endDate || data.end_date),
          fiscalYear: parseSafeInt(data.fiscalYear ?? data.fiscal_year ?? data.fiscal_year_be),
          trlOutputs: parseSafeJsonOrString(data.trlOutputs ?? data.trl_outputs),
        },
      });

      const updated = await tx.researchProject.update({
        where: { id: created.id },
        data: { legacyId: data.id || `res_${created.id}` },
      });

      if (data.membersList && data.membersList.length > 0) {
        for (const m of data.membersList) {
          await tx.researchProjectMember.create({
            data: {
              projectId: created.id,
              personName: m,
              role: 'co_researcher',
            },
          });
        }
      }

      if (data.departmentsList && data.departmentsList.length > 0) {
        for (const d of data.departmentsList) {
          await tx.researchProjectDepartment.create({
            data: {
              projectId: created.id,
              departmentCode: d,
            },
          });
        }
      }

      return tx.researchProject.findUnique({
        where: { id: created.id },
        include: {
          members: true,
          departments: { include: { department: true } },
        },
      });
    });
  }

  static async updateResearch(id: number, data: any) {
    return prisma.$transaction(async (tx) => {
      await tx.researchProject.update({
        where: { id },
        data: {
          ...(data.code !== undefined ? { code: data.code } : {}),
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.nameEn !== undefined || data.name_en !== undefined ? { nameEn: data.nameEn || data.name_en } : {}),
          ...(data.headName !== undefined || data.head !== undefined ? { headName: data.headName || data.head } : {}),
          ...(data.headDepartmentCode !== undefined || data.departmentCode !== undefined || data.department !== undefined
            ? { headDepartmentCode: data.headDepartmentCode || data.departmentCode || data.department }
            : {}),
          ...(data.status !== undefined ? { status: data.status } : {}),
          ...(data.budgetInternal !== undefined || data.budget_internal !== undefined || data.budget !== undefined
            ? { budgetInternal: parseSafeNumber(data.budgetInternal ?? data.budget_internal ?? data.budget, 0) }
            : {}),
          ...(data.budgetExternal !== undefined || data.budget_external !== undefined
            ? { budgetExternal: parseSafeNumber(data.budgetExternal ?? data.budget_external, 0) }
            : {}),
          ...(data.fundSource !== undefined || data.fund_source !== undefined
            ? { fundSource: data.fundSource || data.fund_source }
            : {}),
          ...(data.fundType !== undefined || data.fund_type !== undefined
            ? { fundType: data.fundType || data.fund_type }
            : {}),
          ...(data.collaborationType !== undefined || data.collaboration_type !== undefined
            ? { collaborationType: parseSafeStringOrArray(data.collaborationType ?? data.collaboration_type) }
            : {}),
          ...(data.projectNature !== undefined || data.project_nature !== undefined
            ? { projectNature: parseSafeStringOrArray(data.projectNature ?? data.project_nature) }
            : {}),
          ...(data.startDate !== undefined || data.start_date !== undefined
            ? { startDate: parseSafeDate(data.startDate || data.start_date) }
            : {}),
          ...(data.endDate !== undefined || data.end_date !== undefined
            ? { endDate: parseSafeDate(data.endDate || data.end_date) }
            : {}),
          ...(data.fiscalYear !== undefined || data.fiscal_year !== undefined || data.fiscal_year_be !== undefined
            ? { fiscalYear: parseSafeInt(data.fiscalYear ?? data.fiscal_year ?? data.fiscal_year_be) }
            : {}),
          ...(data.trlOutputs !== undefined || data.trl_outputs !== undefined
            ? { trlOutputs: parseSafeJsonOrString(data.trlOutputs ?? data.trl_outputs) }
            : {}),
        },
      });

      if (data.membersList !== undefined) {
        await tx.researchProjectMember.deleteMany({ where: { projectId: id } });
        for (const m of data.membersList) {
          await tx.researchProjectMember.create({
            data: { projectId: id, personName: m, role: 'co_researcher' },
          });
        }
      }

      if (data.departmentsList !== undefined) {
        await tx.researchProjectDepartment.deleteMany({ where: { projectId: id } });
        for (const d of data.departmentsList) {
          await tx.researchProjectDepartment.create({
            data: { projectId: id, departmentCode: d },
          });
        }
      }

      return tx.researchProject.findUnique({
        where: { id },
        include: {
          members: true,
          departments: { include: { department: true } },
        },
      });
    });
  }

  static async deleteResearch(id: number) {
    return prisma.researchProject.delete({ where: { id } });
  }

  // ==========================================
  // Academic Development Projects
  // ==========================================

  static async findAcademicAll(params: {
    search?: string;
    department?: string;
    year?: number;
    page?: number;
    limit?: number;
  } = {}) {
    const { search, department, year, page, limit } = params;
    const where: any = {};

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
        { headName: { contains: q, mode: 'insensitive' } },
        { client: { contains: q, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.academicDevProject.count({ where });
    const items = await prisma.academicDevProject.findMany({
      where,
      include: { department: true },
      orderBy: { id: 'desc' },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit || undefined,
    });

    return { total, items };
  }

  static async findAcademicById(identifier: string | number) {
    const numId = extractNumericId(identifier);
    if (numId !== null) {
      const item = await prisma.academicDevProject.findUnique({
        where: { id: numId },
        include: { department: true },
      });
      if (item) return item;
    }
    return prisma.academicDevProject.findUnique({
      where: { legacyId: String(identifier) },
      include: { department: true },
    });
  }

  static async createAcademic(data: any) {
    const created = await prisma.academicDevProject.create({
      data: {
        name: data.name,
        headName: data.headName || data.head || null,
        departmentCode: data.departmentCode || data.department || null,
        client: data.client || null,
        budget: parseSafeNumber(data.budget, 0),
        month: data.month || null,
        fiscalYear: parseSafeInt(data.fiscalYear ?? data.fiscal_year),
        startDate: parseSafeDate(data.startDate ?? data.start_date),
        endDate: parseSafeDate(data.endDate ?? data.end_date),
        integrationStartDate: parseSafeDate(data.integrationStartDate ?? data.integration_start_date),
        integrationEndDate: parseSafeDate(data.integrationEndDate ?? data.integration_end_date),
      },
    });

    return prisma.academicDevProject.update({
      where: { id: created.id },
      data: { legacyId: data.id || `acad_${created.id}` },
      include: { department: true },
    });
  }

  static async updateAcademic(id: number, data: any) {
    return prisma.academicDevProject.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.headName !== undefined || data.head !== undefined ? { headName: data.headName || data.head } : {}),
        ...(data.departmentCode !== undefined || data.department !== undefined ? { departmentCode: data.departmentCode || data.department } : {}),
        ...(data.client !== undefined ? { client: data.client } : {}),
        ...(data.budget !== undefined ? { budget: parseSafeNumber(data.budget, 0) } : {}),
        ...(data.month !== undefined ? { month: data.month } : {}),
        ...(data.fiscalYear !== undefined || data.fiscal_year !== undefined ? { fiscalYear: parseSafeInt(data.fiscalYear ?? data.fiscal_year) } : {}),
        ...(data.startDate !== undefined || data.start_date !== undefined ? { startDate: parseSafeDate(data.startDate ?? data.start_date) } : {}),
        ...(data.endDate !== undefined || data.end_date !== undefined ? { endDate: parseSafeDate(data.endDate ?? data.end_date) } : {}),
        ...(data.integrationStartDate !== undefined || data.integration_start_date !== undefined ? { integrationStartDate: parseSafeDate(data.integrationStartDate ?? data.integration_start_date) } : {}),
        ...(data.integrationEndDate !== undefined || data.integration_end_date !== undefined ? { integrationEndDate: parseSafeDate(data.integrationEndDate ?? data.integration_end_date) } : {}),
      },
      include: { department: true },
    });
  }

  static async deleteAcademic(id: number) {
    return prisma.academicDevProject.delete({ where: { id } });
  }

  // ==========================================
  // Publications
  // ==========================================

  static async findPublicationsAll(params: {
    search?: string;
    department?: string;
    type?: string;
    year?: number;
    page?: number;
    limit?: number;
  } = {}) {
    const { search, department, type, year, page, limit } = params;
    const where: any = {};

    if (type && type !== 'all') {
      where.type = type;
    }
    if (department && department !== 'all') {
      where.departmentCode = department;
    }
    if (year) {
      where.fiscalYearBe = year;
    }
    if (search) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { journal: { contains: q, mode: 'insensitive' } },
        { firstAuthorName: { contains: q, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.publication.count({ where });
    const items = await prisma.publication.findMany({
      where,
      include: {
        authors: true,
        department: true,
      },
      orderBy: { id: 'desc' },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit || undefined,
    });

    return { total, items };
  }

  static async findPublicationById(identifier: string | number) {
    const numId = extractNumericId(identifier);
    if (numId !== null) {
      const item = await prisma.publication.findUnique({
        where: { id: numId },
        include: {
          authors: true,
          department: true,
        },
      });
      if (item) return item;
    }
    return prisma.publication.findUnique({
      where: { legacyId: String(identifier) },
      include: {
        authors: true,
        department: true,
      },
    });
  }

  static async createPublication(data: any) {
    return prisma.$transaction(async (tx) => {
      const created = await tx.publication.create({
        data: {
          title: data.title,
          type: data.type || null,
          level: data.level || null,
          journal: data.journal || null,
          volume: data.volume || null,
          issue: data.issue || null,
          pageStart: data.pageStart || data.page_start || null,
          pageEnd: data.pageEnd || data.page_end || null,
          budget: parseSafeNumber(data.budget, 0),
          firstAuthorName: data.firstAuthorName || data.first_author || data.owner || null,
          departmentCode: data.departmentCode || data.department || null,
          fiscalYearBe: parseSafeInt(data.fiscalYearBe ?? data.fiscal_year_be),
          month: data.month || null,
          monthYear: data.monthYear || data.month_year || null,
          status: data.status || 'ตีพิมพ์',
          remarks: data.remarks || null,
        },
      });

      const updated = await tx.publication.update({
        where: { id: created.id },
        data: { legacyId: data.id || `pub_${created.id}` },
      });

      if (data.authorsList && data.authorsList.length > 0) {
        for (const a of data.authorsList) {
          await tx.publicationAuthor.create({
            data: {
              publicationId: created.id,
              personName: a.name,
              affiliationType: a.type || 'internal',
            },
          });
        }
      }

      return tx.publication.findUnique({
        where: { id: created.id },
        include: {
          authors: true,
          department: true,
        },
      });
    });
  }

  static async updatePublication(id: number, data: any) {
    return prisma.$transaction(async (tx) => {
      await tx.publication.update({
        where: { id },
        data: {
          ...(data.title !== undefined ? { title: data.title } : {}),
          ...(data.type !== undefined ? { type: data.type } : {}),
          ...(data.level !== undefined ? { level: data.level } : {}),
          ...(data.journal !== undefined ? { journal: data.journal } : {}),
          ...(data.volume !== undefined ? { volume: data.volume } : {}),
          ...(data.issue !== undefined ? { issue: data.issue } : {}),
          ...(data.pageStart !== undefined || data.page_start !== undefined ? { pageStart: data.pageStart || data.page_start } : {}),
          ...(data.pageEnd !== undefined || data.page_end !== undefined ? { pageEnd: data.pageEnd || data.page_end } : {}),
          ...(data.budget !== undefined ? { budget: parseSafeNumber(data.budget, 0) } : {}),
          ...(data.firstAuthorName !== undefined || data.first_author !== undefined || data.owner !== undefined
            ? { firstAuthorName: data.firstAuthorName || data.first_author || data.owner }
            : {}),
          ...(data.departmentCode !== undefined || data.department !== undefined ? { departmentCode: data.departmentCode || data.department } : {}),
          ...(data.fiscalYearBe !== undefined || data.fiscal_year_be !== undefined ? { fiscalYearBe: parseSafeInt(data.fiscalYearBe ?? data.fiscal_year_be) } : {}),
          ...(data.month !== undefined ? { month: data.month } : {}),
          ...(data.monthYear !== undefined || data.month_year !== undefined ? { monthYear: data.monthYear || data.month_year } : {}),
          ...(data.status !== undefined ? { status: data.status } : {}),
          ...(data.remarks !== undefined ? { remarks: data.remarks } : {}),
        },
      });

      if (data.authorsList !== undefined) {
        await tx.publicationAuthor.deleteMany({ where: { publicationId: id } });
        for (const a of data.authorsList) {
          await tx.publicationAuthor.create({
            data: {
              publicationId: id,
              personName: a.name,
              affiliationType: a.type || 'internal',
            },
          });
        }
      }

      return tx.publication.findUnique({
        where: { id },
        include: {
          authors: true,
          department: true,
        },
      });
    });
  }

  static async deletePublication(id: number) {
    return prisma.publication.delete({ where: { id } });
  }
}

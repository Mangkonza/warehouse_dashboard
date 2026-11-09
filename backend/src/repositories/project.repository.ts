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
      include: { members: true, departments: { include: { department: true } }, headPersonnel: true },
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
        include: { members: true, departments: { include: { department: true } }, headPersonnel: true },
      });
      if (item) return item;
    }
    const str = String(identifier).trim();
    const byLegacy = await prisma.researchProject.findUnique({
      where: { legacyId: str },
      include: { members: true, departments: { include: { department: true } }, headPersonnel: true },
    });
    if (byLegacy) return byLegacy;

    return prisma.researchProject.findFirst({
      where: {
        OR: [
          { code: str },
          { legacyId: str },
          { name: str },
        ],
      },
      include: { members: true, departments: { include: { department: true } }, headPersonnel: true },
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
          trlStart: parseSafeInt(data.trlStart ?? data.trl_start),
          trlEnd: parseSafeInt(data.trlEnd ?? data.trl_end),
          trlOutputs: parseSafeJsonOrString(data.trlOutputs ?? data.trl_outputs),
          teachingCourses: parseSafeJsonOrString(data.teachingCourses ?? data.teaching_courses),
          appliedCourses: parseSafeJsonOrString(data.appliedCourses ?? data.applied_courses),
          academicService: data.academicService ?? data.academic_service ?? null,
          crossDisciplinary: data.crossDisciplinary ?? data.cross_disciplinary ?? null,
          integration: data.integration || null,
          remarks: data.remarks || null,
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
        include: { members: true, departments: { include: { department: true } }, headPersonnel: true },
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
          ...(data.trlStart !== undefined || data.trl_start !== undefined
            ? { trlStart: parseSafeInt(data.trlStart ?? data.trl_start) }
            : {}),
          ...(data.trlEnd !== undefined || data.trl_end !== undefined
            ? { trlEnd: parseSafeInt(data.trlEnd ?? data.trl_end) }
            : {}),
          ...(data.teachingCourses !== undefined || data.teaching_courses !== undefined
            ? { teachingCourses: parseSafeJsonOrString(data.teachingCourses ?? data.teaching_courses) }
            : {}),
          ...(data.appliedCourses !== undefined || data.applied_courses !== undefined
            ? { appliedCourses: parseSafeJsonOrString(data.appliedCourses ?? data.applied_courses) }
            : {}),
          ...(data.academicService !== undefined || data.academic_service !== undefined
            ? { academicService: data.academicService ?? data.academic_service }
            : {}),
          ...(data.crossDisciplinary !== undefined || data.cross_disciplinary !== undefined
            ? { crossDisciplinary: data.crossDisciplinary ?? data.cross_disciplinary }
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
        include: { members: true, departments: { include: { department: true } }, headPersonnel: true },
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
      include: { department: true, headPersonnel: true },
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
        include: { department: true, headPersonnel: true },
      });
      if (item) return item;
    }
    const str = String(identifier).trim();
    const byLegacy = await prisma.academicDevProject.findUnique({
      where: { legacyId: str },
      include: { department: true, headPersonnel: true },
    });
    if (byLegacy) return byLegacy;

    return prisma.academicDevProject.findFirst({
      where: {
        OR: [
          { legacyId: str },
          { name: str },
        ],
      },
      include: { department: true, headPersonnel: true },
    });
  }

  static async createAcademic(data: any) {
    const legacyId = data.legacyId || data.legacy_id || data._id || data.id || null;
    const created = await prisma.academicDevProject.create({
      data: {
        ...(legacyId ? { legacyId } : {}),
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
        recordNumber: data.recordNumber ?? data.record_number ?? data.registration_code ?? null,
        coMembersInternal: parseSafeInt(data.coMembersInternal ?? data.co_members_internal),
        coMembersExternal: parseSafeInt(data.coMembersExternal ?? data.co_members_external),
        allocOverhead: parseSafeNumber(data.allocOverhead ?? data.alloc_overhead, 0),
        allocFaculty: parseSafeNumber(data.allocFaculty ?? data.alloc_faculty, 0),
        allocDept: parseSafeNumber(data.allocDept ?? data.alloc_dept, 0),
        allocKu: parseSafeNumber(data.allocKu ?? data.alloc_ku, 0),
        allocRemaining: parseSafeNumber(data.allocRemaining ?? data.alloc_remaining, 0),
        serviceReceiverType: data.serviceReceiverType ?? data.service_receiver_type ?? null,
        researchIntegration: data.researchIntegration ?? data.research_integration ?? null,
        patentIntegration: data.patentIntegration ?? data.patent_integration ?? null,
        projectTypeCategory: data.projectTypeCategory ?? data.project_type_category ?? (Array.isArray(data.project_type_categories) ? data.project_type_categories[0] : null) ?? null,
        projectSubTypes: parseSafeJsonOrString(data.projectSubTypes ?? data.project_sub_types),
        researchProjects: parseSafeJsonOrString(data.researchProjects ?? data.research_projects),
        characteristics: parseSafeStringOrArray(data.characteristics ?? data.project_nature),
        status: data.status || 'ดำเนินการ',
        remarks: data.remarks || null,
      },
    });

    return prisma.academicDevProject.update({
      where: { id: created.id },
      data: { legacyId: data.id || `acad_${created.id}` },
      include: { department: true, headPersonnel: true },
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
        ...(data.recordNumber !== undefined || data.record_number !== undefined || data.registration_code !== undefined ? { recordNumber: data.recordNumber ?? data.record_number ?? data.registration_code } : {}),
        ...(data.coMembersInternal !== undefined || data.co_members_internal !== undefined ? { coMembersInternal: parseSafeInt(data.coMembersInternal ?? data.co_members_internal) } : {}),
        ...(data.coMembersExternal !== undefined || data.co_members_external !== undefined ? { coMembersExternal: parseSafeInt(data.coMembersExternal ?? data.co_members_external) } : {}),
        ...(data.allocOverhead !== undefined || data.alloc_overhead !== undefined ? { allocOverhead: parseSafeNumber(data.allocOverhead ?? data.alloc_overhead, 0) } : {}),
        ...(data.allocFaculty !== undefined || data.alloc_faculty !== undefined ? { allocFaculty: parseSafeNumber(data.allocFaculty ?? data.alloc_faculty, 0) } : {}),
        ...(data.allocDept !== undefined || data.alloc_dept !== undefined ? { allocDept: parseSafeNumber(data.allocDept ?? data.alloc_dept, 0) } : {}),
        ...(data.allocKu !== undefined || data.alloc_ku !== undefined ? { allocKu: parseSafeNumber(data.allocKu ?? data.alloc_ku, 0) } : {}),
        ...(data.allocRemaining !== undefined || data.alloc_remaining !== undefined ? { allocRemaining: parseSafeNumber(data.allocRemaining ?? data.alloc_remaining, 0) } : {}),
        ...(data.serviceReceiverType !== undefined || data.service_receiver_type !== undefined ? { serviceReceiverType: data.serviceReceiverType ?? data.service_receiver_type } : {}),
        ...(data.researchIntegration !== undefined || data.research_integration !== undefined ? { researchIntegration: data.researchIntegration ?? data.research_integration } : {}),
        ...(data.patentIntegration !== undefined || data.patent_integration !== undefined ? { patentIntegration: data.patentIntegration ?? data.patent_integration } : {}),
        ...(data.projectTypeCategory !== undefined || data.project_type_category !== undefined || data.project_type_categories !== undefined
          ? { projectTypeCategory: data.projectTypeCategory ?? data.project_type_category ?? (Array.isArray(data.project_type_categories) ? data.project_type_categories[0] : null) }
          : {}),
        ...(data.projectSubTypes !== undefined || data.project_sub_types !== undefined
          ? { projectSubTypes: parseSafeJsonOrString(data.projectSubTypes ?? data.project_sub_types) }
          : {}),
        ...(data.researchProjects !== undefined || data.research_projects !== undefined
          ? { researchProjects: parseSafeJsonOrString(data.researchProjects ?? data.research_projects) }
          : {}),
        ...(data.characteristics !== undefined || data.project_nature !== undefined ? { characteristics: parseSafeStringOrArray(data.characteristics ?? data.project_nature) } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.remarks !== undefined ? { remarks: data.remarks } : {}),
      },
      include: { department: true, headPersonnel: true },
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
      include: { authors: { include: { personnel: true } }, department: true },
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
        include: { authors: { include: { personnel: true } }, department: true },
      });
      if (item) return item;
    }
    const str = String(identifier).trim();
    const byLegacy = await prisma.publication.findUnique({
      where: { legacyId: str },
      include: { authors: { include: { personnel: true } }, department: true },
    });
    if (byLegacy) return byLegacy;

    return prisma.publication.findFirst({
      where: {
        OR: [
          { legacyId: str },
          { title: str },
        ],
      },
      include: { authors: { include: { personnel: true } }, department: true },
    });
  }

  static async createPublication(data: any) {
    return prisma.$transaction(async (tx) => {
      const coAuthorsDomestic = Array.isArray(data.co_authors_domestic ?? data.coAuthorsDomestic)
        ? (data.co_authors_domestic ?? data.coAuthorsDomestic).map((x: any) => String(x).trim()).filter(Boolean).join(', ')
        : (data.co_authors_domestic || data.coAuthorsDomestic || null);

      const coAuthorsForeign = Array.isArray(data.co_authors_foreign ?? data.coAuthorsForeign)
        ? (data.co_authors_foreign ?? data.coAuthorsForeign).map((x: any) => String(x).trim()).filter(Boolean).join(', ')
        : (data.co_authors_foreign || data.coAuthorsForeign || null);

      const isPatent = data.type === 'เตรียมความพร้อมจดอนุสิทธิบัตร';
      const isPrep = data.type === 'เตรียมความพร้อมตีพิมพ์' || data.type === 'เตรียมความพร้อม';

      let journal = String(data.journal || '').trim() || (isPatent ? 'อนุสิทธิบัตร' : isPrep ? 'เตรียมความพร้อมตีพิมพ์' : 'ไม่ระบุ');
      let volume = String(data.volume || '').trim() || '1';
      let issue = String(data.issue || '').trim() || '1';
      let pageStart = String(data.pageStart || data.page_start || '').trim() || '1';
      let pageEnd = String(data.pageEnd || data.page_end || '').trim() || pageStart;

      const numStart = parseInt(pageStart, 10);
      const numEnd = parseInt(pageEnd, 10);
      if (!isNaN(numStart) && !isNaN(numEnd) && numEnd < numStart) {
        pageEnd = pageStart;
      }

      const monthYear = data.monthYear || data.month_year || null;
      let fiscalYearBe = parseSafeInt(data.fiscalYearBe ?? data.fiscal_year_be ?? data.year ?? data.fiscal_year);
      if (!fiscalYearBe && monthYear) {
        const beMatch = String(monthYear).match(/(25\d{2})/);
        if (beMatch) {
          fiscalYearBe = parseInt(beMatch[1], 10);
        } else {
          const ceMatch = String(monthYear).match(/(20\d{2})/);
          if (ceMatch) fiscalYearBe = parseInt(ceMatch[1], 10) + 543;
        }
      }
      if (!fiscalYearBe) {
        fiscalYearBe = new Date().getFullYear() + 543;
      }

      let month = data.month || null;
      if (!month && monthYear) {
        const thaiMonths = [
          'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
          'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
          'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
          'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
        ];
        for (const tm of thaiMonths) {
          if (String(monthYear).includes(tm)) {
            month = tm;
            break;
          }
        }
      }

      const firstAuthorPersonnelId = parseSafeInt(
        data.firstAuthorPersonnelId ?? data.first_author_personnel_id ?? data.owner_id ?? data.person_id
      );

      const created = await tx.publication.create({
        data: {
          title: data.title,
          type: data.type || null,
          level: data.level || null,
          journal,
          volume,
          issue,
          pageStart,
          pageEnd,
          budget: parseSafeNumber(data.budget, 0),
          firstAuthorName: data.firstAuthorName || data.first_author || data.owner || null,
          firstAuthorPersonnelId,
          departmentCode: data.departmentCode || data.department || null,
          fiscalYearBe,
          month,
          monthYear,
          quartile: data.quartile || null,
          coAuthorsDomestic,
          coAuthorsForeign,
          hasInternationalCoauthor: Boolean(data.has_international_coauthor || data.hasInternationalCoauthor || data.has_foreign_coauthor || data.hasForeignCoauthor),
          hasDomesticCoauthor: Boolean(data.has_domestic_coauthor || data.hasDomesticCoauthor),
          hasForeignCoauthor: Boolean(data.has_foreign_coauthor || data.hasForeignCoauthor || data.has_international_coauthor || data.hasInternationalCoauthor),
          status: data.status || 'ตีพิมพ์',
          remarks: data.remarks || null,
        },
      });

      let legacyId = data.legacyId || (typeof data.id === 'string' && data.id.startsWith('pub-') ? data.id : `pub_${created.id}`);
      try {
        await tx.publication.update({
          where: { id: created.id },
          data: { legacyId },
        });
      } catch {
        legacyId = `pub_${created.id}_${Date.now()}`;
        await tx.publication.update({
          where: { id: created.id },
          data: { legacyId },
        });
      }

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
        include: { authors: { include: { personnel: true } }, department: true },
      });
    });
  }

  static async updatePublication(id: number, data: any) {
    return prisma.$transaction(async (tx) => {
      const coAuthorsDomestic = data.co_authors_domestic !== undefined || data.coAuthorsDomestic !== undefined
        ? (Array.isArray(data.co_authors_domestic ?? data.coAuthorsDomestic)
            ? (data.co_authors_domestic ?? data.coAuthorsDomestic).map((x: any) => String(x).trim()).filter(Boolean).join(', ')
            : (data.co_authors_domestic || data.coAuthorsDomestic || null))
        : undefined;

      const coAuthorsForeign = data.co_authors_foreign !== undefined || data.coAuthorsForeign !== undefined
        ? (Array.isArray(data.co_authors_foreign ?? data.coAuthorsForeign)
            ? (data.co_authors_foreign ?? data.coAuthorsForeign).map((x: any) => String(x).trim()).filter(Boolean).join(', ')
            : (data.co_authors_foreign || data.coAuthorsForeign || null))
        : undefined;

      let updatePageStart = data.pageStart !== undefined || data.page_start !== undefined 
        ? String(data.pageStart || data.page_start || '').trim() || '1' 
        : undefined;
      let updatePageEnd = data.pageEnd !== undefined || data.page_end !== undefined 
        ? String(data.pageEnd || data.page_end || '').trim() || updatePageStart || '1' 
        : undefined;

      if (updatePageStart && updatePageEnd) {
        const numStart = parseInt(updatePageStart, 10);
        const numEnd = parseInt(updatePageEnd, 10);
        if (!isNaN(numStart) && !isNaN(numEnd) && numEnd < numStart) {
          updatePageEnd = updatePageStart;
        }
      }

      const monthYear = data.monthYear || data.month_year;
      let fiscalYearBe = data.fiscalYearBe !== undefined || data.fiscal_year_be !== undefined || data.year !== undefined || data.fiscal_year !== undefined
        ? parseSafeInt(data.fiscalYearBe ?? data.fiscal_year_be ?? data.year ?? data.fiscal_year)
        : undefined;
      if (fiscalYearBe === undefined && monthYear) {
        const beMatch = String(monthYear).match(/(25\d{2})/);
        if (beMatch) {
          fiscalYearBe = parseInt(beMatch[1], 10);
        } else {
          const ceMatch = String(monthYear).match(/(20\d{2})/);
          if (ceMatch) fiscalYearBe = parseInt(ceMatch[1], 10) + 543;
        }
      }

      let month = data.month;
      if (month === undefined && monthYear) {
        const thaiMonths = [
          'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
          'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
          'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
          'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
        ];
        for (const tm of thaiMonths) {
          if (String(monthYear).includes(tm)) {
            month = tm;
            break;
          }
        }
      }

      const firstAuthorPersonnelId = data.firstAuthorPersonnelId !== undefined || data.first_author_personnel_id !== undefined || data.owner_id !== undefined || data.person_id !== undefined
        ? parseSafeInt(data.firstAuthorPersonnelId ?? data.first_author_personnel_id ?? data.owner_id ?? data.person_id)
        : undefined;

      await tx.publication.update({
        where: { id },
        data: {
          ...(data.title !== undefined ? { title: data.title } : {}),
          ...(data.type !== undefined ? { type: data.type } : {}),
          ...(data.level !== undefined ? { level: data.level } : {}),
          ...(data.journal !== undefined ? { journal: data.journal } : {}),
          ...(data.volume !== undefined ? { volume: String(data.volume || '').trim() || '1' } : {}),
          ...(data.issue !== undefined ? { issue: String(data.issue || '').trim() || '1' } : {}),
          ...(updatePageStart !== undefined ? { pageStart: updatePageStart } : {}),
          ...(updatePageEnd !== undefined ? { pageEnd: updatePageEnd } : {}),
          ...(data.budget !== undefined ? { budget: parseSafeNumber(data.budget, 0) } : {}),
          ...(data.firstAuthorName !== undefined || data.first_author !== undefined || data.owner !== undefined
            ? { firstAuthorName: data.firstAuthorName || data.first_author || data.owner }
            : {}),
          ...(firstAuthorPersonnelId !== undefined ? { firstAuthorPersonnelId } : {}),
          ...(data.departmentCode !== undefined || data.department !== undefined ? { departmentCode: data.departmentCode || data.department } : {}),
          ...(fiscalYearBe !== undefined ? { fiscalYearBe } : {}),
          ...(month !== undefined ? { month } : {}),
          ...(monthYear !== undefined ? { monthYear } : {}),
          ...(coAuthorsDomestic !== undefined ? { coAuthorsDomestic } : {}),
          ...(coAuthorsForeign !== undefined ? { coAuthorsForeign } : {}),
          ...(data.has_international_coauthor !== undefined || data.hasInternationalCoauthor !== undefined || data.has_foreign_coauthor !== undefined || data.hasForeignCoauthor !== undefined
            ? { hasInternationalCoauthor: Boolean(data.has_international_coauthor || data.hasInternationalCoauthor || data.has_foreign_coauthor || data.hasForeignCoauthor) }
            : {}),
          ...(data.has_domestic_coauthor !== undefined || data.hasDomesticCoauthor !== undefined
            ? { hasDomesticCoauthor: Boolean(data.has_domestic_coauthor || data.hasDomesticCoauthor) }
            : {}),
          ...(data.has_foreign_coauthor !== undefined || data.hasForeignCoauthor !== undefined
            ? { hasForeignCoauthor: Boolean(data.has_foreign_coauthor || data.hasForeignCoauthor) }
            : {}),
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
        include: { authors: { include: { personnel: true } }, department: true },
      });
    });
  }

  static async deletePublication(id: number) {
    return prisma.publication.delete({ where: { id } });
  }
}

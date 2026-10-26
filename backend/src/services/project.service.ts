import { ProjectRepository } from '../repositories/project.repository.js';

const DEPT_MAP: Record<string, string> = {
  'การบิน': 'AE',
  'โยธา': 'CE',
  'คอมพิวเตอร์': 'CPE',
  'ไฟฟ้า': 'EEEC',
  'สิ่งแวดล้อม': 'EEEC',
  'พลังงาน': 'EEEC',
  'อาหาร': 'FE',
  'อุตสาหการ': 'IE',
  'เครื่องกล': 'ME',
  'ชลประทาน': 'IRE',
  'ทรัพยากรน้ำ': 'IRE',
  'ประตู': 'DWT',
  'เกษตร': 'NAMC',
  'สำนักงาน': 'OFS',
};

export function resolveDeptCode(input?: string): string | null {
  if (!input) return null;
  const s = input.trim();
  const validCodes = ['AE', 'CE', 'CPE', 'DWT', 'EEEC', 'FE', 'IE', 'IRE', 'ME', 'NAMC', 'OFS', 'OTH'];
  if (validCodes.includes(s.toUpperCase())) return s.toUpperCase();
  for (const [kw, code] of Object.entries(DEPT_MAP)) {
    if (s.includes(kw)) return code;
  }
  return null;
}

// Formatters preserving UI expected shape
function formatResearch(item: any) {
  if (!item) return null;
  const membersStr = item.members && item.members.length > 0
    ? item.members.map((m: any) => m.personName).join(', ')
    : '';
  const deptsStr = item.departments && item.departments.length > 0
    ? item.departments.map((d: any) => d.department?.nameTh || d.departmentCode).join(', ')
    : item.headDepartmentCode || '';

  return {
    _id: item.legacyId || `res_${item.id}`,
    id: item.code || item.legacyId || `res_${item.id}`,
    dbId: item.id,
    name: item.name,
    name_en: item.nameEn || '',
    head: item.headName || '',
    head_id: item.headPersonnelId || '',
    department: item.headDepartmentCode || deptsStr,
    departments: deptsStr,
    status: item.status || 'กำลังดำเนินการ',
    members: membersStr,
    co_researchers: membersStr,
    budget_internal: Number(item.budgetInternal || 0),
    budget_external: Number(item.budgetExternal || 0),
    budget: Number(item.budgetInternal || 0) + Number(item.budgetExternal || 0),
    fund_source: item.fundSource || '',
    fund_type: item.fundType || '',
    collaboration_type: item.collaborationType
      ? (item.collaborationType.includes(',')
          ? item.collaborationType.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [item.collaborationType.trim()].filter(Boolean))
      : [],
    project_nature: item.projectNature
      ? (item.projectNature.includes(',')
          ? item.projectNature.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [item.projectNature.trim()].filter(Boolean))
      : [],
    start_date: item.startDate ? item.startDate.toISOString().split('T')[0] : '',
    end_date: item.endDate ? item.endDate.toISOString().split('T')[0] : '',
    fiscal_year: item.fiscalYear || '',
    trl_outputs: item.trlOutputs || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function formatAcademic(item: any) {
  if (!item) return null;
  return {
    _id: item.legacyId || `acad_${item.id}`,
    id: item.legacyId || `acad_${item.id}`,
    dbId: item.id,
    name: item.name,
    head: item.headName || '',
    head_id: item.headPersonnelId || '',
    department: item.department?.nameTh || item.departmentCode || '',
    departmentCode: item.departmentCode || '',
    client: item.client || '',
    budget: Number(item.budget || 0),
    month: item.month || '',
    fiscal_year: item.fiscalYear || '',
    start_date: item.startDate ? item.startDate.toISOString().split('T')[0] : '',
    end_date: item.endDate ? item.endDate.toISOString().split('T')[0] : '',
    integration_start_date: item.integrationStartDate ? item.integrationStartDate.toISOString().split('T')[0] : '',
    integration_end_date: item.integrationEndDate ? item.integrationEndDate.toISOString().split('T')[0] : '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function formatPublication(item: any) {
  if (!item) return null;
  const domesticStr = item.authors && item.authors.length > 0
    ? item.authors.filter((a: any) => a.affiliationType === 'domestic').map((a: any) => a.personName).join(', ')
    : '';
  const foreignStr = item.authors && item.authors.length > 0
    ? item.authors.filter((a: any) => a.affiliationType === 'foreign').map((a: any) => a.personName).join(', ')
    : '';

  return {
    _id: item.legacyId || `pub_${item.id}`,
    id: item.legacyId || `pub_${item.id}`,
    dbId: item.id,
    name: item.title,
    title: item.title,
    type: item.type || '',
    level: item.level || '',
    budget: Number(item.budget || 0),
    owner: item.firstAuthorName || '',
    first_author: item.firstAuthorName || '',
    co_authors_domestic: domesticStr,
    co_authors_foreign: foreignStr,
    department: item.department?.nameTh || item.departmentCode || '',
    departmentCode: item.departmentCode || '',
    journal: item.journal || '',
    volume: item.volume || '',
    issue: item.issue || '',
    page_start: item.pageStart || '',
    page_end: item.pageEnd || '',
    fiscal_year_be: item.fiscalYearBe || '',
    month: item.month || '',
    month_year: item.monthYear || '',
    status: item.status || 'ตีพิมพ์',
    remarks: item.remarks || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export class ProjectService {
  // --- Research ---
  static async getResearchList(query: any = {}) {
    const { total, items } = await ProjectRepository.findResearchAll({
      search: query.search ? String(query.search) : undefined,
      department: query.department ? String(query.department) : undefined,
      status: query.status ? String(query.status) : undefined,
      year: query.year ? parseInt(String(query.year), 10) : undefined,
      page: query.page ? parseInt(String(query.page), 10) : undefined,
      limit: query.limit ? parseInt(String(query.limit), 10) : undefined,
    });
    return { status: 'success', category: 'research', total, data: items.map(formatResearch) };
  }

  static async createResearch(body: any) {
    const name = String(body.name || '').trim();
    if (!name) {
      const err: any = new Error('กรุณากรอกชื่อโครงการวิจัย');
      err.status = 400;
      throw err;
    }
    const headDept = resolveDeptCode(body.department || body.headDepartmentCode || body.head_department || body.departmentCode);
    const rawDepts = Array.isArray(body.departments)
      ? body.departments
      : body.departments || body.department
      ? String(body.departments || body.department).split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const departmentsList = Array.from(new Set(rawDepts.map(resolveDeptCode).filter(Boolean))) as string[];
    if (headDept && !departmentsList.includes(headDept)) {
      departmentsList.push(headDept);
    }

    const membersList = Array.isArray(body.members)
      ? body.members
      : body.members || body.co_researchers
      ? String(body.members || body.co_researchers).split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const created = await ProjectRepository.createResearch({
      ...body,
      name,
      headDepartmentCode: headDept,
      membersList,
      departmentsList,
    });
    return formatResearch(created);
  }

  static async updateResearch(identifier: string | number, body: any) {
    let existing = await ProjectRepository.findResearchById(identifier);
    if (!existing && body.name) {
      existing = await prisma.researchProject.findFirst({
        where: { name: body.name },
        include: {
          members: true,
          departments: { include: { department: true } },
        },
      });
    }
    if (!existing) {
      if (body.name) {
        return this.createResearch(body);
      }
      const err: any = new Error('ไม่พบข้อมูลโครงการวิจัย');
      err.status = 404;
      throw err;
    }
    const headDept = body.department !== undefined || body.headDepartmentCode !== undefined || body.departmentCode !== undefined
      ? resolveDeptCode(body.department || body.headDepartmentCode || body.departmentCode)
      : undefined;

    const membersList = body.members !== undefined || body.co_researchers !== undefined
      ? (Array.isArray(body.members || body.co_researchers)
          ? (body.members || body.co_researchers)
          : String(body.members || body.co_researchers).split(',').map((s) => s.trim()).filter(Boolean))
      : undefined;

    let departmentsList: string[] | undefined = undefined;
    if (body.departments !== undefined || body.department !== undefined) {
      const raw = Array.isArray(body.departments)
        ? body.departments
        : String(body.departments || body.department).split(',').map((s) => s.trim()).filter(Boolean);
      departmentsList = Array.from(new Set(raw.map(resolveDeptCode).filter(Boolean))) as string[];
      if (headDept && !departmentsList.includes(headDept)) {
        departmentsList.push(headDept);
      }
    }

    const updated = await ProjectRepository.updateResearch(existing.id, {
      ...body,
      ...(headDept !== undefined ? { headDepartmentCode: headDept } : {}),
      membersList,
      departmentsList,
    });
    return formatResearch(updated);
  }

  static async deleteResearch(identifier: string | number) {
    const existing = await ProjectRepository.findResearchById(identifier);
    if (!existing) {
      const err: any = new Error('ไม่พบข้อมูลโครงการวิจัย');
      err.status = 404;
      throw err;
    }
    await ProjectRepository.deleteResearch(existing.id);
    return { id: existing.legacyId || String(existing.id) };
  }

  // --- Academic ---
  static async getAcademicList(query: any = {}) {
    const { total, items } = await ProjectRepository.findAcademicAll({
      search: query.search ? String(query.search) : undefined,
      department: query.department ? String(query.department) : undefined,
      year: query.year ? parseInt(String(query.year), 10) : undefined,
      page: query.page ? parseInt(String(query.page), 10) : undefined,
      limit: query.limit ? parseInt(String(query.limit), 10) : undefined,
    });
    return { status: 'success', category: 'academic', total, data: items.map(formatAcademic) };
  }

  static async createAcademic(body: any) {
    const name = String(body.name || '').trim();
    if (!name) {
      const err: any = new Error('กรุณากรอกชื่อโครงการพัฒนาวิชาการ');
      err.status = 400;
      throw err;
    }
    const deptCode = resolveDeptCode(body.departmentCode || body.department_code || body.department);
    const created = await ProjectRepository.createAcademic({
      ...body,
      name,
      departmentCode: deptCode,
    });
    return formatAcademic(created);
  }

  static async updateAcademic(identifier: string | number, body: any) {
    let existing = await ProjectRepository.findAcademicById(identifier);
    if (!existing && body.name) {
      existing = await prisma.academicDevProject.findFirst({
        where: { name: body.name },
      });
    }
    if (!existing) {
      if (body.name) {
        return this.createAcademic(body);
      }
      const err: any = new Error('ไม่พบข้อมูลโครงการพัฒนาวิชาการ');
      err.status = 404;
      throw err;
    }
    const deptCode = body.departmentCode !== undefined || body.department !== undefined
      ? resolveDeptCode(body.departmentCode || body.department)
      : undefined;

    const updated = await ProjectRepository.updateAcademic(existing.id, {
      ...body,
      ...(deptCode !== undefined ? { departmentCode: deptCode } : {}),
    });
    return formatAcademic(updated);
  }

  static async deleteAcademic(identifier: string | number) {
    const existing = await ProjectRepository.findAcademicById(identifier);
    if (!existing) {
      const err: any = new Error('ไม่พบข้อมูลโครงการพัฒนาวิชาการ');
      err.status = 404;
      throw err;
    }
    await ProjectRepository.deleteAcademic(existing.id);
    return { id: existing.legacyId || String(existing.id) };
  }

  // --- Publications ---
  static async getPublicationList(query: any = {}) {
    const { total, items } = await ProjectRepository.findPublicationsAll({
      search: query.search ? String(query.search) : undefined,
      department: query.department ? String(query.department) : undefined,
      type: query.type ? String(query.type) : undefined,
      year: query.year ? parseInt(String(query.year), 10) : undefined,
      page: query.page ? parseInt(String(query.page), 10) : undefined,
      limit: query.limit ? parseInt(String(query.limit), 10) : undefined,
    });
    return { status: 'success', category: 'publications', total, data: items.map(formatPublication) };
  }

  static async createPublication(body: any) {
    const title = String(body.title || body.name || '').trim();
    if (!title) {
      const err: any = new Error('กรุณากรอกชื่อเรื่อง / ผลงานตีพิมพ์');
      err.status = 400;
      throw err;
    }
    const deptCode = resolveDeptCode(body.departmentCode || body.department_code || body.department);
    const authorsList: { name: string; type: string }[] = [];
    if (body.owner || body.first_author) {
      authorsList.push({ name: String(body.owner || body.first_author).trim(), type: 'internal' });
    }
    if (body.co_authors_domestic) {
      String(body.co_authors_domestic).split(',').map((s) => s.trim()).filter(Boolean).forEach((name) => {
        authorsList.push({ name, type: 'domestic' });
      });
    }
    if (body.co_authors_foreign) {
      String(body.co_authors_foreign).split(',').map((s) => s.trim()).filter(Boolean).forEach((name) => {
        authorsList.push({ name, type: 'foreign' });
      });
    }

    const created = await ProjectRepository.createPublication({
      ...body,
      title,
      departmentCode: deptCode,
      authorsList,
    });
    return formatPublication(created);
  }

  static async updatePublication(identifier: string | number, body: any) {
    const existing = await ProjectRepository.findPublicationById(identifier);
    if (!existing) {
      const err: any = new Error('ไม่พบข้อมูลผลงานตีพิมพ์');
      err.status = 404;
      throw err;
    }
    const deptCode = body.departmentCode !== undefined || body.department !== undefined
      ? resolveDeptCode(body.departmentCode || body.department)
      : undefined;

    let authorsList: { name: string; type: string }[] | undefined = undefined;
    if (body.owner !== undefined || body.co_authors_domestic !== undefined || body.co_authors_foreign !== undefined) {
      authorsList = [];
      const owner = body.owner !== undefined ? body.owner : existing.firstAuthorName;
      if (owner) authorsList.push({ name: String(owner).trim(), type: 'internal' });
      if (body.co_authors_domestic) {
        String(body.co_authors_domestic).split(',').map((s) => s.trim()).filter(Boolean).forEach((name) => {
          authorsList!.push({ name, type: 'domestic' });
        });
      }
      if (body.co_authors_foreign) {
        String(body.co_authors_foreign).split(',').map((s) => s.trim()).filter(Boolean).forEach((name) => {
          authorsList!.push({ name, type: 'foreign' });
        });
      }
    }

    const updated = await ProjectRepository.updatePublication(existing.id, {
      ...body,
      title: body.title !== undefined || body.name !== undefined ? String(body.title || body.name).trim() : undefined,
      ...(deptCode !== undefined ? { departmentCode: deptCode } : {}),
      authorsList,
    });
    return formatPublication(updated);
  }

  static async deletePublication(identifier: string | number) {
    const existing = await ProjectRepository.findPublicationById(identifier);
    if (!existing) {
      const err: any = new Error('ไม่พบข้อมูลผลงานตีพิมพ์');
      err.status = 404;
      throw err;
    }
    await ProjectRepository.deletePublication(existing.id);
    return { id: existing.legacyId || String(existing.id) };
  }
}

import { prisma } from '../db/prisma.js';
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
  'ชลประทาน': 'IRRE',
  'ทรัพยากรน้ำ': 'IRRE',
  'ประตู': 'TDWCB',
  'เกษตร': 'NAMC',
  'สำนักงาน': 'OFS',
};

export function resolveDeptCode(input?: string): string | null {
  if (!input) return null;
  const s = input.trim();
  const validCodes = ['AE', 'CE', 'CPE', 'DWT', 'EEEC', 'FE', 'IE', 'IRE', 'IRRE', 'ME', 'NAMC', 'OFS', 'OTH', 'TDWCB'];
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
    trl_start: item.trlStart ?? null,
    trl_end: item.trlEnd ?? null,
    trl_outputs: item.trlOutputs ? (typeof item.trlOutputs === 'string' && item.trlOutputs.startsWith('[') ? JSON.parse(item.trlOutputs) : item.trlOutputs) : [],
    teaching_courses: item.teachingCourses ? (typeof item.teachingCourses === 'string' && item.teachingCourses.startsWith('[') ? JSON.parse(item.teachingCourses) : item.teachingCourses) : [],
    applied_courses: item.appliedCourses ? (typeof item.appliedCourses === 'string' && item.appliedCourses.startsWith('[') ? JSON.parse(item.appliedCourses) : item.appliedCourses) : [],
    academic_service: item.academicService || '',
    cross_disciplinary: item.crossDisciplinary || '',
    integration: item.integration || '',
    remarks: item.remarks || '',
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
    record_number: item.recordNumber || '',
    registration_code: item.recordNumber || '',
    co_members_internal: item.coMembersInternal ?? 0,
    co_members_external: item.coMembersExternal ?? 0,
    alloc_overhead: Number(item.allocOverhead || 0),
    alloc_faculty: Number(item.allocFaculty || 0),
    alloc_dept: Number(item.allocDept || 0),
    alloc_ku: Number(item.allocKu || 0),
    alloc_remaining: Number(item.allocRemaining || 0),
    service_receiver_type: item.serviceReceiverType || '',
    research_integration: item.researchIntegration || '',
    patent_integration: item.patentIntegration || '',
    project_type_category: item.projectTypeCategory || '',
    project_type_categories: item.projectTypeCategory ? [item.projectTypeCategory] : [],
    project_sub_types: item.projectSubTypes ? (typeof item.projectSubTypes === 'string' && item.projectSubTypes.startsWith('[') ? JSON.parse(item.projectSubTypes) : item.projectSubTypes.split(',').map((s: string) => s.trim()).filter(Boolean)) : [],
    research_projects: item.researchProjects ? (typeof item.researchProjects === 'string' && item.researchProjects.startsWith('[') ? JSON.parse(item.researchProjects) : item.researchProjects) : [],
    characteristics: item.characteristics || '',
    status: item.status || 'ดำเนินการ',
    remarks: item.remarks || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function formatPublication(item: any) {
  if (!item) return null;
  const domesticAuthors = (item.authors || []).filter((a: any) => a.affiliationType === 'domestic').map((a: any) => a.personName).filter(Boolean);
  const domesticStr = domesticAuthors.length > 0 ? domesticAuthors.join(', ') : (item.coAuthorsDomestic || '');

  const foreignAuthors = (item.authors || []).filter((a: any) => a.affiliationType === 'foreign').map((a: any) => a.personName).filter(Boolean);
  const foreignStr = foreignAuthors.length > 0 ? foreignAuthors.join(', ') : (item.coAuthorsForeign || '');

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
    month_year: item.monthYear || (item.month && item.fiscalYearBe ? `${item.month} ${item.fiscalYearBe}` : ''),
    quartile: item.quartile || '',
    has_international_coauthor: Boolean(item.hasInternationalCoauthor),
    has_domestic_coauthor: Boolean(item.hasDomesticCoauthor),
    has_foreign_coauthor: Boolean(item.hasForeignCoauthor),
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
  static validateResearch(body: any, isUpdate = false) {
    if (!isUpdate || body.id !== undefined || body.code !== undefined) {
      const id = String(body.id || body.code || '').trim();
      if (!id) {
        const err: any = new Error('กรุณากรอก "รหัสโครงการวิจัย" (id)');
        err.status = 400;
        err.field = 'id';
        throw err;
      }
    }

    if (!isUpdate || body.fiscal_year_be !== undefined || body.fiscal_year !== undefined || body.fiscalYear !== undefined) {
      const fy = body.fiscal_year_be ?? body.fiscal_year ?? body.fiscalYear;
      if (fy === undefined || fy === null || String(fy).trim() === '') {
        const err: any = new Error('กรุณาระบุ "ปีงบประมาณ (พ.ศ.)" (fiscal_year_be)');
        err.status = 400;
        err.field = 'fiscal_year_be';
        throw err;
      }
    }

    if (!isUpdate || body.name !== undefined) {
      const name = String(body.name || '').trim();
      if (!name) {
        const err: any = new Error('กรุณากรอก "ชื่อโครงการวิจัย (ภาษาไทย)" (name)');
        err.status = 400;
        err.field = 'name';
        throw err;
      }
    }

    if (!isUpdate || body.fund_type !== undefined || body.fundType !== undefined) {
      const ft = String(body.fund_type || body.fundType || '').trim();
      if (!ft || !['ภายใน', 'ภายนอก'].includes(ft)) {
        const err: any = new Error('กรุณาระบุประเภททุนวิจัย (fund_type: ภายใน หรือ ภายนอก)');
        err.status = 400;
        err.field = 'fund_type';
        throw err;
      }
    }

    const start = body.start_date !== undefined ? body.start_date : body.startDate;
    const end = body.end_date !== undefined ? body.end_date : body.endDate;

    if (!isUpdate || start !== undefined) {
      if (!start || !String(start).trim()) {
        const err: any = new Error('กรุณาระบุเดือน/ปี หรือวันที่เริ่มต้นโครงการวิจัย (start_date)');
        err.status = 400;
        err.field = 'start_date';
        throw err;
      }
    }

    if (!isUpdate || end !== undefined) {
      if (!end || !String(end).trim()) {
        const err: any = new Error('กรุณาระบุเดือน/ปี หรือวันที่สิ้นสุดโครงการวิจัย (end_date)');
        err.status = 400;
        err.field = 'end_date';
        throw err;
      }
    }

    if (start && end && String(end) < String(start)) {
      const err: any = new Error('วันที่สิ้นสุดโครงการวิจัยต้องไม่เกิดขึ้นก่อนวันที่เริ่มต้น (end_date >= start_date)');
      err.status = 400;
      err.field = 'end_date';
      throw err;
    }

    if (!isUpdate || body.project_nature !== undefined || body.projectNature !== undefined) {
      const pn = body.project_nature ?? body.projectNature;
      const list = Array.isArray(pn)
        ? pn
        : typeof pn === 'string' && pn.trim()
        ? pn.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      if (list.length === 0) {
        const err: any = new Error('กรุณาเลือกลักษณะโครงการวิจัยอย่างน้อย 1 ประเภท (project_nature)');
        err.status = 400;
        err.field = 'project_nature';
        throw err;
      }
    }

    if (!isUpdate || body.budget_internal !== undefined || body.budget_external !== undefined || body.budgetInternal !== undefined || body.budgetExternal !== undefined) {
      const bInt = Number(body.budget_internal ?? body.budgetInternal ?? 0);
      const bExt = Number(body.budget_external ?? body.budgetExternal ?? 0);
      if (isNaN(bInt) || bInt < 0) {
        const err: any = new Error('งบประมาณภายในต้องไม่ติดลบ (budget_internal)');
        err.status = 400;
        err.field = 'budget_internal';
        throw err;
      }
      if (isNaN(bExt) || bExt < 0) {
        const err: any = new Error('งบประมาณภายนอกต้องไม่ติดลบ (budget_external)');
        err.status = 400;
        err.field = 'budget_external';
        throw err;
      }
      if (bInt + bExt <= 0) {
        const err: any = new Error('งบประมาณรวม (งบภายใน + งบภายนอก) ต้องมากกว่า 0 บาท');
        err.status = 400;
        err.field = 'budget';
        throw err;
      }
    }
  }

  static validateAcademic(body: any, isUpdate = false) {
    if (!isUpdate || body.record_number !== undefined || body.req_no !== undefined || body.legacy_id !== undefined || body.id !== undefined) {
      const rec = String(body.record_number || body.req_no || body.legacy_id || body.id || '').trim();
      if (!rec) {
        const err: any = new Error('กรุณาระบุเลขที่คำขอ / เลขระเบียน (record_number)');
        err.status = 400;
        err.field = 'record_number';
        throw err;
      }
    }

    if (!isUpdate || body.name !== undefined) {
      const name = String(body.name || '').trim();
      if (!name) {
        const err: any = new Error('กรุณากรอกชื่อโครงการพัฒนาวิชาการ (name)');
        err.status = 400;
        err.field = 'name';
        throw err;
      }
    }

    if (!isUpdate || body.client !== undefined) {
      const client = String(body.client || '').trim();
      if (!client) {
        const err: any = new Error('กรุณาระบุผู้ขอรับบริการ / ว่าจ้าง (client)');
        err.status = 400;
        err.field = 'client';
        throw err;
      }
    }

    if (!isUpdate || body.characteristics !== undefined) {
      const chars = Array.isArray(body.characteristics)
        ? body.characteristics
        : typeof body.characteristics === 'string' && body.characteristics.trim()
        ? body.characteristics.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      if (chars.length === 0) {
        const err: any = new Error('กรุณาเลือกลักษณะโครงการอย่างน้อย 1 รายการ (characteristics)');
        err.status = 400;
        err.field = 'characteristics';
        throw err;
      }
    }

    if (!isUpdate || body.department !== undefined || body.departmentCode !== undefined || body.department_code !== undefined) {
      const dept = resolveDeptCode(body.departmentCode || body.department_code || body.department);
      if (!dept) {
        const err: any = new Error('กรุณาระบุสังกัดที่ดำเนินการ (department)');
        err.status = 400;
        err.field = 'department';
        throw err;
      }
    }

    if (!isUpdate || body.co_members_internal !== undefined) {
      if (body.co_members_internal === undefined || body.co_members_internal === null || String(body.co_members_internal).trim() === '') {
        const err: any = new Error('กรุณาระบุจำนวนผู้ร่วมโครงการ (ภายใน) (co_members_internal)');
        err.status = 400;
        err.field = 'co_members_internal';
        throw err;
      }
    }

    if (!isUpdate || body.co_members_external !== undefined) {
      if (body.co_members_external === undefined || body.co_members_external === null || String(body.co_members_external).trim() === '') {
        const err: any = new Error('กรุณาระบุจำนวนผู้ร่วมโครงการ (ภายนอก) (co_members_external)');
        err.status = 400;
        err.field = 'co_members_external';
        throw err;
      }
    }

    if (!isUpdate || body.project_type_category !== undefined || body.project_type_categories !== undefined) {
      const cats = Array.isArray(body.project_type_categories)
        ? body.project_type_categories
        : Array.isArray(body.project_type_category)
        ? body.project_type_category
        : typeof body.project_type_category === 'string' && body.project_type_category.trim()
        ? body.project_type_category.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      if (cats.length === 0) {
        const err: any = new Error('กรุณาเลือกประเภทโครงการพัฒนาวิชาการอย่างน้อย 1 ประเภท (project_type_category)');
        err.status = 400;
        err.field = 'project_type_category';
        throw err;
      }
    }

    const start = body.start_date !== undefined ? body.start_date : body.startDate;
    const end = body.end_date !== undefined ? body.end_date : body.endDate;
    if (start && end && String(end) < String(start)) {
      const err: any = new Error('วันที่สิ้นสุดดำเนินการต้องไม่เกิดขึ้นก่อนวันที่เริ่มต้นดำเนินการ (end_date >= start_date)');
      err.status = 400;
      err.field = 'end_date';
      throw err;
    }

    // Conditional rule for integration
    const hasIntegration = Boolean(
      (Array.isArray(body.research_projects) && body.research_projects.length > 0) ||
      (body.patent_integration && String(body.patent_integration).trim()) ||
      body.has_integration
    );
    const intStart = body.integration_start_date !== undefined ? body.integration_start_date : body.integrationStartDate;
    const intEnd = body.integration_end_date !== undefined ? body.integration_end_date : body.integrationEndDate;

    if (hasIntegration) {
      if (!intStart || !String(intStart).trim()) {
        const err: any = new Error('กรุณาระบุวันที่เริ่มต้นนำไปบูรณาการ (integration_start_date)');
        err.status = 400;
        err.field = 'integration_start_date';
        throw err;
      }
      if (!intEnd || !String(intEnd).trim()) {
        const err: any = new Error('กรุณาระบุวันที่สิ้นสุดนำไปบูรณาการ (integration_end_date)');
        err.status = 400;
        err.field = 'integration_end_date';
        throw err;
      }
    }

    if (intStart && intEnd && String(intEnd) < String(intStart)) {
      const err: any = new Error('วันที่สิ้นสุดนำไปบูรณาการต้องไม่เกิดขึ้นก่อนวันที่เริ่มต้นนำไปบูรณาการ (integration_end_date >= integration_start_date)');
      err.status = 400;
      err.field = 'integration_end_date';
      throw err;
    }
  }

  static validatePublication(body: any, isUpdate = false) {
    if (!isUpdate || body.title !== undefined || body.name !== undefined) {
      const title = String(body.title || body.name || '').trim();
      if (!title) {
        const err: any = new Error('กรุณากรอกชื่อเรื่อง / ผลงานตีพิมพ์ (title)');
        err.status = 400;
        err.field = 'title';
        throw err;
      }
    }

    if (!isUpdate || body.budget !== undefined) {
      if (body.budget === undefined || body.budget === null || String(body.budget).trim() === '') {
        const err: any = new Error('กรุณาระบุจำนวนเงินสนับสนุน (budget)');
        err.status = 400;
        err.field = 'budget';
        throw err;
      }
      const b = Number(body.budget);
      if (isNaN(b) || b < 0) {
        const err: any = new Error('จำนวนเงินสนับสนุนต้องเป็นตัวเลขที่ไม่ติดลบ (budget >= 0)');
        err.status = 400;
        err.field = 'budget';
        throw err;
      }
    }

    if (!isUpdate || body.month_year !== undefined || body.month !== undefined || body.fiscal_year_be !== undefined || body.fiscalYearBe !== undefined) {
      const my = body.month_year || body.month || body.fiscal_year_be || body.fiscalYearBe;
      if (!my || !String(my).trim()) {
        const err: any = new Error('กรุณาระบุเดือน/ปี (พ.ศ.) ของผลงานตีพิมพ์ (month_year)');
        err.status = 400;
        err.field = 'month_year';
        throw err;
      }
    }

    if (!isUpdate || body.has_foreign_coauthor !== undefined || body.has_domestic_coauthor !== undefined || body.co_authors_foreign !== undefined || body.co_authors_domestic !== undefined) {
      const hasForeign = Boolean(
        body.has_foreign_coauthor ||
        body.has_international_coauthor ||
        (Array.isArray(body.co_authors_foreign) && body.co_authors_foreign.length > 0) ||
        (typeof body.co_authors_foreign === 'string' && body.co_authors_foreign.trim())
      );
      const hasDomestic = Boolean(
        body.has_domestic_coauthor ||
        (Array.isArray(body.co_authors_domestic) && body.co_authors_domestic.length > 0) ||
        (typeof body.co_authors_domestic === 'string' && body.co_authors_domestic.trim())
      );
      if (!hasForeign && !hasDomestic) {
        const err: any = new Error('กรุณาระบุข้อมูลผู้แต่งร่วม (มีผู้ร่วมต่างชาติ หรือ มีผู้ร่วมภายในประเทศ) (co_authors)');
        err.status = 400;
        err.field = 'co_authors';
        throw err;
      }
    }

    const type = String(body.type || '').trim();
    if (type !== 'เตรียมความพร้อมจดอนุสิทธิบัตร') {
      if (!isUpdate || body.journal !== undefined) {
        if (!body.journal || !String(body.journal).trim()) {
          const err: any = new Error('กรุณากรอกรายละเอียดวารสาร/การประชุม (journal)');
          err.status = 400;
          err.field = 'journal';
          throw err;
        }
      }
      if (!isUpdate || body.volume !== undefined) {
        if (!body.volume || !String(body.volume).trim()) {
          const err: any = new Error('กรุณาระบุ Volume (เล่มที่) (volume)');
          err.status = 400;
          err.field = 'volume';
          throw err;
        }
      }
      if (!isUpdate || body.issue !== undefined) {
        if (!body.issue || !String(body.issue).trim()) {
          const err: any = new Error('กรุณาระบุ Issue (ฉบับที่) (issue)');
          err.status = 400;
          err.field = 'issue';
          throw err;
        }
      }
      const pStart = body.page_start !== undefined ? body.page_start : body.pageStart;
      const pEnd = body.page_end !== undefined ? body.page_end : body.pageEnd;
      if (!isUpdate || pStart !== undefined) {
        if (!pStart || !String(pStart).trim()) {
          const err: any = new Error('กรุณาระบุหน้าเริ่มต้น (page_start)');
          err.status = 400;
          err.field = 'page_start';
          throw err;
        }
      }
      if (!isUpdate || pEnd !== undefined) {
        if (!pEnd || !String(pEnd).trim()) {
          const err: any = new Error('กรุณาระบุหน้าสิ้นสุด (page_end)');
          err.status = 400;
          err.field = 'page_end';
          throw err;
        }
      }
      if (pStart && pEnd) {
        const numStart = parseInt(String(pStart).trim(), 10);
        const numEnd = parseInt(String(pEnd).trim(), 10);
        if (!isNaN(numStart) && !isNaN(numEnd) && numEnd < numStart) {
          const err: any = new Error('หน้าสิ้นสุดต้องมากกว่าหรือเท่ากับหน้าเริ่มต้น (page_end >= page_start)');
          err.status = 400;
          err.field = 'page_end';
          throw err;
        }
      }
    }
  }



  static async createResearch(body: any) {
    this.validateResearch(body, false);
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
      ? String(body.departments || body.department).split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];
    const departmentsList = Array.from(new Set(rawDepts.map(resolveDeptCode).filter(Boolean))) as string[];
    if (headDept && !departmentsList.includes(headDept)) {
      departmentsList.push(headDept);
    }

    const rawMembers = body.co_researchers ?? body.members;
    const membersList = Array.isArray(rawMembers)
      ? rawMembers.map((m: any) => (typeof m === 'object' && m !== null ? String(m.name || m.personName || '').trim() : String(m).trim())).filter(Boolean)
      : rawMembers
      ? String(rawMembers).split(',').map((s: string) => s.trim()).filter(Boolean)
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
    this.validateResearch(body, true);
    let existing: any = await ProjectRepository.findResearchById(identifier);
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

    const rawUpdateMembers = body.co_researchers ?? body.members;
    const membersList = body.members !== undefined || body.co_researchers !== undefined
      ? (Array.isArray(rawUpdateMembers)
          ? rawUpdateMembers.map((m: any) => (typeof m === 'object' && m !== null ? String(m.name || m.personName || '').trim() : String(m).trim())).filter(Boolean)
          : String(rawUpdateMembers || '').split(',').map((s: string) => s.trim()).filter(Boolean))
      : undefined;

    let departmentsList: string[] | undefined = undefined;
    if (body.departments !== undefined || body.department !== undefined) {
      const raw = Array.isArray(body.departments)
        ? body.departments
        : String(body.departments || body.department).split(',').map((s: string) => s.trim()).filter(Boolean);
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
    let existing: any = await ProjectRepository.findResearchById(identifier);
    if (!existing) {
      existing = await prisma.researchProject.findFirst({
        where: { name: String(identifier).trim() },
      });
    }
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
    this.validateAcademic(body, false);
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
    this.validateAcademic(body, true);
    let existing: any = await ProjectRepository.findAcademicById(identifier);
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
    let existing: any = await ProjectRepository.findAcademicById(identifier);
    if (!existing) {
      existing = await prisma.academicDevProject.findFirst({
        where: { name: String(identifier).trim() },
      });
    }
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
    this.validatePublication(body, false);
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
      const domesticList = Array.isArray(body.co_authors_domestic)
        ? body.co_authors_domestic
        : String(body.co_authors_domestic).split(',');
      domesticList.map((s: any) => String(s).trim()).filter(Boolean).forEach((name: string) => {
        authorsList.push({ name, type: 'domestic' });
      });
    }
    if (body.co_authors_foreign) {
      const foreignList = Array.isArray(body.co_authors_foreign)
        ? body.co_authors_foreign
        : String(body.co_authors_foreign).split(',');
      foreignList.map((s: any) => String(s).trim()).filter(Boolean).forEach((name: string) => {
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
    this.validatePublication(body, true);
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
        const domesticList = Array.isArray(body.co_authors_domestic)
          ? body.co_authors_domestic
          : String(body.co_authors_domestic).split(',');
        domesticList.map((s: any) => String(s).trim()).filter(Boolean).forEach((name: string) => {
          authorsList!.push({ name, type: 'domestic' });
        });
      }
      if (body.co_authors_foreign) {
        const foreignList = Array.isArray(body.co_authors_foreign)
          ? body.co_authors_foreign
          : String(body.co_authors_foreign).split(',');
        foreignList.map((s: any) => String(s).trim()).filter(Boolean).forEach((name: string) => {
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
    let existing: any = await ProjectRepository.findPublicationById(identifier);
    if (!existing) {
      existing = await prisma.publication.findFirst({
        where: { title: String(identifier).trim() },
      });
    }
    if (!existing) {
      const err: any = new Error('ไม่พบข้อมูลผลงานตีพิมพ์');
      err.status = 404;
      throw err;
    }
    await ProjectRepository.deletePublication(existing.id);
    return { id: existing.legacyId || String(existing.id) };
  }
}

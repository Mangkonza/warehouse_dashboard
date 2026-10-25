import { ServiceRepository } from '../repositories/service.repository.js';
import { parseSafeDate, parseSafeNumber, parseSafeInt, extractNumericId } from '../utils/sanitize.js';

export const VALID_SERVICE_CATEGORIES = [
  'วิทยากร/อาจารย์พิเศษ',
  'วิชาการ',
  'วิชาชีพ',
  'ผู้ทรงคุณวุฒิ',
  'วิทยานิพนธ์ภายนอก',
  'ศึกษาดูงาน วศ.กพส.',
] as const;

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

function resolveDeptCode(input?: string): string | null {
  if (!input) return null;
  const s = input.trim();
  const validCodes = ['AE', 'CE', 'CPE', 'DWT', 'EEEC', 'FE', 'IE', 'IRE', 'ME', 'NAMC', 'OFS', 'OTH'];
  if (validCodes.includes(s.toUpperCase())) return s.toUpperCase();
  for (const [kw, code] of Object.entries(DEPT_MAP)) {
    if (s.includes(kw)) return code;
  }
  return null;
}

function formatServiceRecord(item: any) {
  if (!item) return null;

  return {
    _id: item.legacyId || `srv_${item.id}`,
    id: item.legacyId || `srv_${item.id}`,
    dbId: item.id,
    name: item.name,
    topic_title: item.name,
    service_category: item.serviceCategory,
    service_type: item.serviceCategory,
    person: item.providerName || '',
    department: item.department?.nameTh || item.departmentCode || '',
    departmentCode: item.departmentCode || '',
    target_group: item.targetGroup || '',
    hours_spent: Number(item.hoursSpent || 0),
    attendees_count: Number(item.attendeesCount || 0),
    date: item.date ? item.date.toISOString().split('T')[0] : '',
    start_date: item.startDate ? item.startDate.toISOString().split('T')[0] : '',
    end_date: item.endDate ? item.endDate.toISOString().split('T')[0] : '',
    fiscal_year: item.fiscalYear || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export class ServiceService {
  static async getAll(query: any = {}) {
    const page = query.page ? parseInt(String(query.page), 10) : undefined;
    const limit = query.limit ? parseInt(String(query.limit), 10) : undefined;
    const search = query.search ? String(query.search) : undefined;
    const category = query.category || query.service_type || query.service_category ? String(query.category || query.service_type || query.service_category) : undefined;
    const department = query.department ? String(query.department) : undefined;
    const year = query.year || query.fiscal_year ? parseInt(String(query.year || query.fiscal_year), 10) : undefined;

    const { total, items } = await ServiceRepository.findAll({
      page,
      limit,
      search,
      category,
      department,
      year,
    });

    return {
      status: 'success',
      category: 'service',
      total,
      data: items.map(formatServiceRecord),
    };
  }

  static async getById(identifier: string | number) {
    let item;
    const numId = extractNumericId(identifier);
    if (numId !== null) {
      item = await ServiceRepository.findById(numId);
    }
    if (!item) {
      item = await ServiceRepository.findByLegacyId(String(identifier));
    }
    if (!item) return null;
    return formatServiceRecord(item);
  }

  static async create(body: any) {
    const name = String(body.name || body.topic_title || '').trim();
    if (!name) {
      const err: any = new Error('กรุณากรอกหัวข้อ / ชื่อโครงการบริการวิชาการ');
      err.status = 400;
      throw err;
    }

    const serviceCategory = String(body.service_category || body.service_type || '').trim();
    if (!serviceCategory || !VALID_SERVICE_CATEGORIES.includes(serviceCategory as any)) {
      const err: any = new Error(
        `ประเภทงานบริการวิชาการไม่ถูกต้อง (ต้องเป็นหนึ่งใน: ${VALID_SERVICE_CATEGORIES.join(', ')})`
      );
      err.status = 422;
      throw err;
    }

    const created = await ServiceRepository.create({
      name,
      serviceCategory,
      providerName: String(body.person || body.provider_name || '').trim() || null,
      departmentCode: resolveDeptCode(body.departmentCode || body.department_code || body.department),
      targetGroup: String(body.target_group || '').trim() || null,
      hoursSpent: parseSafeNumber(body.hours_spent, 0),
      attendeesCount: parseSafeInt(body.attendees_count, 0) || 0,
      date: parseSafeDate(body.date),
      startDate: parseSafeDate(body.start_date),
      endDate: parseSafeDate(body.end_date),
      fiscalYear: parseSafeInt(body.fiscal_year),
    });

    return formatServiceRecord(created);
  }

  static async update(identifier: string | number, body: any) {
    let existing;
    const numId = extractNumericId(identifier);
    if (numId !== null) {
      existing = await ServiceRepository.findById(numId);
    }
    if (!existing) {
      existing = await ServiceRepository.findByLegacyId(String(identifier));
    }
    if (!existing) {
      const err: any = new Error('ไม่พบข้อมูลงานบริการวิชาการที่ต้องการแก้ไข');
      err.status = 404;
      throw err;
    }

    let serviceCategory = existing.serviceCategory;
    if (body.service_category !== undefined || body.service_type !== undefined) {
      const cat = String(body.service_category || body.service_type).trim();
      if (!VALID_SERVICE_CATEGORIES.includes(cat as any)) {
        const err: any = new Error(
          `ประเภทงานบริการวิชาการไม่ถูกต้อง (ต้องเป็นหนึ่งใน: ${VALID_SERVICE_CATEGORIES.join(', ')})`
        );
        err.status = 422;
        throw err;
      }
      serviceCategory = cat;
    }

    const updated = await ServiceRepository.update(existing.id, {
      name: body.name !== undefined || body.topic_title !== undefined ? String(body.name || body.topic_title).trim() : undefined,
      serviceCategory,
      providerName: body.person !== undefined || body.provider_name !== undefined ? String(body.person || body.provider_name).trim() || null : undefined,
      departmentCode: body.department !== undefined || body.department_code !== undefined || body.departmentCode !== undefined
        ? resolveDeptCode(body.departmentCode || body.department_code || body.department)
        : undefined,
      targetGroup: body.target_group !== undefined ? String(body.target_group).trim() || null : undefined,
      hoursSpent: body.hours_spent !== undefined ? parseSafeNumber(body.hours_spent, 0) : undefined,
      attendeesCount: body.attendees_count !== undefined ? parseSafeInt(body.attendees_count, 0) || 0 : undefined,
      date: body.date !== undefined ? parseSafeDate(body.date) : undefined,
      startDate: body.start_date !== undefined ? parseSafeDate(body.start_date) : undefined,
      endDate: body.end_date !== undefined ? parseSafeDate(body.end_date) : undefined,
      fiscalYear: body.fiscal_year !== undefined ? parseSafeInt(body.fiscal_year) : undefined,
    });

    return formatServiceRecord(updated);
  }

  static async delete(identifier: string | number) {
    let existing;
    const numId = extractNumericId(identifier);
    if (numId !== null) {
      existing = await ServiceRepository.findById(numId);
    }
    if (!existing) {
      existing = await ServiceRepository.findByLegacyId(String(identifier));
    }
    if (!existing) {
      const err: any = new Error('ไม่พบข้อมูลงานบริการวิชาการที่ต้องการลบ');
      err.status = 404;
      throw err;
    }
    await ServiceRepository.delete(existing.id);
    return { id: existing.legacyId || String(existing.id) };
  }
}

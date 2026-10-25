import { IpRepository } from '../repositories/ip.repository.js';
import { parseSafeDate, parseSafeNumber, parseSafeInt, extractNumericId, resolveDepartmentCode } from '../utils/sanitize.js';

function formatIpRecord(item: any) {
  if (!item) return null;

  const inventorsStr =
    item.inventors && item.inventors.length > 0
      ? item.inventors.map((i: any) => i.personName).join(', ')
      : item.creatorName || '';

  const deptsStr =
    item.departments && item.departments.length > 0
      ? item.departments.map((d: any) => d.department?.nameTh || d.departmentCode).join(', ')
      : item.departmentCode || '';

  return {
    _id: item.legacyId || `ip_${item.id}`,
    id: item.legacyId || `ip_${item.id}`,
    dbId: item.id,
    name: item.title,
    title: item.title,
    type: item.type,
    work_category: item.workCategory || '',
    work_character: item.workCharacter || '',
    creator: item.creatorName || inventorsStr,
    inventors: inventorsStr,
    department: item.departmentCode || deptsStr,
    departments: deptsStr,
    application_number: item.applicationNumber || '',
    registration_number: item.registrationNumber || '',
    filing_date: item.filingDate ? item.filingDate.toISOString().split('T')[0] : '',
    protection_start: item.protectionStart ? item.protectionStart.toISOString().split('T')[0] : '',
    protection_end: item.protectionEnd ? item.protectionEnd.toISOString().split('T')[0] : '',
    support_amount: Number(item.supportAmount || 0),
    status: item.status || 'ยื่นคำขอแล้ว',
    fiscal_year: item.fiscalYear || '',
    remarks: item.remarks || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export class IpService {
  static async getAll(query: any = {}) {
    const page = query.page ? parseInt(String(query.page), 10) : undefined;
    const limit = query.limit ? parseInt(String(query.limit), 10) : undefined;
    const search = query.search ? String(query.search) : undefined;
    const type = query.type ? String(query.type) : undefined;
    const department = query.department ? String(query.department) : undefined;
    const status = query.status ? String(query.status) : undefined;

    const { total, items } = await IpRepository.findAll({
      page,
      limit,
      search,
      type,
      department,
      status,
    });

    return {
      status: 'success',
      category: 'ip',
      total,
      data: items.map(formatIpRecord),
    };
  }

  static async getById(identifier: string | number) {
    let item;
    const numId = extractNumericId(identifier);
    if (numId !== null) {
      item = await IpRepository.findById(numId);
    }
    if (!item) {
      item = await IpRepository.findByLegacyId(String(identifier));
    }
    if (!item) return null;
    return formatIpRecord(item);
  }

  static async create(body: any) {
    const title = String(body.title || body.name || '').trim();
    if (!title) {
      const err: any = new Error('กรุณากรอกชื่อเรื่อง / ชื่อผลงาน');
      err.status = 400;
      throw err;
    }

    const type = String(body.type || '').trim();
    const validTypes = ['อนุสิทธิบัตร', 'สิทธิบัตร', 'ลิขสิทธิ์'];
    if (!type || !validTypes.includes(type)) {
      const err: any = new Error('กรุณาเลือกประเภททรัพย์สินทางปัญญา (อนุสิทธิบัตร, สิทธิบัตร หรือ ลิขสิทธิ์)');
      err.status = 422;
      throw err;
    }

    let workCategory: string | null = null;
    let workCharacter: string | null = null;

    if (type === 'ลิขสิทธิ์') {
      workCategory = String(body.work_category || '').trim();
      if (!workCategory) {
        const err: any = new Error('กรุณาระบุประเภทงานสร้างสรรค์สำหรับลิขสิทธิ์');
        err.status = 422;
        throw err;
      }
      workCharacter = String(body.work_character || '').trim() || null;
    } else {
      // Patent / Petty Patent do not accept work_category
      workCategory = null;
      workCharacter = null;
    }

    const regNo = String(body.registration_number || '').trim();
    if (regNo) {
      const isDup = await IpRepository.checkDuplicateRegistrationNumber(type, regNo);
      if (isDup) {
        const err: any = new Error(`เลขทะเบียน "${regNo}" มีอยู่ในระบบแล้วภายใต้ประเภทผลงานเดียวกัน`);
        err.status = 409;
        throw err;
      }
    }

    const appNo = String(body.application_number || '').trim() || null;

    // Parse inventors
    let inventorsList: string[] = [];
    if (Array.isArray(body.inventors)) {
      inventorsList = body.inventors.map(String).map((s: string) => s.trim()).filter(Boolean);
    } else if (body.creator || body.inventors) {
      inventorsList = String(body.creator || body.inventors)
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    // Parse departments
    let rawDepts: string[] = [];
    if (Array.isArray(body.departments)) {
      rawDepts = body.departments.map(String).map((s: string) => s.trim()).filter(Boolean);
    } else if (body.department || body.departments) {
      rawDepts = String(body.department || body.departments)
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    const departmentsList: string[] = [];
    for (const d of rawDepts) {
      const code = await resolveDepartmentCode(d);
      if (code && !departmentsList.includes(code)) {
        departmentsList.push(code);
      }
    }

    const created = await IpRepository.create({
      title,
      type,
      workCategory,
      workCharacter,
      creatorName: inventorsList.join(', ') || null,
      departmentCode: departmentsList[0] || null,
      applicationNumber: appNo,
      registrationNumber: regNo || null,
      filingDate: parseSafeDate(body.filing_date),
      protectionStart: parseSafeDate(body.protection_start),
      protectionEnd: parseSafeDate(body.protection_end),
      supportAmount: parseSafeNumber(body.support_amount, 0),
      status: body.status || 'ยื่นคำขอแล้ว',
      fiscalYear: parseSafeInt(body.fiscal_year),
      remarks: body.remarks || null,
      inventorsList,
      departmentsList,
    });

    return formatIpRecord(created);
  }

  static async update(identifier: string | number, body: any) {
    let existing;
    const numId = extractNumericId(identifier);
    if (numId !== null) {
      existing = await IpRepository.findById(numId);
    }
    if (!existing) {
      existing = await IpRepository.findByLegacyId(String(identifier));
    }
    if (!existing) {
      const err: any = new Error('ไม่พบข้อมูลทรัพย์สินทางปัญญาที่ต้องการแก้ไข');
      err.status = 404;
      throw err;
    }

    const type = body.type !== undefined ? String(body.type).trim() : existing.type;
    const validTypes = ['อนุสิทธิบัตร', 'สิทธิบัตร', 'ลิขสิทธิ์'];
    if (!validTypes.includes(type)) {
      const err: any = new Error('ประเภททรัพย์สินทางปัญญาไม่ถูกต้อง');
      err.status = 422;
      throw err;
    }

    let workCategory = existing.workCategory;
    let workCharacter = existing.workCharacter;

    if (type === 'ลิขสิทธิ์') {
      if (body.work_category !== undefined) {
        workCategory = String(body.work_category).trim();
        if (!workCategory) {
          const err: any = new Error('กรุณาระบุประเภทงานสร้างสรรค์สำหรับลิขสิทธิ์');
          err.status = 422;
          throw err;
        }
      } else if (!workCategory) {
        const err: any = new Error('กรุณาระบุประเภทงานสร้างสรรค์สำหรับลิขสิทธิ์');
        err.status = 422;
        throw err;
      }
      if (body.work_character !== undefined) {
        workCharacter = String(body.work_character).trim() || null;
      }
    } else {
      workCategory = null;
      workCharacter = null;
    }

    const regNo = body.registration_number !== undefined ? String(body.registration_number).trim() : existing.registrationNumber;
    if (regNo) {
      const isDup = await IpRepository.checkDuplicateRegistrationNumber(type, regNo, existing.id);
      if (isDup) {
        const err: any = new Error(`เลขทะเบียน "${regNo}" มีอยู่ในระบบแล้วภายใต้ประเภทผลงานเดียวกัน`);
        err.status = 409;
        throw err;
      }
    }

    let inventorsList: string[] | undefined = undefined;
    if (Array.isArray(body.inventors)) {
      inventorsList = body.inventors.map(String).map((s: string) => s.trim()).filter(Boolean);
    } else if (body.creator !== undefined || body.inventors !== undefined) {
      inventorsList = String(body.creator || body.inventors || '')
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    let departmentsList: string[] | undefined = undefined;
    if (Array.isArray(body.departments)) {
      const raw = body.departments.map(String).map((s: string) => s.trim()).filter(Boolean);
      departmentsList = [];
      for (const d of raw) {
        const code = await resolveDepartmentCode(d);
        if (code && !departmentsList.includes(code)) departmentsList.push(code);
      }
    } else if (body.department !== undefined || body.departments !== undefined) {
      const raw = String(body.department || body.departments || '')
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
      departmentsList = [];
      for (const d of raw) {
        const code = await resolveDepartmentCode(d);
        if (code && !departmentsList.includes(code)) departmentsList.push(code);
      }
    }

    const updated = await IpRepository.update(existing.id, {
      title: body.title !== undefined || body.name !== undefined ? String(body.title || body.name).trim() : undefined,
      type,
      workCategory,
      workCharacter,
      creatorName: inventorsList ? inventorsList.join(', ') : undefined,
      departmentCode: departmentsList ? departmentsList[0] : undefined,
      applicationNumber: body.application_number !== undefined ? String(body.application_number).trim() || null : undefined,
      registrationNumber: regNo || null,
      filingDate: body.filing_date !== undefined ? parseSafeDate(body.filing_date) : undefined,
      protectionStart: body.protection_start !== undefined ? parseSafeDate(body.protection_start) : undefined,
      protectionEnd: body.protection_end !== undefined ? parseSafeDate(body.protection_end) : undefined,
      supportAmount: body.support_amount !== undefined ? parseSafeNumber(body.support_amount, 0) : undefined,
      status: body.status !== undefined ? String(body.status).trim() : undefined,
      fiscalYear: body.fiscal_year !== undefined ? parseSafeInt(body.fiscal_year) : undefined,
      remarks: body.remarks !== undefined ? String(body.remarks).trim() || null : undefined,
      inventorsList,
      departmentsList,
    });

    return formatIpRecord(updated);
  }

  static async delete(identifier: string | number) {
    let existing;
    const numId = extractNumericId(identifier);
    if (numId !== null) {
      existing = await IpRepository.findById(numId);
    }
    if (!existing) {
      existing = await IpRepository.findByLegacyId(String(identifier));
    }
    if (!existing) {
      const err: any = new Error('ไม่พบข้อมูลทรัพย์สินทางปัญญาที่ต้องการลบ');
      err.status = 404;
      throw err;
    }
    await IpRepository.delete(existing.id);
    return { id: existing.legacyId || String(existing.id) };
  }
}

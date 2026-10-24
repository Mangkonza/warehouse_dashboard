import { NextRequest, NextResponse } from 'next/server';
import {
  readCategoryData,
  addItemToCategory,
  updateItemInCategory,
  deleteItemFromCategory,
  batchSaveCategory,
} from '../../../../lib/serverDataStore';
import { ResearchProjectSchema } from '../../../../types/researchProject';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ category: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { category } = await context.params;
    const data = readCategoryData(category);
    return NextResponse.json({
      status: 'success',
      category,
      total: data.length,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { category } = await context.params;
    const body = await request.json();

    // Check if batch import
    if (body && Array.isArray(body.items)) {
      const mode = body.mode === 'overwrite' ? 'overwrite' : 'append';
      const updated = batchSaveCategory(category, body.items, mode);
      return NextResponse.json({
        status: 'success',
        message: `Imported ${body.items.length} records into ${category}`,
        total: updated.length,
        data: updated,
      });
    }

    // Single item creation
    if (category.toLowerCase() === 'research') {
      const code = String(body.id || '').replace(/\r?\n/g, ' ').trim();
      if (!code) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาระบุรหัสโครงการวิจัย' },
          { status: 400 }
        );
      }

      // Check duplicate project code
      const existing = readCategoryData('research');
      const isDuplicate = existing.some((item: any) => {
        const itemCode = String(item.id || '').replace(/\r?\n/g, ' ').trim();
        return itemCode.toLowerCase() === code.toLowerCase();
      });

      if (isDuplicate) {
        return NextResponse.json(
          {
            status: 'error',
            code: 'DUPLICATE_CODE',
            message: `รหัสโครงการวิจัย "${code}" มีอยู่ในระบบแล้ว`,
          },
          { status: 409 }
        );
      }

      // Validate schema
      const parseResult = ResearchProjectSchema.safeParse(body);
      if (!parseResult.success) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'ข้อมูลโครงการวิจัยไม่ถูกต้อง',
            errors: parseResult.error.flatten().fieldErrors,
          },
          { status: 422 }
        );
      }
    }

    if (category.toLowerCase() === 'service' || category.toLowerCase() === 'services') {
      const topicName = String(body.name || body.topic_title || '').trim();
      if (!topicName) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณากรอกเรื่อง / ชื่องานบริการวิชาการ' },
          { status: 400 }
        );
      }

      const sType = String(body.service_type || body.service_category || '').trim();
      const validTypes = [
        'วิทยากร/อาจารย์พิเศษ',
        'วิชาการ',
        'วิชาชีพ',
        'ผู้ทรงคุณวุฒิ',
        'วิทยานิพนธ์ภายนอก',
        'ศึกษาดูงาน วศ.กพส.',
      ];
      if (!sType || !validTypes.includes(sType)) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาเลือกประเภทงานบริการวิชาการจาก 6 ประเภทที่กำหนด' },
          { status: 422 }
        );
      }

      const person = String(body.person || '').trim();
      if (!person) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาระบุชื่อ-นามสกุล ผู้ให้บริการ/ผู้รับผิดชอบ' },
          { status: 400 }
        );
      }

      // Normalize fields for backward and forward compatibility
      body.name = topicName;
      body.topic_title = topicName;
      body.service_type = sType;
      body.service_category = sType;
      body.person = person;
      body.date = body.start_date || body.date || '';
    }

    if (category.toLowerCase() === 'academic') {
      const projName = String(body.name || '').trim();
      if (!projName) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณากรอกชื่อโครงการพัฒนาวิชาการ' },
          { status: 400 }
        );
      }

      const validAcademicCategories = [
        'งานบริการด้านวิจัย',
        'งานที่ปรึกษา',
        'งานบริการด้านฝึกอบรม',
        'งานด้านบริการ',
        'งานบริการอื่นๆ',
      ];

      // Support single category, array of categories, or comma-separated categories
      let catsToCheck: string[] = [];
      if (Array.isArray(body.project_type_category)) {
        catsToCheck = body.project_type_category.map((c: any) => String(c).trim()).filter(Boolean);
        body.project_type_category = catsToCheck.join(', ');
      } else if (typeof body.project_type_category === 'string' && body.project_type_category.trim()) {
        catsToCheck = body.project_type_category.split(',').map((c: string) => c.trim()).filter(Boolean);
      } else if (Array.isArray(body.project_type_categories)) {
        catsToCheck = body.project_type_categories.map((c: any) => String(c).trim()).filter(Boolean);
        body.project_type_category = catsToCheck.join(', ');
      }

      if (catsToCheck.length > 0) {
        const hasInvalid = catsToCheck.some((c) => !validAcademicCategories.includes(c));
        if (hasInvalid) {
          return NextResponse.json(
            { status: 'error', message: 'ประเภทโครงการพัฒนาวิชาการต้องเป็นหนึ่งใน 5 ประเภทที่กำหนด' },
            { status: 422 }
          );
        }
      }

      // Ensure array type for project_sub_types
      if (body.project_sub_types !== undefined) {
        if (Array.isArray(body.project_sub_types)) {
          body.project_sub_types = body.project_sub_types.map((s: any) => String(s).trim()).filter(Boolean);
        } else if (typeof body.project_sub_types === 'string') {
          body.project_sub_types = body.project_sub_types.split(',').map((s: string) => s.trim()).filter(Boolean);
        } else {
          body.project_sub_types = [];
        }
      }
    }

    if (category.toLowerCase() === 'publications') {
      const name = String(body.name || '').trim();
      if (!name) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณากรอกชื่อผลงานทางวิชาการ' },
          { status: 400 }
        );
      }

      const validTypes = ['เตรียมความพร้อมตีพิมพ์', 'เตรียมความพร้อมจดอนุสิทธิบัตร', 'ตีพิมพ์'];
      const type = String(body.type || '').trim();
      if (!type || !validTypes.includes(type)) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาเลือกชนิดของผลงานจากรายการที่กำหนด' },
          { status: 422 }
        );
      }

      const validLevels = ['ชาติ', 'นานาชาติ'];
      const level = String(body.level || '').trim();
      if (!level || !validLevels.includes(level)) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาเลือกระดับ (ชาติ หรือ นานาชาติ)' },
          { status: 422 }
        );
      }

      let budget = 0;
      if (body.budget !== undefined && body.budget !== null && body.budget !== '') {
        budget = parseFloat(body.budget);
        if (isNaN(budget) || budget < 0) {
          return NextResponse.json(
            { status: 'error', message: 'จำนวนเงินสนับสนุนต้องเป็นตัวเลขที่ไม่ติดลบ' },
            { status: 422 }
          );
        }
      }

      const owner = String(body.owner || '').trim();
      if (!owner) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาระบุเจ้าของผลงาน' },
          { status: 400 }
        );
      }

      const department = String(body.department || '').trim();
      if (!department) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาระบุสังกัดภาควิชา/สาขาวิชา' },
          { status: 400 }
        );
      }

      if (type === 'เตรียมความพร้อมจดอนุสิทธิบัตร') {
        body.journal = 'อนุสิทธิบัตร';
        body.volume = '';
        body.issue = '';
        body.page_start = '';
        body.page_end = '';
      } else {
        const pStart = String(body.page_start || '').trim();
        const pEnd = String(body.page_end || '').trim();
        if (pStart && pEnd) {
          const numStart = parseInt(pStart, 10);
          const numEnd = parseInt(pEnd, 10);
          if (!isNaN(numStart) && !isNaN(numEnd) && numEnd < numStart) {
            return NextResponse.json(
              { status: 'error', message: 'หน้าสิ้นสุดต้องมากกว่าหรือเท่ากับหน้าเริ่มต้น' },
              { status: 422 }
            );
          }
        }
      }

      if (body.has_foreign_coauthor !== undefined) {
        body.has_foreign_coauthor = Boolean(body.has_foreign_coauthor);
      } else if (Array.isArray(body.co_authors_foreign) && body.co_authors_foreign.length > 0) {
        body.has_foreign_coauthor = true;
      }
      if (body.has_domestic_coauthor !== undefined) {
        body.has_domestic_coauthor = Boolean(body.has_domestic_coauthor);
      } else if (Array.isArray(body.co_authors_domestic) && body.co_authors_domestic.length > 0) {
        body.has_domestic_coauthor = true;
      }

      if (!Array.isArray(body.co_authors_foreign)) {
        body.co_authors_foreign = typeof body.co_authors_foreign === 'string' && body.co_authors_foreign ? body.co_authors_foreign.split(',').map((s: string) => s.trim()).filter(Boolean) : (body.has_foreign_coauthor ? ['มีผู้ร่วมต่างชาติ'] : []);
      }
      if (!Array.isArray(body.co_authors_domestic)) {
        body.co_authors_domestic = typeof body.co_authors_domestic === 'string' && body.co_authors_domestic ? body.co_authors_domestic.split(',').map((s: string) => s.trim()).filter(Boolean) : (body.has_domestic_coauthor ? ['มีผู้ร่วมภายในประเทศ'] : []);
      }

      body.name = name;
      body.type = type;
      body.level = level;
      body.budget = budget;
      body.owner = owner;
      body.department = department;

      if (body.month_year) {
        const parts = String(body.month_year).split('-');
        if (parts.length >= 2) {
          const yr = parseInt(parts[0], 10);
          const mo = parseInt(parts[1], 10) - 1;
          const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
          if (!isNaN(mo) && mo >= 0 && mo < 12) {
            body.month = THAI_MONTHS[mo];
          }
          if (!isNaN(yr)) {
            body.fiscal_year_be = mo >= 9 ? yr + 544 : yr + 543;
          }
        }
      }
    }

    if (category.toLowerCase() === 'ip') {
      const title = String(body.title || body.name || '').trim();
      if (!title) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณากรอกชื่อเรื่อง' },
          { status: 400 }
        );
      }

      const hasInventors = (Array.isArray(body.inventors) && body.inventors.length > 0) || (body.creator && String(body.creator).trim());
      if (!hasInventors) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาระบุผู้ประดิษฐ์อย่างน้อย 1 ท่าน' },
          { status: 400 }
        );
      }

      const type = String(body.type || '').trim();
      if (!type || (type !== 'อนุสิทธิบัตร' && type !== 'สิทธิบัตร')) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาเลือกประเภททรัพย์สินทางปัญญา (อนุสิทธิบัตร หรือ สิทธิบัตร)' },
          { status: 422 }
        );
      }

      const appNo = String(body.application_number || '').trim();
      if (appNo && !/^\d{10}$/.test(appNo)) {
        return NextResponse.json(
          { status: 'error', message: 'เลขที่คำขอต้องมี 10 หลักและเป็นตัวเลขเท่านั้น' },
          { status: 422 }
        );
      }

      const regNo = String(body.registration_number || '').trim();
      if (regNo && !/^\d{10}$/.test(regNo)) {
        return NextResponse.json(
          { status: 'error', message: 'เลขที่ต้องมี 10 หลักและเป็นตัวเลขเท่านั้น' },
          { status: 422 }
        );
      }

      if (body.protection_start && body.protection_end && body.protection_end < body.protection_start) {
        return NextResponse.json(
          { status: 'error', message: 'วันที่สิ้นสุดต้องไม่เกิดขึ้นก่อนวันที่เริ่มต้น' },
          { status: 422 }
        );
      }

      let supportAmount = 0;
      if (body.support_amount !== undefined && body.support_amount !== null && body.support_amount !== '') {
        supportAmount = parseFloat(body.support_amount);
        if (isNaN(supportAmount) || supportAmount < 0) {
          return NextResponse.json(
            { status: 'error', message: 'จำนวนเงินคณะฯ สนับสนุนต้องเป็นตัวเลขที่ไม่ติดลบ' },
            { status: 422 }
          );
        }
      }

      body.title = title;
      body.name = title;
      body.type = type;
      body.application_number = appNo;
      body.registration_number = regNo;
      body.support_amount = supportAmount;

      if (!body.req_no) {
        body.req_no = appNo ? (regNo ? `${appNo} / ${regNo}` : appNo) : (regNo || '');
      }
      if (!body.status) {
        body.status = regNo || body.protection_start ? 'ได้รับความคุ้มครองแล้ว' : 'ยื่นคำขอแล้ว';
      }
    }

    const created = addItemToCategory(category, body);
    return NextResponse.json({
      status: 'success',
      message: 'Record created successfully and persisted',
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to save record' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { category } = await context.params;
    const body = await request.json();

    if (category.toLowerCase() === 'research') {
      const targetId = body._id || body.id;
      const code = String(body.id || '').replace(/\r?\n/g, ' ').trim();

      // Check if new code collides with another record
      if (code) {
        const existing = readCategoryData('research');
        const isDuplicateOther = existing.some((item: any) => {
          const itemCode = String(item.id || '').replace(/\r?\n/g, ' ').trim();
          const itemKey = item._id || item.id;
          if (itemKey === targetId || item._id === body._id || item.id === targetId) {
            return false;
          }
          return itemCode.toLowerCase() === code.toLowerCase();
        });

        if (isDuplicateOther) {
          return NextResponse.json(
            {
              status: 'error',
              code: 'DUPLICATE_CODE',
              message: `รหัสโครงการวิจัย "${code}" ซ้ำกับโครงการอื่นในระบบ`,
            },
            { status: 409 }
          );
        }
      }

      // Validate schema
      const parseResult = ResearchProjectSchema.partial().safeParse(body);
      if (!parseResult.success) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'ข้อมูลโครงการวิจัยไม่ถูกต้อง',
            errors: parseResult.error.flatten().fieldErrors,
          },
          { status: 422 }
        );
      }
    }

    if (category.toLowerCase() === 'service' || category.toLowerCase() === 'services') {
      const topicName = String(body.name || body.topic_title || '').trim();
      const sType = String(body.service_type || body.service_category || '').trim();
      const validTypes = [
        'วิทยากร/อาจารย์พิเศษ',
        'วิชาการ',
        'วิชาชีพ',
        'ผู้ทรงคุณวุฒิ',
        'วิทยานิพนธ์ภายนอก',
        'ศึกษาดูงาน วศ.กพส.',
      ];

      if (sType && !validTypes.includes(sType)) {
        return NextResponse.json(
          { status: 'error', message: 'ประเภทงานบริการวิชาการต้องเป็น 1 ใน 6 ประเภทที่กำหนด' },
          { status: 422 }
        );
      }

      if (topicName) {
        body.name = topicName;
        body.topic_title = topicName;
      }
      if (sType) {
        body.service_type = sType;
        body.service_category = sType;
      }
      if (body.start_date) {
        body.date = body.start_date;
      }
    }

    if (category.toLowerCase() === 'academic') {
      const validAcademicCategories = [
        'งานบริการด้านวิจัย',
        'งานที่ปรึกษา',
        'งานบริการด้านฝึกอบรม',
        'งานด้านบริการ',
        'งานบริการอื่นๆ',
      ];

      // Support single category, array of categories, or comma-separated categories
      let catsToCheck: string[] = [];
      if (Array.isArray(body.project_type_category)) {
        catsToCheck = body.project_type_category.map((c: any) => String(c).trim()).filter(Boolean);
        body.project_type_category = catsToCheck.join(', ');
      } else if (typeof body.project_type_category === 'string' && body.project_type_category.trim()) {
        catsToCheck = body.project_type_category.split(',').map((c: string) => c.trim()).filter(Boolean);
      } else if (Array.isArray(body.project_type_categories)) {
        catsToCheck = body.project_type_categories.map((c: any) => String(c).trim()).filter(Boolean);
        body.project_type_category = catsToCheck.join(', ');
      }

      if (catsToCheck.length > 0) {
        const hasInvalid = catsToCheck.some((c) => !validAcademicCategories.includes(c));
        if (hasInvalid) {
          return NextResponse.json(
            { status: 'error', message: 'ประเภทโครงการพัฒนาวิชาการต้องเป็นหนึ่งใน 5 ประเภทที่กำหนด' },
            { status: 422 }
          );
        }
      }

      // Ensure array type for project_sub_types
      if (body.project_sub_types !== undefined) {
        if (Array.isArray(body.project_sub_types)) {
          body.project_sub_types = body.project_sub_types.map((s: any) => String(s).trim()).filter(Boolean);
        } else if (typeof body.project_sub_types === 'string') {
          body.project_sub_types = body.project_sub_types.split(',').map((s: string) => s.trim()).filter(Boolean);
        } else {
          body.project_sub_types = [];
        }
      }
    }

    if (category.toLowerCase() === 'publications') {
      const name = String(body.name || '').trim();
      if (!name) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณากรอกชื่อผลงานทางวิชาการ' },
          { status: 400 }
        );
      }

      const validTypes = ['เตรียมความพร้อมตีพิมพ์', 'เตรียมความพร้อมจดอนุสิทธิบัตร', 'ตีพิมพ์'];
      const type = String(body.type || '').trim();
      if (!type || !validTypes.includes(type)) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาเลือกชนิดของผลงานจากรายการที่กำหนด' },
          { status: 422 }
        );
      }

      const validLevels = ['ชาติ', 'นานาชาติ'];
      const level = String(body.level || '').trim();
      if (!level || !validLevels.includes(level)) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาเลือกระดับ (ชาติ หรือ นานาชาติ)' },
          { status: 422 }
        );
      }

      let budget = 0;
      if (body.budget !== undefined && body.budget !== null && body.budget !== '') {
        budget = parseFloat(body.budget);
        if (isNaN(budget) || budget < 0) {
          return NextResponse.json(
            { status: 'error', message: 'จำนวนเงินสนับสนุนต้องเป็นตัวเลขที่ไม่ติดลบ' },
            { status: 422 }
          );
        }
      }

      const owner = String(body.owner || '').trim();
      if (!owner) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาระบุเจ้าของผลงาน' },
          { status: 400 }
        );
      }

      const department = String(body.department || '').trim();
      if (!department) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาระบุสังกัดภาควิชา/สาขาวิชา' },
          { status: 400 }
        );
      }

      if (type === 'เตรียมความพร้อมจดอนุสิทธิบัตร') {
        body.journal = 'อนุสิทธิบัตร';
        body.volume = '';
        body.issue = '';
        body.page_start = '';
        body.page_end = '';
      } else {
        const pStart = String(body.page_start || '').trim();
        const pEnd = String(body.page_end || '').trim();
        if (pStart && pEnd) {
          const numStart = parseInt(pStart, 10);
          const numEnd = parseInt(pEnd, 10);
          if (!isNaN(numStart) && !isNaN(numEnd) && numEnd < numStart) {
            return NextResponse.json(
              { status: 'error', message: 'หน้าสิ้นสุดต้องมากกว่าหรือเท่ากับหน้าเริ่มต้น' },
              { status: 422 }
            );
          }
        }
      }

      if (body.has_foreign_coauthor !== undefined) {
        body.has_foreign_coauthor = Boolean(body.has_foreign_coauthor);
      } else if (Array.isArray(body.co_authors_foreign) && body.co_authors_foreign.length > 0) {
        body.has_foreign_coauthor = true;
      }
      if (body.has_domestic_coauthor !== undefined) {
        body.has_domestic_coauthor = Boolean(body.has_domestic_coauthor);
      } else if (Array.isArray(body.co_authors_domestic) && body.co_authors_domestic.length > 0) {
        body.has_domestic_coauthor = true;
      }

      if (!Array.isArray(body.co_authors_foreign)) {
        body.co_authors_foreign = typeof body.co_authors_foreign === 'string' && body.co_authors_foreign ? body.co_authors_foreign.split(',').map((s: string) => s.trim()).filter(Boolean) : (body.has_foreign_coauthor ? ['มีผู้ร่วมต่างชาติ'] : []);
      }
      if (!Array.isArray(body.co_authors_domestic)) {
        body.co_authors_domestic = typeof body.co_authors_domestic === 'string' && body.co_authors_domestic ? body.co_authors_domestic.split(',').map((s: string) => s.trim()).filter(Boolean) : (body.has_domestic_coauthor ? ['มีผู้ร่วมภายในประเทศ'] : []);
      }

      body.name = name;
      body.type = type;
      body.level = level;
      body.budget = budget;
      body.owner = owner;
      body.department = department;

      if (body.month_year) {
        const parts = String(body.month_year).split('-');
        if (parts.length >= 2) {
          const yr = parseInt(parts[0], 10);
          const mo = parseInt(parts[1], 10) - 1;
          const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
          if (!isNaN(mo) && mo >= 0 && mo < 12) {
            body.month = THAI_MONTHS[mo];
          }
          if (!isNaN(yr)) {
            body.fiscal_year_be = mo >= 9 ? yr + 544 : yr + 543;
          }
        }
      }
    }

    if (category.toLowerCase() === 'ip') {
      const title = String(body.title || body.name || '').trim();
      if (!title) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณากรอกชื่อเรื่อง' },
          { status: 400 }
        );
      }

      const hasInventors = (Array.isArray(body.inventors) && body.inventors.length > 0) || (body.creator && String(body.creator).trim());
      if (!hasInventors) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาระบุผู้ประดิษฐ์อย่างน้อย 1 ท่าน' },
          { status: 400 }
        );
      }

      const type = String(body.type || '').trim();
      if (!type || (type !== 'อนุสิทธิบัตร' && type !== 'สิทธิบัตร')) {
        return NextResponse.json(
          { status: 'error', message: 'กรุณาเลือกประเภททรัพย์สินทางปัญญา (อนุสิทธิบัตร หรือ สิทธิบัตร)' },
          { status: 422 }
        );
      }

      const appNo = String(body.application_number || '').trim();
      if (appNo && !/^\d{10}$/.test(appNo)) {
        return NextResponse.json(
          { status: 'error', message: 'เลขที่คำขอต้องมี 10 หลักและเป็นตัวเลขเท่านั้น' },
          { status: 422 }
        );
      }

      const regNo = String(body.registration_number || '').trim();
      if (regNo && !/^\d{10}$/.test(regNo)) {
        return NextResponse.json(
          { status: 'error', message: 'เลขที่ต้องมี 10 หลักและเป็นตัวเลขเท่านั้น' },
          { status: 422 }
        );
      }

      if (body.protection_start && body.protection_end && body.protection_end < body.protection_start) {
        return NextResponse.json(
          { status: 'error', message: 'วันที่สิ้นสุดต้องไม่เกิดขึ้นก่อนวันที่เริ่มต้น' },
          { status: 422 }
        );
      }

      let supportAmount = 0;
      if (body.support_amount !== undefined && body.support_amount !== null && body.support_amount !== '') {
        supportAmount = parseFloat(body.support_amount);
        if (isNaN(supportAmount) || supportAmount < 0) {
          return NextResponse.json(
            { status: 'error', message: 'จำนวนเงินคณะฯ สนับสนุนต้องเป็นตัวเลขที่ไม่ติดลบ' },
            { status: 422 }
          );
        }
      }

      body.title = title;
      body.name = title;
      body.type = type;
      body.application_number = appNo;
      body.registration_number = regNo;
      body.support_amount = supportAmount;

      if (!body.req_no) {
        body.req_no = appNo ? (regNo ? `${appNo} / ${regNo}` : appNo) : (regNo || '');
      }
      if (!body.status) {
        body.status = regNo || body.protection_start ? 'ได้รับความคุ้มครองแล้ว' : 'ยื่นคำขอแล้ว';
      }
    }

    const updated = updateItemInCategory(category, body);
    if (!updated) {
      return NextResponse.json(
        { status: 'error', message: 'Record ID missing or record not found' },
        { status: 400 }
      );
    }
    return NextResponse.json({
      status: 'success',
      message: 'Record updated successfully and persisted',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to update record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { category } = await context.params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'Target record ID is required' },
        { status: 400 }
      );
    }

    const deleted = deleteItemFromCategory(category, id);
    return NextResponse.json({
      status: 'success',
      message: deleted ? `Record ${id} deleted successfully` : 'Record not found, file saved',
      deleted,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to delete record' },
      { status: 500 }
    );
  }
}

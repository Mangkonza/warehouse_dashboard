import { ProjectExtensionRecord, ProjectStatus, ProjectTimelineInfo } from '../types/projectMonitoring';

/**
 * ปรับแก้ปี พ.ศ. ที่ติดเป็น 1968 จาก Excel 2 หลัก (เช่น 68 -> 1968 แท้จริงคือ 2568 พ.ศ. = 2025 ค.ศ.)
 */
export function normalizeCeDate(d: Date): Date {
  if (!d || isNaN(d.getTime())) return d;
  const y = d.getFullYear();
  if (y >= 1960 && y <= 1980) {
    d.setFullYear(y + 57); // 1968 (BE 2568) -> 2025 CE
  } else if (y > 2400) {
    d.setFullYear(y - 543); // 2568 BE -> 2025 CE
  }
  return d;
}

/**
 * ฟังก์ชันแปลง Date String หลากหลายรูปแบบ (ISO, YYYY-MM-DD, DD/MM/YYYY, Timestamp) เป็น Date Object อย่างแม่นยำ
 */
export function parseFlexibleDate(val: any): Date | null {
  if (val === null || val === undefined || val === '' || val === '-' || val === 'nan' || val === 'NaT') {
    return null;
  }
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : normalizeCeDate(new Date(val.getTime()));
  }

  const str = String(val).trim();
  if (!str) return null;

  // 1. ISO date string or timestamp (e.g., 2025-09-30, 2025-09-30T00:00:00.000Z, 2025/09/30)
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    let y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10) - 1;
    const d = parseInt(isoMatch[3], 10);
    if (y >= 1960 && y <= 1980) y += 57;
    else if (y > 2400) y -= 543;
    const date = new Date(y, m, d);
    return isNaN(date.getTime()) ? null : date;
  }

  // 2. DD/MM/YYYY or D/M/YYYY or DD-MM-YYYY (e.g., 30/09/2568, 11/11/2026)
  const dmyMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10) - 1;
    let y = parseInt(dmyMatch[3], 10);
    if (y >= 1960 && y <= 1980) y += 57;
    else if (y > 2400) y -= 543;
    const date = new Date(y, m, d);
    return isNaN(date.getTime()) ? null : date;
  }

  // 3. YYYY-MM or MM/YYYY
  const ymMatch = str.match(/^(\d{4})[-/](\d{1,2})$/);
  if (ymMatch) {
    let y = parseInt(ymMatch[1], 10);
    const m = parseInt(ymMatch[2], 10) - 1;
    if (y >= 1960 && y <= 1980) y += 57;
    else if (y > 2400) y -= 543;
    const date = new Date(y, m, 1);
    return isNaN(date.getTime()) ? null : date;
  }

  // 4. Fallback Date constructor
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return normalizeCeDate(parsed);
  }

  return null;
}

/**
 * คำนวณข้อมูลเวลาและการติดตามผลของโครงการ (Project Timeline & Monitoring Calculation)
 * ตรวจสอบความถูกต้องของสถานะโครงการ (Overdue, On Track, Extended, Completed, Cancelled)
 */
export function calculateProjectTimeline(item: Record<string, any>, referenceDateStr?: string, isEval?: boolean): ProjectTimelineInfo {
  const today = referenceDateStr ? new Date(referenceDateStr) : new Date();

  // 1. ดึงปีงบประมาณ หรือสกัดจากรหัสโครงการ
  let fiscalYear = Number(item.fiscal_year_be || item.fiscal_year);
  if (!fiscalYear || isNaN(fiscalYear)) {
    const codeMatch = String(item.id || item.code || item.legacy_id || '').match(/25[6-7][0-9]/);
    fiscalYear = codeMatch ? parseInt(codeMatch[0], 10) : 2568;
  }
  const fiscalYearCe = fiscalYear - 543;

  // 2. ตรวจสอบและแปลงวันเริ่มและวันสิ้นสุดสัญญาจริง
  const rawStart = item.start_date || '';
  const rawEnd = item.end_date || item.original_end_date || '';

  const parsedStartDate = parseFlexibleDate(rawStart);
  const parsedEndDate = parseFlexibleDate(rawEnd);

  // 3. ดึงระยะเวลาโครงการ (เดือน)
  let durationMonths = Number(item.duration_months);
  if (!durationMonths || isNaN(durationMonths)) {
    const monthMatch = String(rawStart).match(/(\d+)\s*เดือน/);
    if (monthMatch) {
      durationMonths = parseInt(monthMatch[1], 10);
    } else {
      durationMonths = 12; // ค่าเริ่มต้นมาตรฐาน 1 ปีงบประมาณ
    }
  }

  // 4. กำหนดวันเริ่มต้นโครงการ (Start Date)
  let startDate: Date;
  if (parsedStartDate) {
    startDate = parsedStartDate;
  } else {
    // กำหนดวันเริ่มต้นตามต้นปีงบประมาณของโครงการ (1 ต.ค. ของปีก่อนหน้า)
    startDate = new Date(fiscalYearCe - 1, 9, 1);
  }

  // 5. กำหนดวันสิ้นสุดเดิม (Original End Date)
  let originalEndDate: Date;
  if (parsedEndDate) {
    originalEndDate = parsedEndDate;
  } else {
    originalEndDate = new Date(startDate.getFullYear(), startDate.getMonth() + durationMonths, startDate.getDate());
  }

  // 6. ประวัติการขอขยายเวลา
  const extensions: ProjectExtensionRecord[] = Array.isArray(item.extensions) ? item.extensions : [];
  
  let currentEndDate = new Date(originalEndDate);
  const approvedExtensions = extensions.filter((e) => e.approval_status === 'approved');
  if (approvedExtensions.length > 0) {
    const latestExtension = approvedExtensions[approvedExtensions.length - 1];
    const parsedExtEnd = parseFlexibleDate(latestExtension.extended_end_date);
    if (parsedExtEnd) {
      currentEndDate = parsedExtEnd;
    }
  }

  // 7. คำนวณวันคงเหลือ (Days Remaining)
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.round((currentEndDate.getTime() - today.getTime()) / msPerDay);
  
  // โครงการจะถือว่าเกินกำหนดสัญญา (isOverdue) เมื่อพ้นวันสิ้นสุดสัญญา (daysRemaining < 0)
  const isOverdue = !isNaN(currentEndDate.getTime()) && daysRemaining < 0;

  // 8. Normalization และวิเคราะห์สถานะจริงของโครงการ
  const rawStatus = String(item.status || '').trim().toLowerCase();

  const isCancelled = Boolean(
    item.cancelled_date ||
    rawStatus === 'cancelled' ||
    rawStatus === 'canceled' ||
    rawStatus === 'cancel' ||
    rawStatus === 'ยกเลิก' ||
    rawStatus.includes('ยกเลิก') ||
    rawStatus.includes('ยุติ') ||
    rawStatus.includes('ระงับ')
  );

  const isClosed = Boolean(
    item.closed_date ||
    item.is_completed ||
    rawStatus === 'completed' ||
    rawStatus === 'closed' ||
    rawStatus === 'finished' ||
    rawStatus === 'เสร็จสิ้น' ||
    rawStatus === 'เสร็จ' ||
    rawStatus === 'ปิดโครงการ' ||
    rawStatus === 'ปิดโครงการแล้ว' ||
    rawStatus === 'ปิดสัญญา' ||
    rawStatus.includes('เสร็จสิ้น') ||
    rawStatus.includes('ปิดโครงการ') ||
    rawStatus === 'waiting_eval' ||
    rawStatus === 'evaluated'
  );

  const isExtensionRequested = Boolean(
    extensions.some((e) => e.approval_status === 'pending') ||
    rawStatus === 'extension_requested' ||
    rawStatus.includes('ขอขยายเวลา') ||
    rawStatus.includes('ยื่นขอขยาย')
  );

  const isExtended = Boolean(
    approvedExtensions.length > 0 ||
    rawStatus === 'extended' ||
    rawStatus.includes('อยู่ระหว่างขยาย') ||
    rawStatus.includes('ขยายเวลา')
  );

  // ใกล้ครบกำหนดสัญญา: เหลือน้อยกว่า 1 เดือน (<= 30 วัน) จากวันปัจจุบัน และยังไม่ปิดหรือยกเลิก
  const isExpiringSoon =
    !isOverdue &&
    daysRemaining >= 0 &&
    daysRemaining <= 30 &&
    !isClosed &&
    !isCancelled;

  // 9. คำนวณความก้าวหน้าประมาณการ (%)
  const totalProjectDays = Math.max(1, Math.round((currentEndDate.getTime() - startDate.getTime()) / msPerDay));
  const elapsedDays = Math.round((today.getTime() - startDate.getTime()) / msPerDay);
  let progressPercent = Math.min(100, Math.max(0, Math.round((elapsedDays / totalProjectDays) * 100)));

  // 10. กำหนดสถานะโครงการ (Project Status)
  let status: ProjectStatus = 'active';

  if (isCancelled) {
    status = 'cancelled';
  } else if (isClosed) {
    if (isEval) {
      status = 'evaluated';
    } else if (rawStatus === 'waiting_eval' && !item.is_completed && !item.closed_date) {
      status = 'waiting_eval';
    } else {
      status = 'completed';
    }
    progressPercent = 100;
  } else if (isExtensionRequested) {
    status = 'extension_requested';
  } else if (isExtended) {
    status = isOverdue ? 'delayed' : 'extended';
  } else if (isOverdue) {
    status = 'delayed';
  } else {
    status = 'active';
  }

  const formatDate = (d: Date) => {
    if (!d || isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    start_date: parsedStartDate ? formatDate(startDate) : (rawStart ? String(rawStart) : formatDate(startDate)),
    end_date: formatDate(currentEndDate),
    original_end_date: formatDate(originalEndDate),
    closed_date: item.closed_date ? String(item.closed_date) : undefined,
    duration_months: durationMonths,
    days_remaining: daysRemaining,
    progress_percent: progressPercent,
    status: status,
    is_overdue: isOverdue && !isClosed && !isCancelled,
    is_expiring_soon: isExpiringSoon,
    extensions: extensions,
  };
}

/**
 * สร้างคำขอขยายระยะเวลาโครงการใหม่ตามระเบียบมหาวิทยาลัยเกษตรศาสตร์
 */
export function createExtensionRequest(
  item: Record<string, any>,
  params: {
    durationMonths: number;
    reasonCategory: any;
    reasonDetail: string;
    documentRefNo?: string;
    customEndDate?: string;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
  }
): ProjectExtensionRecord {
  const currentTimeline = calculateProjectTimeline(item);
  const currentEnd = new Date(currentTimeline.end_date);
  
  let newEnd: Date;
  if (params.customEndDate && !isNaN(new Date(params.customEndDate).getTime())) {
    newEnd = new Date(params.customEndDate);
  } else {
    newEnd = new Date(currentEnd);
    newEnd.setMonth(newEnd.getMonth() + params.durationMonths);
  }

  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatDate(new Date());
  const round = (currentTimeline.extensions.length || 0) + 1;

  return {
    id: `ext_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    round: round,
    request_date: todayStr,
    original_end_date: currentTimeline.end_date,
    extended_end_date: formatDate(newEnd),
    duration_months: params.durationMonths,
    reason_category: params.reasonCategory,
    reason_detail: params.reasonDetail,
    document_ref_no: params.documentRefNo || `อว 6505/${round}`,
    approval_status: params.approvalStatus || 'pending',
    created_at: new Date().toISOString(),
  };
}

export const STATUS_LABELS: Record<ProjectStatus, { labelTh: string; color: string; bg: string; border: string }> = {
  proposed: { labelTh: 'รออนุมัติโครงการ', color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' },
  active: { labelTh: 'กำลังดำเนินการตามแผน', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  extension_requested: { labelTh: 'ยื่นขอขยายเวลา', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  extended: { labelTh: 'อยู่ระหว่างขยายเวลา', color: '#b45309', bg: '#fef3c7', border: '#fcd34d' },
  delayed: { labelTh: 'เกินกำหนดสัญญา', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  submitted: { labelTh: 'ส่งรายงานสมบูรณ์ (รอตรวจรับ)', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  completed: { labelTh: 'ปิดโครงการแล้ว', color: '#475569', bg: '#f8fafc', border: '#e2e8f0' },
  waiting_eval: { labelTh: 'รอประเมิน', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  evaluated: { labelTh: 'ประเมินแล้ว', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  cancelled: { labelTh: 'ยกเลิกโครงการ', color: '#991b1b', bg: '#fee2e2', border: '#fca5a5' },
};

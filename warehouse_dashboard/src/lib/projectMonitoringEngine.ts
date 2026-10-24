import { ProjectExtensionRecord, ProjectStatus, ProjectTimelineInfo } from '../types/projectMonitoring';

/**
 * คำนวณข้อมูลเวลาและการติดตามผลของโครงการ (Project Timeline & Monitoring Calculation)
 * แก้ไขตาม GAP Analysis 1.1: ป้องกันไม่ให้โครงการที่ไม่มีวันที่หรืออยู่ในกรอบปีงบประมาณถูกตีเป็น "ล่าช้า"
 */
export function calculateProjectTimeline(item: Record<string, any>, referenceDateStr?: string, isEval?: boolean): ProjectTimelineInfo {
  const today = referenceDateStr ? new Date(referenceDateStr) : new Date();

  // 1. ดึงปีงบประมาณ หรือสกัดจากรหัสโครงการ
  let fiscalYear = Number(item.fiscal_year_be || item.fiscal_year);
  if (!fiscalYear || isNaN(fiscalYear)) {
    const codeMatch = String(item.id || '').match(/25[6-7][0-9]/);
    fiscalYear = codeMatch ? parseInt(codeMatch[0], 10) : 2568;
  }
  const fiscalYearCe = fiscalYear - 543;

  // 2. ตรวจสอบว่ามีข้อมูลวันเริ่มและวันสิ้นสุดสัญญาจริงหรือไม่
  const rawStart = String(item.start_date || '').trim();
  const rawEnd = String(item.end_date || item.original_end_date || '').trim();

  const isRealDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) || /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}$/.test(s);
  const hasExplicitStartDate = isRealDate(rawStart);
  const hasExplicitEndDate = isRealDate(rawEnd);

  // 3. ดึงระยะเวลาโครงการ (เดือน)
  let durationMonths = Number(item.duration_months);
  if (!durationMonths || isNaN(durationMonths)) {
    const monthMatch = rawStart.match(/(\d+)\s*เดือน/);
    if (monthMatch) {
      durationMonths = parseInt(monthMatch[1], 10);
    } else {
      durationMonths = 12; // ค่าเริ่มต้นมาตรฐาน 1 ปีงบประมาณ
    }
  }

  // 4. กำหนดวันเริ่มต้นโครงการ (Start Date)
  let startDate: Date;
  if (hasExplicitStartDate) {
    startDate = new Date(rawStart);
  } else {
    // กำหนดวันเริ่มต้นตามต้นปีงบประมาณของโครงการ (1 ต.ค. ของปีก่อนหน้า)
    startDate = new Date(fiscalYearCe - 1, 9, 1);
  }

  // 5. กำหนดวันสิ้นสุดเดิม (Original End Date)
  let originalEndDate: Date;
  if (hasExplicitEndDate) {
    originalEndDate = new Date(rawEnd);
  } else {
    originalEndDate = new Date(startDate);
    originalEndDate.setMonth(originalEndDate.getMonth() + durationMonths);
  }

  // 6. ประวัติการขอขยายเวลา
  const extensions: ProjectExtensionRecord[] = Array.isArray(item.extensions) ? item.extensions : [];
  
  let currentEndDate = new Date(originalEndDate);
  const approvedExtensions = extensions.filter((e) => e.approval_status === 'approved');
  if (approvedExtensions.length > 0) {
    const latestExtension = approvedExtensions[approvedExtensions.length - 1];
    if (latestExtension.extended_end_date) {
      currentEndDate = new Date(latestExtension.extended_end_date);
    }
  }

  // 7. คำนวณวันคงเหลือ (Days Remaining)
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.round((currentEndDate.getTime() - today.getTime()) / msPerDay);
  
  // โครงการจะถือว่าเกินกำหนดสัญญา (isOverdue) ได้ก็ต่อเมื่อ "มีวันสิ้นสุดระบุไว้จริง" เท่านั้น
  const isOverdue = hasExplicitEndDate && daysRemaining < 0;

  // 8. คำนวณความก้าวหน้าประมาณการ (%)
  const totalProjectDays = Math.max(1, Math.round((currentEndDate.getTime() - startDate.getTime()) / msPerDay));
  const elapsedDays = Math.round((today.getTime() - startDate.getTime()) / msPerDay);
  let progressPercent = Math.min(100, Math.max(0, Math.round((elapsedDays / totalProjectDays) * 100)));

  // 9. กำหนดสถานะโครงการ (Project Status) ตาม GAP Analysis 1.1
  let status: ProjectStatus = (item.status as ProjectStatus) || 'active';

  const isClosed = Boolean(
    item.closed_date ||
    item.is_completed ||
    item.status === 'completed' ||
    item.status === 'waiting_eval' ||
    item.status === 'evaluated'
  );

  if (isClosed) {
    status = isEval ? 'evaluated' : 'waiting_eval';
    progressPercent = 100;
  } else if (!item.status || item.status === 'active' || item.status === 'delayed' || item.status === 'extended') {
    if (extensions.some((e) => e.approval_status === 'pending')) {
      status = 'extension_requested';
    } else if (approvedExtensions.length > 0) {
      status = isOverdue ? 'delayed' : 'extended';
    } else if (isOverdue) {
      status = 'delayed';
    } else {
      status = 'active';
    }
  }

  const formatDate = (d: Date) => {
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    start_date: hasExplicitStartDate ? formatDate(startDate) : (rawStart || formatDate(startDate)),
    end_date: formatDate(currentEndDate),
    original_end_date: formatDate(originalEndDate),
    closed_date: item.closed_date ? String(item.closed_date) : undefined,
    duration_months: durationMonths,
    days_remaining: daysRemaining,
    progress_percent: progressPercent,
    status: status,
    is_overdue: isOverdue && status !== 'completed' && status !== 'cancelled' && status !== 'waiting_eval' && status !== 'evaluated',
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
  }
): ProjectExtensionRecord {
  const currentTimeline = calculateProjectTimeline(item);
  const currentEnd = new Date(currentTimeline.end_date);
  const newEnd = new Date(currentEnd);
  newEnd.setMonth(newEnd.getMonth() + params.durationMonths);

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
    approval_status: 'pending',
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

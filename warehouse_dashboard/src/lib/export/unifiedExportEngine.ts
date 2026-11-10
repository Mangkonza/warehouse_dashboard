import * as XLSX from 'xlsx';
import { CATEGORIES_CONFIG, normalizeDepartmentName } from '@/config/dataManagementConfig';
import { splitFullName } from '@/lib/formatPersonName';
import {
  ExportPageKey,
  ExportSectionKey,
  ExportMetric,
  ExportBreakdownTable,
  ExportSheetColumn,
  UnifiedExportOptions,
} from './types';

/**
 * แปลงค่าตัวเลขงบประมาณอย่างปลอดภัย
 */
function parseNumericValue(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val || val === '-' || val === 'nan') return 0;
  const cleaned = String(val).replace(/[,\sบาท\.-]/gi, '').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

/**
 * แปลงตัวเลขเป็นข้อความพร้อม comma
 */
function formatNumber(num: number, decimals: number = 0): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return num.toLocaleString('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * คำนวณสรุปตัวชี้วัดสถิติอัตโนมัติจากข้อมูลตาราง (Auto-aggregation) เมื่อหน้าไม่ได้ส่ง metrics มา
 */
export function autoDeriveMetrics(
  categoryKey: string | undefined,
  data: any[],
  page?: ExportPageKey
): ExportMetric[] {
  if (!data || data.length === 0) {
    return [{ label: 'จำนวนรายการทั้งหมด', value: '0', unit: 'รายการ' }];
  }

  const count = data.length;
  const metrics: ExportMetric[] = [
    { label: 'จำนวนรายการข้อมูลทั้งหมดที่แสดง', value: formatNumber(count), unit: 'รายการ', category: 'ภาพรวม' },
  ];

  if (categoryKey === 'research' || page === 'research') {
    const totalBudget = data.reduce((sum, item) => sum + parseNumericValue(item.budget), 0);
    const externalBudget = data.reduce((sum, item) => {
      const type = String(item.funding_type || item.funding_agency || '').toLowerCase();
      const isExternal = !type.includes('ภายใน') && !type.includes('คณะ') && !type.includes('มก');
      return isExternal ? sum + parseNumericValue(item.budget) : sum;
    }, 0);
    const internalBudget = totalBudget - externalBudget;
    const megaCount = data.filter((item) => parseNumericValue(item.budget) >= 10000000).length;
    const heads = new Set(data.map((item) => item.head || item.leader || item.creator).filter(Boolean));

    metrics.push(
      { label: 'งบประมาณวิจัยรวมทั้งหมด', value: formatNumber(totalBudget, 2), unit: 'บาท', category: 'งบประมาณ' },
      { label: 'งบประมาณจากแหล่งทุนภายนอก', value: formatNumber(externalBudget, 2), unit: 'บาท', category: 'งบประมาณ' },
      { label: 'งบประมาณจากแหล่งทุนภายใน', value: formatNumber(internalBudget, 2), unit: 'บาท', category: 'งบประมาณ' },
      { label: 'โครงการวิจัยขนาดใหญ่ (Mega Projects >= 10 ล้านบาท)', value: formatNumber(megaCount), unit: 'โครงการ', category: 'ผลสัมฤทธิ์' },
      { label: 'จำนวนหัวหน้าโครงการที่ดำเนินงาน (ไม่ซ้ำ)', value: formatNumber(heads.size), unit: 'คน', category: 'บุคลากร' }
    );
  } else if (categoryKey === 'academic' || page === 'academic') {
    const totalBudget = data.reduce((sum, item) => sum + parseNumericValue(item.budget), 0);
    const facultyAlloc = (totalBudget * 15) / 100;
    const avgBudget = count > 0 ? totalBudget / count : 0;

    metrics.push(
      { label: 'มูลค่าสัญญา/งบประมาณรวม', value: formatNumber(totalBudget, 2), unit: 'บาท', category: 'งบประมาณ' },
      { label: 'เงินจัดสรรหักเข้าคณะ/มก. 15%', value: formatNumber(facultyAlloc, 2), unit: 'บาท', category: 'งบประมาณ' },
      { label: 'มูลค่าเฉลี่ยต่อโครงการ', value: formatNumber(avgBudget, 2), unit: 'บาท/โครงการ', category: 'งบประมาณ' }
    );
  } else if (categoryKey === 'publications' || page === 'publications') {
    const scopusCount = data.filter((item) => {
      const tier = String(item.level || item.tier || item.journal_level || '').toLowerCase();
      const name = String(item.journal_name || item.source || '').toLowerCase();
      return tier.includes('scopus') || tier.includes('wos') || tier.includes('นานาชาติ') || name.includes('scopus');
    }).length;

    const tciCount = data.filter((item) => {
      const tier = String(item.level || item.tier || '').toLowerCase();
      return tier.includes('tci');
    }).length;

    metrics.push(
      { label: 'บทความตีพิมพ์ระดับนานาชาติ (Scopus/WoS)', value: formatNumber(scopusCount), unit: 'เรื่อง', category: 'ระดับผลงาน' },
      { label: 'บทความตีพิมพ์ระดับชาติ (TCI)', value: formatNumber(tciCount), unit: 'เรื่อง', category: 'ระดับผลงาน' }
    );
  } else if (categoryKey === 'service' || page === 'service') {
    const totalRevenue = data.reduce((sum, item) => sum + parseNumericValue(item.budget || item.revenue || item.total_amount), 0);
    const facultyFee = (totalRevenue * 15) / 100;

    metrics.push(
      { label: 'มูลค่ารายได้จากการบริการวิชาการรวม', value: formatNumber(totalRevenue, 2), unit: 'บาท', category: 'รายได้' },
      { label: 'เงินหักสมทบเข้าคณะ (15%)', value: formatNumber(facultyFee, 2), unit: 'บาท', category: 'รายได้' }
    );
  } else if (categoryKey === 'ip' || page === 'ip') {
    const granted = data.filter((item) => {
      const status = String(item.status || item.stage || item._pipelineStage || '').toLowerCase();
      return status.includes('คุ้มครอง') || status.includes('granted') || status.includes('จดทะเบียน');
    }).length;
    const pending = data.filter((item) => {
      const status = String(item.status || item.stage || item._pipelineStage || '').toLowerCase();
      return status.includes('ยื่น') || status.includes('pending') || status.includes('คำขอ');
    }).length;

    metrics.push(
      { label: 'ผลงานที่ได้รับการขึ้นทะเบียน/คุ้มครองแล้ว', value: formatNumber(granted), unit: 'รายการ', category: 'สถานะ' },
      { label: 'ผลงานที่ยื่นคำขอแล้ว (อยู่ระหว่างตรวจสอบ)', value: formatNumber(pending), unit: 'รายการ', category: 'สถานะ' }
    );
  } else if (page === 'evaluation') {
    const evaluated = data.filter((item) => item.status === 'ประเมินแล้ว' || item.is_evaluated === true).length;
    const unevaluated = count - evaluated;
    const percent = count > 0 ? ((evaluated / count) * 100).toFixed(1) : '0';

    metrics.push(
      { label: 'รายการที่ประเมินแล้ว', value: formatNumber(evaluated), unit: 'รายการ', category: 'ความก้าวหน้า' },
      { label: 'รายการที่ยังไม่ประเมิน', value: formatNumber(unevaluated), unit: 'รายการ', category: 'ความก้าวหน้า' },
      { label: 'สัดส่วนความก้าวหน้าการประเมิน', value: `${percent}%`, unit: '', category: 'ความก้าวหน้า' }
    );
  }

  return metrics;
}

/**
 * คำนวณตารางสถิติตามมิติอัตโนมัติ (เช่น แจกแจงตามภาควิชา) เมื่อหน้าไม่ได้ส่ง breakdowns มา
 */
export function autoDeriveBreakdowns(categoryKey: string | undefined, data: any[]): ExportBreakdownTable[] {
  if (!data || data.length === 0) return [];

  const deptMap: Record<string, { count: number; totalBudget: number }> = {};
  const hasBudget = data.some((item) => item.budget !== undefined && item.budget !== null);

  data.forEach((item) => {
    const rawDept = item.department || item.responsible_department || 'ไม่ระบุสังกัด';
    const dept = normalizeDepartmentName(rawDept);
    if (!deptMap[dept]) {
      deptMap[dept] = { count: 0, totalBudget: 0 };
    }
    deptMap[dept].count += 1;
    if (hasBudget) {
      deptMap[dept].totalBudget += parseNumericValue(item.budget);
    }
  });

  const sortedDepts = Object.entries(deptMap).sort((a, b) => b[1].count - a[1].count);

  if (hasBudget) {
    return [
      {
        title: 'การแจกแจงข้อมูลจำแนกตามภาควิชา/หน่วยงาน',
        headers: ['ลำดับ', 'ภาควิชา / หน่วยงาน', 'จำนวนรายการ (เรื่อง/โครงการ)', 'สัดส่วนรายการ (%)', 'งบประมาณรวม (บาท)', 'สัดส่วนงบประมาณ (%)'],
        rows: sortedDepts.map(([dept, stats], idx) => {
          const totalCount = data.length;
          const totalAllBudget = data.reduce((s, it) => s + parseNumericValue(it.budget), 0);
          const countPct = totalCount > 0 ? ((stats.count / totalCount) * 100).toFixed(1) + '%' : '0%';
          const budgetPct = totalAllBudget > 0 ? ((stats.totalBudget / totalAllBudget) * 100).toFixed(1) + '%' : '0%';
          return [idx + 1, dept, stats.count, countPct, stats.totalBudget, budgetPct];
        }),
        colWidths: [8, 38, 26, 18, 24, 20],
      },
    ];
  }

  return [
    {
      title: 'การแจกแจงข้อมูลจำแนกตามภาควิชา/หน่วยงาน',
      headers: ['ลำดับ', 'ภาควิชา / หน่วยงาน', 'จำนวนรายการ (เรื่อง/โครงการ)', 'สัดส่วนรายการ (%)'],
      rows: sortedDepts.map(([dept, stats], idx) => {
        const totalCount = data.length;
        const countPct = totalCount > 0 ? ((stats.count / totalCount) * 100).toFixed(1) + '%' : '0%';
        return [idx + 1, dept, stats.count, countPct];
      }),
      colWidths: [8, 38, 26, 18],
    },
  ];
}

/**
 * สร้าง Worksheet สรุปภาพรวมและตัวชี้วัดทั้งหมดที่แสดงบนหน้า (Summary Sheet)
 */
export function buildSummaryWorksheet(options: UnifiedExportOptions): XLSX.WorkSheet {
  const {
    title = 'รายงานสรุปผลการดำเนินงาน',
    subtitle = 'คณะวิศวกรรมศาสตร์ กำแพงแสน มหาวิทยาลัยเกษตรศาสตร์',
    page,
    section = 'full_page',
    periodLabel = 'ปีงบประมาณ 2568-2569',
    filterSummary,
    metrics = [],
    breakdowns = [],
    tableData = [],
    categoryKey,
  } = options;

  // รวม metrics ถ้าไม่ได้ส่งมา
  const effectiveMetrics = metrics.length > 0 ? metrics : autoDeriveMetrics(categoryKey, tableData, page);
  // รวม breakdowns ถ้าไม่ได้ส่งมา
  const effectiveBreakdowns = breakdowns.length > 0 ? breakdowns : autoDeriveBreakdowns(categoryKey, tableData);

  const rows: any[][] = [];

  // Header Block
  rows.push([title]);
  rows.push([subtitle]);
  rows.push([
    `หมวด/หน้า: ${page.toUpperCase()} | ส่วนที่ส่งออก: ${section} | รอบรายงาน: ${periodLabel} | วันที่ส่งออกข้อมูล: ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
  ]);

  // Active Filters Info
  if (filterSummary && Object.keys(filterSummary).length > 0) {
    const filterTexts = Object.entries(filterSummary)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '' && v !== 'all')
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');
    if (filterTexts) {
      rows.push([`เงื่อนไขตัวกรองที่เลือกใช้งาน: ${filterTexts}`]);
    } else {
      rows.push(['เงื่อนไขตัวกรองที่เลือกใช้งาน: ข้อมูลทั้งหมด (ไม่มีการกรองจำกัดสิทธิ์)']);
    }
  } else {
    rows.push(['เงื่อนไขตัวกรองที่เลือกใช้งาน: ข้อมูลทั้งหมด']);
  }

  rows.push([]); // บรรทัดว่าง

  // Section 1: สรุปตัวชี้วัดและข้อมูลสถิติสำคัญที่แสดงบนหน้า
  rows.push(['=== 1. สรุปตัวชี้วัดและข้อมูลสถิติสำคัญที่แสดงบนหน้าจอ (Executive Key Metrics) ===']);
  rows.push(['ลำดับ', 'หมวดหมู่', 'ตัวชี้วัด / ข้อมูลสถิติ', 'มูลค่า / จำนวน', 'หน่วยนับ', 'หมายเหตุ']);

  effectiveMetrics.forEach((m, idx) => {
    rows.push([
      idx + 1,
      m.category || 'ภาพรวม',
      m.label,
      m.value,
      m.unit || '-',
      m.note || '-',
    ]);
  });

  rows.push([]); // บรรทัดว่าง

  // Section 2: ตารางแจกแจงสถิติตามมิติ (Breakdown Tables)
  if (effectiveBreakdowns.length > 0) {
    effectiveBreakdowns.forEach((bd, bIdx) => {
      rows.push([`=== 2.${bIdx + 1} ${bd.title} ===`]);
      rows.push(bd.headers);
      bd.rows.forEach((r) => rows.push(r));
      rows.push([]);
    });
  }

  // Section 3: สรุปความเชื่อมโยงกับชีตรายละเอียด
  rows.push(['=== ข้อมูลอ้างอิงและคำแนะนำ ===']);
  rows.push(['* รายการข้อมูลละเอียดทั้งหมดตามตัวกรองปัจจุบัน ได้ถูกรวบรวมไว้ในแผ่นงานถัดไป ("รายการข้อมูลรายละเอียด")']);
  rows.push(['* ข้อมูลนี้ถูกประมวลผลจากระบบคลังข้อมูลกลาง (Data Warehouse Dashboard) คณะวิศวกรรมศาสตร์ กำแพงแสน']);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // กำหนดความกว้างคอลัมน์อัตโนมัติ
  ws['!cols'] = [
    { wch: 8 },  // ลำดับ
    { wch: 20 }, // หมวดหมู่
    { wch: 45 }, // ตัวชี้วัด / รายละเอียด
    { wch: 25 }, // มูลค่า / จำนวน
    { wch: 15 }, // หน่วยนับ
    { wch: 30 }, // หมายเหตุ
  ];

  return ws;
}

/**
 * สร้าง Worksheet ตารางข้อมูลรายละเอียด (Detail Data Sheet)
 */
export function buildDetailWorksheet(
  data: any[],
  categoryKey?: string,
  customColumns?: ExportSheetColumn[]
): XLSX.WorkSheet {
  if (!data || data.length === 0) {
    return XLSX.utils.aoa_to_sheet([['ไม่มีข้อมูลสำหรับเงื่อนไขที่เลือก']]);
  }

  // หากเป็น category personnel
  if (categoryKey === 'personnel') {
    const exportRows = data.map((row, idx) => {
      const split = row.first_name || row.last_name
        ? { first_name: row.first_name || '', last_name: row.last_name || '' }
        : splitFullName(row.name || row.name_th || '', row.title_th);
      return {
        'ลำดับ': idx + 1,
        'คำนำหน้า': row.title_th || row.prefix || '-',
        'ชื่อ': split.first_name || '-',
        'นามสกุล': split.last_name || '-',
        'ตำแหน่งทางวิชาการ': row.position || '-',
        'สังกัด': row.department || '-',
        'อีเมล KU': row.email || '-',
      };
    });
    const ws = XLSX.utils.json_to_sheet(exportRows);
    ws['!cols'] = [{ wch: 8 }, { wch: 15 }, { wch: 22 }, { wch: 25 }, { wch: 25 }, { wch: 35 }, { wch: 30 }];
    return ws;
  }

  // หากมี Custom Columns กำหนดมา
  if (customColumns && customColumns.length > 0) {
    const exportRows = data.map((row, idx) => {
      const item: Record<string, any> = { 'ลำดับ': idx + 1 };
      customColumns.forEach((col) => {
        const colTitle = col.label.replace(/\r?\n/g, ' ').trim();
        if (col.format) {
          item[colTitle] = col.format(row[col.key], row);
        } else {
          item[colTitle] = row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '-';
        }
      });
      return item;
    });

    const ws = XLSX.utils.json_to_sheet(exportRows);
    ws['!cols'] = [{ wch: 8 }, ...customColumns.map((col) => ({ wch: col.width || Math.max(col.label.length * 2.2, 18) }))];
    return ws;
  }

  // ใช้ Columns จาก CATEGORIES_CONFIG ถ้ามี
  const config = categoryKey && (CATEGORIES_CONFIG as any)[categoryKey];
  if (config && config.columns) {
    const activeCols = config.columns;
    const exportRows = data.map((row, idx) => {
      const item: Record<string, any> = { 'ลำดับ': idx + 1 };
      activeCols.forEach((col: any) => {
        const colTitle = col.label.replace(/\r?\n/g, ' ').trim();
        if (col.format) {
          item[colTitle] = col.format(row[col.key], row);
        } else if (col.type === 'ip_req_info') {
          item[colTitle] = row.application_number || row.req_no || '-';
        } else if (col.type === 'ip_reg_info') {
          item[colTitle] = row.registration_number || row.reg_no || '-';
        } else {
          item[colTitle] = row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '-';
        }
      });
      return item;
    });

    const ws = XLSX.utils.json_to_sheet(exportRows);
    ws['!cols'] = [
      { wch: 8 },
      ...activeCols.map((col: any) => ({ wch: Math.max(col.label.length * 2.2, 18) })),
    ];
    return ws;
  }

  // Fallback: ใช้ json_to_sheet โดยตรงถ้าไม่มี schema
  const fallbackRows = data.map((r, i) => ({ 'ลำดับ': i + 1, ...r }));
  const ws = XLSX.utils.json_to_sheet(fallbackRows);
  return ws;
}

/**
 * ฟังก์ชันหลักของระบบ Unified Export Engine:
 * ส่งออกไฟล์ Excel แบบไม่ hardcode โดยสร้าง Sheet สรุปภาพรวม (Summary) + Sheet รายการข้อมูล (Details) + Custom Sheets
 */
export function exportUnifiedPageExcel(options: UnifiedExportOptions): void {
  if (typeof window === 'undefined') return;

  const {
    page,
    section = 'full_page',
    categoryKey,
    tableData = [],
    columns,
    customSheets = [],
    fileName,
  } = options;

  const wb = XLSX.utils.book_new();

  // 1. สร้างและแทรกแผ่นงานสรุปภาพรวม (Summary Sheet)
  const wsSummary = buildSummaryWorksheet(options);
  const summarySheetName = `สรุปภาพรวม_${categoryKey || page}`.substring(0, 31);
  XLSX.utils.book_append_sheet(wb, wsSummary, summarySheetName);

  // 2. สร้างและแทรกแผ่นงานตารางข้อมูลรายการ (Detail Sheet)
  if (tableData && tableData.length > 0) {
    const wsDetail = buildDetailWorksheet(tableData, categoryKey, columns);
    const detailSheetName = `รายการข้อมูล_${categoryKey || page}`.substring(0, 31);
    XLSX.utils.book_append_sheet(wb, wsDetail, detailSheetName);
  }

  // 3. แทรก Custom Sheets เพิ่มเติมถ้ามี
  if (customSheets && customSheets.length > 0) {
    customSheets.forEach((cs) => {
      const ws = buildDetailWorksheet(cs.data, undefined, cs.columns);
      XLSX.utils.book_append_sheet(wb, ws, cs.sheetName.substring(0, 31));
    });
  }

  // 4. บันทึกและดาวน์โหลดไฟล์
  const dateStr = new Date().toISOString().substring(0, 10);
  const safeTitle = options.title ? options.title.replace(/[^a-zA-Z0-9ก-๙_-]/g, '_') : `${page}_${section}`;
  const outFileName = fileName || `KU_KPS_${safeTitle}_${dateStr}.xlsx`;

  XLSX.writeFile(wb, outFileName);
}

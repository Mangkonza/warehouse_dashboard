import { KPIItem, KPIComputedResult, KPICategory } from '../types/kpi';

// ภาควิชาหลักทั้ง 7 ของคณะวิศวกรรมศาสตร์ กำแพงแสน
export const ENGINEERING_DEPARTMENTS = [
  'วิศวกรรมเกษตร',
  'วิศวกรรมคอมพิวเตอร์',
  'วิศวกรรมชลประทาน',
  'วิศวกรรมอาหาร',
  'วิศวกรรมอุตสาหการ',
  'วิศวกรรมเครื่องกล',
  'วิศวกรรมโยธา',
];

// ชุดตัวชี้วัดยุทธศาสตร์เริ่มต้น อ้างอิงตามรายงานตัวชี้วัดจริง คณะวิศวกรรมศาสตร์ กำแพงแสน ปีงบประมาณ 2568-2569
export const DEFAULT_KPIS: KPIItem[] = [
  {
    id: 'kpi-2-1-1',
    code: 'KPI 2.1-1',
    title: 'การตีพิมพ์บทความวิจัยระดับนานาชาติ (Scopus/WoS)',
    category: 'publications',
    fiscalYear: '2569',
    targetValue: 330,
    unit: 'เรื่อง',
    calcType: 'auto_count',
    datasetKey: 'publications',
    description: 'จำนวนบทความที่ได้รับการตีพิมพ์ในวารสารวิชาการระดับนานาชาติที่อยู่ในฐานข้อมูล Scopus หรือ Web of Science',
    responsibleUnit: 'รองคณบดีฝ่ายวิจัย / คณาจารย์ทุกภาควิชา',
  },
  {
    id: 'kpi-2-1-2',
    code: 'KPI 2.1-2',
    title: 'โครงการวิจัยขนาดใหญ่ (Mega Projects งบประมาณ > 10 ล้านบาท)',
    category: 'research',
    fiscalYear: '2569',
    targetValue: 5,
    unit: 'โครงการ',
    calcType: 'auto_filtered_count',
    datasetKey: 'research',
    filterConfig: {
      field: 'budget_external',
      operator: 'gte',
      value: 10000000,
    },
    description: 'โครงการวิจัยที่ได้รับจัดสรรงบประมาณจากแหล่งทุนภายนอกเกิน 10 ล้านบาทต่อโครงการ',
    responsibleUnit: 'หัวหน้าโครงการวิจัย / ฝ่ายส่งเสริมการวิจัย',
  },
  {
    id: 'kpi-2-1-6',
    code: 'KPI 2.1-6',
    title: 'งบประมาณวิจัยที่ได้รับจัดสรรจากแหล่งทุนภายนอก',
    category: 'research',
    fiscalYear: '2569',
    targetValue: 100000000,
    unit: 'บาท',
    calcType: 'auto_sum',
    datasetKey: 'research',
    sumField: 'budget_external',
    description: 'ยอดเงินทุนวิจัยที่ได้รับสนับสนุนจากหน่วยงานให้ทุนภายนอก (บพข., สกสว., วช., เอกชน)',
    responsibleUnit: 'ฝ่ายวิจัยและนวัตกรรม',
  },
  {
    id: 'kpi-2-2-1',
    code: 'KPI 2.2-1',
    title: 'รายได้จากการให้บริการวิชาการและการจัดฝึกอบรม',
    category: 'academic',
    fiscalYear: '2569',
    targetValue: 50000000,
    unit: 'บาท',
    calcType: 'auto_sum',
    datasetKey: 'academic',
    sumField: 'budget',
    description: 'มูลค่างานบริการวิชาการ โครงการจ้างที่ปรึกษา และการจัดอบรมภายนอก',
    responsibleUnit: 'ศูนย์บริการวิชาการ / ภาควิชา',
  },
  {
    id: 'kpi-2-3-2',
    code: 'KPI 2.3-2',
    title: 'การยื่นจดทะเบียนทรัพย์สินทางปัญญา (สิทธิบัตร/อนุสิทธิบัตร/ลิขสิทธิ์)',
    category: 'ip',
    fiscalYear: '2569',
    targetValue: 15,
    unit: 'รายการ',
    calcType: 'auto_count',
    datasetKey: 'ip',
    description: 'ผลงานประดิษฐ์และนวัตกรรมที่ได้รับการยื่นคำขอจดทรัพย์สินทางปัญญากับกรมทรัพย์สินทางปัญญา',
    responsibleUnit: 'หน่วยทรัพย์สินทางปัญญาและถ่ายทอดเทคโนโลยี',
  },
  {
    id: 'kpi-3-1-1',
    code: 'KPI 3.1-1',
    title: 'การมีส่วนร่วมด้านการวิจัยครบถ้วนทั้ง 7 ภาควิชา',
    category: 'strategy',
    fiscalYear: '2569',
    targetValue: 7,
    unit: 'ภาควิชา',
    calcType: 'auto_completeness',
    datasetKey: 'research',
    completenessField: 'department',
    completenessExpected: ENGINEERING_DEPARTMENTS,
    description: 'ติดตามให้ทุกภาควิชาในคณะวิศวกรรมศาสตร์มีการดำเนินโครงการวิจัยอย่างทั่วถึง',
    responsibleUnit: 'หัวหน้าภาควิชา 7 ภาควิชา',
  },
  {
    id: 'kpi-1-3-3',
    code: 'KPI 1.3-3',
    title: 'อาจารย์และศิษย์เก่าได้รับใบอนุญาตประกอบวิชาชีพวิศวกรรมควบคุม (กว.)',
    category: 'personnel',
    fiscalYear: '2569',
    targetValue: 5,
    unit: 'ราย',
    calcType: 'manual',
    manualProgress: 58,
    datasetKey: 'personnel',
    description: 'จำนวนอาจารย์และวิศวกรที่สอบผ่านและได้รับใบอนุญาตประกอบวิชาชีพวิศวกรรมควบคุมระดับสามัญหรือวุฒิวิศวกร',
    responsibleUnit: 'ฝ่ายพัฒนาวิชาการและวิชาชีพ',
  },
  {
    id: 'kpi-4-1-1',
    code: 'KPI 4.1-1',
    title: 'ความร่วมมือทางวิชาการ (MOU) กับหน่วยงานภาครัฐและเอกชน',
    category: 'strategy',
    fiscalYear: '2569',
    targetValue: 50,
    unit: 'ฉบับ',
    calcType: 'manual',
    manualProgress: 55,
    datasetKey: 'service',
    description: 'การลงนามบันทึกข้อตกลงความร่วมมือทางวิชาการและการวิจัยทั้งในและต่างประเทศ',
    responsibleUnit: 'ฝ่ายวิเทศสัมพันธ์และความร่วมมือ',
  },
];

const STORAGE_KEY = 'ku_warehouse_dynamic_kpis_v2';

export const parseNumber = (val: any): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// ==========================================
// LocalStorage KPI Persistence
// ==========================================
export const getStoredKPIs = (): KPIItem[] => {
  if (typeof window === 'undefined') return DEFAULT_KPIS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load KPIs from localStorage, using default:', err);
  }
  return DEFAULT_KPIS;
};

export const saveStoredKPIs = (kpis: KPIItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(kpis));
    window.dispatchEvent(new CustomEvent('kpi_updated', { detail: kpis }));
  } catch (err) {
    console.error('Failed to save KPIs to localStorage:', err);
  }
};

export const resetKPIsToDefault = (): KPIItem[] => {
  saveStoredKPIs(DEFAULT_KPIS);
  return DEFAULT_KPIS;
};

export const addKPI = (kpi: Omit<KPIItem, 'id'>): KPIItem => {
  const current = getStoredKPIs();
  const newId = `kpi-${Date.now()}`;
  const newItem: KPIItem = {
    ...kpi,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updated = [...current, newItem];
  saveStoredKPIs(updated);
  return newItem;
};

export const updateKPI = (kpi: KPIItem): KPIItem => {
  const current = getStoredKPIs();
  const updated = current.map((item) => (item.id === kpi.id ? { ...kpi, updatedAt: new Date().toISOString() } : item));
  saveStoredKPIs(updated);
  return kpi;
};

export const deleteKPI = (id: string): void => {
  const current = getStoredKPIs();
  const updated = current.filter((item) => item.id !== id);
  saveStoredKPIs(updated);
};

// ==========================================
// Dynamic KPI Evaluation Engine
// ==========================================
export const evaluateKPI = (kpi: KPIItem, datasets: Record<string, any[]>): KPIComputedResult => {
  const rawData = datasets[kpi.datasetKey] || [];
  // กรองรายการขยะ เช่น nan, NaT, เรื่อง
  const data = rawData.filter(
    (item) => item && item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง'
  );

  let currentValue = 0;
  const details: KPIComputedResult['details'] = {};

  switch (kpi.calcType) {
    case 'auto_sum': {
      const field = kpi.sumField || 'budget';
      currentValue = data.reduce((acc, cur) => acc + parseNumber(cur[field]), 0);
      break;
    }

    case 'auto_count': {
      currentValue = data.length;
      break;
    }

    case 'auto_filtered_count': {
      if (!kpi.filterConfig) {
        currentValue = data.length;
        break;
      }
      const { field, operator, value } = kpi.filterConfig;
      const matched = data.filter((item) => {
        const itemVal = item[field];
        if (operator === 'gte') {
          return parseNumber(itemVal) >= parseNumber(value);
        }
        if (operator === 'lte') {
          return parseNumber(itemVal) <= parseNumber(value);
        }
        if (operator === 'equals') {
          return String(itemVal).trim().toLowerCase() === String(value).trim().toLowerCase();
        }
        if (operator === 'contains') {
          return String(itemVal).toLowerCase().includes(String(value).toLowerCase());
        }
        if (operator === 'not_empty') {
          return itemVal && itemVal !== 'nan' && itemVal !== '-';
        }
        return false;
      });
      currentValue = matched.length;
      details.matchCount = matched.length;
      details.sampleMatches = matched.slice(0, 3);
      break;
    }

    case 'auto_completeness': {
      const expected = kpi.completenessExpected || ENGINEERING_DEPARTMENTS;
      const field = kpi.completenessField || 'department';
      const presentDepts = new Set<string>();

      data.forEach((item) => {
        const deptStr = String(item[field] || '');
        expected.forEach((exp) => {
          // เปรียบเทียบแบบยืดหยุ่น เช่น "วิศวกรรมเกษตร" กับ "ภาควิชา\nวิศวกรรมเกษตร"
          const cleanExp = exp.replace(/วิศวกรรม/g, '').trim();
          if (deptStr.includes(exp) || (cleanExp && deptStr.includes(cleanExp))) {
            presentDepts.add(exp);
          }
        });
      });

      const completed = Array.from(presentDepts);
      const missing = expected.filter((d) => !presentDepts.has(d));

      currentValue = completed.length;
      details.completedDepartments = completed;
      details.missingDepartments = missing;
      break;
    }

    case 'manual':
    default: {
      currentValue = kpi.manualProgress ?? 0;
      break;
    }
  }

  const target = kpi.targetValue || 1;
  const percentage = Math.round((currentValue / target) * 100);
  const variance = currentValue - target;

  let status: KPIComputedResult['status'] = 'behind';
  let statusLabel = 'ต้องเร่งรัด';
  let statusColor = '#dc2626';

  if (percentage >= 100) {
    status = 'achieved';
    statusLabel = 'บรรลุเป้าหมาย';
    statusColor = '#059669';
  } else if (percentage >= 70) {
    status = 'on_track';
    statusLabel = 'เป็นไปตามเป้า';
    statusColor = '#0284c7';
  } else if (percentage >= 40) {
    status = 'at_risk';
    statusLabel = 'เฝ้าระวัง';
    statusColor = '#d97706';
  }

  return {
    kpi,
    currentValue,
    targetValue: target,
    percentage,
    status,
    statusLabel,
    statusColor,
    variance,
    details,
  };
};

export const evaluateAllKPIs = (
  kpis: KPIItem[],
  datasets: Record<string, any[]>
): KPIComputedResult[] => {
  return kpis.map((kpi) => evaluateKPI(kpi, datasets));
};

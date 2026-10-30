import { CategoryConfig, CategoryKey } from '../types/dataManagement';
export type { CategoryConfig, CategoryKey };

export const CANONICAL_DEPARTMENTS = [
  'ภาควิชาวิศวกรรมเกษตร',
  'ภาควิชาวิศวกรรมคอมพิวเตอร์',
  'ภาควิชาวิศวกรรมชลประทาน',
  'ภาควิชาวิศวกรรมอาหาร',
  'ภาควิชาวิศวกรรมอุตสาหการ',
  'ภาควิชาวิศวกรรมเครื่องกล',
  'ภาควิชาวิศวกรรมโยธา',
] as const;

export function normalizeDepartmentName(raw?: string): string {
  if (!raw) return 'อื่นๆ / ไม่ระบุ';
  const clean = String(raw).replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (clean.includes('เกษตร') || clean.includes('ABE')) return 'ภาควิชาวิศวกรรมเกษตร';
  if (clean.includes('คอมพิวเตอร์') || clean.includes('CPE')) return 'ภาควิชาวิศวกรรมคอมพิวเตอร์';
  if (clean.includes('ชลประทาน') || clean.includes('IRE')) return 'ภาควิชาวิศวกรรมชลประทาน';
  if (clean.includes('อาหาร') || clean.includes('FE')) return 'ภาควิชาวิศวกรรมอาหาร';
  if (clean.includes('อุตสาหการ') || clean.includes('IE')) return 'ภาควิชาวิศวกรรมอุตสาหการ';
  if (clean.includes('เครื่องกล') || clean.includes('ME')) return 'ภาควิชาวิศวกรรมเครื่องกล';
  if (clean.includes('โยธา') || clean.includes('CE')) return 'ภาควิชาวิศวกรรมโยธา';
  if (clean.includes('ศูนย์') || clean.includes('ทดสอบ') || clean.includes('สำนักงาน')) return 'ศูนย์วิจัยและบริการวิชาการ';
  return 'อื่นๆ / ภายนอก';
}

export const DEPARTMENTS = CANONICAL_DEPT_LIST.map((d) => d.name);

import { getDepartment, DEPARTMENTS as CANONICAL_DEPT_LIST } from '@/lib/departments';
import { formatDateBE } from '@/components/ui/RecordDetailDrawer';

export const DEPARTMENT_ABBR_MAP: Record<string, string> = {
  // Legacy mappings for backwards compatibility
  'ภาควิชาวิศวกรรมการเกษตร': 'AE',
  'ภาควิชาวิศวกรรมเกษตร': 'AE',
  'วิศวกรรมการเกษตร': 'AE',
  'วิศวกรรมเกษตร': 'AE',
  'ภาควิชาวิศวกรรมคอมพิวเตอร์': 'CPE',
  'วิศวกรรมคอมพิวเตอร์': 'CPE',
  'ภาควิชาวิศวกรรมชลประทาน': 'IRE',
  'วิศวกรรมชลประทาน': 'IRE',
  'ภาควิชาวิศวกรรมอาหาร': 'FE',
  'ภาควิชาวิศวกรรมการอาหาร': 'FE',
  'วิศวกรรมอาหาร': 'FE',
  'วิศวกรรมการอาหาร': 'FE',
  'ภาควิชาวิศวกรรมอุตสาหการ': 'IE',
  'วิศวกรรมอุตสาหการ': 'IE',
  'ภาควิชาวิศวกรรมเครื่องกล': 'ME',
  'วิศวกรรมเครื่องกล': 'ME',
  'ภาควิชาวิศวกรรมโยธา': 'CE',
  'วิศวกรรมโยธา': 'CE',
  'ศูนย์ปฏิบัติการวิศวกรรมพลังงานและสิ่งแวดล้อม': 'EEEC',
  'ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร': 'DWT',
  'ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ': 'NAMC',
  'สำนักงานเลขานุการ': 'OFS',
};

export const getDepartmentAbbr = (dept: string): string => {
  if (!dept || dept === '-' || dept === 'nan' || dept === 'ü' || dept === 'P') return '-';
  const rawList = String(dept).split(',').map((s) => s.trim()).filter(Boolean);
  if (rawList.length > 1) {
    return rawList.map((item) => getDepartment(item).code).join(', ');
  }
  return getDepartment(dept).code;
};

const COLLABORATION_LABEL_MAP: Record<string, string> = {
  internal_ku: 'ร่วมมือกับหน่วยงานภายในมหาวิทยาลัยเกษตรศาสตร์',
  domestic_academic: 'ร่วมมือกับสถาบันการศึกษา / หน่วยงานวิจัยในประเทศ',
  domestic_industry: 'ร่วมมือกับภาคเอกชน / ภาคอุตสาหกรรมในประเทศ',
  international: 'ร่วมมือกับสถาบันหรือองค์กรต่างประเทศ',
};

const PROJECT_NATURE_LABEL_MAP: Record<string, string> = {
  basic: 'การวิจัยพื้นฐาน',
  applied: 'การวิจัยประยุกต์',
  experimental: 'การพัฒนาเชิงทดลอง',
  commercialization: 'การถ่ายทอดเทคโนโลยีหรือเชิงพาณิชย์',
};

function parseListValue(raw: any): any[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed || trimmed === '-' || trimmed === 'nan') return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // fallback to comma split
      }
    }
    return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function formatCourseList(rawCourses: any, fallbackStr?: any): string[] | string {
  const list = parseListValue(rawCourses);
  if (list.length > 0) {
    const mapped = list
      .map((c: any) => {
        if (typeof c === 'object' && c !== null) {
          const code = c.code ? `[${c.code}] ` : '';
          const name = c.name || c.title || '';
          return `${code}${name}`.trim();
        }
        return String(c).trim();
      })
      .filter(Boolean);
    if (mapped.length > 0) return mapped;
  }
  if (fallbackStr && String(fallbackStr).trim() && fallbackStr !== '-' && fallbackStr !== 'nan') {
    return String(fallbackStr).trim();
  }
  return '-';
}

function formatTrlOutputs(rawOutputs: any): string[] | string {
  const list = parseListValue(rawOutputs);
  if (list.length > 0) {
    const mapped = list
      .map((t: any, idx: number) => {
        if (typeof t === 'object' && t !== null) {
          const name = t.name || t.title || `ผลผลิตที่ ${idx + 1}`;
          const lvl = t.trl ?? t.trl_level;
          const note = t.note ? ` (${t.note})` : '';
          return `${name}${lvl ? ` — TRL ${lvl}` : ''}${note}`;
        }
        return String(t).trim();
      })
      .filter(Boolean);
    if (mapped.length > 0) return mapped;
  }
  return '-';
}

export const CATEGORIES_CONFIG: Record<CategoryKey, CategoryConfig> = {
  monitoring: {
    key: 'monitoring',
    title: 'ติดตามสถานะโครงการ',
    titleEn: 'Project Monitoring & Timeline',
    icon: 'fa-clock',
    color: '#0284c7',
    description: 'ติดตามกำหนดการ วันเริ่ม-สิ้นสุด การขอขยายเวลา และสถานะการดำเนินงานตามระเบียบ มก.',
    primaryKey: 'id',
    nameKey: 'name',
    columns: [],
    templateSampleRows: [],
    searchFields: ['name', 'head', 'department', 'status'],
  },

  research: {
    key: 'research',
    title: 'โครงการวิจัย',
    titleEn: 'Research Projects',
    icon: 'fa-flask',
    color: '#00A651',
    primaryKey: 'id',
    nameKey: 'name',
    departmentKey: 'department',
    personKey: 'head',
    columns: [
      {
        key: 'id',
        label: 'รหัสโครงการ',
        type: 'text',
        width: '8%',
        align: 'center',
        format: (val) => {
          if (!val || typeof val !== 'string' || /^research_idx_\d+$/i.test(val.trim())) {
            return '-';
          }
          return val;
        },
      },
      { key: 'name', label: 'ชื่อโครงการ', type: 'text', width: '24%', required: true },
      { key: 'head', label: 'หัวหน้าโครงการ', type: 'text', width: '12%', required: true },
      { key: 'department', label: 'สังกัดที่รับผิดชอบ', type: 'badge', width: '8%' },
      { key: 'budget_internal', label: 'งบภายใน (บาท)', type: 'currency', width: '10%', align: 'right' },
      { key: 'budget_external', label: 'งบภายนอก (บาท)', type: 'currency', width: '10%', align: 'right' },
      { key: 'fund_source', label: 'แหล่งทุนวิจัย', type: 'text', width: '10%' },
      { key: 'duration', label: 'ระยะเวลา', type: 'research_duration', width: '8%', align: 'center' },
    ],
    detailGroups: [
      {
        groupLabel: 'ข้อมูลโครงการวิจัย',
        fields: [
          {
            key: 'id',
            label: 'รหัสโครงการวิจัย',
            getValue: (item) => {
              const v = item.code || item.id;
              if (!v || /^research_idx_\d+$/i.test(String(v).trim())) return '-';
              return String(v);
            },
          },
          {
            key: 'fiscal_year_be',
            label: 'ปีงบประมาณ (พ.ศ.)',
            getValue: (item) => item.fiscal_year_be || item.fiscal_year || '-',
          },
          { key: 'name', label: 'ชื่อโครงการวิจัย (ภาษาไทย)', span: 2 },
          {
            key: 'name_en',
            label: 'ชื่อโครงการวิจัย (ภาษาอังกฤษ)',
            span: 2,
            getValue: (item) => item.name_en || '-',
          },
          { key: 'fund_source', label: 'แหล่งทุนวิจัย', getValue: (item) => item.fund_source || '-' },
          {
            key: 'fund_type',
            label: 'ประเภททุนวิจัย',
            getValue: (item) => {
              if (!item.fund_type || item.fund_type === '-') return '-';
              if (item.fund_type === 'ภายใน') return 'ทุนภายใน';
              if (item.fund_type === 'ภายนอก') return 'ทุนภายนอก';
              return String(item.fund_type);
            },
          },
          { key: 'start_date', label: 'ระยะเวลาดำเนินโครงการ (เริ่มต้น)', type: 'date' },
          { key: 'end_date', label: 'ระยะเวลาดำเนินโครงการ (สิ้นสุด)', type: 'date' },
        ],
      },
      {
        groupLabel: 'คณะผู้วิจัยและสังกัด',
        fields: [
          { key: 'head', label: 'หัวหน้าโครงการวิจัย', type: 'person' },
          {
            key: 'department',
            label: 'สังกัดที่รับผิดชอบ',
            type: 'department',
            getValue: (item) => item.department || '-',
          },
          {
            key: 'departments',
            label: 'สังกัดที่ร่วมรับผิดชอบ (ถ้ามีหลายสังกัด)',
            type: 'department',
            span: 2,
            getValue: (item) => item.departments || item.department || '-',
          },
          {
            key: 'co_researchers',
            label: 'ผู้ร่วมวิจัย (Co-Researchers)',
            type: 'person_list',
            span: 2,
            getValue: (item) => item.co_researchers || item.members,
          },
        ],
      },
      {
        groupLabel: 'ความร่วมมือ ลักษณะโครงการ และงบประมาณ',
        fields: [
          {
            key: 'collaboration_type',
            label: 'ลักษณะความร่วมมือของโครงการวิจัย',
            type: 'list',
            span: 2,
            getValue: (item) => {
              const raw = parseListValue(item.collaboration_type);
              const extra = [item.collaboration_domestic, item.collaboration_foreign]
                .filter((x) => x && x !== '-' && x !== 'nan');
              const combined = [...raw, ...extra];
              if (combined.length === 0) return null;
              return combined.map((c: string) => {
                const s = String(c).trim();
                if (s.startsWith('other:')) return `ความร่วมมืออื่นๆ: ${s.replace('other:', '').trim()}`;
                return COLLABORATION_LABEL_MAP[s] || s;
              });
            },
          },
          {
            key: 'project_nature',
            label: 'ลักษณะโครงการวิจัย',
            type: 'list',
            span: 2,
            getValue: (item) => {
              const raw = parseListValue(item.project_nature);
              if (raw.length === 0) return null;
              return raw.map((n: string) => {
                const s = String(n).trim();
                if (s.startsWith('other:')) return `ลักษณะอื่นๆ: ${s.replace('other:', '').trim()}`;
                return PROJECT_NATURE_LABEL_MAP[s] || s;
              });
            },
          },
          { key: 'budget_internal', label: 'งบประมาณภายใน', type: 'currency' },
          { key: 'budget_external', label: 'งบประมาณภายนอก', type: 'currency' },
          {
            key: 'budget_total',
            label: 'งบประมาณรวม',
            type: 'currency',
            span: 2,
            getValue: (item) => {
              const bi = Number(item.budget_internal) || 0;
              const be = Number(item.budget_external) || 0;
              const total = bi + be;
              if (total > 0) return total;
              if (item.budget !== undefined && item.budget !== null && item.budget !== '') {
                return Number(item.budget) || 0;
              }
              return 0;
            },
          },
        ],
      },
      {
        groupLabel: 'การบูรณาการกับการเรียนการสอนและบริการวิชาการ',
        fields: [
          {
            key: 'teaching_courses',
            label: 'รายวิชาที่นำองค์ความรู้จากงานวิจัยไปใช้ในการเรียนการสอน',
            type: 'list',
            span: 2,
            getValue: (item) => {
              const res = formatCourseList(item.teaching_courses, item.integration_teaching);
              return res === '-' ? null : Array.isArray(res) ? res : [res];
            },
          },
          {
            key: 'applied_courses',
            label: 'รายวิชาที่นำผลงานวิจัย / ชิ้นงาน / ต้นแบบ ไปใช้ประโยชน์',
            type: 'list',
            span: 2,
            getValue: (item) => {
              const res = formatCourseList(item.applied_courses, item.integration_research_teaching);
              return res === '-' ? null : Array.isArray(res) ? res : [res];
            },
          },
          {
            key: 'academic_service',
            label: 'การนำผลงานไปบูรณาการกับงานบริการวิชาการ',
            span: 2,
            getValue: (item) => item.academic_service || item.integration_service_project || '-',
          },
          {
            key: 'cross_disciplinary',
            label: 'การบูรณาการข้ามศาสตร์ / สหวิทยาการ',
            span: 2,
            getValue: (item) => item.cross_disciplinary || '-',
          },
        ],
      },
      {
        groupLabel: 'ระดับความพร้อมทางเทคโนโลยี',
        fields: [
          {
            key: 'trl_start',
            label: 'ระดับ TRL เริ่มต้นโครงการ ',
            getValue: (item) => (item.trl_start ? `TRL ${item.trl_start}` : '-'),
          },
          {
            key: 'trl_end',
            label: 'ระดับ TRL เมื่อสิ้นสุดโครงการ ',
            getValue: (item) => {
              if (item.trl_end) return `TRL ${item.trl_end}`;
              if (item.trl) return String(item.trl).startsWith('TRL') ? String(item.trl) : `TRL ${item.trl}`;
              return '-';
            },
          },
          {
            key: 'trl_outputs',
            label: 'ผลงาน / ผลผลิตโครงการราย Output พร้อมระดับ TRL',
            type: 'list',
            span: 2,
            getValue: (item) => {
              const res = formatTrlOutputs(item.trl_outputs);
              return res === '-' ? null : Array.isArray(res) ? res : [res];
            },
          },
        ],
      },
    ],
    templateSampleRows: [
      { id: 'R-67-01', name: 'การพัฒนาระบบชลประทานอัจฉริยะสำหรับแปลงเกษตรแม่นยำ', head: 'ผศ.ดร.วันรัฐ อับดุลลากาซิม', department: 'ภาควิชาวิศวกรรมการเกษตร', budget_internal: 150000, budget_external: 500000, fund_source: 'วช.', status: 'active' },
      { id: 'R-67-02', name: 'การประยุกต์ใช้ AI ในการวิเคราะห์โครงสร้างอาคาร', head: 'รศ.ดร.ศิวลักษณ์ ปฐวีรัตน์', department: 'ภาควิชาวิศวกรรมคอมพิวเตอร์', budget_internal: 200000, budget_external: 800000, fund_source: 'สวทช.', status: 'active' },
    ],
    searchFields: ['id', 'name', 'head', 'department', 'fund_source', 'budget_internal', 'budget_external'],
  },

  academic: {
    key: 'academic',
    title: 'โครงการพัฒนาวิชาการ',
    titleEn: 'Academic Projects',
    icon: 'fa-graduation-cap',
    color: '#1565c0',
    primaryKey: 'name',
    nameKey: 'name',
    departmentKey: 'department',
    personKey: 'head',
    columns: [
      { key: 'name', label: 'ชื่อโครงการ', type: 'text', width: '33%', required: true },
      { key: 'head', label: 'หัวหน้าโครงการ', type: 'text', width: '15%', required: true },
      { key: 'department', label: 'สังกัดที่ดำเนินการ', type: 'badge', width: '9%' },
      { key: 'budget', label: 'งบประมาณ (บาท)', type: 'academic_budget', width: '13%', align: 'right' },
      { key: 'start_date', label: 'วันเริ่มต้น', type: 'date', width: '10%', align: 'center' },
      { key: 'end_date', label: 'วันสิ้นสุด', type: 'date', width: '10%', align: 'center' },
    ],
    detailGroups: [
      {
        groupLabel: 'ข้อมูลทั่วไปของโครงการพัฒนาวิชาการ',
        fields: [
          { key: 'name', label: 'ชื่อโครงการพัฒนาวิชาการ', span: 2 },
          {
            key: 'department',
            label: 'สังกัดที่ดำเนินการ',
            type: 'department',
            getValue: (item) => item.department || (item.head ? normalizeDepartmentName(item.head) : '-'),
          },
          {
            key: 'client',
            label: 'ผู้ขอรับบริการ / ว่าจ้าง',
            getValue: (item) => item.client || '-',
          },
          {
            key: 'characteristics',
            label: 'ลักษณะโครงการ',
            span: 2,
            getValue: (item) => {
              const list = parseListValue(item.characteristics);
              return list.length > 0 ? list.join(', ') : '-';
            },
          },
        ],
      },
      {
        groupLabel: 'บุคลากรและผู้ร่วมโครงการ',
        fields: [
          { key: 'head', label: 'หัวหน้าโครงการ', type: 'person', span: 2 },
          {
            key: 'co_members_internal',
            label: 'ผู้ร่วมโครงการ (ภายใน)',
            getValue: (item) =>
              item.co_members_internal !== undefined && item.co_members_internal !== null && item.co_members_internal !== ''
                ? `${item.co_members_internal} คน`
                : '0 คน',
          },
          {
            key: 'co_members_external',
            label: 'ผู้ร่วมโครงการ (ภายนอก)',
            getValue: (item) =>
              item.co_members_external !== undefined && item.co_members_external !== null && item.co_members_external !== ''
                ? `${item.co_members_external} คน`
                : '0 คน',
          },
        ],
      },
      {
        groupLabel: 'งบประมาณรวมและการจัดสรรอัตโนมัติ',
        fields: [
          { key: 'budget', label: 'งบประมาณรวมทั้งหมด', type: 'currency', span: 2 },
          {
            key: 'alloc_faculty',
            label: 'หักเข้าคณะ',
            type: 'allocation',
            getValue: (item) => {
              const b = Number(item.budget) || 0;
              const p = item.percent_faculty !== undefined && item.percent_faculty !== '' ? Number(item.percent_faculty) : 5;
              const a = item.alloc_faculty !== undefined && item.alloc_faculty !== '' ? Number(item.alloc_faculty) : (b * p) / 100;
              return { percent: p, amount: a };
            },
          },
          {
            key: 'alloc_dept',
            label: 'หักเข้าภาควิชา',
            type: 'allocation',
            getValue: (item) => {
              const b = Number(item.budget) || 0;
              const p = item.percent_dept !== undefined && item.percent_dept !== '' ? Number(item.percent_dept) : 5;
              const a = item.alloc_dept !== undefined && item.alloc_dept !== '' ? Number(item.alloc_dept) : (b * p) / 100;
              return { percent: p, amount: a };
            },
          },
          {
            key: 'alloc_ku',
            label: 'หักเข้ามหาวิทยาลัย (มก.)',
            type: 'allocation',
            getValue: (item) => {
              const b = Number(item.budget) || 0;
              const p = item.percent_ku !== undefined && item.percent_ku !== '' ? Number(item.percent_ku) : 5;
              const a = item.alloc_ku !== undefined && item.alloc_ku !== '' ? Number(item.alloc_ku) : (b * p) / 100;
              return { percent: p, amount: a };
            },
          },
          {
            key: 'alloc_total',
            label: 'หักรวม',
            type: 'allocation',
            getValue: (item) => {
              const b = Number(item.budget) || 0;
              const pf = item.percent_faculty !== undefined && item.percent_faculty !== '' ? Number(item.percent_faculty) : 5;
              const pd = item.percent_dept !== undefined && item.percent_dept !== '' ? Number(item.percent_dept) : 5;
              const pk = item.percent_ku !== undefined && item.percent_ku !== '' ? Number(item.percent_ku) : 5;
              const pTotal = pf + pd + pk;
              const af = item.alloc_faculty !== undefined && item.alloc_faculty !== '' ? Number(item.alloc_faculty) : (b * pf) / 100;
              const ad = item.alloc_dept !== undefined && item.alloc_dept !== '' ? Number(item.alloc_dept) : (b * pd) / 100;
              const ak = item.alloc_ku !== undefined && item.alloc_ku !== '' ? Number(item.alloc_ku) : (b * pk) / 100;
              const aTotal = af + ad + ak;
              return { percent: pTotal, amount: aTotal };
            },
          },
          {
            key: 'alloc_remaining',
            label: 'งบดำเนินงานคงเหลือ',
            type: 'allocation',
            span: 2,
            getValue: (item) => {
              const b = Number(item.budget) || 0;
              const pf = item.percent_faculty !== undefined && item.percent_faculty !== '' ? Number(item.percent_faculty) : 5;
              const pd = item.percent_dept !== undefined && item.percent_dept !== '' ? Number(item.percent_dept) : 5;
              const pk = item.percent_ku !== undefined && item.percent_ku !== '' ? Number(item.percent_ku) : 5;
              const pRem = Math.max(0, 100 - (pf + pd + pk));
              const af = item.alloc_faculty !== undefined && item.alloc_faculty !== '' ? Number(item.alloc_faculty) : (b * pf) / 100;
              const ad = item.alloc_dept !== undefined && item.alloc_dept !== '' ? Number(item.alloc_dept) : (b * pd) / 100;
              const ak = item.alloc_ku !== undefined && item.alloc_ku !== '' ? Number(item.alloc_ku) : (b * pk) / 100;
              const aRem =
                item.alloc_remaining !== undefined && item.alloc_remaining !== ''
                  ? Number(item.alloc_remaining)
                  : Math.max(0, b - (af + ad + ak));
              return { percent: pRem, amount: aRem };
            },
          },
        ],
      },
      {
        groupLabel: 'ระยะเวลาดำเนินการ',
        fields: [
          {
            key: 'start_date',
            label: 'วันที่เริ่มต้นดำเนินการ',
            type: 'date',
            getValue: (item) => item.start_date || (item.month ? item.month : null),
          },
          {
            key: 'end_date',
            label: 'วันที่สิ้นสุดดำเนินการ',
            type: 'date',
            getValue: (item) => item.end_date || null,
          },
        ],
      },
      {
        groupLabel: 'ประเภทโครงการพัฒนาวิชาการ',
        fields: [
          {
            key: 'project_type_categories',
            label: 'ประเภทโครงการหลัก',
            span: 2,
            getValue: (item) => {
              const cats = parseListValue(item.project_type_categories || item.project_type_category);
              return cats.length > 0 ? cats.join(', ') : '-';
            },
          },
          {
            key: 'project_sub_types',
            label: 'ประเภทย่อย',
            span: 2,
            getValue: (item) => {
              const subs = parseListValue(item.project_sub_types);
              return subs.length > 0 ? subs.join(', ') : '-';
            },
          },
          {
            key: 'record_number',
            label: 'เลขระเบียนโครงการ',
            span: 2,
            getValue: (item) => item.record_number || '-',
          },
        ],
      },
      {
        groupLabel: 'การบูรณาการการใช้ประโยชน์และหมายเหตุ',
        fields: [
          {
            key: 'research_projects',
            label: 'บูรณาการกับโครงการวิจัย',
            type: 'list',
            span: 2,
            getValue: (item) => {
              const list = parseListValue(item.research_projects);
              return list.length > 0 ? list : null;
            },
          },
          {
            key: 'patent_integration',
            label: 'บูรณาการทรัพย์สินทางปัญญา',
            span: 2,
            getValue: (item) => item.patent_integration || '-',
          },
          { key: 'integration_start_date', label: 'วันที่เริ่มต้นนำไปบูรณาการ', type: 'date' },
          { key: 'integration_end_date', label: 'วันที่สิ้นสุดนำไปบูรณาการ', type: 'date' },
          { key: 'remarks', label: 'หมายเหตุ', span: 2, getValue: (item) => item.remarks || '-' },
        ],
      },
    ],
    templateSampleRows: [
      {
        name: 'โครงการตรวจประเมินคุณภาพน้ำและระบบบำบัดน้ำเสียอุตสาหกรรม',
        head: 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ',
        co_members_internal: 2,
        co_members_external: 1,
        department: 'ภาควิชาวิศวกรรมชลประทาน',
        client: 'กรมโรงงานอุตสาหกรรม',
        budget: 450000,
        start_date: '2025-01-01',
        end_date: '2025-06-30',
        characteristics: ['สอดคล้องกับนโยบายชาติ'],
        research_projects: [{ code: 'R-68-001', name: 'การวิจัยการบำบัดน้ำเสียอัจฉริยะ' }],
        patent_integration: '2301004567 ระบบควบคุมระบบปรับอากาศ',
      },
      {
        name: 'การให้คำปรึกษาการออกแบบโรงเรือนอัจฉริยะ',
        head: 'รศ.ดร.ประเทือง อุษาบริสุทธิ์',
        co_members_internal: 1,
        co_members_external: 0,
        department: 'ภาควิชาวิศวกรรมการเกษตร',
        client: 'บริษัท เกษตรพัฒนา จำกัด',
        budget: 280000,
        start_date: '2025-02-01',
        end_date: '2025-07-31',
        characteristics: ['เพิ่มมูลค่า'],
        research_projects: [{ code: '02206231', name: 'การเกษตรแม่นยำและการควบคุมสิ่งแวดล้อม' }],
      },
    ],
    searchFields: ['name', 'head', 'department', 'client', 'budget', 'record_number', 'month'],
  },

  service: {
    key: 'service',
    title: 'งานบริการวิชาการ',
    titleEn: 'Academic Services',
    icon: 'fa-hands-helping',
    color: '#e65100',
    primaryKey: 'name',
    nameKey: 'name',
    departmentKey: 'department',
    personKey: 'person',
    columns: [
      { key: 'date', label: 'วัน/เดือน/ปี', type: 'date', width: '9%', align: 'center' },
      { key: 'name', label: 'ชื่องานบริการวิชาการ', type: 'text', width: '26%', required: true },
      { key: 'service_type', label: 'ประเภท', type: 'badge', width: '10%', align: 'center' },
      { key: 'person', label: 'ชื่อ - นามสกุล', type: 'text', width: '14%', required: true },
      { key: 'department', label: 'สังกัด', type: 'badge', width: '8%' },
      { key: 'target_group', label: 'กลุ่มเป้าหมาย', type: 'text', width: '11%' },
      { key: 'hours_spent', label: 'จำนวนชั่วโมง', type: 'number', width: '6%', align: 'right', format: (val) => val !== undefined && val !== null && val !== '' && val !== '-' && val !== 'nan' ? String(val) : '-' },
      { key: 'attendees_count', label: 'จำนวนคนเข้าร่วม', type: 'number', width: '6%', align: 'right', format: (val) => val !== undefined && val !== null && val !== '' && val !== '-' && val !== 'nan' ? Number(val).toLocaleString() : '-' },
    ],
    detailGroups: [
      {
        groupLabel: 'ข้อมูลงานบริการวิชาการ',
        fields: [
          { key: 'name', label: 'ชื่องานบริการวิชาการ', span: 2, getValue: (item) => item.name || item.topic_title || '-' },
          { key: 'target_group', label: 'กลุ่มเป้าหมาย / ผู้เข้าร่วม', getValue: (item) => item.target_group || '-' },
          { key: 'service_type', label: 'ประเภทงานบริการวิชาการ', type: 'badge', getValue: (item) => item.service_type || item.service_category || '-' },
        ],
      },
      {
        groupLabel: 'ผู้ให้บริการและสังกัด',
        fields: [
          { key: 'person', label: 'ผู้ให้บริการ / ผู้รับผิดชอบ', type: 'person' },
          { key: 'department', label: 'สังกัด', type: 'department' },
        ],
      },
      {
        groupLabel: 'ระยะเวลาและผู้เข้าร่วมกิจกรรม',
        fields: [
          {
            key: 'start_date',
            label: 'วันเดือนปีที่จัดกิจกรรม (เริ่มต้น)',
            type: 'date',
            getValue: (item) => item.start_date || item.date || null,
          },
          {
            key: 'end_date',
            label: 'วันเดือนปีที่จัดกิจกรรม (สิ้นสุด)',
            type: 'date',
            getValue: (item) => item.end_date || item.start_date || item.date || null,
          },
          {
            key: 'hours_spent',
            label: 'จำนวนชั่วโมง',
            format: (val) =>
              val !== undefined && val !== null && val !== '' && val !== '-' && val !== 'nan'
                ? `${val} ชั่วโมง`
                : '-',
          },
          {
            key: 'attendees_count',
            label: 'จำนวนคนเข้าร่วม',
            format: (val) =>
              val !== undefined && val !== null && val !== '' && val !== '-' && val !== 'nan'
                ? `${Number(val).toLocaleString()} คน`
                : '-',
          },
        ],
      },
    ],
    templateSampleRows: [
      { date: '2024-03-15', name: 'การอบรมเชิงปฏิบัติการการใช้โดรนเพื่อการเกษตรแม่นยำ', service_type: 'วิชาการ', person: 'รศ.ดร.วัชรพล ชยประเสริฐ', department: 'ภาควิชาวิศวกรรมการเกษตร', target_group: 'เกษตรกรกลุ่มแปลงใหญ่ จ.นครปฐม', hours_spent: 6, attendees_count: 45 },
      { date: '2024-04-20', name: 'สัมมนาการทดสอบแรงลมและการรั่วซึมของผนังอาคารสูง', service_type: 'วิชาชีพ', person: 'ผศ.ศุภชัย กุลมุติวัฒน์', department: 'ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร', target_group: 'วิศวกรและสถาปนิก', hours_spent: 8, attendees_count: 60 },
    ],
    searchFields: ['name', 'person', 'department', 'target_group', 'service_type', 'date'],
  },

  publications: {
    key: 'publications',
    title: 'ผลงานตีพิมพ์ทางวิชาการ',
    titleEn: 'Publications',
    icon: 'fa-book-open',
    color: '#e11d48',
    primaryKey: 'name',
    nameKey: 'name',
    departmentKey: 'department',
    personKey: 'owner',
    columns: [
      { key: 'name', label: 'ชื่อผลงานทางวิชาการ', type: 'text', width: '23%', required: true },
      { key: 'type', label: 'ชนิดของผลงาน', type: 'badge', width: '9%', align: 'center', required: true },
      { key: 'level', label: 'ระดับ', type: 'badge', width: '7%', align: 'center', required: true },
      { key: 'budget', label: 'จำนวนเงินสนับสนุน (บาท)', type: 'currency', width: '12%', align: 'right' },
      { key: 'owner', label: 'เจ้าของผลงาน', type: 'text', width: '12%', required: true },
      { key: 'department', label: 'สังกัด', type: 'badge', width: '9%' },
      { key: 'journal', label: 'รายละเอียดวารสาร/การประชุม', type: 'publication_journal', width: '18%' },
    ],
    detailGroups: [
      {
        groupLabel: 'ข้อมูลผลงาน',
        fields: [
          { key: 'name', label: 'ชื่อผลงานทางวิชาการ', span: 2, getValue: (item) => item.name || item.title || '-' },
          { key: 'type', label: 'ชนิดของผลงาน', type: 'badge' },
          { key: 'level', label: 'ระดับ', type: 'badge' },
          { key: 'budget', label: 'จำนวนเงินสนับสนุน', type: 'currency' },
          {
            key: 'month_year',
            label: 'เดือน/ปี (พ.ศ.)',
            getValue: (item) => {
              if (item.month_year && item.month_year !== '-' && item.month_year !== 'nan') {
                return formatDateBE(item.month_year);
              }
              const parts = [item.month, item.fiscal_year_be || item.fiscal_year]
                .filter((p) => p && p !== '-' && p !== 'nan');
              return parts.length > 0 ? parts.join(' ') : '-';
            },
          },
        ],
      },
      {
        groupLabel: 'ผู้เกี่ยวข้องและสังกัด',
        fields: [
          {
            key: 'owner',
            label: 'เจ้าของผลงาน',
            type: 'person',
            getValue: (item) => item.owner || item.first_author || '-',
          },
          { key: 'department', label: 'สังกัด', type: 'department' },
          { key: 'co_authors_foreign', label: 'มีผู้ร่วมต่างชาติ', type: 'person_list' },
          { key: 'co_authors_domestic', label: 'มีผู้ร่วมภายในประเทศ', type: 'person_list' },
        ],
      },
      {
        groupLabel: 'รายละเอียดการตีพิมพ์และหมายเหตุ',
        fields: [
          {
            key: 'journal',
            label: 'รายละเอียดวารสาร/การประชุม',
            span: 2,
            getValue: (item) =>
              item.journal || (item.type === 'เตรียมความพร้อมจดอนุสิทธิบัตร' ? 'อนุสิทธิบัตร' : '-'),
          },
          { key: 'volume', label: 'Volume', getValue: (item) => item.volume || '-' },
          { key: 'issue', label: 'Issue', getValue: (item) => item.issue || '-' },
          { key: 'page_start', label: 'Page start', getValue: (item) => item.page_start || '-' },
          { key: 'page_end', label: 'Page end', getValue: (item) => item.page_end || '-' },
          { key: 'remarks', label: 'หมายเหตุ', span: 2, getValue: (item) => item.remarks || '-' },
        ],
      },
    ],
    templateSampleRows: [
      { name: 'Optimization of precision irrigation system using deep reinforcement learning', owner: 'รศ.ดร.วัชรพล ชยประเสริฐ', department: 'ภาควิชาวิศวกรรมการเกษตร', type: 'ตีพิมพ์', level: 'นานาชาติ', journal: 'Computers and Electronics in Agriculture', budget: 50000 },
      { name: 'A comparative study of thermal performance in smart greenhouse envelope', owner: 'รศ.ดร.แก้วกานต์ พวงสมบัติ', department: 'ภาควิชาวิศวกรรมการเกษตร', type: 'ตีพิมพ์', level: 'นานาชาติ', journal: 'Energy and Buildings', budget: 30000 },
    ],
    searchFields: ['name', 'owner', 'department', 'type', 'level', 'journal', 'month', 'fiscal_year_be'],
  },

  ip: {
    key: 'ip',
    title: 'งานทรัพย์สินทางปัญญา',
    titleEn: 'Intellectual Property',
    icon: 'fa-certificate',
    color: '#6a1b9a',
    primaryKey: 'name',
    nameKey: 'name',
    departmentKey: 'department',
    personKey: 'creator',
    columns: [
      { key: 'name', label: 'ชื่อผลงาน', type: 'text', width: '25%', required: true },
      { key: 'type', label: 'ประเภท', type: 'badge', width: '10%', align: 'center', required: true },
      { key: 'creator', label: 'ผู้ประดิษฐ์', type: 'text', width: '12%' },
      { key: 'department', label: 'สังกัด', type: 'badge', width: '8%' },
      { key: 'application_number', label: 'เลขที่คำขอ', type: 'ip_req_info', width: '12%', align: 'center' },
      { key: 'registration_number', label: 'เลขทะเบียน', type: 'ip_reg_info', width: '11%', align: 'center' },
      { key: 'support_amount', label: 'เงินสนับสนุนจากคณะ (บาท)', type: 'currency', width: '12%', align: 'right' },
    ],
    detailGroups: [
      {
        groupLabel: 'ข้อมูลพื้นฐานและผู้ประดิษฐ์ / ผู้สร้างสรรค์',
        fields: [
          {
            key: 'type',
            label: 'ประเภททรัพย์สินทางปัญญา',
            type: 'badge',
            span: 2,
          },
          {
            key: 'title',
            label: 'ชื่อผลงาน / ชื่อที่แสดงถึงการประดิษฐ์',
            span: 2,
            getValue: (item) => item.name || item.title || '-',
          },
          {
            key: 'work_category',
            label: 'ประเภทงาน (ลิขสิทธิ์)',
            getValue: (item) => item.work_category || '-',
          },
          {
            key: 'work_character',
            label: 'ลักษณะงาน (ลิขสิทธิ์)',
            getValue: (item) => item.work_character || '-',
          },
          {
            key: 'inventors',
            label: 'ผู้ประดิษฐ์ / ผู้สร้างสรรค์',
            type: 'person_list',
            span: 2,
            getValue: (item) => item.inventors || item.creator,
          },
          {
            key: 'department',
            label: 'สังกัด',
            type: 'department',
            getValue: (item) => item.departments || item.department,
          },
          {
            key: 'owner',
            label: 'เจ้าของสิทธิ / เจ้าของลิขสิทธิ์',
            getValue: (item) => item.owner || item.right_holder || 'มหาวิทยาลัยเกษตรศาสตร์',
          },
        ],
      },
      {
        groupLabel: 'ขั้นตอนดำเนินการยื่นคำขอ',
        fields: [
          {
            key: 'filing_date',
            label: 'วันที่ยื่นคำขอ / วันที่แจ้งข้อมูลลิขสิทธิ์',
            type: 'date',
            getValue: (item) => item.filing_date || item.filingDate || item.request_date || item.app_date || null,
          },
          {
            key: 'application_number',
            label: 'เลขที่คำขอ / คำขอแจ้งข้อมูลเลขที่',
            getValue: (item) =>
              item.application_number ||
              item.req_info ||
              item.app_no ||
              (item.req_no ? String(item.req_no).split('/')[0]?.trim() : '') ||
              '-',
          },
        ],
      },
      {
        groupLabel: 'การได้รับความคุ้มครอง / การออกหนังสือรับรอง',
        fields: [
          {
            key: 'registration_number',
            label: 'เลขทะเบียน / เลขที่สิทธิบัตร',
            getValue: (item) =>
              item.registration_number ||
              item.reg_info ||
              item.reg_no ||
              item.patent_number ||
              (item.req_no && String(item.req_no).includes('/') ? String(item.req_no).split('/')[1]?.trim() : '') ||
              '-',
          },
          {
            key: 'protection_start',
            label: 'วันที่ออกให้ / วันที่ออกหนังสือรับรอง',
            type: 'date',
            getValue: (item) => item.protection_start || item.protectionStart || item.issue_date || item.registration_date || null,
          },
          {
            key: 'protection_end',
            label: 'วันหมดอายุ (ระยะเวลาคุ้มครองสิ้นสุด)',
            type: 'date',
            span: 2,
            getValue: (item) => item.protection_end || item.protectionEnd || item.expiration_date || null,
          },
        ],
      },
      {
        groupLabel: 'การสนับสนุนและหมายเหตุ',
        fields: [
          { key: 'support_amount', label: 'เงินสนับสนุนจากคณะ', type: 'currency' },
          { key: 'remarks', label: 'หมายเหตุ', getValue: (item) => item.remarks || '-' },
        ],
      },
    ],
    templateSampleRows: [
      { name: 'อุปกรณ์ไฟฟ้าช็อตที่มีค่ากระแสไฟฟ้าขาออกไม่เกินสองมิลลิแอมป์', creator: 'นายเชาว์ อินทร์ประสิทธิ์', department: 'ภาควิชาวิศวกรรมโยธา', type: 'อนุสิทธิบัตร', application_number: '2503003348', registration_number: '28565', filing_date: '2025-09-05', status: 'ได้รับความคุ้มครองแล้ว', support_amount: 10000, owner: 'มหาวิทยาลัยเกษตรศาสตร์' },
      { name: 'โปรแกรมจำลองการเคลื่อนที่ของระบบกระพ้อลำเลียงแบบสามมิติด้วยซอฟต์แวร์ LIGGGHTS', creator: 'ผศ.ดร.สมชาย ใจดี', department: 'ภาควิชาวิศวกรรมเครื่องกล', type: 'ลิขสิทธิ์', application_number: '461933', registration_number: 'ว1.000033', filing_date: '2025-09-23', status: 'ได้รับความคุ้มครองแล้ว', work_category: 'วรรณกรรม', work_character: 'โปรแกรมคอมพิวเตอร์', support_amount: 5000, owner: 'มหาวิทยาลัยเกษตรศาสตร์' },
    ],
    searchFields: ['name', 'title', 'creator', 'department', 'type', 'application_number', 'registration_number', 'req_no', 'status', 'work_category', 'work_character', 'owner'],
  },

  personnel: {
    key: 'personnel',
    title: 'ข้อมูลบุคลากรและอาจารย์',
    titleEn: 'Faculty & Personnel',
    icon: 'fa-users',
    color: '#00838f',
    primaryKey: 'id',
    nameKey: 'name',
    departmentKey: 'department',
    personKey: 'name',
    columns: [
      { key: 'image_url', label: 'รูปภาพประจำตัว', type: 'avatar', width: '8%', align: 'center' },
      { key: 'title_th', label: 'คำนำหน้า', type: 'badge', width: '10%', align: 'center' },
      { key: 'name', label: 'ชื่อ-นามสกุล', type: 'text', width: '25%', required: true },
      { key: 'position', label: 'ตำแหน่งทางวิชาการ', type: 'text', width: '19%' },
      { key: 'department', label: 'สังกัด', type: 'badge', width: '18%', selectOptions: DEPARTMENTS },
      { key: 'email', label: 'อีเมล KU', type: 'email', width: '20%' },
    ],
    detailGroups: [
      {
        groupLabel: 'ข้อมูลบุคลากรและอาจารย์',
        fields: [
          { key: 'title_th', label: 'คำนำหน้า', getValue: (item) => item.title_th || item.prefix || '-' },
          { key: 'name', label: 'ชื่อ-นามสกุล', getValue: (item) => item.name || '-' },
          { key: 'position', label: 'ตำแหน่งทางวิชาการ / ตำแหน่งงาน', getValue: (item) => item.position || '-' },
          { key: 'department', label: 'สังกัด', type: 'department', getValue: (item) => item.department || '-' },
          { key: 'email', label: 'อีเมล KU', span: 2, getValue: (item) => item.email || '-' },
        ],
      },
    ],
    templateSampleRows: [
      { title_th: '', name: '', position: '', department: '', email: '' },
    ],
    searchFields: ['name', 'clean_name', 'position', 'department', 'email'],
  },

  kpi: {
    key: 'kpi',
    title: 'ตัวชี้วัดตามแผนยุทธศาสตร์',
    titleEn: 'Strategic KPIs',
    icon: 'fa-bullseye',
    color: '#059669',
    description: 'จัดการ เพิ่ม ลบ แก้ไข ตัวชี้วัดยุทธศาสตร์และเกณฑ์ประเมินผลงานแบบ Dynamic',
    primaryKey: 'id',
    nameKey: 'title',
    columns: [],
    templateSampleRows: [],
    searchFields: ['code', 'title', 'category', 'responsibleUnit'],
  },

  user_roles: {
    key: 'user_roles',
    title: 'จัดการสิทธิ์ผู้ใช้',
    titleEn: 'User Role Management',
    icon: 'fa-user-shield',
    color: '#4f46e5',
    description: 'กำหนดและเพิกถอนสิทธิ์การเข้าถึงข้อมูลระบบ Data Warehouse',
    primaryKey: 'username',
    nameKey: 'displayName',
    columns: [],
    templateSampleRows: [],
    searchFields: ['username', 'displayName', 'note'],
  },
};

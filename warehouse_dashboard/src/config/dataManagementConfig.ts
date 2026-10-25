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
        fields: [
          { key: 'id', label: 'รหัสโครงการ' },
          { key: 'name', label: 'ชื่อโครงการ', span: 2 },
          { key: 'head', label: 'หัวหน้าโครงการ', type: 'person' },
          {
            key: 'co_researchers',
            label: 'ผู้ร่วมวิจัย',
            type: 'person_list',
            span: 2,
            getValue: (item) => item.co_researchers || item.members,
          },
          {
            key: 'department',
            label: 'สังกัดที่รับผิดชอบ',
            type: 'department',
            getValue: (item) => item.departments || item.department,
          },
        ],
      },
      {
        groupLabel: 'ความร่วมมือ',
        fields: [
          {
            key: 'collaboration_domestic',
            label: 'ในประเทศ',
            getValue: (item) => {
              const arr = Array.isArray(item.collaboration_type)
                ? item.collaboration_type
                : String(item.collaboration_type || '').split(',');
              return arr.some((s: string) => s.includes('ในประเทศ')) ? 'ในประเทศ' : (item.collaboration_domestic || '-');
            },
          },
          {
            key: 'collaboration_foreign',
            label: 'ต่างประเทศ',
            getValue: (item) => {
              const arr = Array.isArray(item.collaboration_type)
                ? item.collaboration_type
                : String(item.collaboration_type || '').split(',');
              return arr.some((s: string) => s.includes('ต่างประเทศ')) ? 'ต่างประเทศ' : (item.collaboration_foreign || '-');
            },
          },
        ],
      },
      {
        groupLabel: 'ลักษณะโครงการ',
        fields: [
          {
            key: 'project_nature_strengthen',
            label: 'สร้างความเข้มแข็ง',
            getValue: (item) => {
              const arr = Array.isArray(item.project_nature)
                ? item.project_nature
                : String(item.project_nature || '').split(',');
              return arr.some((s: string) => s.includes('สร้างความเข้มแข็ง')) ? 'สร้างความเข้มแข็ง' : '-';
            },
          },
          {
            key: 'project_nature_policy',
            label: 'สอดคล้องกับนโยบาย',
            getValue: (item) => {
              const arr = Array.isArray(item.project_nature)
                ? item.project_nature
                : String(item.project_nature || '').split(',');
              return arr.some((s: string) => s.includes('สอดคล้องกับนโยบาย')) ? 'สอดคล้องกับนโยบาย' : '-';
            },
          },
        ],
      },
      {
        groupLabel: 'งบประมาณ',
        fields: [
          { key: 'budget_internal', label: 'ภายใน', type: 'currency' },
          { key: 'budget_external', label: 'ภายนอก', type: 'currency' },
        ],
      },
      {
        fields: [
          { key: 'fund_source', label: 'แหล่งทุนวิจัย' },
          { key: 'start_date', label: 'ระยะเวลาเริ่มดำเนินการ', type: 'date' },
          { key: 'end_date', label: 'ระยะเวลาสิ้นสุดการดำเนินการ', type: 'date' },
        ],
      },
      {
        groupLabel: 'การบูรณาการ',
        fields: [
          {
            key: 'integration_teaching',
            label: 'การนำความรู้จากการสอนรายวิชา',
            getValue: (item) => item.integration_teaching || '-',
          },
          {
            key: 'integration_research_teaching',
            label: 'นำวิจัยมาใช้การเรียนการสอน',
            getValue: (item) => item.integration_research_teaching || '-',
          },
          {
            key: 'integration_service_project',
            label: 'การบริการวิชาการ/ชื่อโครงการ',
            getValue: (item) => item.integration_service_project || '-',
          },
        ],
      },
      {
        fields: [
          {
            key: 'trl',
            label: 'ระดับ TRL',
            getValue: (item) => {
              if (item.trl) return String(item.trl);
              if (Array.isArray(item.trl_outputs) && item.trl_outputs.length > 0) {
                return item.trl_outputs.map((t: any) => t.trl_level || t.title || t).join(', ');
              }
              return '-';
            },
          },
          { key: 'remarks', label: 'หมายเหตุ', getValue: (item) => item.remarks || '-' },
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
        fields: [
          { key: 'name', label: 'ชื่อโครงการ', span: 2 },
          { key: 'head', label: 'หัวหน้าโครงการ', type: 'person' },
          {
            key: 'department',
            label: 'สังกัดที่ดำเนินการ',
            type: 'department',
            getValue: (item) => item.department || (item.head ? normalizeDepartmentName(item.head) : '-'),
          },
          {
            key: 'project_type_category',
            label: 'ประเภทโครงการพัฒนาวิชาการ',
            span: 2,
            getValue: (item) => {
              const cats = Array.isArray(item.project_type_categories)
                ? item.project_type_categories.join(', ')
                : item.project_type_category || '';
              const subs = Array.isArray(item.project_sub_types)
                ? item.project_sub_types.join(', ')
                : '';
              if (!cats && !subs) return '-';
              return cats && subs ? `${cats} (${subs})` : (cats || subs);
            },
          },
        ],
      },
      {
        groupLabel: 'ผู้ร่วมโครงการ',
        fields: [
          {
            key: 'co_members_internal',
            label: 'ภายใน',
            getValue: (item) => item.co_members_internal !== undefined && item.co_members_internal !== null ? `${item.co_members_internal} คน` : '-',
          },
          {
            key: 'co_members_external',
            label: 'ภายนอก',
            getValue: (item) => item.co_members_external !== undefined && item.co_members_external !== null ? `${item.co_members_external} คน` : '-',
          },
        ],
      },
      {
        groupLabel: 'ผู้ขอรับบริการ',
        fields: [
          {
            key: 'client_first_time',
            label: 'ครั้งแรก',
            getValue: (item) => item.client_frequency === 'ครั้งแรก' ? 'ใช่' : (item.client_first_time || '-'),
          },
          {
            key: 'client_recurring',
            label: 'มากกว่า 1 ครั้ง',
            getValue: (item) => item.client_frequency === 'มากกว่า 1 ครั้ง' ? 'ใช่' : (item.client_recurring || '-'),
          },
        ],
      },
      {
        fields: [
          { key: 'budget', label: 'งบประมาณ', type: 'currency' },
        ],
      },
      {
        groupLabel: 'การจัดสรร',
        fields: [
          {
            key: 'alloc_faculty',
            label: 'คณะ',
            type: 'allocation',
            getValue: (item) => {
              const b = Number(item.budget) || 0;
              const p = item.percent_faculty !== undefined ? Number(item.percent_faculty) : 5;
              const a = item.alloc_faculty !== undefined ? Number(item.alloc_faculty) : (b * p) / 100;
              return b > 0 || a > 0 ? { percent: p, amount: a } : null;
            },
          },
          {
            key: 'alloc_dept',
            label: 'ภาควิชา',
            type: 'allocation',
            getValue: (item) => {
              const b = Number(item.budget) || 0;
              const p = item.percent_dept !== undefined ? Number(item.percent_dept) : 5;
              const a = item.alloc_dept !== undefined ? Number(item.alloc_dept) : (b * p) / 100;
              return b > 0 || a > 0 ? { percent: p, amount: a } : null;
            },
          },
          {
            key: 'alloc_ku',
            label: 'มก.',
            type: 'allocation',
            getValue: (item) => {
              const b = Number(item.budget) || 0;
              const p = item.percent_ku !== undefined ? Number(item.percent_ku) : 5;
              const a = item.alloc_ku !== undefined ? Number(item.alloc_ku) : (b * p) / 100;
              return b > 0 || a > 0 ? { percent: p, amount: a } : null;
            },
          },
          {
            key: 'alloc_total',
            label: 'รวม',
            type: 'allocation',
            getValue: (item) => {
              const b = Number(item.budget) || 0;
              const pf = item.percent_faculty !== undefined ? Number(item.percent_faculty) : 5;
              const pd = item.percent_dept !== undefined ? Number(item.percent_dept) : 5;
              const pk = item.percent_ku !== undefined ? Number(item.percent_ku) : 5;
              const pTotal = pf + pd + pk;
              const af = item.alloc_faculty !== undefined ? Number(item.alloc_faculty) : (b * pf) / 100;
              const ad = item.alloc_dept !== undefined ? Number(item.alloc_dept) : (b * pd) / 100;
              const ak = item.alloc_ku !== undefined ? Number(item.alloc_ku) : (b * pk) / 100;
              const aTotal = af + ad + ak;
              return b > 0 || aTotal > 0 ? { percent: pTotal, amount: aTotal } : null;
            },
          },
        ],
      },
      {
        groupLabel: 'บูรณาการการใช้ประโยชน์',
        fields: [
          { key: 'research_projects', label: 'โครงการวิจัย', type: 'list', span: 2 },
          { key: 'patent_integration', label: 'สิทธิบัตร/อนุสิทธิบัตร', span: 2 },
        ],
      },
      {
        groupLabel: 'ลักษณะโครงการ',
        fields: [
          {
            key: 'nature_policy',
            label: 'สอดคล้องกับนโยบายชาติ',
            getValue: (item) => {
              const c = Array.isArray(item.characteristics) ? item.characteristics : String(item.characteristics || '').split(',');
              return c.some((s: string) => s.includes('สอดคล้องกับนโยบายชาติ')) ? 'สอดคล้องกับนโยบายชาติ' : '-';
            },
          },
          {
            key: 'nature_value_add',
            label: 'เพิ่มมูลค่า',
            getValue: (item) => {
              const c = Array.isArray(item.characteristics) ? item.characteristics : String(item.characteristics || '').split(',');
              return c.some((s: string) => s.includes('เพิ่มมูลค่า')) ? 'เพิ่มมูลค่า' : '-';
            },
          },
        ],
      },
      {
        groupLabel: 'ระยะเวลาดำเนินการ',
        fields: [
          { key: 'start_date', label: 'เริ่มต้น', type: 'date', getValue: (item) => item.start_date || (item.month ? item.month : null) },
          { key: 'end_date', label: 'สิ้นสุด', type: 'date', getValue: (item) => item.end_date || null },
        ],
      },
      {
        groupLabel: 'วันที่นำไปบูรณาการ',
        fields: [
          { key: 'integration_start_date', label: 'เริ่มต้น', type: 'date' },
          { key: 'integration_end_date', label: 'สิ้นสุด', type: 'date' },
        ],
      },
      {
        fields: [
          { key: 'record_number', label: 'เลขระเบียนโครงการ', getValue: (item) => item.record_number || '-' },
          { key: 'remarks', label: 'หมายเหตุ', getValue: (item) => item.remarks || '-' },
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
        fields: [
          { key: 'name', label: 'เรื่อง', span: 2, getValue: (item) => item.name || item.topic_title || '-' },
          { key: 'target_group', label: 'กลุ่มเป้าหมาย' },
          { key: 'service_type', label: 'ประเภท', type: 'badge', getValue: (item) => item.service_type || item.service_category || '-' },
          { key: 'person', label: 'ชื่อ - นามสกุล', type: 'person' },
          { key: 'department', label: 'สังกัด', type: 'department' },
          { key: 'date', label: 'วัน/เดือน/ปี', type: 'date' },
          { key: 'hours_spent', label: 'จำนวนชั่วโมง', format: (val) => val !== undefined && val !== null && val !== '' ? `${val} ชม.` : '-' },
          { key: 'attendees_count', label: 'จำนวนคนเข้าร่วม', format: (val) => val !== undefined && val !== null && val !== '' ? `${val} คน` : '-' },
          { key: 'remarks', label: 'หมายเหตุ', getValue: (item) => item.remarks || '-' },
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
        fields: [
          { key: 'name', label: 'ชื่อผลงานทางวิชาการ', span: 2 },
          { key: 'type', label: 'ชนิดของผลงาน', type: 'badge' },
          { key: 'level', label: 'ระดับ', type: 'badge' },
          { key: 'budget', label: 'จำนวนเงินสนับสนุน', type: 'currency' },
          { key: 'owner', label: 'เจ้าของผลงาน', type: 'person' },
        ],
      },
      {
        groupLabel: 'ผู้ร่วม',
        fields: [
          { key: 'co_authors_foreign', label: 'ต่างชาติ', type: 'person_list', span: 2 },
          { key: 'co_authors_domestic', label: 'ภายในประเทศ', type: 'person_list', span: 2 },
        ],
      },
      {
        fields: [
          { key: 'department', label: 'สังกัด', type: 'department' },
          { key: 'journal', label: 'รายละเอียดวารสาร/การประชุม', span: 2 },
          { key: 'volume', label: 'Volume' },
          { key: 'issue', label: 'Issue' },
          { key: 'page_start', label: 'Page start' },
          { key: 'page_end', label: 'Page end' },
          { key: 'remarks', label: 'หมายเหตุ', getValue: (item) => item.remarks || '-' },
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
        fields: [
          { key: 'title', label: 'เรื่อง', span: 2, getValue: (item) => item.title || item.name || '-' },
          {
            key: 'type',
            label: 'ประเภททรัพย์สินทางปัญญา',
            type: 'badge',
          },
          {
            key: 'owner',
            label: 'เจ้าของสิทธิ',
            getValue: (item) => item.owner || item.right_holder || 'มหาวิทยาลัยเกษตรศาสตร์',
          },
          {
            key: 'inventors',
            label: 'ผู้ประดิษฐ์',
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
            key: 'work_category',
            label: 'ประเภทงาน (ลิขสิทธิ์)',
            getValue: (item) => item.work_category || (item.type === 'ลิขสิทธิ์' ? '-' : ''),
          },
          {
            key: 'work_character',
            label: 'ลักษณะงาน (ลิขสิทธิ์)',
            getValue: (item) => item.work_character || (item.type === 'ลิขสิทธิ์' ? '-' : ''),
          },
        ],
      },
      {
        groupLabel: 'ขั้นตอนดำเนินการ',
        fields: [
          { key: 'filing_date', label: 'วันที่ยื่นคำขอ', type: 'date' },
          {
            key: 'application_number',
            label: 'เลขที่คำขอ',
            getValue: (item) => item.application_number || item.req_no || '-',
          },
        ],
      },
      {
        groupLabel: 'ได้รับความคุ้มครอง / ออกให้',
        fields: [
          {
            key: 'registration_number',
            label: 'เลขทะเบียน',
            getValue: (item) => item.registration_number || item.reg_no || '-',
          },
          {
            key: 'protection_period',
            label: 'ระยะเวลาความคุ้มครอง',
            getValue: (item) => {
              if (item.type === 'ลิขสิทธิ์') {
                return item.protection_start ? ('ออกหนังสือรับรอง: ' + formatDateBE(item.protection_start)) : '-';
              }
              if (item.protection_start || item.protection_end) {
                const s = item.protection_start ? formatDateBE(item.protection_start) : '-';
                const e = item.protection_end ? formatDateBE(item.protection_end) : '-';
                return s + ' – ' + e;
              }
              return item.protection_period || '-';
            },
          },
        ],
      },
      {
        fields: [
          { key: 'support_amount', label: 'เงินสนับสนุนจากคณะ (บาท)', type: 'currency' },
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

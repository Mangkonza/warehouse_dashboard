import { CategoryConfig, CategoryKey } from '../types/dataManagement';

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

export const DEPARTMENTS = [
  ...CANONICAL_DEPARTMENTS,
  'ศูนย์ปฏิบัติการวิศวกรรมพลังงานและสิ่งแวดล้อม',
  'ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร',
  'ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ',
  'สำนักงานเลขานุการ',
];

export const DEPARTMENT_ABBR_MAP: Record<string, string> = {
  // วิศวกรรมการเกษตร / วิศวกรรมเกษตร -> ABE
  'ภาควิชาวิศวกรรมการเกษตร': 'ABE',
  'ภาควิชาวิศวกรรมเกษตร': 'ABE',
  'วิศวกรรมการเกษตร': 'ABE',
  'วิศวกรรมเกษตร': 'ABE',

  // วิศวกรรมคอมพิวเตอร์ -> CPE
  'ภาควิชาวิศวกรรมคอมพิวเตอร์': 'CPE',
  'วิศวกรรมคอมพิวเตอร์': 'CPE',

  // วิศวกรรมชลประทาน -> IRE
  'ภาควิชาวิศวกรรมชลประทาน': 'IRE',
  'วิศวกรรมชลประทาน': 'IRE',

  // วิศวกรรมอาหาร / วิศวกรรมการอาหาร -> FE
  'ภาควิชาวิศวกรรมอาหาร': 'FE',
  'ภาควิชาวิศวกรรมการอาหาร': 'FE',
  'วิศวกรรมอาหาร': 'FE',
  'วิศวกรรมการอาหาร': 'FE',

  // วิศวกรรมอุตสาหการ -> IE
  'ภาควิชาวิศวกรรมอุตสาหการ': 'IE',
  'วิศวกรรมอุตสาหการ': 'IE',

  // วิศวกรรมเครื่องกล -> ME
  'ภาควิชาวิศวกรรมเครื่องกล': 'ME',
  'วิศวกรรมเครื่องกล': 'ME',

  // วิศวกรรมโยธา -> CE
  'ภาควิชาวิศวกรรมโยธา': 'CE',
  'วิศวกรรมโยธา': 'CE',

  // ศูนย์ต่าง ๆ
  'ศูนย์ปฏิบัติการวิศวกรรมพลังงานและสิ่งแวดล้อม': 'EEEC',
  'ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร': 'TDW',
  'ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ': 'NAMC',
  'สำนักงานเลขานุการ': 'OFFICE',
};

export const getDepartmentAbbr = (dept: string): string => {
  if (!dept || dept === '-' || dept === 'nan' || dept === 'ü' || dept === 'P') return '-';
  const clean = String(dept).trim();

  // 1. Direct match
  if (DEPARTMENT_ABBR_MAP[clean]) {
    return DEPARTMENT_ABBR_MAP[clean];
  }

  // 2. Multi-department and Keyword-based matching
  const found: string[] = [];
  if (clean.includes('โยธา') || clean.includes('CE')) found.push('CE');
  if (clean.includes('อาหาร') || clean.includes('FE')) found.push('FE');
  if (clean.includes('เกษตร') || clean.includes('ABE')) found.push('ABE');
  if (clean.includes('คอมพิวเตอร์') || clean.includes('คอม') || clean.includes('CPE')) found.push('CPE');
  if (clean.includes('ชลประทาน') || clean.includes('IRE')) found.push('IRE');
  if (clean.includes('อุตสาหการ') || clean.includes('IE')) found.push('IE');
  if (clean.includes('เครื่องกล') || clean.includes('ME')) found.push('ME');
  if (clean.includes('พลังงาน') || clean.includes('สิ่งแวดล้อม') || clean.includes('EEEC')) found.push('EEEC');
  if (clean.includes('ประตู') || clean.includes('ผนังกระจก') || clean.includes('TDW')) found.push('TDW');
  if (clean.includes('เครื่องจักรกล') || clean.includes('NAMC')) found.push('NAMC');
  if (clean.includes('เลขานุการ') || clean.includes('สำนักงาน') || clean.includes('OFFICE')) found.push('OFFICE');

  if (found.length > 0) {
    return found.join(', ');
  }

  // 3. Fallback check for map keys
  for (const [k, v] of Object.entries(DEPARTMENT_ABBR_MAP)) {
    if (clean.includes(k) || k.includes(clean)) {
      return v;
    }
  }

  if (clean.length <= 2) return '-';

  return clean.replace('ภาควิชา', '').replace('ศูนย์', '');
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
    description: 'จัดการโครงการวิจัย ทุนวิจัย และหัวหน้าโครงการ',
    primaryKey: 'id',
    nameKey: 'name',
    departmentKey: 'department',
    personKey: 'head',
    columns: [
      { key: 'id', label: 'รหัสโครงการ', type: 'text', width: '8%', align: 'center', placeholder: 'เช่น R-67-01' },
      { key: 'name', label: 'ชื่อโครงการวิจัย', type: 'text', width: '24%', required: true, placeholder: 'ชื่อโครงการวิจัยฉบับเต็ม' },
      { key: 'head', label: 'หัวหน้าโครงการ', type: 'text', width: '13%', required: true, autocomplete: 'personnel', placeholder: 'พิมพ์ค้นหาชื่ออาจารย์...' },
      { key: 'department', label: 'ภาควิชา', type: 'badge', width: '11%', autocomplete: 'department', selectOptions: DEPARTMENTS },
      { key: 'status', label: 'สถานะ / กำหนดการ', type: 'status', width: '11%', align: 'center' },
      { key: 'sdg_code', label: 'SDGs', type: 'sdg', width: '8%', align: 'center' },
      { key: 'members', label: 'ทีมงาน', type: 'members', width: '7%', align: 'center' },
      { key: 'budget_internal', label: 'งบภายใน', type: 'currency', width: '8%', align: 'right', placeholder: '0' },
      { key: 'budget_external', label: 'งบภายนอก', type: 'currency', width: '8%', align: 'right', placeholder: '0' },
      { 
        key: 'budget_total', 
        label: 'งบรวม (บาท)', 
        type: 'currency', 
        width: '9%', 
        align: 'right',
        editable: false,
        format: (_val, row) => {
          const total = (Number(row.budget_internal) || 0) + (Number(row.budget_external) || 0);
          return total > 0 ? total.toLocaleString() : '-';
        }
      },
      { key: 'fund_source', label: 'แหล่งทุน', type: 'text', width: '6%', placeholder: 'เช่น วช., สกสว., ทุน มก.' },
    ],
    templateSampleRows: [
      { id: 'R-67-01', name: 'การพัฒนาระบบชลประทานอัจฉริยะสำหรับแปลงเกษตรแม่นยำ', head: 'ผศ.ดร.วันรัฐ อับดุลลากาซิม', department: 'ภาควิชาวิศวกรรมการเกษตร', budget_internal: 150000, budget_external: 500000, fund_source: 'วช.', status: 'active', sdg_code: 'SDG 6' },
      { id: 'R-67-02', name: 'การประยุกต์ใช้ AI ในการวิเคราะห์โครงสร้างอาคาร', head: 'รศ.ดร.ศิวลักษณ์ ปฐวีรัตน์', department: 'ภาควิชาวิศวกรรมคอมพิวเตอร์', budget_internal: 200000, budget_external: 800000, fund_source: 'สวทช.', status: 'active', sdg_code: 'SDG 9' },
    ],
    searchFields: ['id', 'name', 'head', 'department', 'fund_source', 'sdg_code', 'status'],
  },

  academic: {
    key: 'academic',
    title: 'โครงการพัฒนาวิชาการ',
    titleEn: 'Academic Projects',
    icon: 'fa-graduation-cap',
    color: '#1565c0',
    description: 'จัดการงานพัฒนาวิชาการ บริการวิชาชีพ การบูรณาการ และการจัดสรรงบประมาณ',
    primaryKey: 'name',
    nameKey: 'name',
    departmentKey: 'department',
    personKey: 'head',
    columns: [
      { key: 'name', label: 'ชื่อโครงการพัฒนาวิชาการ', type: 'text', width: '24%', required: true, placeholder: 'ชื่อโครงการพัฒนาวิชาการ' },
      { key: 'head', label: 'หัวหน้าโครงการ', type: 'text', width: '13%', required: true, autocomplete: 'personnel', placeholder: 'พิมพ์ค้นหาชื่ออาจารย์...' },
      { key: 'co_members', label: 'ผู้ร่วมโครงการ', type: 'academic_members', width: '10%', align: 'center' },
      { key: 'department', label: 'ภาควิชา', type: 'badge', width: '9%', autocomplete: 'department', selectOptions: DEPARTMENTS },
      { key: 'client', label: 'ผู้ขอรับบริการ / ว่าจ้าง', type: 'text', width: '11%', placeholder: 'หน่วยงานผู้ว่าจ้าง' },
      { key: 'budget', label: 'งบประมาณรวม (บาท)', type: 'academic_budget', width: '12%', align: 'right', placeholder: '0' },
      { key: 'timeline', label: 'ระยะเวลาดำเนินการ', type: 'academic_timeline', width: '11%', align: 'center', required: true },
      { key: 'characteristics', label: 'ลักษณะโครงการ', type: 'academic_character', width: '10%', align: 'center' },
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
    searchFields: ['name', 'head', 'client', 'department', 'month'],
  },

  service: {
    key: 'service',
    title: 'งานบริการวิชาการ',
    titleEn: 'Academic Services',
    icon: 'fa-hands-helping',
    color: '#e65100',
    description: 'จัดการกิจกรรมอบรม สัมมนา ถ่ายทอดเทคโนโลยี และการทดสอบ',
    primaryKey: 'name',
    nameKey: 'name',
    departmentKey: 'department',
    personKey: 'person',
    columns: [
      { key: 'date', label: 'วันที่จัดกิจกรรม', type: 'date', width: '11%', align: 'center', placeholder: 'ปปปป-ดด-วว' },
      { key: 'name', label: 'ชื่องานบริการวิชาการ', type: 'text', width: '33%', required: true, placeholder: 'ชื่อกิจกรรมหรือหลักสูตรอบรม' },
      { key: 'person', label: 'ผู้รับผิดชอบ', type: 'text', width: '18%', required: true, autocomplete: 'personnel', placeholder: 'พิมพ์ค้นหาชื่ออาจารย์...' },
      { key: 'department', label: 'ภาควิชา / ศูนย์', type: 'badge', width: '15%', autocomplete: 'department', selectOptions: DEPARTMENTS },
      { key: 'target_group', label: 'กลุ่มเป้าหมาย / ผู้เข้าร่วม', type: 'text', width: '14%', placeholder: 'เช่น เกษตรกร, บุคคลทั่วไป' },
    ],
    templateSampleRows: [
      { date: '2024-03-15', name: 'การอบรมเชิงปฏิบัติการการใช้โดรนเพื่อการเกษตรแม่นยำ', person: 'รศ.ดร.วัชรพล ชยประเสริฐ', department: 'ภาควิชาวิศวกรรมการเกษตร', target_group: 'เกษตรกรกลุ่มแปลงใหญ่ จ.นครปฐม' },
      { date: '2024-04-20', name: 'สัมมนาการทดสอบแรงลมและการรั่วซึมของผนังอาคารสูง', person: 'ผศ.ศุภชัย กุลมุติวัฒน์', department: 'ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร', target_group: 'วิศวกรและสถาปนิก' },
    ],
    searchFields: ['name', 'person', 'department', 'target_group', 'date'],
  },

  publications: {
    key: 'publications',
    title: 'ผลงานตีพิมพ์ทางวิชาการ',
    titleEn: 'Publications',
    icon: 'fa-book-open',
    color: '#2e7d32',
    description: 'จัดการบทความวิชาการ วารสารนานาชาติ (Scopus/WoS) และ TCI',
    primaryKey: 'name',
    nameKey: 'name',
    departmentKey: 'department',
    personKey: 'owner',
    columns: [
      { key: 'name', label: 'ชื่อผลงานตีพิมพ์ทางวิชาการ', type: 'text', width: '28%', required: true, placeholder: 'ชื่อบทความหรือผลงานตีพิมพ์' },
      { key: 'owner', label: 'เจ้าของผลงาน / ผู้ประพันธ์', type: 'text', width: '15%', required: true, autocomplete: 'personnel', placeholder: 'พิมพ์ค้นหาชื่ออาจารย์...' },
      { key: 'department', label: 'ภาควิชา', type: 'badge', width: '12%', autocomplete: 'department', selectOptions: DEPARTMENTS },
      { key: 'level', label: 'ระดับ / ควอร์ไทล์', type: 'quartile', width: '12%', align: 'center' },
      { key: 'sdg_code', label: 'SDG', type: 'sdg', width: '8%', align: 'center' },
      { key: 'journal', label: 'วารสาร / แหล่งตีพิมพ์', type: 'text', width: '15%', placeholder: 'ชื่อวารสาร' },
      { key: 'doi', label: 'DOI', type: 'text', width: '10%', placeholder: '10.xxxx/...' },
    ],
    templateSampleRows: [
      { name: 'Optimization of precision irrigation system using deep reinforcement learning', owner: 'รศ.ดร.วัชรพล ชยประเสริฐ', department: 'ภาควิชาวิศวกรรมการเกษตร', type: 'วารสารนานาชาติ', level: 'Scopus Q1', journal: 'Computers and Electronics in Agriculture', budget: 50000, sdg_code: 'SDG 6', doi: '10.1016/j.compag.2023.107890' },
      { name: 'A comparative study of thermal performance in smart greenhouse envelope', owner: 'รศ.ดร.แก้วกานต์ พวงสมบัติ', department: 'ภาควิชาวิศวกรรมการเกษตร', type: 'วารสารนานาชาติ', level: 'Scopus Q2', journal: 'Energy and Buildings', budget: 30000, sdg_code: 'SDG 7', doi: '10.1016/j.enbuild.2023.109876' },
    ],
    searchFields: ['name', 'owner', 'department', 'type', 'level', 'journal', 'doi', 'sdg_code'],
  },

  ip: {
    key: 'ip',
    title: 'งานทรัพย์สินทางปัญญา',
    titleEn: 'Intellectual Property',
    icon: 'fa-certificate',
    color: '#6a1b9a',
    description: 'จัดการสิทธิบัตร อนุสิทธิบัตร และลิขสิทธิ์ของคณะวิศวกรรมศาสตร์',
    primaryKey: 'name',
    nameKey: 'name',
    departmentKey: 'department',
    personKey: 'creator',
    columns: [
      { key: 'req_no', label: 'เลขที่คำขอ / ทะเบียน', type: 'text', width: '15%', align: 'center', placeholder: 'เช่น 2301001234' },
      { key: 'name', label: 'ชื่อผลงาน / การประดิษฐ์', type: 'text', width: '38%', required: true, placeholder: 'ชื่อการประดิษฐ์หรือผลงาน' },
      { key: 'department', label: 'ภาควิชาที่ประดิษฐ์', type: 'badge', width: '18%', align: 'center', autocomplete: 'department', selectOptions: DEPARTMENTS },
      { key: 'type', label: 'ประเภททรัพย์สินทางปัญญา', type: 'badge', width: '14%', align: 'center', placeholder: 'เช่น อนุสิทธิบัตร, สิทธิบัตร' },
      { 
        key: 'status', 
        label: 'สถานะคำขอ', 
        type: 'badge', 
        width: '15%', 
        align: 'center',
        badgeColorMap: (val) => {
          if (String(val).includes('รับจดทะเบียน') || String(val).includes('ออกสิทธิบัตร') || String(val).includes('ได้รับความคุ้มครอง')) {
            return { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' };
          }
          if (String(val).includes('ยื่นคำขอ') || String(val).includes('ประกาศโฆษณา')) {
            return { bg: '#fff8e1', text: '#f57f17', border: '#ffe082' };
          }
          return { bg: '#f5f5f5', text: '#616161', border: '#e0e0e0' };
        }
      },
    ],
    templateSampleRows: [
      { req_no: '2403000123', name: 'อุปกรณ์วัดความชื้นในเมล็ดพืชแบบพกพาด้วยคลื่นความถี่สูง', department: 'ภาควิชาวิศวกรรมเกษตร', type: 'อนุสิทธิบัตร', status: 'ยื่นคำขอแล้ว' },
      { req_no: '2301004567', name: 'ระบบควบคุมระบบปรับอากาศประหยัดพลังงานอัตโนมัติ', department: 'ภาควิชาวิศวกรรมคอมพิวเตอร์', type: 'สิทธิบัตรการประดิษฐ์', status: 'ได้รับความคุ้มครองแล้ว' },
    ],
    searchFields: ['name', 'creator', 'department', 'type', 'req_no', 'status'],
  },

  personnel: {
    key: 'personnel',
    title: 'ข้อมูลบุคลากรและอาจารย์',
    titleEn: 'Faculty & Personnel',
    icon: 'fa-users',
    color: '#00838f',
    description: 'คณะวิศวกรรมศาสตร์ กำแพงแสน มหาวิทยาลัยเกษตรศาสตร์',
    primaryKey: 'id',
    nameKey: 'name',
    departmentKey: 'department',
    personKey: 'name',
    columns: [
      { key: 'image_url', label: 'รูปโปรไฟล์', type: 'avatar', width: '6%', align: 'center', placeholder: 'อัปโหลดรูปภาพ หรือระบุ URL / Path' },
      { key: 'id', label: 'รหัสบุคลากร', type: 'text', width: '9%', align: 'center', placeholder: 'PER-xxx' },
      { key: 'title_th', label: 'คำนำหน้า', type: 'badge', width: '7%', align: 'center', placeholder: 'ศ.ดร.' },
      { key: 'name', label: 'ชื่อ-นามสกุล', type: 'text', width: '23%', required: true, placeholder: 'เช่น สมชาย ใจดี' },
      { key: 'position', label: 'ตำแหน่ง / บทบาท', type: 'text', width: '20%', placeholder: 'ตำแหน่งวิชาการหรือบริหาร' },
      { key: 'department', label: 'ภาควิชา / สังกัด', type: 'badge', width: '13%', selectOptions: DEPARTMENTS },
      { key: 'email', label: 'อีเมล KU', type: 'email', width: '13%', placeholder: 'xxx@ku.ac.th' },
    ],
    templateSampleRows: [
      { id: 'PER-999', name: 'ดร.ทดสอบ ข้อมูลระบบ', title_th: 'ดร.', position: 'อาจารย์', department: 'ภาควิชาวิศวกรรมคอมพิวเตอร์', email: 'test.k@ku.ac.th' },
    ],
    searchFields: ['id', 'name', 'clean_name', 'position', 'department', 'email'],
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
};

import { FactDomainDef, FactDomainId } from '../types/analyticsBuilder';

export const FACT_DOMAINS_CONFIG: Record<FactDomainId, FactDomainDef> = {
  research: {
    id: 'research',
    nameTh: 'โครงการวิจัย',
    nameEn: 'Research Projects',
    description: 'ทุนวิจัย งบประมาณสนับสนุน และการบริหารโครงการวิจัย คณะวิศวกรรมศาสตร์ กำแพงแสน',
    iconName: 'FaFlask',
    color: '#006838',
    measures: [
      { id: 'total_budget', label: 'งบประมาณรวม (บาท)', field: 'budget_total', aggregation: 'SUM', format: 'currency', description: 'ผลรวมงบประมาณทั้งภายในและภายนอก' },
      { id: 'project_count', label: 'จำนวนโครงการ (โครงการ)', field: 'name', aggregation: 'COUNT', format: 'number', description: 'จำนวนโครงการวิจัยทั้งหมด' },
      { id: 'avg_budget', label: 'งบเฉลี่ยต่อโครงการ (บาท)', field: 'budget_total', aggregation: 'AVG', format: 'currency', description: 'งบประมาณเฉลี่ยต่อหนึ่งโครงการ' },
      { id: 'budget_external', label: 'งบทุนภายนอก (บาท)', field: 'budget_external', aggregation: 'SUM', format: 'currency', description: 'งบสนับสนุนจากหน่วยงานภายนอก (วช., สกสว., บพข. ฯลฯ)' },
      { id: 'budget_internal', label: 'งบทุนภายใน (บาท)', field: 'budget_internal', aggregation: 'SUM', format: 'currency', description: 'งบสนับสนุนจากภายในมหาวิทยาลัยเกษตรศาสตร์' },
    ],
    dimensions: [
      { id: 'department', label: 'ภาควิชา / สังกัด', field: 'department', type: 'categorical', description: '11 ภาควิชาและศูนย์งาน' },
      { id: 'fund_source', label: 'แหล่งเงินทุน', field: 'fund_source', type: 'categorical', description: 'หน่วยงานผู้ให้ทุน เช่น วช., คณะฯ, สวทช.' },
      { id: 'fiscal_year', label: 'ปีงบประมาณ (พ.ศ.)', field: 'fiscal_year', type: 'time', description: 'ปีงบประมาณที่ดำเนินโครงการ' },
      { id: 'sdg', label: 'เป้าหมายความยั่งยืน (SDG)', field: 'sdg_code', type: 'categorical', description: 'เป้าหมาย SDGs 1 - 17' },
      { id: 'status', label: 'สถานะโครงการ', field: 'status', type: 'categorical', description: 'กำลังดำเนินการ, ขอขยายเวลา, ล่าช้า, ปิดโครงการ' },
    ],
  },

  academic: {
    id: 'academic',
    nameTh: 'โครงการพัฒนาวิชาการ',
    nameEn: 'Academic Development Projects',
    description: 'งานบริการวิชาชีพ ที่ปรึกษา และการพัฒนาวิชาการแก่หน่วยงานภายนอก/ภาคเอกชน',
    iconName: 'FaGraduationCap',
    color: '#1565c0',
    measures: [
      { id: 'total_budget', label: 'มูลค่าสัญญารวม (บาท)', field: 'budget', aggregation: 'SUM', format: 'currency', description: 'มูลค่างานพัฒนาวิชาการรวมทั้งหมด' },
      { id: 'project_count', label: 'จำนวนโครงการ (โครงการ)', field: 'name', aggregation: 'COUNT', format: 'number', description: 'จำนวนโครงการพัฒนาวิชาการ' },
      { id: 'avg_budget', label: 'มูลค่าเฉลี่ยต่อสัญญา (บาท)', field: 'budget', aggregation: 'AVG', format: 'currency', description: 'มูลค่าสัญญาเฉลี่ย' },
    ],
    dimensions: [
      { id: 'client', label: 'หน่วยงานผู้ว่าจ้าง / ลูกค้า', field: 'client', type: 'categorical', description: 'องค์กรหรือบริษัทผู้ว่าจ้าง' },
      { id: 'month', label: 'ช่วงเวลา (เดือน)', field: 'month', type: 'time', description: 'ช่วงเดือนที่ดำเนินงาน' },
      { id: 'head', label: 'หัวหน้าโครงการ', field: 'head', type: 'categorical', description: 'อาจารย์ผู้รับผิดชอบโครงการ' },
    ],
  },

  publications: {
    id: 'publications',
    nameTh: 'ผลงานตีพิมพ์ทางวิชาการ',
    nameEn: 'Publications',
    description: 'บทความวิจัยระดับนานาชาติ (Scopus/WoS), Quartile (Q1-Q4), TCI',
    iconName: 'FaBook',
    color: '#8e24aa',
    measures: [
      { id: 'pub_count', label: 'จำนวนผลงานตีพิมพ์ (เรื่อง)', field: 'name', aggregation: 'COUNT', format: 'number', description: 'จำนวนบทความวิจัยที่ได้รับการตีพิมพ์' },
      { id: 'support_budget', label: 'เงินสนับสนุนการตีพิมพ์ (บาท)', field: 'budget', aggregation: 'SUM', format: 'currency', description: 'งบอุดหนุนรางวัลและค่าตีพิมพ์' },
    ],
    dimensions: [
      { id: 'level', label: 'ระดับ / ควอร์ไทล์ (Q1-Q4 / TCI)', field: 'level', type: 'categorical', description: 'Scopus Q1, Q2, Q3, Q4, TCI 1, TCI 2' },
      { id: 'department', label: 'ภาควิชา / สังกัด', field: 'department', type: 'categorical', description: 'ภาควิชาของเจ้าของผลงาน' },
      { id: 'type', label: 'ประเภทผลงาน', field: 'type', type: 'categorical', description: 'วารสารวิชาการ, การประชุมวิชาการ, เตรียมความพร้อม' },
      { id: 'journal', label: 'วารสาร / แหล่งตีพิมพ์', field: 'journal', type: 'categorical', description: 'ชื่อวารสารที่ตีพิมพ์' },
      { id: 'owner', label: 'เจ้าของผลงาน', field: 'owner', type: 'categorical', description: 'ชื่ออาจารย์ผู้ประพันธ์' },
    ],
  },

  service: {
    id: 'service',
    nameTh: 'งานบริการวิชาการ',
    nameEn: 'Academic Services',
    description: 'การฝึกอบรม สัมมนา ถ่ายทอดเทคโนโลยี และการให้คำปรึกษาแก่สังคม',
    iconName: 'FaHandsHelping',
    color: '#e65100',
    measures: [
      { id: 'activity_count', label: 'จำนวนกิจกรรม (ครั้ง)', field: 'name', aggregation: 'COUNT', format: 'number', description: 'จำนวนหลักสูตรหรือกิจกรรมที่จัดขึ้น' },
    ],
    dimensions: [
      { id: 'department', label: 'ภาควิชา / ศูนย์ผู้จัด', field: 'department', type: 'categorical', description: 'ภาควิชาหรือศูนย์ที่จัดกิจกรรม' },
      { id: 'target_group', label: 'กลุ่มเป้าหมาย / ผู้รับบริการ', field: 'target_group', type: 'categorical', description: 'เกษตรกร, วิศวกร, ประชาชนทั่วไป' },
      { id: 'person', label: 'ผู้รับผิดชอบกิจกรรม', field: 'person', type: 'categorical', description: 'อาจารย์หรือบุคลากรผู้จัด' },
    ],
  },

  ip: {
    id: 'ip',
    nameTh: 'งานทรัพย์สินทางปัญญา',
    nameEn: 'Intellectual Property',
    description: 'สิทธิบัตรการประดิษฐ์ อนุสิทธิบัตร และลิขสิทธิ์ของคณะวิศวกรรมศาสตร์',
    iconName: 'FaCertificate',
    color: '#6a1b9a',
    measures: [
      { id: 'ip_count', label: 'จำนวนทรัพย์สินทางปัญญา (เรื่อง)', field: 'name', aggregation: 'COUNT', format: 'number', description: 'จำนวนผลงานการประดิษฐ์' },
    ],
    dimensions: [
      { id: 'type', label: 'ประเภททรัพย์สินทางปัญญา', field: 'type', type: 'categorical', description: 'สิทธิบัตรการประดิษฐ์, อนุสิทธิบัตร, ลิขสิทธิ์' },
      { id: 'status', label: 'สถานะการคุ้มครอง / ยื่นขอ', field: 'status', type: 'categorical', description: 'ยื่นคำขอแล้ว, ประกาศโฆษณา, รับจดทะเบียนแล้ว' },
      { id: 'department', label: 'ภาควิชา / สังกัด', field: 'department', type: 'categorical', description: 'ภาควิชาของผู้ประดิษฐ์' },
      { id: 'creator', label: 'ผู้ประดิษฐ์ / ผู้สร้างสรรค์', field: 'creator', type: 'categorical', description: 'ชื่ออาจารย์ผู้ประดิษฐ์' },
    ],
  },

  monitoring: {
    id: 'monitoring',
    nameTh: 'การติดตามงวดงานและกำหนดการ',
    nameEn: 'Project Timeline & Monitoring',
    description: 'วงจรชีวิตโครงการ การเปิด-ปิดสัญญา การขอขยายเวลา และการติดตามความล่าช้า',
    iconName: 'FaClock',
    color: '#0284c7',
    measures: [
      { id: 'total_projects', label: 'โครงการทั้งหมด (โครงการ)', field: 'id', aggregation: 'COUNT', format: 'number', description: 'จำนวนโครงการในการติดตาม' },
      { id: 'avg_days_remaining', label: 'วันคงเหลือเฉลี่ย (วัน)', field: 'days_remaining', aggregation: 'AVG', format: 'number', description: 'จำนวนวันเฉลี่ยก่อนครบกำหนดสัญญา' },
      { id: 'total_budget', label: 'มูลค่างบประมาณที่กำลังติดตาม (บาท)', field: 'budget_total', aggregation: 'SUM', format: 'currency', description: 'มูลค่างบประมาณโครงการ' },
    ],
    dimensions: [
      { id: 'status', label: 'สถานะการดำเนินงาน', field: 'status', type: 'categorical', description: 'กำลังดำเนินการ, ขอขยายเวลา, ล่าช้า, ปิดแล้ว' },
      { id: 'department', label: 'ภาควิชา / สังกัด', field: 'department', type: 'categorical', description: 'ภาควิชาผู้รับผิดชอบโครงการ' },
    ],
  },
};

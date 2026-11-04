export type GreenMetricCategory = 'SI' | 'EC' | 'WS' | 'WR' | 'TR' | 'ED';

export interface SDGItem {
  number: number;
  code: string;
  nameTh: string;
  nameEn: string;
  color: string;
  greenMetricCategory?: GreenMetricCategory;
  greenMetricNameTh?: string;
  keywords: string[];
}

export const SDGS_DATA: Record<number, SDGItem> = {
  1: {
    number: 1,
    code: 'เป้าหมายที่ 1',
    nameTh: 'ขจัดความยากจน',
    nameEn: 'ขจัดความยากจนทุกรูปแบบ',
    color: '#FDA4AF',
    keywords: ['ความยากจน', 'ยากจน', 'รายได้น้อย', 'เกษตรกรยากจน', 'หนี้สิน', 'poverty', 'income'],
  },
  2: {
    number: 2,
    code: 'เป้าหมายที่ 2',
    nameTh: 'ขจัดความหิวโหย',
    nameEn: 'ความมั่นคงทางอาหารและเกษตรยั่งยืน',
    color: '#FCD34D',
    greenMetricCategory: 'ED',
    greenMetricNameTh: 'การศึกษาและวิจัยด้านการเกษตรและความมั่นคงทางอาหาร',
    keywords: [
      'ข้าว', 'พืช', 'เมล็ดพันธุ์', 'ผลผลิต', 'เกษตร', 'วิศวกรรมเกษตร', 'อาหาร', 'แปรรูปอาหาร',
      'โรงเรือน', 'ฟาร์ม', 'ปศุสัตว์', 'ดิน', 'ปุ๋ย', 'เก็บเกี่ยว', 'เครื่องจักรกลเกษตร',
      'food', 'agriculture', 'crop', 'harvest', 'farming', 'hunger', 'nutrition'
    ],
  },
  3: {
    number: 3,
    code: 'เป้าหมายที่ 3',
    nameTh: 'สุขภาพและความเป็นอยู่ที่ดี',
    nameEn: 'การมีสุขภาพและสุขภาวะที่ดี',
    color: '#86EFAC',
    keywords: [
      'สุขภาพ', 'การแพทย์', 'สุขอนามัย', 'ฝุ่น', 'pm2.5', 'โรคพืช', 'สารตกค้าง', 'ความปลอดภัย',
      'ชีวการแพทย์', 'กายภาพ', 'ergonomics', 'health', 'biomedical', 'wellbeing'
    ],
  },
  4: {
    number: 4,
    code: 'เป้าหมายที่ 4',
    nameTh: 'การศึกษาที่มีคุณภาพ',
    nameEn: 'การเรียนรู้ตลอดชีวิตอย่างทั่วถึง',
    color: '#F9A8D4',
    greenMetricCategory: 'ED',
    greenMetricNameTh: 'การศึกษาด้านสิ่งแวดล้อมและความยั่งยืน',
    keywords: ['การศึกษา', 'หลักสูตร', 'เรียนรู้', 'อบรม', 'ถ่ายทอดเทคโนโลยี', 'ฝึกอบรม', 'นิสิต', 'education', 'learning', 'training'],
  },
  5: {
    number: 5,
    code: 'เป้าหมายที่ 5',
    nameTh: 'ความเท่าเทียมทางเพศ',
    nameEn: 'ความเสมอภาคและการเสริมสร้างพลังสตรี',
    color: '#FDBA74',
    keywords: ['ความเท่าเทียม', 'สตรี', 'เพศสภาพ', 'gender', 'equality', 'women'],
  },
  6: {
    number: 6,
    code: 'เป้าหมายที่ 6',
    nameTh: 'น้ำสะอาดและสุขอนามัย',
    nameEn: 'การจัดการน้ำและสุขาภิบาลที่ยั่งยืน',
    color: '#7DD3FC',
    greenMetricCategory: 'WR',
    greenMetricNameTh: 'การจัดการน้ำและการอนุรักษ์ทรัพยากรน้ำ',
    keywords: [
      'ชลประทาน', 'น้ำ', 'บำบัดน้ำ', 'น้ำเสีย', 'แหล่งน้ำ', 'ฝาย', 'ลุ่มน้ำ', 'อ่างเก็บน้ำ',
      'เขื่อน', 'ท่อระบายน้ำ', 'ระบายน้ำ', 'น้ำผิวดิน', 'น้ำบาดาล', 'ประปา', 'หยดน้ำ',
      'water', 'irrigation', 'wastewater', 'sanitation', 'hydrology', 'drainage'
    ],
  },
  7: {
    number: 7,
    code: 'เป้าหมายที่ 7',
    nameTh: 'พลังงานสะอาดที่เข้าถึงได้',
    nameEn: 'พลังงานทดแทนและพลังงานสะอาด',
    color: '#FDE047',
    greenMetricCategory: 'EC',
    greenMetricNameTh: 'พลังงานและการรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ',
    keywords: [
      'พลังงาน', 'โซลาร์', 'พลังงานแสงอาทิตย์', 'เซลล์แสงอาทิตย์', 'ชีวมวล', 'ไบโอแก๊ส',
      'ประหยัดพลังงาน', 'ไฟฟ้า', 'พลังงานทดแทน', 'ประสิทธิภาพพลังงาน', 'แบตเตอรี่', 'ev',
      'ยานยนต์ไฟฟ้า', 'energy', 'solar', 'biomass', 'renewable', 'clean energy', 'power'
    ],
  },
  8: {
    number: 8,
    code: 'เป้าหมายที่ 8',
    nameTh: 'งานที่มีคุณค่าและการเติบโตทางเศรษฐกิจ',
    nameEn: 'เศรษฐกิจเติบโตและการจ้างงานที่มีคุณค่า',
    color: '#F472B6',
    keywords: ['เศรษฐกิจ', 'วิสาหกิจ', 'sme', 'รายได้', 'ต้นทุน', 'ประสิทธิภาพการผลิต', 'อุตสาหกรรมเกษตร', 'economic', 'growth', 'productivity'],
  },
  9: {
    number: 9,
    code: 'เป้าหมายที่ 9',
    nameTh: 'อุตสาหกรรม นวัตกรรม และโครงสร้างพื้นฐาน',
    nameEn: 'การพัฒนาโครงสร้างพื้นฐานและนวัตกรรม',
    color: '#FB923C',
    greenMetricCategory: 'SI',
    greenMetricNameTh: 'โครงสร้างพื้นฐานและการออกแบบอาคารที่เป็นมิตรต่อสิ่งแวดล้อม',
    keywords: [
      'นวัตกรรม', 'หุ่นยนต์', 'ai', 'ปัญญาประดิษฐ์', 'เซ็นเซอร์', 'iot', 'เครื่องจักร',
      'คอนกรีต', 'โครงสร้าง', 'อาคาร', 'ผนังกระจก', 'ประตูหน้าต่าง', 'วัสดุ', 'ซอฟต์แวร์',
      'ระบบอัตโนมัติ', 'industry', 'innovation', 'infrastructure', 'robotics', 'sensors'
    ],
  },
  10: {
    number: 10,
    code: 'เป้าหมายที่ 10',
    nameTh: 'ลดความเหลื่อมล้ำ',
    nameEn: 'การลดความเหลื่อมล้ำในสังคม',
    color: '#E879F9',
    keywords: ['ลดความเหลื่อมล้ำ', 'ชุมชนห่างไกล', 'ความเสมอภาค', 'inequality', 'accessibility'],
  },
  11: {
    number: 11,
    code: 'เป้าหมายที่ 11',
    nameTh: 'เมืองและชุมชนที่ยั่งยืน',
    nameEn: 'การพัฒนาเมืองและถิ่นฐานอย่างยั่งยืน',
    color: '#FBBF24',
    greenMetricCategory: 'SI',
    greenMetricNameTh: 'การพัฒนาพื้นที่สีเขียวและการอยู่อาศัยที่ยั่งยืน',
    keywords: [
      'เมืองอัจฉริยะ', 'smart city', 'ผังเมือง', 'การระบายอากาศ', 'ที่อยู่อาศัย', 'ชุมชน',
      'ความปลอดภัยอาคาร', 'การสั่นสะเทือน', 'แรงลม', 'urban', 'sustainable cities', 'housing'
    ],
  },
  12: {
    number: 12,
    code: 'เป้าหมายที่ 12',
    nameTh: 'การผลิตและการบริโภคที่ยั่งยืน',
    nameEn: 'การใช้ทรัพยากรอย่างคุ้มค่าและหมุนเวียน',
    color: '#D8B4FE',
    greenMetricCategory: 'WS',
    greenMetricNameTh: 'การจัดการของเสียและการนำกลับมาใช้ใหม่',
    keywords: [
      'ขยะ', 'ของเสีย', 'รีไซเคิล', 'หมุนเวียน', 'circular economy', 'วัสดุเหลือใช้',
      'กากตะกอน', 'การลดขยะ', 'บรรจุภัณฑ์', 'waste', 'recycle', 'consumption', 'sustainable production'
    ],
  },
  13: {
    number: 13,
    code: 'เป้าหมายที่ 13',
    nameTh: 'การรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ',
    nameEn: 'การลดก๊าซเรือนกระจกและภาวะโลกร้อน',
    color: '#6EE7B7',
    greenMetricCategory: 'EC',
    greenMetricNameTh: 'นโยบายลดก๊าซเรือนกระจกและความเป็นกลางทางคาร์บอน',
    keywords: [
      'สภาพภูมิอากาศ', 'ก๊าซเรือนกระจก', 'คาร์บอน', 'โลกร้อน', 'climate change', 'carbon footprint',
      'net zero', 'การดูดซับคาร์บอน', 'การแปรปรวนของอากาศ'
    ],
  },
  14: {
    number: 14,
    code: 'เป้าหมายที่ 14',
    nameTh: 'ทรัพยากรทางทะเล',
    nameEn: 'การอนุรักษ์ทรัพยากรน้ำและทางทะเล',
    color: '#93C5FD',
    keywords: ['ทะเล', 'ชายฝั่ง', 'ประมง', 'สัตว์น้ำ', 'marine', 'ocean', 'coastal'],
  },
  15: {
    number: 15,
    code: 'เป้าหมายที่ 15',
    nameTh: 'ระบบนิเวศบนบก',
    nameEn: 'การอนุรักษ์ป่าไม้และระบบนิเวศบนบก',
    color: '#A7F3D0',
    keywords: ['ป่าไม้', 'ระบบนิเวศ', 'ความหลากหลายทางชีวภาพ', 'การชะล้างพังทลายของดิน', 'ดิน', 'forest', 'biodiversity', 'ecosystem', 'soil'],
  },
  16: {
    number: 16,
    code: 'เป้าหมายที่ 16',
    nameTh: 'สันติภาพและความยุติธรรม',
    nameEn: 'สถาบันที่เข้มแข็งและธรรมาภิบาล',
    color: '#A5B4FC',
    keywords: ['ธรรมาภิบาล', 'ความโปร่งใส', 'ความยุติธรรม', 'กฎหมาย', 'governance', 'transparency', 'justice'],
  },
  17: {
    number: 17,
    code: 'เป้าหมายที่ 17',
    nameTh: 'ความร่วมมือเพื่อการพัฒนาที่ยั่งยืน',
    nameEn: 'เครือข่ายความร่วมมือเพื่อการพัฒนา',
    color: '#C4B5FD',
    keywords: ['ความร่วมมือ', 'เครือข่าย', 'พันธมิตร', 'ความร่วมมือนานาชาติ', 'mou', 'partnership', 'collaboration'],
  },
};

export type SDGClusterKey = 'agri_food_health' | 'water_energy_climate' | 'smart_industry_infra' | 'education_partnership';

export interface SDGStrategicCluster {
  key: SDGClusterKey;
  nameTh: string;
  shortNameTh: string;
  descriptionTh: string;
  color: string;
  bgTint: string;
  borderTint: string;
  sdgNumbers: number[];
  relatedDepts: string[];
}

export const SDG_STRATEGIC_CLUSTERS: SDGStrategicCluster[] = [
  {
    key: 'agri_food_health',
    nameTh: 'เกษตร อาหาร และคุณภาพชีวิต',
    shortNameTh: 'เกษตร・อาหาร・สุขภาพ',
    descriptionTh: 'ความมั่นคงทางอาหาร เครื่องจักรกลเกษตร แปรรูปอาหาร และความปลอดภัยทางชีวภาพ',
    color: '#00A651',
    bgTint: '#f0fbf5',
    borderTint: '#a7f3d0',
    sdgNumbers: [1, 2, 3],
    relatedDepts: ['AE', 'FE'],
  },
  {
    key: 'water_energy_climate',
    nameTh: 'น้ำ พลังงานสะอาด และสภาพภูมิอากาศ',
    shortNameTh: 'น้ำ・พลังงาน・ภูมิอากาศ',
    descriptionTh: 'การบริหารจัดการน้ำชลประทาน พลังงานทดแทน การลดคาร์บอน และระบบนิเวศ',
    color: '#0284c7',
    bgTint: '#eff6ff',
    borderTint: '#bfdbfe',
    sdgNumbers: [6, 7, 13, 14, 15],
    relatedDepts: ['IRE', 'ME', 'EEEC'],
  },
  {
    key: 'smart_industry_infra',
    nameTh: 'อุตสาหกรรม นวัตกรรมดิจิทัล และเมืองยั่งยืน',
    shortNameTh: 'อุตสาหกรรม・AI・เมืองยั่งยืน',
    descriptionTh: 'ปัญญาประดิษฐ์ หุ่นยนต์ โครงสร้างพื้นฐานโยธา การจัดการของเสีย และเศรษฐกิจหมุนเวียน',
    color: '#e65100',
    bgTint: '#fff7ed',
    borderTint: '#fed7aa',
    sdgNumbers: [8, 9, 11, 12],
    relatedDepts: ['CPE', 'CE', 'IE', 'DWT', 'NAMC'],
  },
  {
    key: 'education_partnership',
    nameTh: 'การศึกษาและเครือข่ายความร่วมมือ',
    shortNameTh: 'การศึกษา・ความร่วมมือ',
    descriptionTh: 'การพัฒนาวิชาการ บริการวิชาการ การถ่ายทอดเทคโนโลยี และความร่วมมือใน/ต่างประเทศ',
    color: '#1565c0',
    bgTint: '#eff6ff',
    borderTint: '#bfdbfe',
    sdgNumbers: [4, 5, 10, 16, 17],
    relatedDepts: ['OFS'],
  },
];

export const UI_GREENMETRIC_CATEGORIES = [
  { code: 'SI', nameTh: 'ที่ตั้งและโครงสร้างพื้นฐาน', color: '#7DD3FC' },
  { code: 'EC', nameTh: 'พลังงานและการเปลี่ยนแปลงสภาพภูมิอากาศ', color: '#FCD34D' },
  { code: 'WS', nameTh: 'การจัดการของเสียและขยะหมุนเวียน', color: '#C4B5FD' },
  { code: 'WR', nameTh: 'การบริหารจัดการและอนุรักษ์น้ำ', color: '#5EEAD4' },
  { code: 'TR', nameTh: 'การคมนาคมขนส่งที่เป็นมิตรต่อสิ่งแวดล้อม', color: '#86EFAC' },
  { code: 'ED', nameTh: 'การศึกษาและการวิจัยเพื่อความยั่งยืน', color: '#6EE7B7' },
];

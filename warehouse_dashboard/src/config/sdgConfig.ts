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
    code: 'SDG 1',
    nameTh: 'ขจัดความยากจน',
    nameEn: 'No Poverty',
    color: '#E5243B',
    keywords: ['ความยากจน', 'ยากจน', 'รายได้น้อย', 'เกษตรกรยากจน', 'หนี้สิน', 'poverty', 'income'],
  },
  2: {
    number: 2,
    code: 'SDG 2',
    nameTh: 'ขจัดความหิวโหย',
    nameEn: 'Zero Hunger',
    color: '#DDA63A',
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
    code: 'SDG 3',
    nameTh: 'สุขภาพและความเป็นอยู่ที่ดี',
    nameEn: 'Good Health and Well-being',
    color: '#4C9F38',
    keywords: [
      'สุขภาพ', 'การแพทย์', 'สุขอนามัย', 'ฝุ่น', 'pm2.5', 'โรคพืช', 'สารตกค้าง', 'ความปลอดภัย',
      'ชีวการแพทย์', 'กายภาพ', 'ergonomics', 'health', 'biomedical', 'wellbeing'
    ],
  },
  4: {
    number: 4,
    code: 'SDG 4',
    nameTh: 'การศึกษาที่มีคุณภาพ',
    nameEn: 'Quality Education',
    color: '#C5192D',
    greenMetricCategory: 'ED',
    greenMetricNameTh: 'การศึกษาด้านสิ่งแวดล้อมและความยั่งยืน',
    keywords: ['การศึกษา', 'หลักสูตร', 'เรียนรู้', 'อบรม', 'ถ่ายทอดเทคโนโลยี', 'ฝึกอบรม', 'นิสิต', 'education', 'learning', 'training'],
  },
  5: {
    number: 5,
    code: 'SDG 5',
    nameTh: 'ความเท่าเทียมทางเพศ',
    nameEn: 'Gender Equality',
    color: '#FF3A21',
    keywords: ['ความเท่าเทียม', 'สตรี', 'เพศสภาพ', 'gender', 'equality', 'women'],
  },
  6: {
    number: 6,
    code: 'SDG 6',
    nameTh: 'น้ำสะอาดและสุขอนามัย',
    nameEn: 'Clean Water and Sanitation',
    color: '#26BDE2',
    greenMetricCategory: 'WR',
    greenMetricNameTh: 'การจัดการน้ำและการอนุรักษ์น้ำ (Water Conservation)',
    keywords: [
      'ชลประทาน', 'น้ำ', 'บำบัดน้ำ', 'น้ำเสีย', 'แหล่งน้ำ', 'ฝาย', 'ลุ่มน้ำ', 'อ่างเก็บน้ำ',
      'เขื่อน', 'ท่อระบายน้ำ', 'ระบายน้ำ', 'น้ำผิวดิน', 'น้ำบาดาล', 'ประปา', 'หยดน้ำ',
      'water', 'irrigation', 'wastewater', 'sanitation', 'hydrology', 'drainage'
    ],
  },
  7: {
    number: 7,
    code: 'SDG 7',
    nameTh: 'พลังงานสะอาดที่เข้าถึงได้',
    nameEn: 'Affordable and Clean Energy',
    color: '#FCC30B',
    greenMetricCategory: 'EC',
    greenMetricNameTh: 'พลังงานและการเปลี่ยนแปลงสภาพภูมิอากาศ (Energy & Climate Change)',
    keywords: [
      'พลังงาน', 'โซลาร์', 'พลังงานแสงอาทิตย์', 'เซลล์แสงอาทิตย์', 'ชีวมวล', 'ไบโอแก๊ส',
      'ประหยัดพลังงาน', 'ไฟฟ้า', 'พลังงานทดแทน', 'ประสิทธิภาพพลังงาน', 'แบตเตอรี่', 'ev',
      'ยานยนต์ไฟฟ้า', 'energy', 'solar', 'biomass', 'renewable', 'clean energy', 'power'
    ],
  },
  8: {
    number: 8,
    code: 'SDG 8',
    nameTh: 'งานที่มีคุณค่าและการเติบโตทางเศรษฐกิจ',
    nameEn: 'Decent Work and Economic Growth',
    color: '#A21942',
    keywords: ['เศรษฐกิจ', 'วิสาหกิจ', 'sme', 'รายได้', 'ต้นทุน', 'ประสิทธิภาพการผลิต', 'อุตสาหกรรมเกษตร', 'economic', 'growth', 'productivity'],
  },
  9: {
    number: 9,
    code: 'SDG 9',
    nameTh: 'อุตสาหกรรม นวัตกรรม และโครงสร้างพื้นฐาน',
    nameEn: 'Industry, Innovation and Infrastructure',
    color: '#FD6925',
    greenMetricCategory: 'SI',
    greenMetricNameTh: 'โครงสร้างพื้นฐานและการออกแบบอาคาร (Setting & Infrastructure)',
    keywords: [
      'นวัตกรรม', 'หุ่นยนต์', 'ai', 'ปัญญาประดิษฐ์', 'เซ็นเซอร์', 'iot', 'เครื่องจักร',
      'คอนกรีต', 'โครงสร้าง', 'อาคาร', 'ผนังกระจก', 'ประตูหน้าต่าง', 'วัสดุ', 'ซอฟต์แวร์',
      'ระบบอัตโนมัติ', 'industry', 'innovation', 'infrastructure', 'robotics', 'sensors'
    ],
  },
  10: {
    number: 10,
    code: 'SDG 10',
    nameTh: 'ลดความเหลื่อมล้ำ',
    nameEn: 'Reduced Inequalities',
    color: '#DD1367',
    keywords: ['ลดความเหลื่อมล้ำ', 'ชุมชนห่างไกล', 'ความเสมอภาค', 'inequality', 'accessibility'],
  },
  11: {
    number: 11,
    code: 'SDG 11',
    nameTh: 'เมืองและชุมชนที่ยั่งยืน',
    nameEn: 'Sustainable Cities and Communities',
    color: '#FD9D24',
    greenMetricCategory: 'SI',
    greenMetricNameTh: 'การพัฒนาพื้นที่สีเขียวและการอยู่อาศัยที่ยั่งยืน',
    keywords: [
      'เมืองอัจฉริยะ', 'smart city', 'ผังเมือง', 'การระบายอากาศ', 'ที่อยู่อาศัย', 'ชุมชน',
      'ความปลอดภัยอาคาร', 'การสั่นสะเทือน', 'แรงลม', 'urban', 'sustainable cities', 'housing'
    ],
  },
  12: {
    number: 12,
    code: 'SDG 12',
    nameTh: 'การผลิตและการบริโภคที่ยั่งยืน',
    nameEn: 'Responsible Consumption and Production',
    color: '#BF8B2E',
    greenMetricCategory: 'WS',
    greenMetricNameTh: 'การจัดการของเสียและการรีไซเคิล (Waste Management)',
    keywords: [
      'ขยะ', 'ของเสีย', 'รีไซเคิล', 'หมุนเวียน', 'circular economy', 'วัสดุเหลือใช้',
      'กากตะกอน', 'การลดขยะ', 'บรรจุภัณฑ์', 'waste', 'recycle', 'consumption', 'sustainable production'
    ],
  },
  13: {
    number: 13,
    code: 'SDG 13',
    nameTh: 'การรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ',
    nameEn: 'Climate Action',
    color: '#3F7E44',
    greenMetricCategory: 'EC',
    greenMetricNameTh: 'นโยบายลดก๊าซเรือนกระจก (Carbon Neutrality)',
    keywords: [
      'สภาพภูมิอากาศ', 'ก๊าซเรือนกระจก', 'คาร์บอน', 'โลกร้อน', 'climate change', 'carbon footprint',
      'net zero', 'การดูดซับคาร์บอน', 'การแปรปรวนของอากาศ'
    ],
  },
  14: {
    number: 14,
    code: 'SDG 14',
    nameTh: 'ทรัพยากรทางทะเล',
    nameEn: 'Life Below Water',
    color: '#0A97D9',
    keywords: ['ทะเล', 'ชายฝั่ง', 'ประมง', 'สัตว์น้ำ', 'marine', 'ocean', 'coastal'],
  },
  15: {
    number: 15,
    code: 'SDG 15',
    nameTh: 'ระบบนิเวศบนบก',
    nameEn: 'Life on Land',
    color: '#56C02B',
    keywords: ['ป่าไม้', 'ระบบนิเวศ', 'ความหลากหลายทางชีวภาพ', 'การชะล้างพังทลายของดิน', 'ดิน', 'forest', 'biodiversity', 'ecosystem', 'soil'],
  },
  16: {
    number: 16,
    code: 'SDG 16',
    nameTh: 'สันติภาพและความยุติธรรม',
    nameEn: 'Peace, Justice and Strong Institutions',
    color: '#00689D',
    keywords: ['ธรรมาภิบาล', 'ความโปร่งใส', 'ความยุติธรรม', 'กฎหมาย', 'governance', 'transparency', 'justice'],
  },
  17: {
    number: 17,
    code: 'SDG 17',
    nameTh: 'ความร่วมมือเพื่อการพัฒนาที่ยั่งยืน',
    nameEn: 'Partnerships for the Goals',
    color: '#19486A',
    keywords: ['ความร่วมมือ', 'เครือข่าย', 'พันธมิตร', 'ความร่วมมือนานาชาติ', 'mou', 'partnership', 'collaboration'],
  },
};

export const UI_GREENMETRIC_CATEGORIES = [
  { code: 'SI', nameTh: 'ที่ตั้งและโครงสร้างพื้นฐาน (Setting & Infrastructure)', color: '#3b82f6' },
  { code: 'EC', nameTh: 'พลังงานและการเปลี่ยนแปลงสภาพภูมิอากาศ (Energy & Climate)', color: '#f59e0b' },
  { code: 'WS', nameTh: 'การจัดการของเสียและขยะ (Waste Management)', color: '#8b5cf6' },
  { code: 'WR', nameTh: 'การจัดการน้ำ (Water Conservation)', color: '#06b6d4' },
  { code: 'TR', nameTh: 'การคมนาคมขนส่ง (Transportation)', color: '#10b981' },
  { code: 'ED', nameTh: 'การศึกษาและการวิจัย (Education & Research)', color: '#006838' },
];

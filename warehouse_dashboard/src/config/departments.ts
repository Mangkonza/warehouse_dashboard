/**
 * Canonical Department Definitions & Mappings
 * Faculty of Engineering at Kamphaeng Saen, Kasetsart University
 */

export interface DepartmentInfo {
  code: string;
  name: string;
  abbrTh: string;
}

export const CANONICAL_DEPARTMENTS: DepartmentInfo[] = [
  { code: 'ABE', name: 'วิศวกรรมเกษตร', abbrTh: 'วศ.กษ.' },
  { code: 'CPE', name: 'วิศวกรรมคอมพิวเตอร์', abbrTh: 'วศ.คพ.' },
  { code: 'IRE', name: 'วิศวกรรมชลประทาน', abbrTh: 'วศ.ชป.' },
  { code: 'FE',  name: 'วิศวกรรมอาหาร', abbrTh: 'วศ.อห.' },
  { code: 'IE',  name: 'วิศวกรรมอุตสาหการ', abbrTh: 'วศ.อหก.' },
  { code: 'ME',  name: 'วิศวกรรมเครื่องกล', abbrTh: 'วศ.คก.' },
  { code: 'CE',  name: 'วิศวกรรมโยธา', abbrTh: 'วศ.ยธ.' },
];

export const DEPARTMENT_NAMES = CANONICAL_DEPARTMENTS.map((d) => d.name);

export function matchDepartmentCode(rawDept: string): string | null {
  if (!rawDept) return null;
  const s = rawDept.trim();
  if (s.includes('เกษตร') || s === 'ABE') return 'ABE';
  if (s.includes('คอมพิวเตอร์') || s === 'CPE') return 'CPE';
  if (s.includes('ชลประทาน') || s === 'IRE') return 'IRE';
  if (s.includes('อาหาร') || s === 'FE') return 'FE';
  if (s.includes('อุตสาหการ') || s === 'IE') return 'IE';
  if (s.includes('เครื่องกล') || s === 'ME') return 'ME';
  if (s.includes('โยธา') || s === 'CE') return 'CE';
  return null;
}

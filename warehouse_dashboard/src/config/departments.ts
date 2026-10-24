/**
 * Canonical Department Definitions & Mappings
 * Faculty of Engineering at Kamphaeng Saen, Kasetsart University
 * (Aligned with src/lib/departments.ts single source of truth)
 */

import { DEPARTMENTS, getDepartment } from '@/lib/departments';

export interface DepartmentInfo {
  code: string;
  name: string;
  abbrTh: string;
}

export const CANONICAL_DEPARTMENTS: DepartmentInfo[] = [
  { code: 'AE', name: 'วิศวกรรมเกษตร', abbrTh: 'วศ.กษ.' },
  { code: 'CPE', name: 'วิศวกรรมคอมพิวเตอร์', abbrTh: 'วศ.คพ.' },
  { code: 'IRE', name: 'วิศวกรรมชลประทาน', abbrTh: 'วศ.ชป.' },
  { code: 'FE',  name: 'วิศวกรรมอาหาร', abbrTh: 'วศ.อห.' },
  { code: 'IE',  name: 'วิศวกรรมอุตสาหการ', abbrTh: 'วศ.อหก.' },
  { code: 'ME',  name: 'วิศวกรรมเครื่องกล', abbrTh: 'วศ.คก.' },
  { code: 'CE',  name: 'วิศวกรรมโยธา', abbrTh: 'วศ.ยธ.' },
];

export const DEPARTMENT_NAMES = CANONICAL_DEPARTMENTS.map((d) => d.name);

export function matchDepartmentCode(rawDept?: string | null): string | null {
  if (!rawDept) return null;
  const dept = getDepartment(rawDept);
  return dept.code !== '-' ? dept.code : null;
}

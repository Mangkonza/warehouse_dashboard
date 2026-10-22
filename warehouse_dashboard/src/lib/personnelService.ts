import personnelData from '../data/personnel.json';
import { PersonnelRecord } from '../types/dataManagement';

const personnelList: PersonnelRecord[] = personnelData as PersonnelRecord[];

// คำนำหน้าชื่อที่ต้องตัดเพื่อ normalization
const PREFIXES = [
  'ศาสตราจารย์ ดร.', 'รองศาสตราจารย์ ดร.', 'ผู้ช่วยศาสตราจารย์ ดร.',
  'ศ.ดร.', 'รศ.ดร.', 'ผศ.ดร.', 'ดร.',
  'ศ.', 'รศ.', 'ผศ.',
  'อาจารย์ ดร.', 'อาจารย์', 'อ.',
  'นางสาว', 'นาง', 'นาย'
];

/**
 * ตัดคำนำหน้าชื่อ สัญลักษณ์ และคำต่อท้ายที่ไม่จำเป็น เพื่อทำความสะอาดชื่อ
 */
export function normalizePersonName(rawName: string): string {
  if (!rawName) return '';
  let clean = String(rawName).trim();
  
  // ตัดคำว่า (หัวหน้าโครงการ), และคณะ
  clean = clean.replace(/\(หัวหน้าโครงการ\)/gi, '');
  clean = clean.replace(/และคณะ/gi, '');
  clean = clean.replace(/,\s*et al\.?/gi, '');
  clean = clean.replace(/\s+/g, ' ').trim();

  // ตัดคำนำหน้า
  for (const prefix of PREFIXES) {
    if (clean.startsWith(prefix)) {
      clean = clean.substring(prefix.length).trim();
      break;
    }
  }

  return clean.replace(/\s+/g, ' ').trim();
}

/**
 * ดึงรายชื่อบุคลากรทั้งหมด 304 ท่าน
 */
export function getAllPersonnel(): PersonnelRecord[] {
  return personnelList;
}

/**
 * ค้นหาบุคลากรด้วยคำค้นหา (ชื่อจริง, นามสกุล, ภาควิชา, หรืออีเมล)
 */
export function searchPersonnel(query: string, limit: number = 10): PersonnelRecord[] {
  if (!query || !query.trim()) return personnelList.slice(0, limit);
  
  const q = query.toLowerCase().trim();
  const qClean = normalizePersonName(query).toLowerCase();

  return personnelList.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.clean_name.toLowerCase().includes(qClean) ||
      p.department.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.position.toLowerCase().includes(q)
    );
  }).slice(0, limit);
}

/**
 * จับคู่ชื่ออาจารย์จากข้อความดิบ (Smart Auto-Matching)
 */
export function matchPerson(rawName: string): PersonnelRecord | null {
  if (!rawName) return null;
  const clean = normalizePersonName(rawName);
  if (!clean) return null;

  // 1. ลอง Exact match กับ clean_name (ไม่รวมคำนำหน้า)
  const exact = personnelList.find(
    (p) => p.clean_name.toLowerCase() === clean.toLowerCase() || p.name.toLowerCase() === rawName.toLowerCase()
  );
  if (exact) return exact;

  // 2. ถ้ามีชื่อ-นามสกุลแยก ลองจับคู่แบบแยกคำ
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];

    const matchFirstLast = personnelList.find((p) => {
      const pClean = p.clean_name;
      return pClean.includes(firstName) && pClean.includes(lastName);
    });
    if (matchFirstLast) return matchFirstLast;
  }

  // 3. ลองจับคู่เฉพาะชื่อต้น หากตรงตัวเดียวในระบบ
  if (parts.length >= 1 && parts[0].length >= 3) {
    const candidateMatches = personnelList.filter((p) => p.clean_name.startsWith(parts[0]));
    if (candidateMatches.length === 1) {
      return candidateMatches[0];
    }
  }

  return null;
}

/**
 * สรุปจำนวนบุคลากรรายภาควิชา
 */
export function getPersonnelDepartmentStats(): Record<string, number> {
  const stats: Record<string, number> = {};
  for (const p of personnelList) {
    stats[p.department] = (stats[p.department] || 0) + 1;
  }
  return stats;
}

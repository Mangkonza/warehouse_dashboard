import { getApiBaseUrl } from './api';
import { PersonnelRecord } from '../types/dataManagement';

let personnelList: PersonnelRecord[] = [];
let isFetchingFromApi = false;

// สร้าง Lookup Map สำหรับรูปภาพประจำตัวจากข้อมูลหลัก
const staticImageMap = new Map<string, string>();

// คำนำหน้าชื่อที่ต้องตัดเพื่อ normalization (เรียงจากยาวไปสั้น)
export const PREFIXES = [
  'ศาสตราจารย์ ดร.', 'รองศาสตราจารย์ ดร.', 'ผู้ช่วยศาสตราจารย์ ดร.',
  'ศาสตราจารย์', 'รองศาสตราจารย์', 'ผู้ช่วยศาสตราจารย์',
  'ศ. ดร.', 'รศ. ดร.', 'ผศ. ดร.', 'อ. ดร.',
  'ศ.ดร.', 'รศ.ดร.', 'ผศ.ดร.', 'อ.ดร.',
  'ศ.', 'รศ.', 'ผศ.',
  'อาจารย์ ดร.', 'อาจารย์', 'อ.', 'ดร.',
  'นางสาว', 'นาง', 'นาย',
  'ว่าที่ร.ต. ดร.', 'ว่าที่ ร.ต. ดร.', 'ว่าที่ร.ต.', 'ว่าที่ ร.ต.',
];

/**
 * ปรับปรุงตัวสะกดที่มักสับสนในภาษาไทย เช่น ฎ ชฎา กับ ฏ ปฏัก
 */
export function normalizeSpellingVariant(str: string): string {
  if (!str) return '';
  return str.replace(/ฎ/g, 'ฏ');
}

/**
 * ตัดคำนำหน้าชื่อ สัญลักษณ์ และคำต่อท้ายที่ไม่จำเป็น เพื่อทำความสะอาดชื่อ
 */
export function normalizePersonName(rawName: string): string {
  if (!rawName) return '';
  // Replace non-breaking spaces and unusual unicode whitespace
  let clean = String(rawName).replace(/[\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\uFEFF\u200b]/g, ' ').trim();
  
  // ตัดคำว่า (หัวหน้าโครงการ), และคณะ
  clean = clean.replace(/\(หัวหน้าโครงการ\)/gi, '');
  clean = clean.replace(/\(ที่ปรึกษา\)/gi, '');
  clean = clean.replace(/และคณะ/gi, '');
  clean = clean.replace(/,\s*et al\.?/gi, '');
  clean = clean.replace(/\s+/g, ' ').trim();

  // ตัดคำนำหน้าแบบทำซ้ำ (รองรับกรณีคำนำหน้าซ้อน เช่น ผศ. ดร. หรือ ว่าที่ ร.ต. ดร.)
  let changed = true;
  while (changed) {
    changed = false;
    for (const prefix of PREFIXES) {
      if (clean.startsWith(prefix)) {
        clean = clean.substring(prefix.length).trim();
        changed = true;
        break;
      }
    }
  }

  return clean.replace(/\s+/g, ' ').trim();
}

/**
 * ดึงรายชื่อบุคลากรทั้งหมด (อัปเดตจาก LocalStorage แคชในเบราว์เซอร์อัตโนมัติ)
 */
export function getAllPersonnel(): PersonnelRecord[] {
  if (typeof window !== 'undefined') {
    try {
      const cached =
        localStorage.getItem('ku_dw_db_cache_personnel') ||
        localStorage.getItem('ku_dw_cache_personnel');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          personnelList = parsed.map((p, idx) => ({
            ...p,
            id: typeof p.id === 'number' ? p.id : (parseInt(String(p.id).replace('PER-', ''), 10) || idx + 1),
            _id: String(p._id || p.id),
            clean_name: p.clean_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || normalizePersonName(p.name),
            image_url: p.image_url || p.imageUrl || staticImageMap.get(String(p.id)) || staticImageMap.get(String(p._id)) || staticImageMap.get(p.name) || '',
          }));
        }
      } else if (!isFetchingFromApi && personnelList.length === 0) {
        isFetchingFromApi = true;
        fetch(`${getApiBaseUrl()}/data/personnel`)
          .then((res) => (res.ok ? res.json() : null))
          .then((json) => {
            const list = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
            if (list.length > 0) {
              personnelList = list.map((p: any, idx: number) => ({
                ...p,
                id: typeof p.id === 'number' ? p.id : (parseInt(String(p.id).replace('PER-', ''), 10) || idx + 1),
                _id: String(p._id || p.id),
                clean_name: p.clean_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || normalizePersonName(p.name),
                image_url: p.image_url || p.imageUrl || staticImageMap.get(String(p.id)) || staticImageMap.get(String(p._id)) || staticImageMap.get(p.name) || '',
              }));
              localStorage.setItem('ku_dw_db_cache_personnel', JSON.stringify(personnelList));
              window.dispatchEvent(new Event('ku_data_updated'));
            }
          })
          .catch(() => {})
          .finally(() => {
            isFetchingFromApi = false;
          });
      }
    } catch {
      // ignore
    }
  }
  return personnelList;
}

/**
 * คืนค่า URL รูปประจำตัวของบุคลากร (ถ้าไม่พบให้คืนค่า '/default-avatar.png')
 */
export function resolvePersonAvatar(
  personId?: number | string | null,
  rawName?: string | null,
  explicitUrl?: string | null
): string {
  const cleanUrl = (u?: string | null) => {
    const s = String(u || '').trim();
    if (!s || s === '-' || s === 'nan' || s === 'NaT' || s === 'null' || s === 'undefined') return '';
    try {
      return encodeURI(decodeURI(s));
    } catch {
      return encodeURI(s);
    }
  };

  const direct = cleanUrl(explicitUrl);
  if (direct) return direct;

    if (personId !== null && personId !== undefined && personId !== '') {
    const byId = getPersonById(personId);
    if (byId) {
      let isCompatible = true;
      if (rawName && rawName.trim().length >= 3) {
        const cleanReq = normalizePersonName(rawName).toLowerCase();
        const cleanById = normalizePersonName(byId.name || byId.name_th || '').toLowerCase();
        if (cleanReq && cleanById && !cleanById.includes(cleanReq) && !cleanReq.includes(cleanById)) {
          isCompatible = false;
        }
      }
      if (isCompatible) {
        const urlById = cleanUrl(byId?.image_url);
        if (urlById) return urlById;
      }
    }

    const fromMap = cleanUrl(staticImageMap.get(String(personId).trim()));
    if (fromMap) return fromMap;
  }

  if (rawName) {
    const byName = matchPerson(rawName);
    const urlByName = cleanUrl(byName?.image_url);
    if (urlByName) return urlByName;

    const fromMap = cleanUrl(staticImageMap.get(rawName.trim()) || staticImageMap.get(normalizePersonName(rawName)));
    if (fromMap) return fromMap;
  }

  return '/default-avatar.png';
}

/**
 * อัปเดตรายชื่อบุคลากรในหน่วยความจำ
 */
export function updatePersonnelList(updatedList: PersonnelRecord[]): void {
  personnelList = updatedList;
}

/**
 * ค้นหาบุคลากรจาก person_id
 */
export function getPersonById(personId: number | string | null | undefined): PersonnelRecord | null {
  if (personId === null || personId === undefined || personId === '') return null;
  const list = getAllPersonnel();
  const targetNum = Number(personId);
  const targetStr = String(personId);
  return list.find((p) => Number(p.id) === targetNum || String(p.id) === targetStr || String(p._id) === targetStr) || null;
}

/**
 * ค้นหาบุคลากรด้วยคำค้นหา (ชื่อจริง, นามสกุล, ภาควิชา, หรืออีเมล)
 */
export function searchPersonnel(query: string, limit: number = 10): PersonnelRecord[] {
  const list = getAllPersonnel();
  if (!query || !query.trim()) return list.slice(0, limit);
  
  const q = query.toLowerCase().trim();
  const qClean = normalizePersonName(query).toLowerCase();

  return list.filter((p) => {
    const pName = String(p.name || '').toLowerCase();
    const pClean = String(p.clean_name || '').toLowerCase();
    const pFirst = String(p.first_name || '').toLowerCase();
    const pLast = String(p.last_name || '').toLowerCase();
    const pCombined = `${pFirst} ${pLast}`.trim();
    const pPrefix = String(p.title_th || '').toLowerCase();
    const pFullWithPrefix = `${pPrefix}${pFirst} ${pLast}`.trim();
    const pDept = String(p.department || '').toLowerCase();
    const pEmail = String(p.email || '').toLowerCase();
    const pPos = String(p.position || '').toLowerCase();

    return (
      pName.includes(q) ||
      pClean.includes(qClean) ||
      pFirst.includes(q) ||
      pLast.includes(q) ||
      pCombined.includes(q) ||
      pFullWithPrefix.includes(q) ||
      pDept.includes(q) ||
      pEmail.includes(q) ||
      pPos.includes(q)
    );
  }).slice(0, limit);
}

/**
 * จับคู่ชื่ออาจารย์จากข้อความดิบ (Smart Auto-Matching)
 */
export function matchPerson(rawName: string): PersonnelRecord | null {
  if (!rawName) return null;
  const list = getAllPersonnel();
  const clean = normalizePersonName(rawName);
  if (!clean) return null;

  const cleanLower = clean.toLowerCase();
  const cleanNorm = normalizeSpellingVariant(cleanLower);
  const rawLower = rawName.trim().toLowerCase();

  // 1. ลอง Exact match กับ clean_name (ไม่รวมคำนำหน้า) หรือ name เต็ม
  const exact = list.find(
    (p) =>
      p.clean_name.toLowerCase() === cleanLower ||
      p.name.toLowerCase() === rawLower ||
      normalizeSpellingVariant(p.clean_name.toLowerCase()) === cleanNorm
  );
  if (exact) return exact;

  // 2. ถ้ามีชื่อ-นามสกุลแยก ลองจับคู่แบบแยกคำ (ทั้งชื่อและนามสกุลตรงกัน พร้อมรองรับตัวสะกด ฎ/ฏ)
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    const firstName = normalizeSpellingVariant(parts[0].toLowerCase());
    const lastName = normalizeSpellingVariant(parts[parts.length - 1].toLowerCase());

    const candidates = list.filter((p) => {
      const pClean = normalizeSpellingVariant(p.clean_name.toLowerCase());
      return pClean.includes(firstName) && pClean.includes(lastName);
    });
    if (candidates.length === 1) return candidates[0];
  }

  // 3. กรณีมีเฉพาะชื่อต้นตัวเดียว (ไม่มีนามสกุล) ลองจับคู่หากตรงบุคคลเดียวในคณะ
  if (parts.length === 1 && parts[0].length >= 3) {
    const fn = normalizeSpellingVariant(parts[0].toLowerCase());
    const candidateMatches = list.filter((p) => {
      const pParts = normalizeSpellingVariant(p.clean_name.toLowerCase()).split(' ').filter(Boolean);
      return pParts[0] === fn;
    });
    if (candidateMatches.length === 1) {
      return candidateMatches[0];
    }
  }

  // 4. กรณีชื่อมีเครื่องหมายคอมม่า (เช่น หลายคนในช่องเดียว) ให้ลองชื่อแรก
  if (rawName.includes(',')) {
    const firstPerson = rawName.split(',')[0].trim();
    return matchPerson(firstPerson);
  }

  return null;
}

/**
 * สรุปจำนวนบุคลากรรายภาควิชา
 */
export function getPersonnelDepartmentStats(): Record<string, number> {
  const list = getAllPersonnel();
  const stats: Record<string, number> = {};
  for (const p of list) {
    stats[p.department] = (stats[p.department] || 0) + 1;
  }
  return stats;
}

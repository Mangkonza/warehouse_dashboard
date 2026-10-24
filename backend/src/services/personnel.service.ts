import fs from 'fs';
import path from 'path';

export interface Personnel {
  id: string;
  name: string;
  clean_name: string;
  title_th: string;
  position: string;
  department: string;
  email: string;
  image_url: string;
}

const loadPersonnel = (): Personnel[] => {
  try {
    const p1 = path.resolve(process.cwd(), 'src', 'data', 'personnel.json');
    if (fs.existsSync(p1)) {
      return JSON.parse(fs.readFileSync(p1, 'utf-8'));
    }
    const p2 = path.resolve(process.cwd(), '..', 'data', 'ku_eng_personnel.json');
    if (fs.existsSync(p2)) {
      const raw = JSON.parse(fs.readFileSync(p2, 'utf-8'));
      const list: Personnel[] = [];
      let c = 1;
      for (const [dept, members] of Object.entries(raw as Record<string, any[]>)) {
        for (const m of members) {
          list.push({
            id: `PER-${String(c++).padStart(3, '0')}`,
            name: m.name,
            clean_name: m.name,
            title_th: '',
            position: m.position,
            department: dept,
            email: m.email,
            image_url: m.image_path !== 'ไม่มีรูปภาพ' ? m.image_path : '',
          });
        }
      }
      return list;
    }
  } catch (err) {
    console.error('Error loading personnel:', err);
  }
  return [];
};

export class PersonnelService {
  private static personnelList: Personnel[] = loadPersonnel();

  static getAll(department?: string, search?: string) {
    let list = this.personnelList;

    if (department) {
      const normDept = department.replace('ภาควิชา', '').trim();
      list = list.filter((p) => p.department.includes(normDept));
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.clean_name.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q)
      );
    }

    return list;
  }

  static getById(id: string) {
    return this.personnelList.find((p) => p.id === id) || null;
  }

  static getDepartments() {
    const deptMap: Record<string, number> = {};
    for (const p of this.personnelList) {
      deptMap[p.department] = (deptMap[p.department] || 0) + 1;
    }
    return Object.entries(deptMap).map(([name, count]) => ({ name, count }));
  }

  static match(rawName: string) {
    if (!rawName) return null;
    const clean = rawName
      .replace(/\(หัวหน้าโครงการ\)/gi, '')
      .replace(/และคณะ/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    return (
      this.personnelList.find(
        (p) => p.clean_name.toLowerCase() === clean.toLowerCase() || p.name.toLowerCase() === rawName.toLowerCase()
      ) || null
    );
  }
}

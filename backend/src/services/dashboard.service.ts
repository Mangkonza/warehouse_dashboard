import fs from 'fs';
import path from 'path';

// ฟังก์ชันช่วยโหลดไฟล์ JSON เพื่อเป็น Fallback data
const loadJsonData = (filename: string): any[] => {
  try {
    const filePath = path.resolve(process.cwd(), '..', 'warehouse_dashboard', 'src', 'data', filename);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error loading ${filename}:`, err);
  }
  return [];
};

export class DashboardService {
  private static researchData = loadJsonData('research.json');
  private static academicData = loadJsonData('academic.json');
  private static pubData = loadJsonData('publications.json');
  private static serviceData = loadJsonData('services.json');
  private static ipData = loadJsonData('ip.json');

  private static parseNumber(val: any): number {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  static getOverview(quarterFilter?: string) {
    const research = this.getValidData(this.researchData);
    const academic = this.getValidData(this.academicData);
    const pub = this.getValidData(this.pubData);
    const service = this.getValidData(this.serviceData);
    const ip = this.getValidData(this.ipData);

    const totalResearchInternal = research.reduce((acc, cur) => acc + this.parseNumber(cur.budget_internal), 0);
    const totalResearchExternal = research.reduce((acc, cur) => acc + this.parseNumber(cur.budget_external), 0);
    const totalResearchBudget = totalResearchInternal + totalResearchExternal;
    const totalAcademicBudget = academic.reduce((acc, cur) => acc + this.parseNumber(cur.budget), 0);
    const totalPubSupport = pub.reduce((acc, cur) => acc + this.parseNumber(cur.budget), 0);

    // คำนวณสรุปรายภาควิชา (Department Benchmarking)
    const deptMap: Record<string, { researchBudget: number; researchCount: number; pubCount: number; serviceCount: number }> = {};
    const normDept = (d: string) => (d || 'อื่นๆ').replace(/ภาควิชา/g, '').replace(/[\n\r]/g, ' ').trim();

    research.forEach(r => {
      const d = normDept(r.department);
      if (!deptMap[d]) deptMap[d] = { researchBudget: 0, researchCount: 0, pubCount: 0, serviceCount: 0 };
      deptMap[d].researchCount += 1;
      deptMap[d].researchBudget += this.parseNumber(r.budget_internal) + this.parseNumber(r.budget_external);
    });

    pub.forEach(p => {
      const d = normDept(p.department);
      if (!deptMap[d]) deptMap[d] = { researchBudget: 0, researchCount: 0, pubCount: 0, serviceCount: 0 };
      deptMap[d].pubCount += 1;
    });

    service.forEach(s => {
      const d = normDept(s.department);
      if (!deptMap[d]) deptMap[d] = { researchBudget: 0, researchCount: 0, pubCount: 0, serviceCount: 0 };
      deptMap[d].serviceCount += 1;
    });

    // แหล่งทุนภายนอกยอดนิยม (Top Funding Sources)
    const fundMap: Record<string, number> = {};
    research.forEach(r => {
      const src = (r.fund_source || 'อื่นๆ').replace(/[\n\r]/g, ' ').trim();
      const b = this.parseNumber(r.budget_external);
      if (b > 0) {
        fundMap[src] = (fundMap[src] || 0) + b;
      }
    });

    const topFunding = Object.entries(fundMap)
      .map(([source, budget]) => ({ source, budget }))
      .sort((a, b) => b.budget - a.budget)
      .slice(0, 5);

    return {
      stats: {
        totalResearchProjects: research.length,
        totalResearchBudget,
        totalResearchInternal,
        totalResearchExternal,
        totalAcademicProjects: academic.length,
        totalAcademicBudget,
        totalPublications: pub.length,
        totalPubSupport,
        totalServices: service.length,
        totalIP: ip.length,
      },
      benchmarking: deptMap,
      topFunding,
      datasets: {
        researchCount: research.length,
        academicCount: academic.length,
        pubCount: pub.length,
        serviceCount: service.length,
        ipCount: ip.length,
      }
    };
  }

  static getResearchProjects() {
    return this.getValidData(this.researchData);
  }

  static getAcademicProjects() {
    return this.getValidData(this.academicData);
  }

  static getPublications() {
    return this.getValidData(this.pubData);
  }

  static getServices() {
    return this.getValidData(this.serviceData);
  }

  static getIntellectualProperties() {
    return this.getValidData(this.ipData);
  }

  private static getValidData(data: any[]): any[] {
    return data.filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง');
  }
}

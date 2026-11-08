import { LookupRepository } from '../repositories/lookup.repository.js';

export class LookupService {
  static async getDepartments() {
    const list = await LookupRepository.getDepartments();
    return {
      status: 'success',
      total: list.length,
      data: list.map((d) => ({
        code: d.code,
        name: d.nameTh,
        nameTh: d.nameTh,
        nameEn: d.nameEn,
        isCanonical: d.isCanonical,
      })),
    };
  }

  static async getFundingSources() {
    const list = await LookupRepository.getFundingSources();
    return {
      status: 'success',
      total: list.length,
      data: list.map((f) => ({
        id: f.id,
        name: f.name,
        type: f.type,
      })),
    };
  }

  static async getCourses() {
    const list = await LookupRepository.getCourses();
    return {
      status: 'success',
      total: list.length,
      data: list.map((c) => ({
        code: c.courseCode,
        courseCode: c.courseCode,
        nameTh: c.courseNameTh,
        nameEn: c.courseNameEn,
        department: c.departmentCode,
      })),
    };
  }

  static async getPersonnel() {
    const list = await LookupRepository.getPersonnel();
    return {
      status: 'success',
      total: list.length,
      data: list.map((p) => ({
        id: p.id,
        personId: p.personId,
        title: p.titleTh,
        name: p.nameTh,
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        nameEn: p.nameEn,
        position: p.position,
        department: p.department?.nameTh || p.departmentCode,
        departmentCode: p.departmentCode,
        email: p.email,
      })),
    };
  }

  static async getKpiOptions(fieldKey?: string) {
    const list = await LookupRepository.getKpiOptions(fieldKey);
    return {
      status: 'success',
      total: list.length,
      data: list,
    };
  }

  static async addKpiOption(fieldKey: string, value: string, label?: string) {
    const item = await LookupRepository.upsertKpiOption(fieldKey, value, label, true);
    return {
      status: 'success',
      data: item,
    };
  }

  static async getStrategicHierarchy() {
    const list = await LookupRepository.getStrategicStrategies();
    return {
      status: 'success',
      total: list.length,
      data: list,
    };
  }

  static async createStrategicStrategy(id: string, code: string, name: string, pillarGroup?: string) {
    const item = await LookupRepository.createStrategicStrategy(id, code, name, pillarGroup);
    return {
      status: 'success',
      data: item,
    };
  }

  static async createStrategicPlan(id: string, strategyId: string, code: string, name: string) {
    const item = await LookupRepository.createStrategicPlan(id, strategyId, code, name);
    return {
      status: 'success',
      data: item,
    };
  }
}

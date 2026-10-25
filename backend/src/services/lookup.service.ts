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
        nameEn: p.nameEn,
        position: p.position,
        department: p.department?.nameTh || p.departmentCode,
        departmentCode: p.departmentCode,
        email: p.email,
      })),
    };
  }
}

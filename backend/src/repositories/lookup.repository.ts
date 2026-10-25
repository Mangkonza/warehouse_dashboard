import { prisma } from '../db/prisma.js';

export class LookupRepository {
  static async getDepartments() {
    return prisma.department.findMany({
      orderBy: { code: 'asc' },
    });
  }

  static async getFundingSources() {
    return prisma.fundingSource.findMany({
      orderBy: { name: 'asc' },
    });
  }

  static async getCourses() {
    return prisma.courseCatalog.findMany({
      orderBy: { courseCode: 'asc' },
      include: {
        department: true,
      },
    });
  }

  static async getPersonnel() {
    return prisma.personnel.findMany({
      orderBy: { nameTh: 'asc' },
      include: {
        department: true,
      },
    });
  }
}

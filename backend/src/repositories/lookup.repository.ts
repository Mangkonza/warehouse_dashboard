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
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }, { id: 'asc' }],
      include: {
        department: true,
      },
    });
  }

  static async getKpiOptions(fieldKey?: string) {
    return prisma.kpiOptionLookup.findMany({
      where: fieldKey ? { fieldKey } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  static async upsertKpiOption(fieldKey: string, value: string, label?: string, isCustom = true) {
    const cleanVal = value.trim();
    const cleanLbl = (label || value).trim();
    return prisma.kpiOptionLookup.upsert({
      where: {
        fieldKey_value: {
          fieldKey,
          value: cleanVal,
        },
      },
      update: {
        label: cleanLbl,
      },
      create: {
        fieldKey,
        value: cleanVal,
        label: cleanLbl,
        isCustom,
        sortOrder: 99,
      },
    });
  }

  static async getStrategicStrategies() {
    return prisma.strategicStrategy.findMany({
      orderBy: { code: 'asc' },
      include: {
        plans: {
          orderBy: { code: 'asc' },
        },
      },
    });
  }

  static async createStrategicStrategy(id: string, code: string, name: string, pillarGroup?: string) {
    return prisma.strategicStrategy.create({
      data: {
        id,
        code: code.trim(),
        name: name.trim(),
        pillarGroup,
      },
    });
  }

  static async createStrategicPlan(id: string, strategyId: string, code: string, name: string) {
    return prisma.strategicPlan.create({
      data: {
        id,
        strategyId,
        code: code.trim(),
        name: name.trim(),
      },
    });
  }
}

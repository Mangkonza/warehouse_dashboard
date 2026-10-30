import { prisma } from '../db/prisma.js';
import { ProjectService } from './project.service.js';
import { ServiceService } from './service.service.js';
import { IpService } from './ip.service.js';

export class DashboardService {
  static async getOverview(quarterFilter?: string) {
    const [
      resCount,
      resBudgetAgg,
      acadCount,
      acadBudgetAgg,
      pubCount,
      pubBudgetAgg,
      serviceCount,
      ipCount,
      depts,
      researchProjects,
      publications,
      services,
    ] = await Promise.all([
      prisma.researchProject.count(),
      prisma.researchProject.aggregate({
        _sum: {
          budgetInternal: true,
          budgetExternal: true,
        },
      }),
      prisma.academicDevProject.count(),
      prisma.academicDevProject.aggregate({
        _sum: {
          budget: true,
        },
      }),
      prisma.publication.count(),
      prisma.publication.aggregate({
        _sum: {
          budget: true,
        },
      }),
      prisma.academicService.count(),
      prisma.intellectualProperty.count(),
      prisma.department.findMany(),
      prisma.researchProject.findMany({
        select: {
          headDepartmentCode: true,
          budgetInternal: true,
          budgetExternal: true,
          fundSource: true,
        },
      }),
      prisma.publication.findMany({
        select: {
          departmentCode: true,
        },
      }),
      prisma.academicService.findMany({
        select: {
          departmentCode: true,
        },
      }),
    ]);

    const totalResearchInternal = Number(resBudgetAgg._sum.budgetInternal || 0);
    const totalResearchExternal = Number(resBudgetAgg._sum.budgetExternal || 0);
    const totalResearchBudget = totalResearchInternal + totalResearchExternal;
    const totalAcademicBudget = Number(acadBudgetAgg._sum.budget || 0);
    const totalPubSupport = Number(pubBudgetAgg._sum.budget || 0);

    // Benchmarking per department
    const deptMap: Record<string, { researchBudget: number; researchCount: number; pubCount: number; serviceCount: number }> = {};
    const normDept = (d: string) => (d || 'อื่นๆ').replace(/ภาควิชา/g, '').replace(/[\n\r]/g, ' ').trim();

    depts.forEach((d) => {
      const name = normDept(d.nameTh);
      deptMap[name] = { researchBudget: 0, researchCount: 0, pubCount: 0, serviceCount: 0 };
    });

    // Map department code to name
    const codeToName = new Map<string, string>();
    depts.forEach((d) => {
      codeToName.set(d.code, normDept(d.nameTh));
    });

    researchProjects.forEach((r) => {
      const deptName = (r.headDepartmentCode && codeToName.get(r.headDepartmentCode)) || 'อื่นๆ';
      if (!deptMap[deptName]) {
        deptMap[deptName] = { researchBudget: 0, researchCount: 0, pubCount: 0, serviceCount: 0 };
      }
      deptMap[deptName].researchCount += 1;
      deptMap[deptName].researchBudget += Number(r.budgetInternal || 0) + Number(r.budgetExternal || 0);
    });

    publications.forEach((p) => {
      const deptName = (p.departmentCode && codeToName.get(p.departmentCode)) || 'อื่นๆ';
      if (!deptMap[deptName]) {
        deptMap[deptName] = { researchBudget: 0, researchCount: 0, pubCount: 0, serviceCount: 0 };
      }
      deptMap[deptName].pubCount += 1;
    });

    services.forEach((s) => {
      const deptName = (s.departmentCode && codeToName.get(s.departmentCode)) || 'อื่นๆ';
      if (!deptMap[deptName]) {
        deptMap[deptName] = { researchBudget: 0, researchCount: 0, pubCount: 0, serviceCount: 0 };
      }
      deptMap[deptName].serviceCount += 1;
    });

    // Top funding sources
    const fundMap: Record<string, number> = {};
    researchProjects.forEach((r) => {
      const src = (r.fundSource || 'อื่นๆ').replace(/[\n\r]/g, ' ').trim();
      const b = Number(r.budgetExternal || 0);
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
        totalResearchProjects: resCount,
        totalResearchBudget,
        totalResearchInternal,
        totalResearchExternal,
        totalAcademicProjects: acadCount,
        totalAcademicBudget,
        totalPublications: pubCount,
        totalPubSupport,
        totalServices: serviceCount,
        totalIP: ipCount,
      },
      benchmarking: deptMap,
      topFunding,
      datasets: {
        researchCount: resCount,
        academicCount: acadCount,
        pubCount: pubCount,
        serviceCount: serviceCount,
        ipCount: ipCount,
      },
    };
  }

  static async getResearchProjects() {
    const res = await ProjectService.getResearchList();
    return res.data;
  }

  static async getAcademicProjects() {
    const res = await ProjectService.getAcademicList();
    return res.data;
  }

  static async getPublications() {
    const res = await ProjectService.getPublicationList();
    return res.data;
  }

  static async getServices() {
    const res = await ServiceService.getAll();
    return res.data;
  }

  static async getIntellectualProperties() {
    const res = await IpService.getAll();
    return res.data;
  }
}

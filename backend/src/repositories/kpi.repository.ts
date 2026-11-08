import { prisma } from '../db/prisma.js';

export class KpiRepository {
  private static async ensureStrategyAndPlan(tx: any, data: any) {
    const sCode =
      String(data.strategyCode || '1.1')
        .replace(/^ยุทธศาสตร์ที่\s*/i, '')
        .trim() || '1.1';
    const sId = data.strategyId || `strat-${sCode.replace(/\./g, '-')}`;
    const rawSName = String(data.strategyName || `ยุทธศาสตร์ที่ ${sCode}`)
      .replace(/^ยุทธศาสตร์ที่\s*[\d.]+\s*:\s*/i, '')
      .trim();

    let finalStrategyId = sId;
    const existingStrat = await tx.strategicStrategy.findUnique({ where: { id: sId } });
    if (!existingStrat) {
      const byCode = await tx.strategicStrategy.findUnique({ where: { code: sCode } });
      if (byCode) {
        finalStrategyId = byCode.id;
      } else {
        await tx.strategicStrategy.create({
          data: {
            id: sId,
            code: sCode,
            name: rawSName || `ยุทธศาสตร์ที่ ${sCode}`,
            fiscalYear: Number(data.fiscalYear) || 2569,
          },
        });
      }
    }

    const pCode =
      String(data.planCode || `${sCode}-1`)
        .replace(/^แผนงาน(ที่)?\s*/i, '')
        .trim() || `${sCode}-1`;
    const pId = data.planId || `plan-${pCode.replace(/\./g, '-')}`;
    const rawPName = String(data.planName || `แผนงาน ${pCode}`).trim();

    let finalPlanId = pId;
    const existingPlan = await tx.strategicPlan.findUnique({ where: { id: pId } });
    if (!existingPlan) {
      const byPlanCode = await tx.strategicPlan.findFirst({
        where: { strategyId: finalStrategyId, code: pCode },
      });
      if (byPlanCode) {
        finalPlanId = byPlanCode.id;
      } else {
        await tx.strategicPlan.create({
          data: {
            id: pId,
            strategyId: finalStrategyId,
            code: pCode,
            name: rawPName || `แผนงาน ${pCode}`,
            isDepartmentProject: Boolean(data.isDepartmentProject),
          },
        });
      }
    }

    return { strategyId: finalStrategyId, planId: finalPlanId };
  }

  static async getAll() {
    return prisma.strategicIndicator.findMany({
      include: {
        strategy: true,
        plan: true,
        subIndicators: {
          orderBy: { sortOrder: 'asc' },
          include: {
            roundResults: true,
          },
        },
        roundResults: true,
      },
      orderBy: [{ code: 'asc' }, { createdAt: 'asc' }],
    });
  }

  static async getById(id: string) {
    return prisma.strategicIndicator.findUnique({
      where: { id },
      include: {
        strategy: true,
        plan: true,
        subIndicators: {
          orderBy: { sortOrder: 'asc' },
          include: {
            roundResults: true,
          },
        },
        roundResults: true,
      },
    });
  }

  static async create(data: any) {
    return prisma.$transaction(async (tx) => {
      const { strategyId, planId } = await this.ensureStrategyAndPlan(tx, data);

      const indicator = await tx.strategicIndicator.create({
        data: {
          id: data.id,
          strategyId,
          planId,
          code: String(data.code || '').trim(),
          title: String(data.title || '').trim(),
          description: data.description?.trim() || null,
          category: data.category || 'research',
          fiscalYear: String(data.fiscalYear || '2569'),
          collectionPeriod: data.collectionPeriod || 'ปีงบประมาณ',
          valueType: data.valueType || 'จำนวนนับ',
          reportingLevels: data.reportingLevels || ['ส่วนงาน'],
          unit: String(data.unit || 'รายการ').trim(),
          targetOperator: data.targetOperator || 'gte',
          targetValue: Number(data.targetValue) || 0,
          targetLabel: data.targetLabel?.trim() || null,
          departmentTarget: data.departmentTarget ? String(data.departmentTarget).trim() : null,
          formulaMethod: data.formulaMethod || 'SUM',
          calcType: data.calcType || 'manual',
          datasetKey: data.datasetKey || 'research',
          datasetKeys: Array.isArray(data.datasetKeys)
            ? data.datasetKeys
            : [data.datasetKey || 'research'],
          manualIncludedProjectIds: Array.isArray(data.manualIncludedProjectIds)
            ? data.manualIncludedProjectIds.map(String)
            : [],
          manualExcludedProjectIds: Array.isArray(data.manualExcludedProjectIds)
            ? data.manualExcludedProjectIds.map(String)
            : [],
          activeRoundIds: data.activeRoundIds || ['round-6m', 'round-9m'],
          reporters: data.reporters || [],
          responsibleUnit: data.responsibleUnit?.trim() || null,
        },
      });

      if (Array.isArray(data.subIndicators) && data.subIndicators.length > 0) {
        for (let idx = 0; idx < data.subIndicators.length; idx++) {
          const sub = data.subIndicators[idx];
          const subId = sub.id || `${indicator.id}-sub-${idx + 1}`;
          await tx.strategicSubIndicator.create({
            data: {
              id: subId,
              indicatorId: indicator.id,
              title: String(sub.title || '').trim(),
              unit: sub.unit?.trim() || indicator.unit,
              formulaRole: sub.formulaRole || 'sum_part',
              valueSource: sub.valueSource || 'manual',
              linkedDatasetKey: sub.linkedDatasetKey || indicator.datasetKey,
              target: sub.target !== undefined && sub.target !== null ? String(sub.target).trim() : null,
              reporters: sub.reporters || indicator.reporters,
              sortOrder: idx,
            },
          });
        }
      }

      if (Array.isArray(data.resultsByRound) && data.resultsByRound.length > 0) {
        for (const r of data.resultsByRound) {
          if (!r.roundId) continue;
          const mainResultId = `res-${indicator.id}-${r.roundId}`;
          await tx.strategicIndicatorRoundResult.upsert({
            where: { id: mainResultId },
            update: {
              actualValue: r.actualValue !== undefined && r.actualValue !== null ? Number(r.actualValue) : null,
              actualText: r.actualText?.trim() || null,
              evidence: r.evidence?.trim() || null,
              remarks: r.remarks?.trim() || null,
              reporter: r.reporter?.trim() || null,
              status: r.status || 'submitted',
            },
            create: {
              id: mainResultId,
              indicatorId: indicator.id,
              roundId: r.roundId,
              actualValue: r.actualValue !== undefined && r.actualValue !== null ? Number(r.actualValue) : null,
              actualText: r.actualText?.trim() || null,
              evidence: r.evidence?.trim() || null,
              remarks: r.remarks?.trim() || null,
              reporter: r.reporter?.trim() || null,
              status: r.status || 'submitted',
            },
          });
        }
      }

      return tx.strategicIndicator.findUnique({
        where: { id: indicator.id },
        include: {
          strategy: true,
          plan: true,
          subIndicators: {
            orderBy: { sortOrder: 'asc' },
            include: { roundResults: true },
          },
          roundResults: true,
        },
      });
    });
  }

  static async update(id: string, data: any) {
    const existing = await prisma.strategicIndicator.findUnique({ where: { id } });
    if (!existing) {
      return this.create({ ...data, id });
    }

    return prisma.$transaction(async (tx) => {
      let resolvedIds: { strategyId?: string; planId?: string } = {};
      if (data.strategyId || data.planId || data.strategyCode || data.planCode) {
        resolvedIds = await this.ensureStrategyAndPlan(tx, {
          ...existing,
          ...data,
        });
      }

      await tx.strategicIndicator.update({
        where: { id },
        data: {
          ...(resolvedIds.strategyId && { strategyId: resolvedIds.strategyId }),
          ...(resolvedIds.planId && { planId: resolvedIds.planId }),
          ...(data.code && { code: String(data.code).trim() }),
          ...(data.title && { title: String(data.title).trim() }),
          ...(data.description !== undefined && { description: data.description?.trim() || null }),
          ...(data.category && { category: data.category }),
          ...(data.fiscalYear && { fiscalYear: String(data.fiscalYear) }),
          ...(data.collectionPeriod && { collectionPeriod: data.collectionPeriod }),
          ...(data.valueType && { valueType: data.valueType }),
          ...(data.reportingLevels && { reportingLevels: data.reportingLevels }),
          ...(data.unit && { unit: String(data.unit).trim() }),
          ...(data.targetOperator && { targetOperator: data.targetOperator }),
          ...(data.targetValue !== undefined && { targetValue: Number(data.targetValue) }),
          ...(data.targetLabel !== undefined && { targetLabel: data.targetLabel?.trim() || null }),
          ...(data.departmentTarget !== undefined && {
            departmentTarget: data.departmentTarget ? String(data.departmentTarget).trim() : null,
          }),
          ...(data.formulaMethod && { formulaMethod: data.formulaMethod }),
          ...(data.calcType && { calcType: data.calcType }),
          ...(data.datasetKey && { datasetKey: data.datasetKey }),
          ...(Array.isArray(data.datasetKeys) && { datasetKeys: data.datasetKeys }),
          ...(Array.isArray(data.manualIncludedProjectIds) && {
            manualIncludedProjectIds: data.manualIncludedProjectIds.map(String),
          }),
          ...(Array.isArray(data.manualExcludedProjectIds) && {
            manualExcludedProjectIds: data.manualExcludedProjectIds.map(String),
          }),
          ...(data.activeRoundIds && { activeRoundIds: data.activeRoundIds }),
          ...(data.reporters && { reporters: data.reporters }),
          ...(data.responsibleUnit !== undefined && {
            responsibleUnit: data.responsibleUnit?.trim() || null,
          }),
        },
      });

      if (Array.isArray(data.subIndicators)) {
        const incomingSubIds = new Set<string>();

        for (let idx = 0; idx < data.subIndicators.length; idx++) {
          const sub = data.subIndicators[idx];
          const subId = sub.id || `${id}-sub-${idx + 1}`;
          incomingSubIds.add(subId);

          await tx.strategicSubIndicator.upsert({
            where: { id: subId },
            update: {
              title: String(sub.title || '').trim(),
              unit: sub.unit?.trim() || data.unit || '',
              formulaRole: sub.formulaRole || 'sum_part',
              valueSource: sub.valueSource || 'manual',
              linkedDatasetKey: sub.linkedDatasetKey || data.datasetKey || 'research',
              target: sub.target !== undefined && sub.target !== null ? String(sub.target).trim() : null,
              reporters: sub.reporters || data.reporters || [],
              sortOrder: idx,
            },
            create: {
              id: subId,
              indicatorId: id,
              title: String(sub.title || '').trim(),
              unit: sub.unit?.trim() || data.unit || '',
              formulaRole: sub.formulaRole || 'sum_part',
              valueSource: sub.valueSource || 'manual',
              linkedDatasetKey: sub.linkedDatasetKey || data.datasetKey || 'research',
              target: sub.target !== undefined && sub.target !== null ? String(sub.target).trim() : null,
              reporters: sub.reporters || data.reporters || [],
              sortOrder: idx,
            },
          });
        }

        await tx.strategicSubIndicator.deleteMany({
          where: {
            indicatorId: id,
            id: { notIn: Array.from(incomingSubIds) },
          },
        });
      }

      if (Array.isArray(data.resultsByRound) && data.resultsByRound.length > 0) {
        for (const r of data.resultsByRound) {
          if (!r.roundId) continue;
          const mainResultId = `res-${id}-${r.roundId}`;
          await tx.strategicIndicatorRoundResult.upsert({
            where: { id: mainResultId },
            update: {
              actualValue: r.actualValue !== undefined && r.actualValue !== null ? Number(r.actualValue) : null,
              actualText: r.actualText?.trim() || null,
              evidence: r.evidence?.trim() || null,
              remarks: r.remarks?.trim() || null,
              reporter: r.reporter?.trim() || null,
              status: r.status || 'submitted',
            },
            create: {
              id: mainResultId,
              indicatorId: id,
              roundId: r.roundId,
              actualValue: r.actualValue !== undefined && r.actualValue !== null ? Number(r.actualValue) : null,
              actualText: r.actualText?.trim() || null,
              evidence: r.evidence?.trim() || null,
              remarks: r.remarks?.trim() || null,
              reporter: r.reporter?.trim() || null,
              status: r.status || 'submitted',
            },
          });
        }
      }

      return tx.strategicIndicator.findUnique({
        where: { id },
        include: {
          strategy: true,
          plan: true,
          subIndicators: {
            orderBy: { sortOrder: 'asc' },
            include: { roundResults: true },
          },
          roundResults: true,
        },
      });
    });
  }

  static async delete(id: string) {
    return prisma.strategicIndicator.delete({
      where: { id },
    });
  }

  static async saveRoundResult(
    indicatorId: string,
    roundId: string,
    data: {
      actualValue?: number | null;
      actualText?: string | null;
      evidence?: string | null;
      remarks?: string | null;
      reporter?: string | null;
      status?: string;
      subDrafts?: Array<{
        subIndicatorId: string;
        actualValue?: number | null;
        actualText?: string | null;
        evidence?: string | null;
        remarks?: string | null;
        reporter?: string | null;
      }>;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      const mainResultId = `res-${indicatorId}-${roundId}`;
      await tx.strategicIndicatorRoundResult.upsert({
        where: { id: mainResultId },
        update: {
          actualValue: data.actualValue !== undefined ? data.actualValue : null,
          actualText: data.actualText?.trim() || null,
          evidence: data.evidence?.trim() || null,
          remarks: data.remarks?.trim() || null,
          reporter: data.reporter?.trim() || null,
          status: data.status || 'submitted',
        },
        create: {
          id: mainResultId,
          indicatorId,
          roundId,
          actualValue: data.actualValue !== undefined ? data.actualValue : null,
          actualText: data.actualText?.trim() || null,
          evidence: data.evidence?.trim() || null,
          remarks: data.remarks?.trim() || null,
          reporter: data.reporter?.trim() || null,
          status: data.status || 'submitted',
        },
      });

      if (Array.isArray(data.subDrafts) && data.subDrafts.length > 0) {
        for (const sub of data.subDrafts) {
          if (!sub.subIndicatorId) continue;
          const subResultId = `res-sub-${sub.subIndicatorId}-${roundId}`;
          await tx.strategicIndicatorRoundResult.upsert({
            where: { id: subResultId },
            update: {
              actualValue: sub.actualValue !== undefined ? sub.actualValue : null,
              actualText: sub.actualText?.trim() || null,
              evidence: sub.evidence?.trim() || null,
              remarks: sub.remarks?.trim() || null,
              reporter: sub.reporter?.trim() || null,
              status: data.status || 'submitted',
            },
            create: {
              id: subResultId,
              indicatorId,
              subIndicatorId: sub.subIndicatorId,
              roundId,
              actualValue: sub.actualValue !== undefined ? sub.actualValue : null,
              actualText: sub.actualText?.trim() || null,
              evidence: sub.evidence?.trim() || null,
              remarks: sub.remarks?.trim() || null,
              reporter: sub.reporter?.trim() || null,
              status: data.status || 'submitted',
            },
          });
        }
      }

      return tx.strategicIndicator.findUnique({
        where: { id: indicatorId },
        include: {
          strategy: true,
          plan: true,
          subIndicators: {
            orderBy: { sortOrder: 'asc' },
            include: { roundResults: true },
          },
          roundResults: true,
        },
      });
    });
  }

  static async getReportingRounds() {
    return prisma.kpiReportingRoundConfig.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  static async upsertReportingRound(data: {
    id: string;
    name: string;
    startDate?: string | null;
    endDate?: string | null;
    dueDate?: string | null;
    isCumulative?: boolean;
    fiscalYear?: number;
    sortOrder?: number;
  }) {
    return prisma.kpiReportingRoundConfig.upsert({
      where: { id: data.id },
      update: {
        name: data.name.trim(),
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        isCumulative: data.isCumulative !== false,
        fiscalYear: data.fiscalYear || 2569,
        sortOrder: data.sortOrder || 0,
      },
      create: {
        id: data.id,
        name: data.name.trim(),
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        isCumulative: data.isCumulative !== false,
        fiscalYear: data.fiscalYear || 2569,
        sortOrder: data.sortOrder || 0,
      },
    });
  }

  static async deleteReportingRound(id: string) {
    return prisma.kpiReportingRoundConfig.delete({
      where: { id },
    });
  }

  static async getStrategicHierarchy() {
    return prisma.strategicStrategy.findMany({
      include: {
        plans: {
          orderBy: { code: 'asc' },
        },
      },
      orderBy: { code: 'asc' },
    });
  }

  static async upsertStrategy(data: { id?: string; code: string; name: string; pillarGroup?: string }) {
    const cleanCode = String(data.code).trim();
    const cleanName = String(data.name).trim();
    const id = data.id || `strat-${cleanCode.replace(/\./g, '-')}`;
    const existingById = await prisma.strategicStrategy.findUnique({ where: { id } });
    if (existingById) {
      return prisma.strategicStrategy.update({
        where: { id },
        data: {
          code: cleanCode,
          name: cleanName,
          pillarGroup: data.pillarGroup || `ยุทธศาสตร์ที่ ${cleanCode}`,
        },
      });
    }
    return prisma.strategicStrategy.upsert({
      where: { code: cleanCode },
      update: {
        name: cleanName,
        pillarGroup: data.pillarGroup || `ยุทธศาสตร์ที่ ${cleanCode}`,
      },
      create: {
        id,
        code: cleanCode,
        name: cleanName,
        pillarGroup: data.pillarGroup || `ยุทธศาสตร์ที่ ${cleanCode}`,
      },
    });
  }

  static async deleteStrategy(id: string) {
    await prisma.strategicPlan.deleteMany({ where: { strategyId: id } });
    return prisma.strategicStrategy.delete({ where: { id } });
  }

  static async upsertPlan(data: {
    id?: string;
    strategyId: string;
    code: string;
    name: string;
    isDepartmentProject?: boolean;
  }) {
    const cleanCode = String(data.code).trim();
    const cleanName = String(data.name).trim();
    const id = data.id || `plan-${cleanCode.replace(/\./g, '-')}`;
    const existingById = await prisma.strategicPlan.findUnique({ where: { id } });
    if (existingById) {
      return prisma.strategicPlan.update({
        where: { id },
        data: {
          code: cleanCode,
          name: cleanName,
          isDepartmentProject: Boolean(data.isDepartmentProject),
        },
      });
    }
    return prisma.strategicPlan.upsert({
      where: {
        strategyId_code: {
          strategyId: data.strategyId,
          code: cleanCode,
        },
      },
      update: {
        name: cleanName,
        isDepartmentProject: Boolean(data.isDepartmentProject),
      },
      create: {
        id,
        strategyId: data.strategyId,
        code: cleanCode,
        name: cleanName,
        isDepartmentProject: Boolean(data.isDepartmentProject),
      },
    });
  }

  static async deletePlan(id: string) {
    return prisma.strategicPlan.delete({ where: { id } });
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
}

import { KpiRepository } from '../repositories/kpi.repository.js';

export class KpiService {
  private static formatIndicatorToItem(ind: any) {
    if (!ind) return null;

    const mainResults = (ind.roundResults || [])
      .filter((r: any) => !r.subIndicatorId)
      .map((r: any) => ({
        roundId: r.roundId,
        actualValue: r.actualValue !== null ? Number(r.actualValue) : null,
        actualText: r.actualText || undefined,
        evidence: r.evidence || undefined,
        remarks: r.remarks || undefined,
        reporter: r.reporter || undefined,
        status: (r.status as 'draft' | 'submitted') || 'submitted',
        updatedAt: r.updatedAt ? r.updatedAt.toISOString() : undefined,
      }));

    const res6M = mainResults.find((r: any) => r.roundId === 'round-6m');
    const res9M = mainResults.find((r: any) => r.roundId === 'round-9m');

    const subIndicators = (ind.subIndicators || []).map((sub: any) => {
      const subResultsByRound: Record<string, string | number> = {};
      (sub.roundResults || []).forEach((sr: any) => {
        if (sr.actualValue !== null) {
          subResultsByRound[sr.roundId] = Number(sr.actualValue);
        } else if (sr.actualText) {
          subResultsByRound[sr.roundId] = sr.actualText;
        }
      });

      return {
        id: sub.id,
        title: sub.title,
        unit: sub.unit,
        formulaRole: sub.formulaRole || 'sum_part',
        valueSource: sub.valueSource || 'manual',
        linkedDatasetKey: sub.linkedDatasetKey || ind.datasetKey || 'research',
        target: sub.target || undefined,
        reporters: sub.reporters || [],
        reporter: (sub.reporters || []).join(' / '),
        actual6M: subResultsByRound['round-6m'] ?? '-',
        actual9M: subResultsByRound['round-9m'] ?? '-',
        resultsByRound: subResultsByRound,
      };
    });

    const sCode = ind.strategy?.code || '2.1';
    const sName = ind.strategy?.name ? `ยุทธศาสตร์ที่ ${sCode} : ${ind.strategy.name}` : '';
    const pCode = ind.plan?.code ? `แผนงานที่ ${ind.plan.code}` : '';
    const pName = ind.plan?.name || '';

    return {
      id: ind.id,
      code: ind.code,
      title: ind.title,
      description: ind.description || undefined,
      category: ind.category,
      fiscalYear: ind.fiscalYear,
      collectionPeriod: ind.collectionPeriod,
      valueType: ind.valueType,
      reportingLevels: ind.reportingLevels || ['ส่วนงาน'],
      unit: ind.unit,
      targetOperator: ind.targetOperator || 'gte',
      targetValue: Number(ind.targetValue),
      targetLabel: ind.targetLabel || undefined,
      departmentTarget: ind.departmentTarget || undefined,
      formulaMethod: ind.formulaMethod || 'SUM',
      calcType: ind.calcType,
      datasetKey: ind.datasetKey,
      datasetKeys:
        Array.isArray(ind.datasetKeys) && ind.datasetKeys.length > 0
          ? ind.datasetKeys
          : [ind.datasetKey || 'research'],
      manualIncludedProjectIds: Array.isArray(ind.manualIncludedProjectIds)
        ? ind.manualIncludedProjectIds
        : [],
      manualExcludedProjectIds: Array.isArray(ind.manualExcludedProjectIds)
        ? ind.manualExcludedProjectIds
        : [],
      strategyId: ind.strategyId,
      strategyCode: sCode,
      strategyName: sName,
      planId: ind.planId,
      planCode: pCode,
      planName: pName,
      isDepartmentProject: Boolean(ind.plan?.isDepartmentProject),
      responsibleUnit: ind.responsibleUnit || undefined,
      reporters: ind.reporters || [],
      reporter: (ind.reporters || []).join(' / '),
      activeRoundIds: ind.activeRoundIds || ['round-6m', 'round-9m'],
      actual6M: res6M ? res6M.actualValue : null,
      actual6MText: res6M?.actualText,
      actual9M: res9M ? res9M.actualValue : null,
      actual9MText: res9M?.actualText,
      manualProgress: res9M?.actualValue ?? res6M?.actualValue ?? undefined,
      evidence: res9M?.evidence ?? res6M?.evidence ?? undefined,
      remarks: res9M?.remarks ?? res6M?.remarks ?? undefined,
      resultsByRound: mainResults,
      subIndicators,
      createdAt: ind.createdAt?.toISOString(),
      updatedAt: ind.updatedAt?.toISOString(),
    };
  }

  static async getAll() {
    const list = await KpiRepository.getAll();
    return {
      status: 'success',
      total: list.length,
      data: list.map(this.formatIndicatorToItem),
    };
  }

  static async getById(id: string) {
    const item = await KpiRepository.getById(id);
    if (!item) return null;
    return {
      status: 'success',
      data: this.formatIndicatorToItem(item),
    };
  }

  static async create(data: any) {
    const newId = data.id || `kpi-${Date.now()}`;
    const created = await KpiRepository.create({
      ...data,
      id: newId,
    });
    return {
      status: 'success',
      data: this.formatIndicatorToItem(created),
    };
  }

  static async update(id: string, data: any) {
    const updated = await KpiRepository.update(id, data);
    return {
      status: 'success',
      data: this.formatIndicatorToItem(updated),
    };
  }

  static async delete(id: string) {
    await KpiRepository.delete(id);
    return {
      status: 'success',
      message: 'ลบตัวชี้วัดเรียบร้อยแล้ว',
    };
  }

  static async saveRoundResult(indicatorId: string, roundId: string, data: any) {
    const updated = await KpiRepository.saveRoundResult(indicatorId, roundId, data);
    return {
      status: 'success',
      data: this.formatIndicatorToItem(updated),
    };
  }

  static async getReportingRounds() {
    const rounds = await KpiRepository.getReportingRounds();
    return {
      status: 'success',
      total: rounds.length,
      data: rounds.map((r) => ({
        id: r.id,
        name: r.name,
        startDate: r.startDate ? r.startDate.toISOString().slice(0, 10) : undefined,
        endDate: r.endDate ? r.endDate.toISOString().slice(0, 10) : undefined,
        dueDate: r.dueDate ? r.dueDate.toISOString().slice(0, 10) : undefined,
        isCumulative: r.isCumulative,
        fiscalYear: String(r.fiscalYear),
        sortOrder: r.sortOrder,
      })),
    };
  }

  static async upsertReportingRound(data: any) {
    const item = await KpiRepository.upsertReportingRound(data);
    return {
      status: 'success',
      data: {
        id: item.id,
        name: item.name,
        startDate: item.startDate ? item.startDate.toISOString().slice(0, 10) : undefined,
        endDate: item.endDate ? item.endDate.toISOString().slice(0, 10) : undefined,
        dueDate: item.dueDate ? item.dueDate.toISOString().slice(0, 10) : undefined,
        isCumulative: item.isCumulative,
        fiscalYear: String(item.fiscalYear),
        sortOrder: item.sortOrder,
      },
    };
  }

  static async deleteReportingRound(id: string) {
    await KpiRepository.deleteReportingRound(id);
    return {
      status: 'success',
      message: 'ลบรอบรายงานเรียบร้อยแล้ว',
    };
  }

  static async getStrategicHierarchy() {
    const strategies = await KpiRepository.getStrategicHierarchy();
    return {
      status: 'success',
      total: strategies.length,
      data: strategies,
    };
  }

  static async mutateStrategicHierarchy(body: any) {
    const { entityType, action, id, strategyId, code, name, pillarGroup, isDepartmentProject } = body || {};
    if (entityType === 'plan') {
      if (action === 'delete' && id) {
        await KpiRepository.deletePlan(String(id));
        return { status: 'success', message: 'ลบแผนงานเรียบร้อยแล้ว' };
      }
      const plan = await KpiRepository.upsertPlan({
        id: id ? String(id) : undefined,
        strategyId: String(strategyId),
        code: String(code),
        name: String(name),
        isDepartmentProject: Boolean(isDepartmentProject),
      });
      return { status: 'success', data: plan };
    } else {
      if (action === 'delete' && id) {
        await KpiRepository.deleteStrategy(String(id));
        return { status: 'success', message: 'ลบยุทธศาสตร์เรียบร้อยแล้ว' };
      }
      const strat = await KpiRepository.upsertStrategy({
        id: id ? String(id) : undefined,
        code: String(code),
        name: String(name),
        pillarGroup: pillarGroup ? String(pillarGroup) : undefined,
      });
      return { status: 'success', data: strat };
    }
  }

  static async getKpiOptions(fieldKey?: string) {
    const list = await KpiRepository.getKpiOptions(fieldKey);
    return {
      status: 'success',
      total: list.length,
      data: list,
    };
  }

  static async addKpiOption(fieldKey: string, value: string, label?: string) {
    const item = await KpiRepository.upsertKpiOption(fieldKey, value, label, true);
    return {
      status: 'success',
      data: item,
    };
  }
}

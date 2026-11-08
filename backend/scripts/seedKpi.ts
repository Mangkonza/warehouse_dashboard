import { PrismaClient } from '@prisma/client';
import {
  DEFAULT_KPIS,
  STRATEGIC_PILLARS,
} from '../../frontend/src/config/kpiConfig';
import {
  DEFAULT_REPORTING_ROUNDS,
  normalizePlanCodeOnly,
  normalizePlanNameOnly,
  normalizeStrategyNameOnly,
  normalizeReportersArray,
  enrichKPIItem,
} from '../../frontend/src/lib/kpiEngine';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log('--- STARTING STRATEGIC KPI SEEDING ---');

  // Clean existing indicator results and indicators for idempotent re-seed
  console.log('Clearing old strategic indicators and results...');
  await prisma.strategicIndicatorRoundResult.deleteMany({});
  await prisma.strategicSubIndicator.deleteMany({});
  await prisma.strategicIndicator.deleteMany({});
  console.log(' Old indicators cleared.');

  // 1. Seed Strategic Pillars (Strategies)
  console.log(`Seeding ${STRATEGIC_PILLARS.length} Strategic Strategies...`);
  const strategyIdMap = new Map<string, string>(); // code -> id

  for (const pillar of STRATEGIC_PILLARS) {
    const id = `strat-${pillar.code.replace(/\./g, '-')}`;
    const cleanName = normalizeStrategyNameOnly(pillar.fullName, pillar.code);
    const strategy = await prisma.strategicStrategy.upsert({
      where: { code: pillar.code },
      update: {
        name: cleanName,
        pillarGroup: pillar.pillarGroup,
        fiscalYear: 2569,
      },
      create: {
        id,
        code: pillar.code,
        name: cleanName,
        pillarGroup: pillar.pillarGroup,
        fiscalYear: 2569,
      },
    });
    strategyIdMap.set(pillar.code, strategy.id);
  }
  console.log(` Strategies seeded.`);

  // 2. Seed Strategic Plans
  console.log(`Collecting and Seeding Strategic Plans...`);
  const planKeyMap = new Map<string, string>(); // strategyCode__planCode -> planId

  for (const kpi of DEFAULT_KPIS) {
    const sCode = kpi.strategyCode || '2.1';
    const strategyId = strategyIdMap.get(sCode);
    if (!strategyId) continue;

    const rawPlanCode = kpi.planCode || `${sCode}-1`;
    const cleanPCode = normalizePlanCodeOnly(rawPlanCode) || `${sCode}-1`;
    const cleanPName =
      normalizePlanNameOnly(kpi.planName, cleanPCode) || kpi.planName || `แผนงาน ${cleanPCode}`;
    const planKey = `${sCode}__${cleanPCode}`;

    if (!planKeyMap.has(planKey)) {
      const planId = `plan-${cleanPCode.replace(/[^a-zA-Z0-9]/g, '-')}`;
      const plan = await prisma.strategicPlan.upsert({
        where: {
          strategyId_code: {
            strategyId,
            code: cleanPCode,
          },
        },
        update: {
          name: cleanPName,
          isDepartmentProject: Boolean(kpi.isDepartmentProject),
        },
        create: {
          id: planId,
          strategyId,
          code: cleanPCode,
          name: cleanPName,
          isDepartmentProject: Boolean(kpi.isDepartmentProject),
        },
      });
      planKeyMap.set(planKey, plan.id);
    }
  }
  console.log(` Seeded ${planKeyMap.size} Strategic Plans.`);

  // 3. Seed Reporting Rounds
  console.log(`Seeding ${DEFAULT_REPORTING_ROUNDS.length} Reporting Rounds...`);
  for (const r of DEFAULT_REPORTING_ROUNDS) {
    await prisma.kpiReportingRoundConfig.upsert({
      where: { id: r.id },
      update: {
        name: r.name,
        startDate: r.startDate ? new Date(r.startDate) : null,
        endDate: r.endDate ? new Date(r.endDate) : null,
        dueDate: r.dueDate ? new Date(r.dueDate) : null,
        isCumulative: r.isCumulative !== false,
        fiscalYear: parseInt(r.fiscalYear || '2569'),
        sortOrder: r.sortOrder || 0,
      },
      create: {
        id: r.id,
        name: r.name,
        startDate: r.startDate ? new Date(r.startDate) : null,
        endDate: r.endDate ? new Date(r.endDate) : null,
        dueDate: r.dueDate ? new Date(r.dueDate) : null,
        isCumulative: r.isCumulative !== false,
        fiscalYear: parseInt(r.fiscalYear || '2569'),
        sortOrder: r.sortOrder || 0,
      },
    });
  }
  console.log(` Reporting Rounds seeded.`);

  // 4. Seed Strategic Indicators (KPIs) and their Sub-indicators & Round Results
  console.log(`Seeding ${DEFAULT_KPIS.length} Strategic Indicators (KPIs)...`);
  let kpiCount = 0;
  let subCount = 0;
  let resultCount = 0;

  for (const rawKpi of DEFAULT_KPIS) {
    const kpi = enrichKPIItem(rawKpi);
    const sCode = kpi.strategyCode || '2.1';
    const strategyId = strategyIdMap.get(sCode);
    if (!strategyId) {
      console.warn(`Could not find strategy for KPI ${kpi.code} with code ${sCode}`);
      continue;
    }

    const cleanPCode = normalizePlanCodeOnly(kpi.planCode) || `${sCode}-1`;
    const planKey = `${sCode}__${cleanPCode}`;
    const planId = planKeyMap.get(planKey);
    if (!planId) {
      console.warn(`Could not find plan for KPI ${kpi.code} with planKey ${planKey}`);
      continue;
    }

    const reporters = normalizeReportersArray(kpi.reporters, kpi.reporter);

    const deptTargetStr =
      kpi.departmentTarget !== undefined && kpi.departmentTarget !== null
        ? String(kpi.departmentTarget)
        : null;

    const indicator = await prisma.strategicIndicator.upsert({
      where: { id: kpi.id },
      update: {
        strategyId,
        planId,
        code: kpi.code,
        title: kpi.title,
        description: kpi.description || null,
        category: kpi.category || 'research',
        fiscalYear: kpi.fiscalYear || '2569',
        collectionPeriod: kpi.collectionPeriod || 'ปีงบประมาณ',
        valueType: kpi.valueType || 'จำนวนนับ',
        reportingLevels: kpi.reportingLevels || ['ส่วนงาน'],
        unit: kpi.unit || '',
        targetOperator: kpi.targetOperator || 'gte',
        targetValue: kpi.targetValue || 0,
        targetLabel: kpi.targetLabel || null,
        departmentTarget: deptTargetStr,
        formulaMethod: kpi.formulaMethod || 'SUM',
        calcType: kpi.calcType || 'manual',
        datasetKey: kpi.datasetKey || 'research',
        activeRoundIds: kpi.activeRoundIds || ['round-6m', 'round-9m'],
        reporters: reporters,
        responsibleUnit: kpi.responsibleUnit || null,
      },
      create: {
        id: kpi.id,
        strategyId,
        planId,
        code: kpi.code,
        title: kpi.title,
        description: kpi.description || null,
        category: kpi.category || 'research',
        fiscalYear: kpi.fiscalYear || '2569',
        collectionPeriod: kpi.collectionPeriod || 'ปีงบประมาณ',
        valueType: kpi.valueType || 'จำนวนนับ',
        reportingLevels: kpi.reportingLevels || ['ส่วนงาน'],
        unit: kpi.unit || '',
        targetOperator: kpi.targetOperator || 'gte',
        targetValue: kpi.targetValue || 0,
        targetLabel: kpi.targetLabel || null,
        departmentTarget: deptTargetStr,
        formulaMethod: kpi.formulaMethod || 'SUM',
        calcType: kpi.calcType || 'manual',
        datasetKey: kpi.datasetKey || 'research',
        activeRoundIds: kpi.activeRoundIds || ['round-6m', 'round-9m'],
        reporters: reporters,
        responsibleUnit: kpi.responsibleUnit || null,
      },
    });
    kpiCount++;

    // Seed Sub-Indicators
    if (Array.isArray(kpi.subIndicators) && kpi.subIndicators.length > 0) {
      for (let sIdx = 0; sIdx < kpi.subIndicators.length; sIdx++) {
        const sub = kpi.subIndicators[sIdx];
        const subId = sub.id || `${kpi.id}-sub-${sIdx + 1}`;
        const subReporters = normalizeReportersArray(sub.reporters, sub.reporter);

        const subTargetStr = sub.target !== undefined && sub.target !== null ? String(sub.target) : null;

        const subIndicator = await prisma.strategicSubIndicator.upsert({
          where: { id: subId },
          update: {
            title: sub.title,
            unit: sub.unit || kpi.unit || '',
            formulaRole: sub.formulaRole || 'sum_part',
            valueSource: sub.valueSource || 'manual',
            linkedDatasetKey: sub.linkedDatasetKey || kpi.datasetKey || 'research',
            target: subTargetStr,
            reporters: subReporters,
            sortOrder: sIdx,
          },
          create: {
            id: subId,
            indicatorId: indicator.id,
            title: sub.title,
            unit: sub.unit || kpi.unit || '',
            formulaRole: sub.formulaRole || 'sum_part',
            valueSource: sub.valueSource || 'manual',
            linkedDatasetKey: sub.linkedDatasetKey || kpi.datasetKey || 'research',
            target: subTargetStr,
            reporters: subReporters,
            sortOrder: sIdx,
          },
        });
        subCount++;

        // Sub Indicator round results
        if (sub.resultsByRound) {
          for (const [roundId, rVal] of Object.entries(sub.resultsByRound)) {
            if (rVal !== undefined && rVal !== null && rVal !== '') {
              const numVal = typeof rVal === 'number' ? rVal : !isNaN(Number(rVal)) ? Number(rVal) : null;
              const textVal = typeof rVal === 'string' && isNaN(Number(rVal)) ? rVal : null;
        const resultId = `res-sub-${subIndicator.id}-${roundId}`;

        await prisma.strategicIndicatorRoundResult.upsert({
          where: { id: resultId },
          update: {
            actualValue: numVal,
            actualText: textVal,
            evidence: sub.evidence || null,
            remarks: sub.remarks || null,
            reporter: subReporters.join(' / ') || null,
            status: 'submitted',
          },
          create: {
            id: resultId,
            indicatorId: indicator.id,
            subIndicatorId: subIndicator.id,
            roundId,
            actualValue: numVal,
            actualText: textVal,
            evidence: sub.evidence || null,
            remarks: sub.remarks || null,
            reporter: subReporters.join(' / ') || null,
            status: 'submitted',
          },
        });
        resultCount++;
            }
          }
        }
      }
    }

    // Seed Main Indicator Round Results
    if (Array.isArray(kpi.resultsByRound) && kpi.resultsByRound.length > 0) {
      for (const entry of kpi.resultsByRound) {
        if (!entry.roundId) continue;
        const resultId = `res-${indicator.id}-${entry.roundId}`;
        const numVal =
          entry.actualValue !== undefined && entry.actualValue !== null
            ? Number(entry.actualValue)
            : null;

        await prisma.strategicIndicatorRoundResult.upsert({
          where: { id: resultId },
          update: {
            actualValue: numVal,
            actualText: entry.actualText || null,
            evidence: entry.evidence || kpi.evidence || null,
            remarks: entry.remarks || kpi.remarks || null,
            reporter: entry.reporter || reporters.join(' / ') || null,
            status: entry.status || 'submitted',
          },
          create: {
            id: resultId,
            indicatorId: indicator.id,
            roundId: entry.roundId,
            actualValue: numVal,
            actualText: entry.actualText || null,
            evidence: entry.evidence || kpi.evidence || null,
            remarks: entry.remarks || kpi.remarks || null,
            reporter: entry.reporter || reporters.join(' / ') || null,
            status: entry.status || 'submitted',
          },
        });
        resultCount++;
      }
    } else {
      // Create initial round entries from actual6M and actual9M if present
      if (kpi.actual6M !== undefined && kpi.actual6M !== null) {
        const num6M = typeof kpi.actual6M === 'number' ? kpi.actual6M : Number(kpi.actual6M) || 0;
        const resultId6M = `res-${indicator.id}-round-6m`;
        await prisma.strategicIndicatorRoundResult.upsert({
          where: { id: resultId6M },
          update: {
            actualValue: num6M,
            actualText: kpi.actual6MText || null,
            evidence: kpi.evidence || null,
            remarks: kpi.remarks || null,
            reporter: reporters.join(' / ') || null,
            status: 'submitted',
          },
          create: {
            id: resultId6M,
            indicatorId: indicator.id,
            roundId: 'round-6m',
            actualValue: num6M,
            actualText: kpi.actual6MText || null,
            evidence: kpi.evidence || null,
            remarks: kpi.remarks || null,
            reporter: reporters.join(' / ') || null,
            status: 'submitted',
          },
        });
        resultCount++;
      }

      if (kpi.actual9M !== undefined && kpi.actual9M !== null) {
        const num9M = typeof kpi.actual9M === 'number' ? kpi.actual9M : Number(kpi.actual9M) || 0;
        const resultId9M = `res-${indicator.id}-round-9m`;
        await prisma.strategicIndicatorRoundResult.upsert({
          where: { id: resultId9M },
          update: {
            actualValue: num9M,
            actualText: kpi.actual9MText || null,
            evidence: kpi.evidence || null,
            remarks: kpi.remarks || null,
            reporter: reporters.join(' / ') || null,
            status: 'submitted',
          },
          create: {
            id: resultId9M,
            indicatorId: indicator.id,
            roundId: 'round-9m',
            actualValue: num9M,
            actualText: kpi.actual9MText || null,
            evidence: kpi.evidence || null,
            remarks: kpi.remarks || null,
            reporter: reporters.join(' / ') || null,
            status: 'submitted',
          },
        });
        resultCount++;
      }
    }
  }

  console.log(` Seeded ${kpiCount} Strategic Indicators.`);
  console.log(` Seeded ${subCount} Sub-Indicators.`);
  console.log(` Seeded ${resultCount} Round Results.`);
  console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error('SEEDING FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

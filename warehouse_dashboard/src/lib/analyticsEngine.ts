import { AggregatedChartData, AnalyticsQuery, ChartType } from '../types/analyticsBuilder';
import { FACT_DOMAINS_CONFIG } from '../config/analyticsMetadata';
import { normalizeDepartmentName } from '../config/dataManagementConfig';
import { recommendChartType } from './chartAdvisor';
import { calculateProjectTimeline } from './projectMonitoringEngine';
import { detectSDGsFromText, isTestRecord } from './sdgEngine';
import { autoDetectJournalRanking } from './journalRankingEngine';
import { getDepartment, getDepartmentColor } from './departments';

// Vibrant Liquid Glass Palette (KU Green, Azure Blue, Violet, Amber, Rose, Teal, Cyan)
const LIQUID_GLASS_PALETTE = [
  '#006838', // KU Green
  '#0284c7', // Sky Blue
  '#7c3aed', // Purple Violet
  '#f59e0b', // Amber
  '#e11d48', // Rose
  '#0d9488', // Teal
  '#ea580c', // Orange
  '#4338ca', // Indigo
  '#059669', // Emerald
  '#0891b2', // Cyan
  '#d97706', // Gold
  '#64748b', // Slate
];

const LIQUID_GLASS_ALPHA = [
  'rgba(0, 104, 56, 0.75)',
  'rgba(2, 132, 199, 0.75)',
  'rgba(124, 58, 237, 0.75)',
  'rgba(245, 158, 11, 0.75)',
  'rgba(225, 29, 72, 0.75)',
  'rgba(13, 148, 136, 0.75)',
  'rgba(234, 88, 12, 0.75)',
  'rgba(67, 56, 202, 0.75)',
  'rgba(5, 150, 105, 0.75)',
  'rgba(8, 145, 178, 0.75)',
];

/**
 * ดึงค่าตัวเลขจากฟิลด์อย่างปลอดภัย
 */
function extractNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const clean = String(val).replace(/[฿,\sบาท\-]/gi, '').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

/**
 * สกัดค่า Dimension จากแถวข้อมูล
 */
export function extractDimensionValue(row: Record<string, any>, dimField: string): string {
  // 1. หมวดหมู่ SDG
  if (dimField === 'sdg_code') {
    if (row.sdg_code) return String(row.sdg_code);
    const detected = detectSDGsFromText(row.name || row.title || '', row.department);
    return detected.length > 0 ? detected[0].sdg.code : 'ทั่วไป';
  }

  // 2. สถานะโครงการ / วงจรเวลา
  if (dimField === 'status') {
    if (row.status) return String(row.status);
    const timeline = calculateProjectTimeline(row);
    return timeline.status;
  }

  // 3. ระดับวารสาร (Q1-Q4 / TCI)
  if (dimField === 'level') {
    if (row.level && row.level !== 'nan') return String(row.level).trim();
    const detected = autoDetectJournalRanking(row.journal || row.name || '');
    return detected ? detected.tier : 'วารสารวิชาการ';
  }

  // 4. ปีงบประมาณ
  if (dimField === 'fiscal_year' || dimField === 'fiscal_year_be') {
    const raw = String(row.fiscal_year_be || row.fiscal_year || row.id || '');
    const match = raw.match(/25[6-7][0-9]/);
    return match ? match[0] : '2568';
  }

  // 5. ภาควิชา
  if (dimField === 'department') {
    const d = getDepartment(row.department);
    return d.code !== '-' ? d.code : normalizeDepartmentName(row.department);
  }

  const val = row[dimField];
  if (!val || val === 'nan' || val === 'NaT' || val === '-') return 'ไม่ระบุ';
  return String(val).replace(/\n/g, ' ').trim();
}

/**
 * คำนวณผลการวิเคราะห์ข้อมูลแบบ Pivot ข้าม Fact, Measure และ Dimensions (Self-Service Query Execution)
 */
export function executeAnalyticsQuery(
  query: AnalyticsQuery,
  rawDataset: Record<string, any>[]
): AggregatedChartData {
  const domainDef = FACT_DOMAINS_CONFIG[query.factDomain];
  if (!domainDef) {
    throw new Error(`Unknown Fact Domain: ${query.factDomain}`);
  }

  const measureDef = domainDef.measures.find((m) => m.id === query.measureId) || domainDef.measures[0];
  const primaryDimDef = domainDef.dimensions.find((d) => d.id === query.primaryDimensionId) || domainDef.dimensions[0];
  const secondaryDimDef = query.secondaryDimensionId
    ? domainDef.dimensions.find((d) => d.id === query.secondaryDimensionId)
    : undefined;

  const activeAggregation = query.aggregationFn || measureDef.aggregation;

  // กรองข้อมูลขยะและข้อมูลทดสอบ (Empty / NaN / test rows)
  let validRows = rawDataset.filter(
    (r) => !isTestRecord(r) && r.name && r.name !== 'nan' && r.name !== 'NaT' && r.name !== 'เรื่อง'
  );

  // กรองตามปี ถ้ามีการระบุ
  if (query.selectedYear && query.selectedYear !== 'all') {
    validRows = validRows.filter((r) => extractDimensionValue(r, 'fiscal_year') === query.selectedYear);
  }

  // กรองตามภาควิชา ถ้ามีการระบุ
  if (query.selectedDept && query.selectedDept !== 'all') {
    const targetCode = getDepartment(query.selectedDept).code;
    validRows = validRows.filter((r) => {
      const rowCode = getDepartment(r.department).code;
      return (
        (targetCode !== '-' && rowCode === targetCode) ||
        extractDimensionValue(r, 'department').includes(query.selectedDept!)
      );
    });
  }

  // การคำนวณแบบ 1 มิติ (Single Primary Dimension)
  if (!secondaryDimDef) {
    const groups: Record<string, { sum: number; count: number; min: number; max: number; values: number[] }> = {};

    validRows.forEach((row) => {
      const dimVal = extractDimensionValue(row, primaryDimDef.field);
      if (!groups[dimVal]) {
        groups[dimVal] = { sum: 0, count: 0, min: Infinity, max: -Infinity, values: [] };
      }

      let val = 1;
      if (activeAggregation !== 'COUNT') {
        if (measureDef.field === 'budget_total') {
          val = extractNumber(row.budget_internal) + extractNumber(row.budget_external) || extractNumber(row.budget);
        } else {
          val = extractNumber(row[measureDef.field]);
        }
      }

      groups[dimVal].sum += val;
      groups[dimVal].count += 1;
      if (val < groups[dimVal].min) groups[dimVal].min = val;
      if (val > groups[dimVal].max) groups[dimVal].max = val;
      groups[dimVal].values.push(val);
    });

    // คำนวณค่าผลลัพธ์ของแต่ละกลุ่มตาม Aggregation Function
    const computeGroupVal = (g: { sum: number; count: number; min: number; max: number }) => {
      if (activeAggregation === 'COUNT') return g.count;
      if (activeAggregation === 'AVG') return Math.round((g.sum / Math.max(1, g.count)) * 100) / 100;
      if (activeAggregation === 'MIN') return g.min === Infinity ? 0 : g.min;
      if (activeAggregation === 'MAX') return g.max === -Infinity ? 0 : g.max;
      return Math.round(g.sum);
    };

    // เรียงลำดับตามค่าจากมากไปน้อย
    const sortedCategories = Object.keys(groups).sort((a, b) => {
      const valA = computeGroupVal(groups[a]);
      const valB = computeGroupVal(groups[b]);
      return valB - valA;
    });

    const labels = sortedCategories;
    const dataValues: number[] = sortedCategories.map((cat) => computeGroupVal(groups[cat]));

    const totalVal = dataValues.reduce((a, b) => a + b, 0);
    const avgVal = dataValues.length > 0 ? totalVal / dataValues.length : 0;
    const maxVal = dataValues.length > 0 ? Math.max(...dataValues) : 0;
    const minVal = dataValues.length > 0 ? Math.min(...dataValues) : 0;

    const tableRows = sortedCategories.map((cat, idx) => {
      const val = dataValues[idx];
      const share = totalVal > 0 ? ((val / totalVal) * 100).toFixed(1) + '%' : '0%';
      let formatted = val.toLocaleString();
      if (measureDef.format === 'currency' && activeAggregation !== 'COUNT') formatted += ' บาท';

      return {
        category: cat,
        value: val,
        formattedValue: formatted,
        sharePercent: share,
      };
    });

    const rec = recommendChartType(primaryDimDef.type, false, labels.length, activeAggregation, primaryDimDef.id);

    return {
      labels,
      datasets: [
        {
          label: measureDef.label,
          data: dataValues,
          backgroundColor:
            primaryDimDef.field === 'department'
              ? labels.map((l) => getDepartmentColor(l))
              : labels.map((_, i) => LIQUID_GLASS_ALPHA[i % LIQUID_GLASS_ALPHA.length]),
          borderColor:
            primaryDimDef.field === 'department'
              ? labels.map((l) => getDepartmentColor(l)) as any
              : (labels.map((_, i) => LIQUID_GLASS_PALETTE[i % LIQUID_GLASS_PALETTE.length]) as any),
          fill: true,
        },
      ],
      totalValue: totalVal,
      averageValue: avgVal,
      count: validRows.length,
      maxValue: maxVal,
      minValue: minVal,
      format: measureDef.format,
      recommendedChartType: rec.recommended,
      recommendationReason: rec.reasonTh,
      tableRows,
    };
  }

  // การคำนวณแบบ 2 มิติ (Primary Dimension x Secondary Breakdown Dimension)
  const primaryCategories = Array.from(new Set(validRows.map((r) => extractDimensionValue(r, primaryDimDef.field)))).slice(0, 10);
  const secondaryCategories = Array.from(new Set(validRows.map((r) => extractDimensionValue(r, secondaryDimDef.field)))).slice(0, 6);

  const matrix: Record<string, Record<string, number>> = {};
  primaryCategories.forEach((p) => {
    matrix[p] = {};
    secondaryCategories.forEach((s) => {
      matrix[p][s] = 0;
    });
  });

  validRows.forEach((row) => {
    const pVal = extractDimensionValue(row, primaryDimDef.field);
    const sVal = extractDimensionValue(row, secondaryDimDef.field);
    if (matrix[pVal] && matrix[pVal][sVal] !== undefined) {
      let val = 1;
      if (measureDef.aggregation !== 'COUNT') {
        val = extractNumber(row[measureDef.field]) || extractNumber(row.budget_total) || extractNumber(row.budget);
      }
      matrix[pVal][sVal] += val;
    }
  });

  const datasets = secondaryCategories.map((sCat, idx) => ({
    label: sCat,
    data: primaryCategories.map((pCat) => Math.round(matrix[pCat][sCat] || 0)),
    backgroundColor: LIQUID_GLASS_ALPHA[idx % LIQUID_GLASS_ALPHA.length],
    borderColor: LIQUID_GLASS_PALETTE[idx % LIQUID_GLASS_PALETTE.length],
  }));

  const allNumbers = datasets.flatMap((d) => d.data);
  const totalVal = allNumbers.reduce((a, b) => a + b, 0);

  const tableRows: any[] = [];
  primaryCategories.forEach((p) => {
    secondaryCategories.forEach((s) => {
      const val = matrix[p][s] || 0;
      if (val > 0) {
        tableRows.push({
          category: p,
          subCategory: s,
          value: val,
          formattedValue: measureDef.format === 'currency' ? `${val.toLocaleString()} บาท` : val.toLocaleString(),
          sharePercent: totalVal > 0 ? ((val / totalVal) * 100).toFixed(1) + '%' : '0%',
        });
      }
    });
  });

  const rec = recommendChartType(primaryDimDef.type, true, primaryCategories.length, activeAggregation, primaryDimDef.id);

  return {
    labels: primaryCategories,
    datasets,
    totalValue: totalVal,
    averageValue: totalVal / Math.max(1, primaryCategories.length),
    count: validRows.length,
    maxValue: Math.max(...allNumbers, 0),
    minValue: Math.min(...allNumbers, 0),
    format: measureDef.format,
    recommendedChartType: rec.recommended,
    recommendationReason: rec.reasonTh,
    tableRows,
  };
}

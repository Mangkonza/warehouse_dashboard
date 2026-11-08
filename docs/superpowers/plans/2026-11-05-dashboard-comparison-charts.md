# Dashboard Comparison Charts Implementation Plan

**Goal:** Apply chart best practices to the dashboard's most important comparisons while preserving the existing in-progress work.

**Architecture:** Extend the existing Chart.js charts using each page's filtered data. Prefer separate aligned plots or metric selectors over dual axes; keep axis units, category ordering, filters, and drill-downs explicit. Do not rebuild comparisons that already communicate their measures clearly.

**Tech Stack:** Next.js 16, React 19, TypeScript, Chart.js 4.

**Spec:** [2026-11-05-dashboard-comparison-charts.md](../specs/2026-11-05-dashboard-comparison-charts.md)
**Research:** [2026-11-05-dashboard-chart-best-practices.md](../../research/2026-11-05-dashboard-chart-best-practices.md)

## Global Constraints

- Preserve current filters, category colors, page layout, and click-through behavior.
- Use a separate panel or metric selector for measures with different units; do not add dual axes.
- Keep bar axes at zero; sort ranked categories by the selected metric and retain natural order for time, tiers, and stages.
- Averages use valid denominators only; show no average when count is zero.
- Publication trends use valid `month_year`; records without one stay outside dated buckets.
- Month-only academic records are a month profile over the filtered years, not a chronological trend when multiple years are included.
- Do not add or run tests unless requested. Run lint on modified files after implementation.
- Preserve all pre-existing uncommitted changes.

## Review Focus

- Publication records with no reliable `month_year` remain visible in the undated summary and do not inflate dated counts or funding.
- Zero-count/zero-budget groups do not produce `NaN` or infinite averages.
- Academic month-only data is not presented as a continuous timeline across years.
- Identified service providers are not described as all staff or faculty; retain a visible denominator.
- IP stage totals are not presented as conversion rates without cohort data.
- Existing chart clicks still open the matching records after chart separation or metric switching.

### Task 1: Separate publication volume/quality and support over a shared time axis

**Files:**
- Modify: `warehouse_dashboard/src/app/(dashboard)/publications/_components/PublicationsCharts.tsx`

- [x] Aggregate records by valid `month_year`, order chronologically, and keep records without a reliable year in an undated count/support summary.
- [x] Replace the current dual-axis plot with two aligned panels: publication count (with a tier breakdown option) and support budget. Give both the same year-month categories.
- [x] Show support per publication as a labeled derived value in the period summary/tooltip and department detail, with an empty state for zero denominator.
- [x] Preserve record membership for click-through from each dated period and the undated summary.

### Task 2: Add research budget-per-project comparison

**Files:**
- Modify: `warehouse_dashboard/src/app/(dashboard)/research/_components/ResearchCharts.tsx`

- [x] Add `researchBudgetMetric: 'total' | 'average'` state and a selector beside the department budget chart.
- [x] In average mode calculate department total budget divided by project count; keep project count visible in the tooltip/compact summary and label million-baht values as total or average.
- [x] Sort by the selected metric and preserve the existing department drill-down mapping.

### Task 3: Add academic contract value comparison by client and separate monthly units

**Files:**
- Modify: `warehouse_dashboard/src/app/(dashboard)/academic/_components/AcademicCharts.tsx`

- [x] Add `clientValueMetric: 'total' | 'average'` state and a selector beside the top-client chart; sort clients by the selected value and expose project count and both value measures in the tooltip.
- [x] Replace the monthly count/budget dual-axis overlay with aligned panels sharing month categories and explicit units.
- [x] When multiple years are included but records have only a month, label the views as month profiles across the filtered period; do not imply continuous time order.
- [x] Preserve client click selection and drill-down behavior.

### Task 4: Remove dual-axis ambiguity from service department comparison

**Files:**
- Modify: `warehouse_dashboard/src/app/(dashboard)/service/_components/ServiceCharts.tsx`

- [x] Replace the activity-count/provider-count dual-axis chart with separate aligned charts sharing the same department order.
- [x] Keep the existing activity-per-identified-provider chart and label its denominator as providers found in records.
- [x] Preserve the activity and provider totals in the tooltip/drill-down; do not describe providers found as total faculty or FTE.

### Task 5: Describe the IP status display as a stage snapshot

**Files:**
- Modify: `warehouse_dashboard/src/app/(dashboard)/ip/_components/IPCharts.tsx`

- [x] Change chart heading/labels that call current stage counts a conversion funnel to “จำนวนผลงานตามสถานะ” (or equivalent).
- [x] Keep granted, submitted/pending, and preparation counts in their existing stage order; do not present a conversion percentage.
- [x] Preserve current department click-through behavior.

### Task 6: Review and lint changed surfaces

**Files:**
- Check: the five chart files above and their in-progress diffs.

- [x] Review the final diff against the spec and confirm no unrelated edits were changed.
- [x] Run targeted ESLint from `warehouse_dashboard` on modified files.
- [x] Report lint results and note that automated tests were not added or run, per instruction.

# Dashboard Comparison Charts Design

## Intent
Make the dashboard's count, budget, quality, and staffing comparisons easier to interpret. Apply chart-selection guidance to current comparisons as well as missing metrics. See [chart best-practices research](../../research/2026-11-05-dashboard-chart-best-practices.md).

## Goals
- Help readers compare output volume, related budget/value, and derived per-output averages without confusing their units.
- Keep existing page layout, chart library, filters, category colors, and drill-down behavior.
- Avoid merging records from different years into the same month bucket or implying year order from month-only data.
- Improve existing comparisons when the current chart form can mislead.

## Non-goals
- A new cross-domain comparison page or analytics builder.
- New source fields, data imports, KPI definitions, or changes to fiscal-year rules.
- Claiming that budget causes output, that identified providers equal total faculty, or that status counts represent a cohort conversion rate.

## Approaches
1. **Add/refine comparisons inside existing category pages (selected).** Reuse page data, filters, chart components, and drill-downs. This puts each comparison beside the records it explains and keeps the work focused.
2. **Create a shared comparison page.** This would place cross-domain comparisons together, but would duplicate filters and require additional cross-domain aggregation.

## Selected direction
Integrate improvements into the existing category pages, based on the user's selection. Preserve unrelated uncommitted workspace changes and build on existing chart edits. Plotting details below are refined using the research requested after the initial design approval and need review before implementation.

## Design
- **Publications:** Replace the dual-axis count/funding combination with two aligned panels sharing a year-month axis: publication volume/quality and support budget. Add support per publication as a labeled derived measure. Keep records without reliable `month_year` out of dated buckets and report them separately.
- **Research:** Provide a department metric selector for total budget versus average budget per project, with project count visible as a separate value in a tooltip or compact summary. Preserve internal/external funding information and drill-down.
- **Academic development:** Provide a client metric selector for total contract value versus average value per contract; show project count alongside the selected value. Keep monthly comparison, but show count and budget in aligned panels instead of dual axes. When a multi-year filter is active and records only have a month, label the chart as a month profile across the filtered years, not a chronological trend.
- **Service:** Replace the department chart's dual-axis activity/provider overlay with separate aligned measures. Keep activity per identified provider and label its denominator accurately.
- **IP:** Keep stage counts by department. Describe the current “funnel” as counts by current stage unless the data establishes a cohort and stage conversion; do not claim a conversion rate from a status snapshot.
- **Personnel:** Keep output by mission. Distinguish total work counts from per-person/per-department rates and show the denominator when presenting a rate.
- **Executive overview and KPI:** Keep volume and budget in separate modes. If comparing relative growth, use an explicitly labeled base-100 index only for nonzero baselines. Keep KPI actual and target values with units visible; do not add duplicate cards.

## Constraints and calls
- Prefer one scale per chart. For two distinct measures over time, use aligned panels with the same time axis rather than an overlaid dual axis.
- Keep count and monetary values distinct; do not combine them on one numeric scale.
- Derive averages only from valid denominators and show an em dash or omit the average when count is zero.
- Use year-month labels only when the record has a reliable year; never infer a publication calendar year from fiscal year.
- Use horizontal bars for ranked categories and start bar axes at zero; retain natural ordering for time, journal tiers, and process stages.
- Do not encode meaning with color alone; retain labels, values, and other visual cues.
- Preserve existing visual styling, category colors, filters, and click-through details.
- The repository already has broad uncommitted changes, including changes to chart files in scope. Review and preserve them while implementing this design.

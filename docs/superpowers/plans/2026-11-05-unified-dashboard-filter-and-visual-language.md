# Unified Dashboard Filter and Visual Language Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every dashboard tab the same manage-style visual language, the
same universal filter area, and a working detailed time selector, while keeping
each tab's own filters and data logic.

**Architecture:** Extend `DashboardTabFilterBar` and the existing
`timeFilter` state instead of creating a second filter model. Shared visual
tokens come from the approved research pilot (`dashboardTheme`). Tab-specific
controls stay in the existing children slot. A per-category date resolver
prevents detailed time filters from silently emptying data-poor tabs.

**Tech Stack:** Next.js 16, React 19, TypeScript, inline style objects plus
global CSS utility classes, existing Chart.js components, Vitest for the date
resolver.

**Spec:** `docs/superpowers/specs/2026-11-05-unified-dashboard-filter-and-visual-design.md`

## Global Constraints

- Preserve all existing data logic, charts, tables, and tab-specific filters.
- Reuse `FilterPopover` from `/manage`; do not create a second deep-filter UI.
- Reuse `TimeFilterModal`; do not duplicate time modes.
- `customFilters.timeFilter` is the single source of truth for detailed time.
- Quick fiscal-year pills must clear `customFilters.timeFilter` and date fields.
- Records with no resolvable date are hidden only while a time filter is
  active; show `ไม่ระบุวันที่ N รายการ`.
- No framework migration, no backend schema change, no sidebar change.
- Keep the pilot's `variant="manage"` opt-in until each tab is checked.

## Review Focus

- A user selects a detailed time range, then clicks a quick fiscal-year pill:
  the pill must win and the data must update immediately.
- A user applies a detailed time range on Publications/IP/Academic: records with
  dates must remain, undated records must not silently disappear without a
  count.
- A user opens a tab whose trigger is near the right edge: the filter flyout
  must stay inside the viewport at all widths.
- A user on KPI or Studio must see the same time trigger, but their specialised
  category/query controls must still work.
- A user resizes the browser while a flyout is open: the flyout must re-clamp.

---

### Task 1: Per-category date resolution and undated counts

**Files:**
- Modify: `src/types/timeFilter.ts`
- Create: `src/types/__tests__/timeFilter.test.ts`
- Modify: `src/hooks/useDashboardTabFilter.ts` only if a helper export is needed

**Interfaces:**
- Produces: `resolveItemDate(item: unknown, category?: string): Date | null`
- Produces: `getUndatedCount(items: unknown[], category?: string): number`
- Consumes: existing `itemMatchesTimeFilter(item, filter)` signature

- [ ] **Step 1: Write failing tests for representative records**

```ts
import { describe, expect, it } from 'vitest';
import { resolveItemDate } from '../timeFilter';

describe('resolveItemDate', () => {
  it('reads publication month_year', () => {
    expect(resolveItemDate({ month_year: '2025-02' }, 'publications')?.toISOString().slice(0, 10))
      .toBe('2025-02-01');
  });
  it('reads IP filing_date including Buddhist-era years', () => {
    expect(resolveItemDate({ filing_date: '2567-06-17' }, 'ip')?.getFullYear()).toBe(2024);
  });
  it('falls back to start_date for research', () => {
    expect(resolveItemDate({ start_date: '2026-10' }, 'research')?.getFullYear()).toBe(2026);
  });
  it('returns null for an undated academic row without a year', () => {
    expect(resolveItemDate({ month: 'ม.ค.' }, 'academic')).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npx vitest run src/types/__tests__/timeFilter.test.ts`
Expected: FAIL because `resolveItemDate` is not exported.

- [ ] **Step 3: Implement the resolver and route `itemMatchesTimeFilter` through it**

Use the category order from the design spec: research `start_date` ->
`fiscal_year_be`; academic `start_date` -> `integration_start_date`; publications
`month_year` -> `fiscal_year_be` (Jan 1 fallback); service `date` -> `start_date`;
IP `filing_date` -> `protection_start`. Keep the generic field list as the
final fallback. Normalise Buddhist-era years exactly as the current code does.

- [ ] **Step 4: Add `getUndatedCount` and use it on the tab views**

`getUndatedCount` counts non-empty records where `resolveItemDate` is null. The
views display a muted note only when the active time filter is not `all`.

- [ ] **Step 5: Run tests and typecheck**

Run: `npx vitest run src/types/__tests__/timeFilter.test.ts && npx tsc --noEmit -p tsconfig.json`
Expected: PASS and no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/types/timeFilter.ts src/types/__tests__/timeFilter.test.ts
git commit -m "feat: resolve time-filter dates per dashboard category"
```

---

### Task 2: Finish shared filter bar behaviour

**Files:**
- Modify: `src/components/ui/DashboardTabFilterBar.tsx`
- Modify: `src/components/ui/FilterPopover.tsx` only if a prop is missing
- Modify: `src/hooks/useDashboardTabFilter.ts`

**Interfaces:**
- Consumes: `showDetailedTime?: boolean`, `onOpenDetailedTime?: () => void`
  already added during the pilot.
- Produces: deep-filter trigger visible on every tab, with tab-specific
  controls still in the advanced drawer.

- [ ] **Step 1: Remove the `!hasSecondaryControls` gate on `FilterPopover`**

Render the deep-filter trigger whenever `enableDeepFilter` is true, even when
`showStrategic` or `children` are present. Place it next to the advanced toggle.

- [ ] **Step 2: Normalise the advanced drawer**

Keep tab-specific children and the strategic selector in one drawer labelled
`ตัวกรองเฉพาะด้าน`. Do not duplicate the strategic selector inline on overview.

- [ ] **Step 3: Verify time-state precedence in the browser**

On research: apply detailed fiscal year 2568, then click quick `ทั้งหมด`; the
stored `customFilters.timeFilter` must be absent and the data must return.
Repeat on academic.

- [ ] **Step 4: Run typecheck and lint**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: PASS. Lint may keep pre-existing warnings; no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/DashboardTabFilterBar.tsx src/hooks/useDashboardTabFilter.ts
git commit -m "feat: unify dashboard filter bar and detailed time state"
```

---

### Task 3: Overview tab in manage style

**Files:**
- Modify: `src/app/(dashboard)/overview/_components/OverviewView.tsx`
- Modify: `src/app/(dashboard)/overview/_components/OverviewHeaderToolbar.tsx`
- Modify: `src/app/(dashboard)/overview/_components/GlanceOverview.tsx`
- Modify: `src/app/(dashboard)/overview/_components/HeroBentoGrid.tsx`
- Modify: `src/app/(dashboard)/overview/_components/StrategicCommandPanel.tsx`

**Interfaces:**
- Consumes: `dashboardTheme`, `dashboardPageTitleStyle`,
  `dashboardPageSubtitleStyle`, `dashboardCardStyle`.
- Produces: the same page header, white filter card, flat KPI surfaces, and
  green table headers as research.

- [ ] **Step 1: Add the manage page header and switch the filter bar to the flat card**

Use the same style override as research: `position: static`,
`backdropFilter: none`, opaque white, radius 12, no shadow. Pass
`showDetailedTime` and `onOpenDetailedTime`.

- [ ] **Step 2: Replace gradient card surfaces with `dashboardCardStyle`**

Keep the existing content and grid; only surface, border, radius, shadow,
title and body text colours change.

- [ ] **Step 3: Verify data and filters still work**

Check: fiscal pills, department, strategic, deep filter, detailed time modal,
filter chips, and reset.

- [ ] **Step 4: Screenshot before/after and typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/'(dashboard)'/overview/_components
git commit -m "style: apply manage visual language to overview"
```

---

### Task 4: Mission tabs in manage style

**Files:**
- Modify: `src/app/(dashboard)/academic/_components/AcademicView.tsx`
- Modify: `src/app/(dashboard)/publications/_components/PublicationsView.tsx`
- Modify: `src/app/(dashboard)/service/_components/ServiceView.tsx`
- Modify: `src/app/(dashboard)/ip/_components/IPView.tsx`
- Modify: each tab's table component for `.table-manage`
- Modify: `src/components/data-display/MissionKpiCard.tsx` only if a prop is
  missing

**Interfaces:**
- Consumes: `MissionKpiCard` `variant="manage"`, `showDetailedTime`,
  `onOpenDetailedTime`, `.table-manage`.
- Produces: four tabs with the same header/filter/KPI/table treatment as
  research.

- [ ] **Step 1: Add the page header and flat filter card to each tab**

Use the same style override as research and pass the detailed-time trigger.

- [ ] **Step 2: Set `variant="manage"` on each KPI card**

Keep the existing labels, values, units and subtexts.

- [ ] **Step 3: Switch each primary table to `table-manage`**

Keep existing columns, sorting, drawers and export actions. Only the header
surface, border and header text colours change.

- [ ] **Step 4: Add the undated-records note**

When a time filter is active and `getUndatedCount` is greater than zero, render
`ไม่ระบุวันที่ N รายการ` under the KPI/table header. Do not change the data
hidden by the filter.

- [ ] **Step 5: Verify each tab in the browser**

For each: fiscal pill, detailed time apply, reset, tab-specific filter, table
header colour, and no horizontal overflow at 800px.

- [ ] **Step 6: Commit**

```bash
git add src/app/'(dashboard)'/academic src/app/'(dashboard)'/publications \
  src/app/'(dashboard)'/service src/app/'(dashboard)'/ip \
  src/components/data-display/MissionKpiCard.tsx
git commit -m "style: apply manage visual language to mission tabs"
```

---

### Task 5: Personnel and KPI tabs

**Files:**
- Modify: `src/app/(dashboard)/personnel/_components/PersonnelView.tsx`
- Modify: `src/app/(dashboard)/kpi/_components/KPIView.tsx`
- Modify: `src/app/(dashboard)/kpi/_components/KpiHeaderToolbar.tsx`
- Modify: `src/app/(dashboard)/kpi/_components/KpiFilterBar.tsx`
- Modify: `src/app/(dashboard)/kpi/_components/KpiSummaryCards.tsx`

**Interfaces:**
- Consumes: shared filter bar and `dashboardTheme`.
- Produces: visual consistency for personnel and KPI without losing category,
  status, calculation-method or ranking controls.

- [ ] **Step 1: Personnel**

Apply the page header, flat filter card, and detailed-time trigger. Keep the
existing ranking table and `KpiGrid`; restyle only the surfaces.

- [ ] **Step 2: KPI**

Replace the standalone `TimeFilterBar` + `KpiFilterBar` visual shells with the
shared filter bar look. Keep KPI category/status/calculation controls in the
tab-specific drawer. Keep the time modal trigger.

- [ ] **Step 3: Verify KPI data**

Fiscal year and detailed time must change evaluator results consistently;
category/status filters must still work.

- [ ] **Step 4: Commit**

```bash
git add src/app/'(dashboard)'/personnel src/app/'(dashboard)'/kpi
git commit -m "style: align personnel and KPI tabs with manage"
```

---

### Task 6: Studio and final verification

**Files:**
- Modify: `src/app/(dashboard)/studio/_components/SelfServiceStudio.tsx`
- Modify: `src/app/globals.css` if shared table/card utilities are needed

**Interfaces:**
- Consumes: `dashboardTheme`, shared filter time trigger.
- Produces: studio shell and time selector matching the dashboard family while
  keeping the query builder.

- [ ] **Step 1: Studio shell**

Apply the page header, white surface panels, green accents and detailed-time
trigger. Keep the query builder, chart type catalog, and domain pills.

- [ ] **Step 2: Full verification**

Run:
```bash
npx tsc --noEmit -p tsconfig.json
npx vitest run src/types/__tests__/timeFilter.test.ts
```
Check each tab in the browser at the available width:
overview, KPI, research, academic, publications, service, IP, personnel, studio.
Confirm the filter bar, detailed time modal, quick-year reset, tab-specific
filters, table headers, and active chips.

- [ ] **Step 3: Save screenshots**

Store before/after screenshots under `.taste-skill/before` and
`.taste-skill/after`.

- [ ] **Step 4: Commit**

```bash
git add src/app/'(dashboard)'/studio src/app/globals.css .taste-skill
git commit -m "style: unify dashboard shell and filters"
```

---

## Self-Review

- Spec coverage: universal filter, time single source, date resolver, manage
  visual language, all nine tabs, and verification are covered.
- Types: `resolveItemDate` and `getUndatedCount` are defined in Task 1 and used
  in Tasks 4 and 5.
- Open default: undated records are hidden while a time filter is active, with
  a visible count; this is documented in the spec and Task 4.
- Pilot state: research is already complete; the tasks above do not rebuild it.

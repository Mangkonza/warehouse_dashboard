# YoY Display Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the readability and interpretation of YoY comparisons across the five mission pages.

**Architecture:** Keep the existing shared `MissionYoYControls` component and its calculation engine. Change only its comparison summary, chart orientation/order, and department breakdown presentation.

**Tech Stack:** Next.js 16, React 19, TypeScript, Chart.js.

**Spec:** [2026-11-05-yoy-display.md](../specs/2026-11-05-yoy-display.md)

## Global Constraints

- Preserve the existing year selectors, metric toggle, department filter, and calculation rules.
- A baseline under 5 units must be visibly labeled as low-base; absolute difference remains primary.
- Use the existing Chart.js dependency and shared component; add no dependencies.
- Do not change fiscal-year assignment, budget rules, source dates, data completeness, or executive overview visuals.
- Do not add or run tests unless requested.

## Review Focus

- Baseline 0: avoid misleading growth percentages; show an explicit low-base/new-data state.
- Baseline 1–4: show the absolute delta first and identify the low base.
- Equal and declining values: retain clear zero and negative deltas with neutral direction cues.
- Budget mode: preserve two-decimal million-baht values and use the correct units in the chart and table.
- Categories with no value in one year: show zero explicitly in the detail table and keep the category visible in the chart.

---

### Task 1: Update the shared YoY summary and comparison visuals

**Files:**
- Modify: `warehouse_dashboard/src/components/data-display/MissionYoYControls.tsx`

**Interfaces:**
- Consumes: existing `calcYoYGrowth`, `breakdownData`, mission labels, and filter state.
- Produces: a summary with primary absolute delta and a low-base label; a horizontally grouped, difference-sorted chart; a compact numeric category table.

- [x] Make the absolute delta the first and most prominent value in the change summary; display the growth percentage as secondary, with a low-base note whenever the selected base metric is below 5.
- [x] Sort comparison categories by descending absolute delta and render the grouped bars horizontally, keeping both years distinguishable and values readable.
- [x] Replace the repeated department chips with a compact table showing category, base value, comparison value, absolute difference, and percentage where applicable; show zero values explicitly.
- [x] Confirm visually on the service YoY page and inspect the mobile-specific layout in source. A narrow live viewport was not captured because Safari changed pages during UI inspection; the mobile row layout is present and avoids a horizontally scrolling table.

# Unified dashboard filter and manage-style visual language

Date: 2026-11-05
Status: awaiting approval

## Intent

Make every main dashboard tab feel like one product. The data-management tab
(`/manage`) is the visual reference. Every tab also gets the same universal
filter area and a detailed time selector, while keeping each mission's own
specific filters.

## Goals

- Use one shared filter bar on every dashboard tab: overview, KPI, research,
  academic, publications, service, IP, personnel, and studio.
- Keep the visual language close to `/manage`: white surfaces, slate borders,
  12px cards, green as the single accent, green table headers.
- Replace the older-years dropdown with `เลือกช่วงเวลาละเอียด`, opening the
  existing `TimeFilterModal`.
- Keep tab-specific filters (funding type, journal level, IP status, KPI
  category/status, studio query builder) in a clearly separated area.
- Make time selection behave the same in every tab and remove conflicting time
  state.
- Normalise time filtering per data domain so detailed time filtering does not
  silently empty a tab.

## Non-goals

- No changes to data entry, import, or the management workflows.
- No backend schema migration.
- No new chart or table content; only shared visual treatment and filter
  behaviour.
- No change to the sidebar navigation.

## Constraints

- Existing data hooks already receive `timeFilter`; the shared filter UI should
  feed that existing path rather than introduce a second filtering model.
- Several source files are being edited in parallel; changes must stay scoped
  and avoid rewriting unrelated user work.
- The project runs on Next.js 16 and React 19.
- `itemMatchesTimeFilter` currently reads a small generic date field list.

## Approaches considered

### A. Extend the existing shared filter bar (chosen)

Extend `DashboardTabFilterBar` so universal controls render on every tab,
tab-specific controls live in the existing children slot / advanced drawer, and
the detailed time trigger opens `TimeFilterModal`. Reuse the same
`FilterPopover` as `/manage`.

Why: the data hooks already consume `timeFilter`; the manage filter is already
the same component; this avoids duplicate filter models.

### B. Build a new filter toolbar

A clean new component, but it duplicates behaviour and risks drift from the
existing bar. Rejected.

### C. Copy the manage filter bar into each page

Fast visually, but duplicates state and code across nine pages. Rejected.

## Universal filter area

- Latest fiscal-year quick pills.
- `เลือกช่วงเวลาละเอียด` trigger (replaces the older-years dropdown when
  enabled). The modal holds academic year, fiscal year/quarter, calendar year,
  and the existing manual range modes.
- Department selector.
- Strategic selector where meaningful.
- Search where the tab needs it.
- Deep-filter trigger using the same `FilterPopover` as `/manage`.
- Reset button and active-filter chips.

## Tab-specific filter area

- Research: funding type, grant size tier.
- Academic: month, hide missing client, client.
- Publications: journal level, publication status.
- Service: activity role.
- IP: pipeline status, IP type.
- KPI: category, status, calculation method.
- Studio: its query builder and domain controls.
- Personnel: existing personnel filters.

## Time state: one source of truth

`useDashboardTabFilter` keeps `customFilters.timeFilter` as the canonical
detailed-time value. The derived `timeFilter` falls back to `fiscalYear` or
`dateFrom`/`dateTo` only when no detailed time exists.

- A quick fiscal-year pill clears `customFilters.timeFilter` and the date range.
- Applying the time modal clears the competing `fiscalYear`/date fields as
  appropriate.
- The active time is shown as one chip/label, not two competing states.

The pilot already implements the first version of this rule.

## Time data normalisation

Add a per-category date resolver (instead of one generic list):

| Tab | Primary date | Fallback |
| --- | --- | --- |
| Research | `start_date` | `fiscal_year_be` |
| Academic | `start_date` | `integration_start_date`, then month/year when derivable |
| Publications | `month_year` | `fiscal_year_be` |
| Service | `date` | `start_date` |
| IP | `filing_date` | `protection_start` |
| Personnel | related work dates | none |

Records whose date cannot be resolved are **hidden only while a time filter is
active**, with a visible count: `ไม่ระบุวันที่ N รายการ`. This avoids silently
pretending they match a period while keeping the gap visible.

## Visual language from `/manage`

Shared tokens live in `src/lib/dashboardTheme.ts`:

- white surface, `#e2e8f0` border, 12px cards, 8px controls
- `#00A651` primary, `#f0fdf4` soft accent
- `#0f172a` ink, `#64748b` secondary text
- page title 20px/700, subtitle 12px/400
- green table header with white text (`table-manage`)
- no glassmorphism, no gradient KPI cards

The research page is the approved pilot: page header, flat filter card, white
KPI cards, green table header, detailed time trigger. The remaining tabs follow
the same treatment.

## Rollout order

1. Research pilot (done and approved).
2. Overview.
3. Academic, publications, service, IP.
4. Personnel.
5. KPI.
6. Studio.

KPI and Studio keep their specialised content; they receive the same shell,
time trigger, and shared filter visual language.

## Verification

- `npx tsc --noEmit` and ESLint (no new errors).
- Browser check for each tab: filter bar renders, detailed time modal opens,
  quick pills clear the detailed state, active chips match.
- Data sanity: record counts before/after a fiscal-year filter and a manual
  range; no tab becomes empty because of an unresolved date field.
- Screenshot before/after for each tab at the available browser width.
- Confirm the original tab-specific filters still work.

## Open decision

Undated records: hide while a time filter is active and show the count. This is
the proposed default; confirm during rollout.

## Risks

- Sparse date fields in Academic, Publications and IP; must be fixed before
  enabling detailed time there.
- Shared components (`MissionKpiCard`, `DashboardTabFilterBar`) are used by
  several tabs; opt-in props protect the pilot until rollout.
- Concurrent edits in the repository; keep changes scoped and review diffs
  before each tab.

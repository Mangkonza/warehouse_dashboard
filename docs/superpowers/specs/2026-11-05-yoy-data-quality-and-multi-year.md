# YoY Data Quality and Multi-Year Display

## Problem

The current year-over-year view compares two selected years but gives no quick way to see a longer trend. Several fiscal-year extractors silently assign unrecognized dates to 2568, so the comparison can look complete while using misclassified records. Service dates also render incorrectly for legacy years, Thai month-name dates are inconsistently parsed, and service year filters contain hardcoded totals and only two years.

## Goals

- Make the YoY area useful for both two-year comparison and a five-year scan.
- Make year assignment and missing data visible and consistent.
- Correct service date display and monthly chart grouping without changing source records.
- Keep service date records that need review available to users instead of hiding them in a year.

## Screen question

How has this mission changed over the available fiscal years, and which departments explain the change?

## Design

1. Keep the current two-year selectors, absolute difference, contextual growth rate, horizontal comparison chart, and numeric breakdown table.
2. Add a compact five-year trend line for the selected metric. Use only years with data; leave unsupported years visually unplotted and label them “ไม่มีข้อมูล”. A real zero remains zero. Keep the existing two-year view as the primary detailed comparison.
3. Add a department-by-year heatmap below the trend. Values use one hue scale for the selected metric; print each value in its cell and use an em dash only when that fiscal year has no dataset coverage. A year with coverage and no rows for a department displays 0.
4. Keep the current mission palette and Thai type. Use quiet grid rules and data color only; do not redesign the surrounding dashboard shell.
5. For Service, show the number of records that have dates requiring review, and provide a way to inspect them in the service table. They remain in the overall record list but do not contribute to year-specific charts or comparisons.

## Data rules

- Parse supported service date forms centrally, including ISO/legacy numeric dates, Thai month abbreviations/names, and day ranges. Format the date without mutating the source value.
- Normalize known legacy year encodings (for example, 1968 → 2568 and 2025 → 2568) consistently for display and fiscal-year extraction.
- Assign a date range to the fiscal/calendar year of its first date only. Never count one record in two years.
- Extract a year only when supported by an explicit year field, a supported date, or an existing trusted mission-specific code. Unknown or invalid values return an unknown state; they must not silently default to 2568.
- Service year filters derive their counts from the filtered records and share the supported year list with YoY controls. No invented fallback counts.
- A fiscal year with no records in a mission is shown as “ไม่มีข้อมูล”, not as zero. Where a mission has records in a year, a department with no matching records is zero.

## Scope

- Shared YoY engine and `MissionYoYControls`, used by research, academic, publications, service, and IP.
- Service date parsing, date display, monthly chart grouping, fiscal-year filter options, and review state.
- Preserve executive overview visualizations, source JSON, and unrelated dashboard work.

## Acceptance criteria

- Unparseable or missing years are not assigned to 2568 by fallback.
- A multi-year service date range contributes to exactly one year based on its first date.
- Legacy and Thai service dates display consistently; invalid date strings are clearly marked for review, not rendered with `NaN` fragments.
- Service filter counts are derived from current data and include supported years without hardcoded totals.
- Trend and heatmap distinguish true zero from a year with no data.
- Existing two-year count/budget comparisons remain available across all five mission pages.
- No changes are made to user-authored unrelated modifications in the working tree.

## Alternatives considered

- **Only fix date parsing:** lowest risk, but does not answer the user's request for clearer multi-year comparison.
- **Replace the pair comparison with a trend:** simpler screen, but removes the detailed two-year department comparison users already have.
- **Keep both views (selected):** five-year context first, with the pair comparison and department detail retained for precise comparison.

## Data caveat

This improves presentation and parsing; it cannot infer missing source records or resolve ambiguous dates without an explicit year. Those records remain visible in the review state and are excluded from year-specific totals until corrected.

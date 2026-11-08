# YoY Display Improvement Spec

## Goal
Make year-over-year comparisons easier to interpret, especially when the baseline has very few records.

## Scope
Update the shared `MissionYoYControls` component used by research, academic, publications, service, and IP pages.

## Approved design
- Make the absolute difference the primary comparison value; keep percentage growth secondary.
- When the baseline is under 5 units, label the percentage as a low-base comparison so a very large rate is not presented without context.
- Replace the grouped vertical bars with horizontally grouped bars sorted by absolute difference, with prior and comparison year values easy to read.
- Remove the department breakdown chips that repeat the chart and replace them with a compact numeric breakdown table.
- Preserve the existing year selectors, metric toggle, department filter, and data calculations.

## Out of scope
- Changing fiscal-year assignment or budget calculation rules.
- Correcting source date values or adding data-completeness metadata.
- Changing the executive overview's separate YoY visualizations.

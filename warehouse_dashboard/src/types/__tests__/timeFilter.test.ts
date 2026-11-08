import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TIME_FILTER,
  getUndatedCount,
  itemMatchesTimeFilter,
  resolveItemDate,
  TimeFilterState,
} from '../timeFilter';

const fiscal = (fiscalYear: string): TimeFilterState => ({
  ...DEFAULT_TIME_FILTER,
  mode: 'fiscal',
  fiscalYear,
  fiscalQuarter: 'all',
});

describe('resolveItemDate', () => {
  it('reads publication month_year', () => {
    const d = resolveItemDate({ month_year: '2025-02' }, 'publications');
    expect(d?.getFullYear()).toBe(2025);
    expect(d?.getMonth()).toBe(1);
    expect(d?.getDate()).toBe(1);
  });

  it('reads IP filing_date and normalises Buddhist-era years', () => {
    const d = resolveItemDate({ filing_date: '2567-06-17' }, 'ip');
    expect(d?.getFullYear()).toBe(2024);
    expect(d?.getMonth()).toBe(5);
  });

  it('reads research start_date with a month only', () => {
    const d = resolveItemDate({ start_date: '2026-10' }, 'research');
    expect(d?.getFullYear()).toBe(2026);
    expect(d?.getMonth()).toBe(9);
  });

  it('returns null for an academic row that only has a Thai month name', () => {
    expect(resolveItemDate({ month: 'ม.ค.' }, 'academic')).toBeNull();
  });

  it('maps a fiscal-year label to the start of that fiscal year', () => {
    const d = resolveItemDate({ fiscal_year_be: 2568 }, 'publications');
    expect(d?.getFullYear()).toBe(2024);
    expect(d?.getMonth()).toBe(9);
  });
});

describe('getUndatedCount', () => {
  it('counts rows without a usable date', () => {
    expect(
      getUndatedCount(
        [
          { month_year: '2025-02' },
          { month: 'ม.ค.' },
          { month_year: '' },
        ],
        'publications'
      )
    ).toBe(2);
  });
});

describe('itemMatchesTimeFilter', () => {
  it('matches a publication month to the correct fiscal year', () => {
    const item = { month_year: '2025-02' };
    expect(itemMatchesTimeFilter(item, fiscal('2568'), 'publications')).toBe(true);
    expect(itemMatchesTimeFilter(item, fiscal('2569'), 'publications')).toBe(false);
  });

  it('does not match a record with no resolvable date', () => {
    expect(itemMatchesTimeFilter({ month: 'ม.ค.' }, fiscal('2568'), 'academic')).toBe(false);
  });
});

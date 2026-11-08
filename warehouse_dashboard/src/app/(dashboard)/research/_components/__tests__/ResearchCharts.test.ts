import { describe, it, expect } from 'vitest';
import { isExternalResearchItem, ResearchItem } from '../ResearchCharts';
import researchData from '@/data/research.json';

describe('Research Project External vs Internal Logic', () => {
  it('correctly classifies items based on budget_external and budget_internal', () => {
    const extItem: ResearchItem = {
      id: '1',
      name: 'External Project',
      budget_external: 500000,
      budget_internal: 0,
    };
    expect(isExternalResearchItem(extItem)).toBe(true);

    const intItem: ResearchItem = {
      id: '2',
      name: 'Internal Project',
      budget_external: 0,
      budget_internal: 200000,
    };
    expect(isExternalResearchItem(intItem)).toBe(false);
  });

  it('correctly falls back to fund_type when budgets are equal or zero', () => {
    const extItem: ResearchItem = {
      id: '3',
      name: 'Fund type ext',
      fund_type: 'ภายนอก',
    };
    expect(isExternalResearchItem(extItem)).toBe(true);

    const intItem: ResearchItem = {
      id: '4',
      name: 'Fund type int',
      fund_type: 'ภายใน',
    };
    expect(isExternalResearchItem(intItem)).toBe(false);
  });

  it('correctly falls back to fund_source keywords', () => {
    const intFacultyItem: ResearchItem = {
      id: '5',
      name: 'Faculty fund',
      fund_source: 'ทุนภายใน คณะวิศวกรรมศาสตร์',
    };
    expect(isExternalResearchItem(intFacultyItem)).toBe(false);

    const extAgencyItem: ResearchItem = {
      id: '6',
      name: 'Agency fund',
      fund_source: 'สำนักงานการวิจัยแห่งชาติ (วช.)',
    };
    expect(isExternalResearchItem(extAgencyItem)).toBe(true);
  });

  it('correctly aggregates research.json into external and internal counts', () => {
    const valid = (researchData as ResearchItem[]).filter(
      (d) => d.name && d.name !== 'nan' && d.name !== 'NaT' && d.name !== 'เรื่อง' && !d.name.toLowerCase().includes('test')
    );

    let extCount = 0;
    let intCount = 0;

    valid.forEach((d) => {
      if (isExternalResearchItem(d)) extCount++;
      else intCount++;
    });

    expect(extCount + intCount).toBe(valid.length);
    expect(extCount).toBeGreaterThan(0);
    expect(intCount).toBeGreaterThan(0);
  });
});

import { describe, it, expect } from 'vitest';
import { resolvePerspectiveTab, createTabUrl } from '../usePerspectiveTab';

describe('Perspective tab utilities', () => {
  const validTabs = ['overview', 'productivity', 'faculty', 'table'] as const;
  type Tab = typeof validTabs[number];

  describe('resolvePerspectiveTab', () => {
    it('returns defaultTab when urlSearch and storage are empty', () => {
      expect(resolvePerspectiveTab<Tab>('', null, validTabs, 'overview')).toBe('overview');
      expect(resolvePerspectiveTab<Tab>(undefined, undefined, validTabs, 'overview')).toBe('overview');
    });

    it('resolves tab from URL search ?tab=', () => {
      expect(resolvePerspectiveTab<Tab>('?tab=faculty', null, validTabs, 'overview')).toBe('faculty');
      expect(resolvePerspectiveTab<Tab>('?dept=CPE&tab=table', 'productivity', validTabs, 'overview')).toBe('table');
    });

    it('resolves tab from URL search ?perspective=', () => {
      expect(resolvePerspectiveTab<Tab>('?perspective=productivity', null, validTabs, 'overview')).toBe('productivity');
    });

    it('resolves tab from custom paramKey e.g. ?mission=', () => {
      const missionTabs = ['all', 'research', 'publications'] as const;
      expect(resolvePerspectiveTab('?mission=publications', null, missionTabs, 'all', 'mission')).toBe('publications');
    });

    it('always returns defaultTab when URL has no valid tab (lands on first menu)', () => {
      expect(resolvePerspectiveTab<Tab>('', 'faculty', validTabs, 'overview')).toBe('overview');
      expect(resolvePerspectiveTab<Tab>('?unrelated=1', 'table', validTabs, 'overview')).toBe('overview');
    });

    it('ignores invalid tabs from URL and storage', () => {
      expect(resolvePerspectiveTab<Tab>('?tab=nonexistent', 'invalid_too', validTabs, 'overview')).toBe('overview');
    });
  });

  describe('createTabUrl', () => {
    it('appends tab param to path without query string', () => {
      expect(createTabUrl('http://localhost:3000/research', 'tab', 'faculty')).toBe('/research?tab=faculty');
    });

    it('updates existing tab param preserving other query parameters', () => {
      expect(createTabUrl('http://localhost:3000/research?tab=overview&dept=CPE', 'tab', 'faculty')).toBe(
        '/research?tab=faculty&dept=CPE'
      );
    });

    it('supports custom paramKey like mission', () => {
      expect(createTabUrl('http://localhost:3000/personnel?mission=all', 'mission', 'publications')).toBe(
        '/personnel?mission=publications'
      );
    });
  });
});

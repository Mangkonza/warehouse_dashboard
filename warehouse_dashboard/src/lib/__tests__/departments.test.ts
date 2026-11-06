import { describe, it, expect } from 'vitest';
import { getDepartment, DEPARTMENTS } from '@/lib/departments';
import { matchDepartmentCode } from '@/config/departments';

describe('Department resolution system', () => {
  describe('getDepartment', () => {
    it('resolves canonical department codes directly', () => {
      expect(getDepartment('AE').code).toBe('AE');
      expect(getDepartment('CPE').code).toBe('CPE');
      expect(getDepartment('IRRE').code).toBe('IRRE');
      expect(getDepartment('FE').code).toBe('FE');
      expect(getDepartment('IE').code).toBe('IE');
      expect(getDepartment('ME').code).toBe('ME');
      expect(getDepartment('CE').code).toBe('CE');
      expect(getDepartment('EEEC').code).toBe('EEEC');
      expect(getDepartment('TDWCB').code).toBe('TDWCB');
      expect(getDepartment('NAMC').code).toBe('NAMC');
      expect(getDepartment('OFS').code).toBe('OFS');
    });

    it('resolves legacy and alternate codes to canonical codes', () => {
      expect(getDepartment('IRE').code).toBe('IRRE');
      expect(getDepartment('DWT').code).toBe('TDWCB');
      expect(getDepartment('TDW').code).toBe('TDWCB');
      expect(getDepartment('ABE').code).toBe('AE');
      expect(getDepartment('OFFICE').code).toBe('OFS');
    });

    it('resolves door/window center variations without returning undefined', () => {
      const variations = [
        'ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร',
        'ศูนย์ทดสอบประตู หน้าต่าง',
        'ประตูหน้าต่างฯ',
        'ผนังกระจก',
        'TDWCB',
        'TDW',
        'DWT',
      ];

      for (const val of variations) {
        const dept = getDepartment(val);
        expect(dept).toBeDefined();
        expect(dept.code).toBe('TDWCB');
        expect(dept.name).toContain('ศูนย์ทดสอบประตู หน้าต่าง');
      }
    });

    it('resolves empty or unassigned inputs to code "-"', () => {
      expect(getDepartment(null).code).toBe('-');
      expect(getDepartment(undefined).code).toBe('-');
      expect(getDepartment('').code).toBe('-');
      expect(getDepartment('-').code).toBe('-');
      expect(getDepartment('nan').code).toBe('-');
      expect(getDepartment('NaT').code).toBe('-');
    });

    it('resolves unknown custom inputs to OTH', () => {
      const custom = getDepartment('หน่วยงานทดสอบพิเศษ');
      expect(custom.code).toBe('OTH');
      expect(custom.name).toBe('หน่วยงานทดสอบพิเศษ');

      const othCustom = getDepartment('OTH: งานพัสดุ');
      expect(othCustom.code).toBe('OTH');
      expect(othCustom.name).toBe('งานพัสดุ');
    });

    it('ensures every DEPARTMENTS entry is valid and resolvable', () => {
      for (const d of DEPARTMENTS) {
        const resolved = getDepartment(d.code);
        expect(resolved).toBeDefined();
        expect(resolved.code).toBe(d.code);
      }
    });
  });

  describe('matchDepartmentCode', () => {
    it('returns null for missing, empty, or unassigned inputs', () => {
      expect(matchDepartmentCode(null)).toBeNull();
      expect(matchDepartmentCode(undefined)).toBeNull();
      expect(matchDepartmentCode('')).toBeNull();
      expect(matchDepartmentCode('-')).toBeNull();
      expect(matchDepartmentCode('nan')).toBeNull();
    });

    it('returns canonical code for valid departments', () => {
      expect(matchDepartmentCode('วิศวกรรมคอมพิวเตอร์')).toBe('CPE');
      expect(matchDepartmentCode('CPE')).toBe('CPE');
      expect(matchDepartmentCode('วิศวกรรมชลประทาน')).toBe('IRRE');
      expect(matchDepartmentCode('IRE')).toBe('IRRE');
      expect(matchDepartmentCode('ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร')).toBe('TDWCB');
      expect(matchDepartmentCode('DWT')).toBe('TDWCB');
    });
  });
});

'use client';

import { useState, useEffect, useMemo } from 'react';
import serviceData from '@/data/services.json';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter, resolveItemDate } from '@/types/timeFilter';
import { isTestRecord } from '@/lib/sdgEngine';
import { getDepartment } from '@/lib/departments';
import { parseServiceFiscalYear, categorizeServiceActivity, itemMatchesStrategicFilter } from '@/lib/pastelTheme';

export interface ServiceItem {
  id?: string;
  dbId?: string | number;
  _id?: string;
  name?: string;
  person?: string;
  person_id?: number | string;
  target_group?: string;
  department?: string;
  date?: string;
  service_type?: string;
  service_category?: string;
  hours_spent?: number;
  attendees_count?: number;
  topic_title?: string;
  evaluation?: any;
  sdg_ids?: number[];
  i_type?: string;
  isee_pillar?: string;
  iam_value?: string;
  _resolvedType?: string;
  _smartRole?: string;
  _fiscalYear?: string;
  [key: string]: any;
}

export function resolveServiceType(item: ServiceItem): string {
  const explicit = String(item.service_type || item.service_category || '').trim();
  if (explicit && explicit !== 'nan' && explicit !== '-') {
    if (explicit === 'วิทยากร') return 'วิทยากร/อาจารย์พิเศษ';
    if (explicit === 'ศึกษาดูงาน') return 'ศึกษาดูงาน วศ.กพส.';
    return explicit;
  }
  const text = `${item.name || ''} ${item.topic_title || ''}`.toLowerCase();
  if (
    text.includes('ผู้ทรงคุณวุฒิ') ||
    text.includes('ประเมิน') ||
    text.includes('พิจารณา') ||
    text.includes('กรรมการ') ||
    text.includes('กลั่นกรอง') ||
    text.includes('ตรวจอ่าน')
  ) {
    return 'ผู้ทรงคุณวุฒิ';
  }
  if (text.includes('วิทยากร') || text.includes('บรรยาย') || text.includes('อาจารย์พิเศษ') || text.includes('สอน')) {
    return 'วิทยากร/อาจารย์พิเศษ';
  }
  if (text.includes('วิทยานิพนธ์') || text.includes('ดุษฎีนิพนธ์') || text.includes('สอบโครงร่าง')) {
    return 'วิทยานิพนธ์ภายนอก';
  }
  if (text.includes('ศึกษาดูงาน') || text.includes('ต้อนรับ') || text.includes('เยี่ยมชม')) {
    return 'ศึกษาดูงาน วศ.กพส.';
  }
  if (text.includes('ตรวจสอบ') || text.includes('ทดสอบ') || text.includes('ออกแบบ') || text.includes('ที่ปรึกษา')) {
    return 'วิชาชีพ';
  }
  return 'วิชาการ';
}

export function useServiceData(timeFilter?: TimeFilterState) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [fiscalYear, setFiscalYear] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [strategicFilter, setStrategicFilter] = useState('all');

  const [dataList, setDataList] = useState<ServiceItem[]>(() => {
    return (getCachedCategoryData('service') as ServiceItem[]) || (serviceData as ServiceItem[]);
  });

  useEffect(() => {
    let isMounted = true;
    fetchCategoryData('service').then((fresh) => {
      if (isMounted && Array.isArray(fresh) && fresh.length > 0) {
        setDataList(fresh as ServiceItem[]);
      }
    });

    const handleUpdate = () => {
      const fresh = getCachedCategoryData('service') as ServiceItem[];
      if (fresh && fresh.length > 0) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('ku_data_updated', handleUpdate);
    };
  }, []);

  const validData = useMemo(() => {
    return dataList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && !isTestRecord(item))
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter, 'service'))
      .map((item) => {
        const resolved = resolveServiceType(item);
        const smartRole = categorizeServiceActivity(item.name, item.topic_title, item.target_group);
        const fYear = parseServiceFiscalYear(item.date);
        return {
          ...item,
          service_type: item.service_type || resolved,
          _resolvedType: resolved,
          _smartRole: smartRole,
          _fiscalYear: fYear,
        };
      });
  }, [dataList, timeFilter]);

  const undatedCount = useMemo(() => {
    if (!timeFilter || timeFilter.mode === 'all') return 0;
    return dataList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && !isTestRecord(item))
      .filter((item) => resolveItemDate(item, 'service') === null).length;
  }, [dataList, timeFilter]);

  const uniquePersons = useMemo(() => {
    return new Set(
      validData.map((d) => String(d.person || '').trim()).filter((p): p is string => Boolean(p && p !== 'nan' && p !== '-'))
    );
  }, [validData]);

  const uniqueTargets = useMemo(() => {
    return new Set(
      validData.map((d) => String(d.target_group || '').trim()).filter((t): t is string => Boolean(t && t !== 'nan' && t !== '-'))
    );
  }, [validData]);

  const uniqueDepts = useMemo(() => {
    return new Set(
      validData
        .map((d) => getDepartment(d.department).code)
        .filter((code) => Boolean(code && code !== '-'))
    );
  }, [validData]);

  // Counts for filters
  const countsByFiscalYear = useMemo(() => {
    const counts: Record<string, number> = { all: validData.length, '2568': 0, '2569': 0 };
    validData.forEach((d) => {
      const y = d._fiscalYear || '2568';
      if (counts[y] !== undefined) counts[y]++;
      else counts[y] = 1;
    });
    return counts;
  }, [validData]);

  const countsByRole = useMemo(() => {
    const counts: Record<string, number> = { all: validData.length };
    validData.forEach((d) => {
      const r = d._smartRole || 'งานบริการวิชาการอื่นๆ';
      counts[r] = (counts[r] || 0) + 1;
    });
    return counts;
  }, [validData]);

  const filteredData = useMemo(() => {
    return validData.filter((item) => {
      // Fiscal year filter
      if (fiscalYear !== 'all') {
        if (item._fiscalYear !== fiscalYear) return false;
      }

      // Department filter
      if (selectedDept !== 'all') {
        const itemDept = getDepartment(item.department);
        const filterDept = getDepartment(selectedDept);
        if (itemDept.code !== filterDept.code && !String(item.department || '').includes(selectedDept)) {
          return false;
        }
      }

      // Smart role filter
      if (selectedRole !== 'all') {
        if (item._smartRole !== selectedRole) return false;
      }

      // Legacy type filter (for backward compatibility if used)
      if (selectedType !== 'all') {
        if (item._resolvedType !== selectedType && item.service_type !== selectedType) {
          return false;
        }
      }

      // Strategic filter (ISEE / IAM / SDGs)
      if (strategicFilter !== 'all' && !itemMatchesStrategicFilter(item, strategicFilter)) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const p = String(item.person || '').toLowerCase();
        const t = String(item.target_group || '').toLowerCase();
        const r = String(item._smartRole || '').toLowerCase();
        if (!n.includes(q) && !p.includes(q) && !t.includes(q) && !r.includes(q)) return false;
      }

      return true;
    });
  }, [validData, fiscalYear, selectedDept, selectedRole, selectedType, strategicFilter, searchTerm]);

  return {
    validData,
    undatedCount,
    filteredData,
    uniquePersons,
    uniqueTargets,
    uniqueDepts,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    selectedType,
    setSelectedType,
    fiscalYear,
    setFiscalYear,
    selectedRole,
    setSelectedRole,
    strategicFilter,
    setStrategicFilter,
    countsByFiscalYear,
    countsByRole,
  };
}

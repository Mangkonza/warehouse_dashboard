'use client';

import { useState, useEffect, useMemo } from 'react';
import serviceData from '@/data/services.json';
import { getCachedCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';
import { isTestRecord } from '@/lib/sdgEngine';
import { getDepartment } from '@/lib/departments';

export interface ServiceItem {
  id?: string;
  name?: string;
  person?: string;
  target_group?: string;
  department?: string;
  date?: string;
  service_type?: string;
  service_category?: string;
  _resolvedType?: string;
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
  const [dataList, setDataList] = useState<ServiceItem[]>(() => {
    return (getCachedCategoryData('service') as ServiceItem[]) || (serviceData as ServiceItem[]);
  });

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getCachedCategoryData('service') as ServiceItem[];
      if (fresh && fresh.length > 0) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => window.removeEventListener('ku_data_updated', handleUpdate);
  }, []);

  const validData = useMemo(() => {
    return dataList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && !isTestRecord(item))
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter))
      .map((item) => {
        const resolved = resolveServiceType(item);
        return {
          ...item,
          service_type: item.service_type || resolved,
          _resolvedType: resolved,
        };
      });
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

  const filteredData = useMemo(() => {
    return validData.filter((item) => {
      if (selectedDept !== 'all') {
        const itemDept = getDepartment(item.department);
        const filterDept = getDepartment(selectedDept);
        if (itemDept.code !== filterDept.code && !String(item.department || '').includes(selectedDept)) {
          return false;
        }
      }
      if (selectedType !== 'all') {
        if (item._resolvedType !== selectedType && item.service_type !== selectedType) {
          return false;
        }
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const p = String(item.person || '').toLowerCase();
        const t = String(item.target_group || '').toLowerCase();
        if (!n.includes(q) && !p.includes(q) && !t.includes(q)) return false;
      }
      return true;
    });
  }, [validData, selectedDept, selectedType, searchTerm]);

  return {
    validData,
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
  };
}

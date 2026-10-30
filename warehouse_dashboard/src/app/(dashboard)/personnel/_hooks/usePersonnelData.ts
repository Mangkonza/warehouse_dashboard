'use client';

import { useState, useEffect, useMemo } from 'react';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';
import { autoDetectJournalRanking } from '@/config/journalRankingConfig';
import { normalizePersonName, normalizeSpellingVariant } from '@/lib/personnelService';
import { PersonnelRecord } from '@/types/dataManagement';

import rawPersonnel from '@/data/personnel.json';
import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import rawPublications from '@/data/publications.json';
import rawServices from '@/data/services.json';
import rawIP from '@/data/ip.json';

export interface PersonnelWorkMetric {
  personnel: PersonnelRecord;
  id: number;
  name: string;
  cleanName: string;
  department: string;
  position: string;
  email: string;
  imageUrl?: string;
  researchItems: any[];
  academicItems: any[];
  pubItems: any[];
  serviceItems: any[];
  ipItems: any[];
  counts: {
    research: number;
    academic: number;
    publications: number;
    service: number;
    ip: number;
    total: number;
  };
  budgets: {
    research: number;
    academic: number;
    total: number;
  };
  pubQuartiles: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    tci: number;
    other: number;
  };
  serviceHours: number;
}

export interface DepartmentPersonnelStat {
  name: string;
  facultyCount: number;
  activeCount: number;
  totalWorks: number;
  totalBudget: number;
}

function parseItemBudget(item: any): number {
  if (typeof item.budget === 'number') return item.budget;
  if (item.budget && !isNaN(Number(item.budget))) return Number(item.budget);
  const intVal = Number(item.budget_internal) || 0;
  const extVal = Number(item.budget_external) || 0;
  return intVal + extVal;
}

export function usePersonnelData(timeFilter?: TimeFilterState) {
  const [personnelList, setPersonnelList] = useState<PersonnelRecord[]>(() => {
    return (getCachedCategoryData('personnel') || rawPersonnel) as PersonnelRecord[];
  });
  const [researchList, setResearchList] = useState<any[]>(() => getCachedCategoryData('research') || rawResearch);
  const [academicList, setAcademicList] = useState<any[]>(() => getCachedCategoryData('academic') || rawAcademic);
  const [pubList, setPubList] = useState<any[]>(() => getCachedCategoryData('publications') || rawPublications);
  const [serviceList, setServiceList] = useState<any[]>(() => getCachedCategoryData('service') || rawServices);
  const [ipList, setIpList] = useState<any[]>(() => getCachedCategoryData('ip') || rawIP);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setPersonnelList((getCachedCategoryData('personnel') || rawPersonnel) as PersonnelRecord[]);
      setResearchList(getCachedCategoryData('research') || rawResearch);
      setAcademicList(getCachedCategoryData('academic') || rawAcademic);
      setPubList(getCachedCategoryData('publications') || rawPublications);
      setServiceList(getCachedCategoryData('service') || rawServices);
      setIpList(getCachedCategoryData('ip') || rawIP);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => window.removeEventListener('ku_data_updated', handleUpdate);
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const [per, res, aca, pub, srv, ip] = await Promise.all([
        fetchCategoryData('personnel'),
        fetchCategoryData('research'),
        fetchCategoryData('academic'),
        fetchCategoryData('publications'),
        fetchCategoryData('service'),
        fetchCategoryData('ip'),
      ]);
      if (per && per.length > 0) setPersonnelList(per);
      if (res && res.length > 0) setResearchList(res);
      if (aca && aca.length > 0) setAcademicList(aca);
      if (pub && pub.length > 0) setPubList(pub);
      if (srv && srv.length > 0) setServiceList(srv);
      if (ip && ip.length > 0) setIpList(ip);
    } catch (err) {
      console.error('Failed to refresh personnel data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter items by time filter if provided
  const filteredResearch = useMemo(() => {
    if (!timeFilter) return researchList;
    return researchList.filter((item) => itemMatchesTimeFilter(item, timeFilter));
  }, [researchList, timeFilter]);

  const filteredAcademic = useMemo(() => {
    if (!timeFilter) return academicList;
    return academicList.filter((item) => itemMatchesTimeFilter(item, timeFilter));
  }, [academicList, timeFilter]);

  const filteredPub = useMemo(() => {
    if (!timeFilter) return pubList;
    return pubList.filter((item) => itemMatchesTimeFilter(item, timeFilter));
  }, [pubList, timeFilter]);

  const filteredService = useMemo(() => {
    if (!timeFilter) return serviceList;
    return serviceList.filter((item) => itemMatchesTimeFilter(item, timeFilter));
  }, [serviceList, timeFilter]);

  const filteredIP = useMemo(() => {
    if (!timeFilter) return ipList;
    return ipList.filter((item) => itemMatchesTimeFilter(item, timeFilter));
  }, [ipList, timeFilter]);

  // Aggregate works for all personnel
  const personnelMetrics = useMemo(() => {
    return personnelList.map((person) => {
      const pId = Number(person.id);
      const clean = normalizePersonName(person.clean_name || person.name || '');
      const normClean = normalizeSpellingVariant(clean.toLowerCase());
      const nameParts = normClean ? normClean.split(' ').filter(Boolean) : [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts[nameParts.length - 1] || '';

      const isMatch = (idVal: any, nameVal: any) => {
        if (pId && idVal && (Number(idVal) === pId || String(idVal) === String(pId))) {
          return true;
        }
        if (!nameVal || !normClean || normClean.length < 3) return false;
        const normVal = normalizeSpellingVariant(normalizePersonName(String(nameVal)).toLowerCase());
        if (normVal.includes(normClean)) return true;
        if (nameParts.length >= 2 && normVal.includes(firstName) && normVal.includes(lastName)) {
          return true;
        }
        return false;
      };

      // 1. Research Projects
      const matchedResearch = filteredResearch.filter(
        (r) =>
          isMatch(r.head_id, r.head) ||
          isMatch(null, r.co_researchers) ||
          isMatch(null, r.members)
      );

      // 2. Academic Development
      const matchedAcademic = filteredAcademic.filter(
        (a) => isMatch(a.head_id, a.head) || isMatch(null, a.leader) || isMatch(null, a.person)
      );

      // 3. Publications
      const matchedPub = filteredPub.filter(
        (b) =>
          isMatch(b.person_id || b.owner_id, b.owner) ||
          isMatch(null, b.author) ||
          isMatch(null, b.co_authors_domestic)
      );

      // 4. Services
      const matchedService = filteredService.filter(
        (s) => isMatch(s.person_id, s.person) || isMatch(null, s.head)
      );

      // 5. Intellectual Property
      const matchedIP = filteredIP.filter(
        (i) => isMatch(i.person_id, i.creator) || isMatch(null, i.inventors)
      );

      // Calculate budgets
      const researchBudget = matchedResearch.reduce((acc, curr) => acc + parseItemBudget(curr), 0);
      const academicBudget = matchedAcademic.reduce((acc, curr) => acc + parseItemBudget(curr), 0);

      // Calculate Quartiles
      const quartiles = { q1: 0, q2: 0, q3: 0, q4: 0, tci: 0, other: 0 };
      matchedPub.forEach((p) => {
        const tier = autoDetectJournalRanking(p.journal || '', p.level || '');
        if (tier === 'Q1') quartiles.q1++;
        else if (tier === 'Q2') quartiles.q2++;
        else if (tier === 'Q3') quartiles.q3++;
        else if (tier === 'Q4') quartiles.q4++;
        else if (tier === 'TCI 1' || tier === 'TCI 2') quartiles.tci++;
        else quartiles.other++;
      });

      // Calculate service hours
      const serviceHours = matchedService.reduce(
        (acc, curr) => acc + (Number(curr.hours_spent) || 0),
        0
      );

      const counts = {
        research: matchedResearch.length,
        academic: matchedAcademic.length,
        publications: matchedPub.length,
        service: matchedService.length,
        ip: matchedIP.length,
        total:
          matchedResearch.length +
          matchedAcademic.length +
          matchedPub.length +
          matchedService.length +
          matchedIP.length,
      };

      return {
        personnel: person,
        id: pId || 0,
        name: person.name || 'ไม่ระบุชื่อ',
        cleanName: clean,
        department: person.department || 'ไม่ระบุภาควิชา',
        position: person.position || 'อาจารย์/นักวิจัย',
        email: person.email || '',
        imageUrl: person.image_url ? person.image_url.trim() : '',
        researchItems: matchedResearch,
        academicItems: matchedAcademic,
        pubItems: matchedPub,
        serviceItems: matchedService,
        ipItems: matchedIP,
        counts,
        budgets: {
          research: researchBudget,
          academic: academicBudget,
          total: researchBudget + academicBudget,
        },
        pubQuartiles: quartiles,
        serviceHours,
      } as PersonnelWorkMetric;
    });
  }, [
    personnelList,
    filteredResearch,
    filteredAcademic,
    filteredPub,
    filteredService,
    filteredIP,
  ]);

  // Department statistics
  const departmentStats = useMemo(() => {
    const map: Record<string, DepartmentPersonnelStat> = {};
    personnelMetrics.forEach((m) => {
      const dept = m.department || 'อื่นๆ';
      if (!map[dept]) {
        map[dept] = {
          name: dept,
          facultyCount: 0,
          activeCount: 0,
          totalWorks: 0,
          totalBudget: 0,
        };
      }
      map[dept].facultyCount++;
      if (m.counts.total > 0) {
        map[dept].activeCount++;
      }
      map[dept].totalWorks += m.counts.total;
      map[dept].totalBudget += m.budgets.total;
    });
    return Object.values(map).sort((a, b) => b.totalWorks - a.totalWorks);
  }, [personnelMetrics]);

  // Overall totals
  const totalFacultyCount = personnelList.length;
  const activeFacultyCount = useMemo(
    () => personnelMetrics.filter((m) => m.counts.total > 0).length,
    [personnelMetrics]
  );
  const totalCombinedWorks = useMemo(
    () => personnelMetrics.reduce((sum, m) => sum + m.counts.total, 0),
    [personnelMetrics]
  );
  const totalCombinedBudget = useMemo(
    () => personnelMetrics.reduce((sum, m) => sum + m.budgets.total, 0),
    [personnelMetrics]
  );

  // Helper to fetch a single person's portfolio (with raw unfiltered data optionally available)
  const getPersonPortfolio = (targetId: string | number) => {
    const idNum = Number(targetId);
    return (
      personnelMetrics.find(
        (m) =>
          m.id === idNum ||
          String(m.id) === String(targetId) ||
          String(m.personnel._id) === String(targetId)
      ) || null
    );
  };

  return {
    personnelMetrics,
    departmentStats,
    totalFacultyCount,
    activeFacultyCount,
    totalCombinedWorks,
    totalCombinedBudget,
    isRefreshing,
    refreshData,
    getPersonPortfolio,
    rawDatasets: {
      research: researchList,
      academic: academicList,
      publications: pubList,
      service: serviceList,
      ip: ipList,
    },
  };
}

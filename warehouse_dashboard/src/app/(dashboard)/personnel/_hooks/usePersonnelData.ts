'use client';
import { formatPersonName } from '@/lib/formatPersonName';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';
import { autoDetectJournalRanking } from '@/config/journalRankingConfig';
import { normalizePersonName, normalizeSpellingVariant, resolvePersonAvatar } from '@/lib/personnelService';
import { PersonnelRecord } from '@/types/dataManagement';

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

interface DatasetsState {
  personnel: PersonnelRecord[];
  research: any[];
  academic: any[];
  publications: any[];
  service: any[];
  ip: any[];
}

function loadInitialDatasets(): DatasetsState {
  return {
    personnel: (getCachedCategoryData('personnel') || []) as PersonnelRecord[],
    research: getCachedCategoryData('research') || [],
    academic: getCachedCategoryData('academic') || [],
    publications: getCachedCategoryData('publications') || [],
    service: getCachedCategoryData('service') || [],
    ip: getCachedCategoryData('ip') || [],
  };
}

const toNorm = (str?: string | null): string =>
  str ? normalizeSpellingVariant(normalizePersonName(str).toLowerCase()) : '';

export function usePersonnelData(timeFilter?: TimeFilterState) {
  const [datasets, setDatasets] = useState<DatasetsState>(loadInitialDatasets);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(() => Boolean(datasets.personnel.length));

  const fetchAllData = useCallback(async () => {
    try {
      const [per, res, aca, pub, srv, ip] = await Promise.all([
        fetchCategoryData('personnel'),
        fetchCategoryData('research'),
        fetchCategoryData('academic'),
        fetchCategoryData('publications'),
        fetchCategoryData('service'),
        fetchCategoryData('ip'),
      ]);

      setDatasets((prev) => ({
        personnel: Array.isArray(per) && per.length > 0 ? (per as PersonnelRecord[]) : prev.personnel,
        research: Array.isArray(res) && res.length > 0 ? res : prev.research,
        academic: Array.isArray(aca) && aca.length > 0 ? aca : prev.academic,
        publications: Array.isArray(pub) && pub.length > 0 ? pub : prev.publications,
        service: Array.isArray(srv) && srv.length > 0 ? srv : prev.service,
        ip: Array.isArray(ip) && ip.length > 0 ? ip : prev.ip,
      }));
    } catch (err) {
      console.error('Failed to load personnel data:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchAllData();

    const handleUpdate = () => {
      setDatasets(loadInitialDatasets());
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('ku_data_updated', handleUpdate);
    };
  }, [fetchAllData]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await fetchAllData();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filter items by time filter if provided
  const filteredResearch = useMemo(() => {
    if (!timeFilter) return datasets.research;
    return datasets.research.filter((item) => itemMatchesTimeFilter(item, timeFilter, 'research'));
  }, [datasets.research, timeFilter]);

  const filteredAcademic = useMemo(() => {
    if (!timeFilter) return datasets.academic;
    return datasets.academic.filter((item) => itemMatchesTimeFilter(item, timeFilter, 'academic'));
  }, [datasets.academic, timeFilter]);

  const filteredPub = useMemo(() => {
    if (!timeFilter) return datasets.publications;
    return datasets.publications.filter((item) => itemMatchesTimeFilter(item, timeFilter, 'publications'));
  }, [datasets.publications, timeFilter]);

  const filteredService = useMemo(() => {
    if (!timeFilter) return datasets.service;
    return datasets.service.filter((item) => itemMatchesTimeFilter(item, timeFilter, 'service'));
  }, [datasets.service, timeFilter]);

  const filteredIP = useMemo(() => {
    if (!timeFilter) return datasets.ip;
    return datasets.ip.filter((item) => itemMatchesTimeFilter(item, timeFilter, 'ip'));
  }, [datasets.ip, timeFilter]);

  // Pre-process all 5 mission datasets once so both personnelMetrics and fallback lookups share the exact same matcher
  const preparedDatasets = useMemo(() => {
    const prepResearch = filteredResearch.map((r) => {
      const hId = r.head_id ? Number(r.head_id) : null;
      const hNorm = toNorm(r.head);
      const memberStr = r.co_researchers || r.members || '';
      const mNorms = memberStr
        ? String(memberStr)
            .split(/[,،;]+/)
            .map((s) => toNorm(s.trim()))
            .filter((s) => s.length >= 3)
        : [];
      return { item: r, budget: parseItemBudget(r), hId, hNorm, mNorms };
    });

    const prepAcademic = filteredAcademic.map((a) => {
      const hId = a.head_id ? Number(a.head_id) : null;
      const hNorm = toNorm(a.head);
      return { item: a, budget: parseItemBudget(a), hId, hNorm };
    });

    const prepPub = filteredPub.map((b) => {
      const pId = b.person_id || b.owner_id ? Number(b.person_id || b.owner_id) : null;
      const oNorm = toNorm(b.owner || b.first_author);
      const dNorms = b.co_authors_domestic
        ? String(b.co_authors_domestic)
            .split(/[,،;]+/)
            .map((s) => toNorm(s.trim()))
            .filter((s) => s.length >= 3)
        : [];
      const tier = autoDetectJournalRanking(b.journal || '', b.level || '');
      return { item: b, pId, oNorm, dNorms, tier };
    });

    const prepService = filteredService.map((s) => {
      const pId = s.person_id ? Number(s.person_id) : null;
      const pNorm = toNorm(s.person);
      const hours = Number(s.hours_spent) || 0;
      return { item: s, pId, pNorm, hours };
    });

    const prepIp = filteredIP.map((i) => {
      const pId = i.person_id ? Number(i.person_id) : null;
      const cNorm = toNorm(i.creator);
      const inventorStr = i.inventors || '';
      const iNorms = inventorStr
        ? String(inventorStr)
            .split(/[,،;]+/)
            .map((s) => toNorm(s.trim()))
            .filter((s) => s.length >= 3)
        : [];
      return { item: i, pId, cNorm, iNorms };
    });

    return { prepResearch, prepAcademic, prepPub, prepService, prepIp };
  }, [filteredResearch, filteredAcademic, filteredPub, filteredService, filteredIP]);

  const computeMetricForPerson = useCallback(
    (person: PersonnelRecord): PersonnelWorkMetric => {
      const { prepResearch, prepAcademic, prepPub, prepService, prepIp } = preparedDatasets;
      const pId = Number(person.id) || 0;
      const clean = normalizePersonName(person.clean_name || person.name || '');
      const normClean = toNorm(clean);
      const nameParts = normClean ? normClean.split(' ').filter(Boolean) : [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts[nameParts.length - 1] || '';

      const fastMatch = (idVal: number | null, nameNorm: string): boolean => {
        if (pId && idVal && idVal === pId) {
          if (nameNorm && normClean.length >= 3) {
            if (
              !nameNorm.includes(normClean) &&
              !(nameParts.length >= 2 && nameNorm.includes(firstName) && nameNorm.includes(lastName))
            ) {
              return false;
            }
          }
          return true;
        }
        if (!nameNorm || normClean.length < 3) return false;
        if (nameNorm.includes(normClean)) return true;
        if (nameParts.length >= 2 && nameNorm.includes(firstName) && nameNorm.includes(lastName)) return true;
        return false;
      };

      // Match Research
      let researchBudget = 0;
      const matchedResearch: any[] = [];
      for (let i = 0; i < prepResearch.length; i++) {
        const pr = prepResearch[i];
        if (fastMatch(pr.hId, pr.hNorm) || (normClean.length >= 4 && pr.mNorms.some((m) => fastMatch(null, m)))) {
          matchedResearch.push(pr.item);
          researchBudget += pr.budget;
        }
      }

      // Match Academic
      let academicBudget = 0;
      const matchedAcademic: any[] = [];
      for (let i = 0; i < prepAcademic.length; i++) {
        const pa = prepAcademic[i];
        if (fastMatch(pa.hId, pa.hNorm)) {
          matchedAcademic.push(pa.item);
          academicBudget += pa.budget;
        }
      }

      // Match Publications
      const quartiles = { q1: 0, q2: 0, q3: 0, q4: 0, tci: 0, other: 0 };
      const matchedPub: any[] = [];
      for (let i = 0; i < prepPub.length; i++) {
        const pb = prepPub[i];
        if (fastMatch(pb.pId, pb.oNorm) || (normClean.length >= 4 && pb.dNorms.some((d) => fastMatch(null, d)))) {
          matchedPub.push(pb.item);
          if (pb.tier === 'Q1') quartiles.q1++;
          else if (pb.tier === 'Q2') quartiles.q2++;
          else if (pb.tier === 'Q3') quartiles.q3++;
          else if (pb.tier === 'Q4') quartiles.q4++;
          else if (pb.tier === 'TCI 1' || pb.tier === 'TCI 2') quartiles.tci++;
          else quartiles.other++;
        }
      }

      // Match Services
      let serviceHours = 0;
      const matchedService: any[] = [];
      for (let i = 0; i < prepService.length; i++) {
        const ps = prepService[i];
        if (fastMatch(ps.pId, ps.pNorm)) {
          matchedService.push(ps.item);
          serviceHours += ps.hours;
        }
      }

      // Match IP
      const matchedIP: any[] = [];
      for (let i = 0; i < prepIp.length; i++) {
        const pi = prepIp[i];
        if (fastMatch(pi.pId, pi.cNorm) || (normClean.length >= 4 && pi.iNorms.some((inv) => fastMatch(null, inv)))) {
          matchedIP.push(pi.item);
        }
      }

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
        name: formatPersonName(person) || person.name || 'ไม่ระบุชื่อ',
        cleanName: clean,
        department: person.department || 'ไม่ระบุสังกัด',
        position: person.position || 'อาจารย์/นักวิจัย',
        email: person.email || '',
        imageUrl: (person.image_url && person.image_url.trim()) || resolvePersonAvatar(person.id || pId, person.name),
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
    },
    [preparedDatasets]
  );

  // Aggregate works for all personnel
  const personnelMetrics = useMemo(() => {
    return datasets.personnel.map(computeMetricForPerson);
  }, [datasets.personnel, computeMetricForPerson]);

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
  const totalFacultyCount = datasets.personnel.length;
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

  // Helper to fetch a single person's portfolio (with name fallback for external/retired personnel or stale IDs)
  const getPersonPortfolio = useCallback(
    (targetId: string | number, fallbackName?: string) => {
      const targetStr = String(targetId || '').trim();
      if (targetStr && targetStr !== 'lookup') {
        const idNum = Number(targetStr);
        const byId = personnelMetrics.find(
          (m) =>
            (!Number.isNaN(idNum) && idNum > 0 && m.id === idNum) ||
            String(m.id) === targetStr ||
            String(m.personnel._id) === targetStr
        );
        if (byId) return byId;
      }

      if (fallbackName && fallbackName.trim()) {
        const cleanQuery = toNorm(fallbackName.split(/,|،|\s+และ\s*/i)[0].trim());
        const qParts = cleanQuery.split(' ').filter(Boolean);
        if (cleanQuery.length >= 3) {
          const byName = personnelMetrics.find((m) => {
            const mNorm = toNorm(m.cleanName || m.name);
            if (!mNorm) return false;
            if (mNorm === cleanQuery || mNorm.includes(cleanQuery) || cleanQuery.includes(mNorm)) return true;
            if (qParts.length >= 2 && mNorm.includes(qParts[0]) && mNorm.includes(qParts[qParts.length - 1])) {
              return true;
            }
            return false;
          });
          if (byName) return byName;

          const displayRaw = fallbackName.split(/,|،|\s+และ\s*/i)[0].trim();
          const synthetic: PersonnelRecord = {
            id: 0,
            _id: 'lookup',
            name: displayRaw,
            title_th: '',
            clean_name: normalizePersonName(displayRaw),
            department: '',
            position: 'อาจารย์/นักวิจัย',
            email: '',
            image_url: '',
          };
          const metric = computeMetricForPerson(synthetic);
          const inferredDept =
            metric.researchItems[0]?.department ||
            metric.academicItems[0]?.department ||
            metric.pubItems[0]?.department ||
            metric.serviceItems[0]?.department ||
            metric.ipItems[0]?.department ||
            'ไม่ระบุสังกัด';
          return {
            ...metric,
            department: inferredDept,
          };
        }
      }

      return null;
    },
    [personnelMetrics, computeMetricForPerson]
  );

  return {
    personnelMetrics,
    departmentStats,
    totalFacultyCount,
    activeFacultyCount,
    totalCombinedWorks,
    totalCombinedBudget,
    isLoaded,
    isRefreshing,
    refreshData,
    getPersonPortfolio,
    rawDatasets: {
      research: datasets.research,
      academic: datasets.academic,
      publications: datasets.publications,
      service: datasets.service,
      ip: datasets.ip,
    },
  };
}

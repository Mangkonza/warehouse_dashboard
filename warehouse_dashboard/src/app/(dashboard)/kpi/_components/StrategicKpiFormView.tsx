'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FaArrowLeft,
  FaBullseye,
  FaCalculator,
  FaCalendarCheck,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaCog,
  FaExclamationTriangle,
  FaFolderOpen,
  FaInfoCircle,
  FaLayerGroup,
  FaListUl,
  FaPlus,
  FaSave,
  FaTrashAlt,
  FaUndo,
  FaUserCheck,
} from 'react-icons/fa';
import {
  KPIItem,
  KPICalcType,
  KPICategory,
  KPIFormulaMethod,
  KPISubFormulaRole,
  KPISubValueSource,
  KPISubIndicator,
  FilterOperator,
  StrategicStrategyEntity,
  StrategicPlanEntity,
  KPIReportingRoundConfig,
} from '@/types/kpi';
import {
  getStoredKPIs,
  getKPIById,
  addKPI,
  updateKPI,
  getStoredStrategies,
  createStrategyEntity,
  updateStrategyEntity,
  deleteStrategyEntity,
  getStoredPlans,
  createPlanEntity,
  updatePlanEntity,
  deletePlanEntity,
  getStoredReportingRounds,
  saveStoredReportingRounds,
  DEFAULT_REPORTING_ROUNDS,
  formatRoundDateRange,
  formatIsoToThaiShort,
  hasKpiReportedResults,
  ENGINEERING_DEPARTMENTS,
} from '@/lib/kpiEngine';
import { OptionPopoverSelect } from '@/components/form/OptionPopoverSelect';
import { CreatableHierarchySelect } from '@/components/form/CreatableHierarchySelect';
import { UnitSelectInput } from '@/components/form/UnitSelectInput';
import { FormField } from '@/components/form/FormField';
import { PersonPicker } from '@/components/form/PersonPicker';
import { DepartmentSelect } from '@/components/ui/department-select';
import { ConfirmActionModal } from '@/components/ui';
import { cn } from '@/lib/utils';

export interface StrategicKpiFormViewProps {
  kpiId?: string;
  isModal?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}

const CATEGORY_OPTIONS: { value: KPICategory; label: string }[] = [
  { value: 'research', label: 'โครงการวิจัย' },
  { value: 'academic', label: 'โครงการพัฒนาวิชาการ / หลักสูตร' },
  { value: 'publications', label: 'ผลงานตีพิมพ์ทางวิชาการ' },
  { value: 'service', label: 'งานบริการวิชาการ' },
  { value: 'ip', label: 'ทรัพย์สินทางปัญญาและเชิงพาณิชย์' },
  { value: 'personnel', label: 'บุคลากรและอาจารย์' },
  { value: 'strategy', label: 'ยุทธศาสตร์และความร่วมมือ' },
];

export const DATASET_CATEGORY_OPTIONS = [
  { id: 'research', label: 'โครงการวิจัย', code: 'research', desc: 'โครงการวิจัยและนวัตกรรม' },
  { id: 'academic', label: 'โครงการพัฒนาวิชาการ', code: 'academic', desc: 'โครงการ/หลักสูตรพัฒนาวิชาการ' },
  { id: 'publications', label: 'ผลงานตีพิมพ์ทางวิชาการ', code: 'publications', desc: 'บทความวิชาการ/วารสาร Scopus/TCI' },
  { id: 'service', label: 'งานบริการวิชาการ', code: 'service', desc: 'โครงการบริการวิชาการ/ฝึกอบรม' },
  { id: 'ip', label: 'งานทรัพย์สินทางปัญญา', code: 'ip', desc: 'สิทธิบัตร/อนุสิทธิบัตร/ลิขสิทธิ์' },
  { id: 'personnel', label: 'บุคลากรและอาจารย์', code: 'personnel', desc: 'ฐานข้อมูลบุคลากรและอาจารย์' },
] as const;

const FORMULA_METHODS: { key: KPIFormulaMethod; label: string; desc: string; needsDenominator?: boolean }[] = [
  {
    key: 'SUM',
    label: 'SUM (ผลรวมค่าย่อย)',
    desc: 'รวมค่าจากตัวชี้วัดย่อยทุกตัวที่มีบทบาทเป็นส่วนของผลรวม',
  },
  {
    key: 'PERCENTAGE',
    label: 'ร้อยละ (ตัวตั้ง÷ตัวหาร×100)',
    desc: 'คำนวณสัดส่วนร้อยละจาก (ผลรวมตัวตั้ง ÷ ผลรวมตัวหาร) × 100',
    needsDenominator: true,
  },
  {
    key: 'AVERAGE',
    label: 'ค่าเฉลี่ย',
    desc: 'คำนวณค่าเฉลี่ยจากตัวชี้วัดย่อยหรือรายการที่ผูก',
  },
  {
    key: 'RATIO',
    label: 'สัดส่วน A:B',
    desc: 'คำนวณอัตราส่วนระหว่างตัวตั้ง (A) ต่อตัวหาร (B) เช่น 1.6 : 1',
    needsDenominator: true,
  },
  {
    key: 'LATEST',
    label: 'ค่าล่าสุด',
    desc: 'ใช้ค่าจากรอบการรายงานผลล่าสุดที่ส่งแล้ว',
  },
  {
    key: 'DIRECT',
    label: 'กรอกผลตรง',
    desc: 'ผู้รายงานบันทึกค่าผลลัพธ์ของตัวชี้วัดหลักโดยตรงในแต่ละรอบการรายงานผล',
  },
];

const ROLE_LABELS: Record<KPISubFormulaRole, { label: string; bg: string; color: string; border: string }> = {
  numerator: { label: 'ตัวตั้ง', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
  denominator: { label: 'ตัวหาร', bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
  sum_part: { label: 'ส่วนของผลรวม', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
};

const SOURCE_LABELS: Record<KPISubValueSource, string> = {
  manual: 'กรอกเอง',
  linked_count: 'นับจากรายการที่ผูก',
  linked_sum: 'รวมยอดจากรายการที่ผูก',
};

const STANDARD_UNITS = [
  'ร้อยละ',
  'หลักสูตร',
  'ราย',
  'ผลงาน',
  'ผลงาน/รางวัล',
  'รางวัล',
  'Platform',
  'รายวิชา',
  'ค่าเฉลี่ย',
  'คะแนน',
  'ระบบ',
  'บทความ',
  'สัดส่วน',
  'ล้านบาท',
  'บาท',
  'โครงการ',
  'ชุมชน',
  'หน่วยงาน',
  'ล้านบาท/ราย',
  'บริการวิชาการ/นวัตกรรม',
  'ผลิตภัณฑ์',
  'กิจกรรม/โครงการ',
  'ความร่วมมือ',
];

export function StrategicKpiFormView({
  kpiId,
  isModal = false,
  onClose,
  onSaved,
  showToast,
}: StrategicKpiFormViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/manage?tab=kpi';
  const isEdit = Boolean(kpiId);

  // ข้อมูลกลาง: ยุทธศาสตร์, แผนงาน, รอบการรายงานผล
  const [strategies, setStrategies] = useState<StrategicStrategyEntity[]>(() => getStoredStrategies());
  const [plans, setPlans] = useState<StrategicPlanEntity[]>(() => getStoredPlans());
  const [reportingRounds, setReportingRounds] = useState<KPIReportingRoundConfig[]>(() =>
    getStoredReportingRounds()
  );
  const [existingKpi, setExistingKpi] = useState<KPIItem | null>(null);

  // สถานะฟอร์ม 4 ชั้น (ยุทธศาสตร์ → แผนงาน → ตัวชี้วัดหลัก → ตัวชี้วัดย่อย)
  const [strategyId, setStrategyId] = useState<string>('');
  const [planId, setPlanId] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<KPICategory>('research');
  const [fiscalYear, setFiscalYear] = useState<string>('2569');

  // 3 ช่องที่ใช้ OptionPopoverSelect ร่วมกัน
  const [collectionPeriod, setCollectionPeriod] = useState<string>('ปีงบประมาณ');
  const [valueType, setValueType] = useState<string>('จำนวนนับ');
  const [reportingLevels, setReportingLevels] = useState<string[]>(['ส่วนงาน']);

  // เป้าหมายและหน่วยนับ (ไม่มีฟิลด์น้ำหนัก)
  const [unit, setUnit] = useState<string>('ผลงาน');
  const [targetOperator, setTargetOperator] = useState<'gte' | 'lte' | 'eq' | 'gt' | 'lt'>('gte');
  const [targetValue, setTargetValue] = useState<number>(10);
  const [targetLabel, setTargetLabel] = useState<string>('');
  const [departmentTarget, setDepartmentTarget] = useState<string>('');

  // สูตรคำนวณตัวชี้วัดหลัก & การเชื่อมฐานข้อมูล
  const [formulaMethod, setFormulaMethod] = useState<KPIFormulaMethod>('SUM');
  const [calcType, setCalcType] = useState<KPICalcType>('manual');
  const [datasetKey, setDatasetKey] = useState<string>('research');
  const [sumField, setSumField] = useState<string>('budget_external');
  const [filterField, setFilterField] = useState<string>('budget_external');
  const [filterOperator, setFilterOperator] = useState<FilterOperator>('gte');
  const [filterValue, setFilterValue] = useState<string>('10000000');

  // ตัวชี้วัดย่อย (พร้อมสถานะกดขยายแถว expandable row)
  const [subIndicators, setSubIndicators] = useState<KPISubIndicator[]>([]);
  const [expandedSubRows, setExpandedSubRows] = useState<Record<number, boolean>>({});

  // รอบการรายงานผลที่ใช้ (ค่าเริ่มต้นคือทุกรอบ)
  const [activeRoundIds, setActiveRoundIds] = useState<string[]>([]);

  // ผู้รายงานและหน่วยงานรับผิดชอบ (ตัดชื่อ "ฟ้า" ออก ต้องใส่เป็นชื่อจริงเต็มเท่านั้น)
  const [reporters, setReporters] = useState<string[]>([]);
  const [responsibleUnit, setResponsibleUnit] = useState<string>('');
  const [datasetKeys, setDatasetKeys] = useState<string[]>(['research']);

  // การแจ้งเตือนและการยืนยันเมื่อแก้ไขหน่วย สูตร หรือเป้า ของตัวชี้วัดที่มีผลรายงานแล้ว
  const [formError, setFormError] = useState<string>('');
  const [showSensitiveChangeConfirm, setShowSensitiveChangeConfirm] = useState<boolean>(false);

  // โหลดข้อมูลเริ่มต้น
  useEffect(() => {
    const strats = getStoredStrategies();
    const allPlans = getStoredPlans();
    const rounds = getStoredReportingRounds();
    setStrategies(strats);
    setPlans(allPlans);
    setReportingRounds(rounds);

    if (kpiId) {
      const found = getKPIById(kpiId);
      if (found) {
        setExistingKpi(found);
        const sId =
          found.strategyId ||
          strats.find((s) => s.code === found.strategyCode)?.id ||
          strats[0]?.id ||
          '';
        setStrategyId(sId);

        const pId =
          found.planId ||
          allPlans.find((p) => p.strategyId === sId)?.id ||
          allPlans[0]?.id ||
          '';
        setPlanId(pId);

        setCode(found.code);
        setTitle(found.title);
        setDescription(found.description || '');
        setCategory(found.category || 'research');
        setFiscalYear(found.fiscalYear || '2569');
        setCollectionPeriod(found.collectionPeriod || 'ปีงบประมาณ');
        setValueType(found.valueType || (found.unit === 'ร้อยละ' ? 'ร้อยละ' : 'จำนวนนับ'));
        setReportingLevels(
          found.reportingLevels && found.reportingLevels.length > 0
            ? found.reportingLevels
            : ['ส่วนงาน']
        );
        setUnit(found.unit || 'ผลงาน');
        setTargetOperator(found.targetOperator || 'gte');
        setTargetValue(found.targetValue ?? 0);
        setTargetLabel(found.targetLabel || '');
        setDepartmentTarget(
          found.departmentTarget !== undefined ? String(found.departmentTarget) : ''
        );
        setFormulaMethod(
          found.formulaMethod || (found.unit === 'ร้อยละ' ? 'PERCENTAGE' : 'SUM')
        );
        setCalcType(found.calcType || 'manual');
        setDatasetKey(found.datasetKey || 'research');
        setDatasetKeys(
          found.datasetKeys && found.datasetKeys.length > 0
            ? found.datasetKeys
            : [found.datasetKey || 'research']
        );
        setSumField(found.sumField || 'budget_external');
        setFilterField(found.filterConfig?.field || 'budget_external');
        setFilterOperator(found.filterConfig?.operator || 'gte');
        setFilterValue(String(found.filterConfig?.value ?? '10000000'));
        setSubIndicators(
          (found.subIndicators || []).map((s, idx) => ({
            ...s,
            id: s.id || `${found.id}-sub-${idx + 1}`,
            formulaRole:
              s.formulaRole ||
              (found.unit === 'ร้อยละ' && idx === 0
                ? 'numerator'
                : found.unit === 'ร้อยละ' && idx === 1
                ? 'denominator'
                : 'sum_part'),
            valueSource: s.valueSource || 'manual',
            linkedDatasetKey: s.linkedDatasetKey || found.datasetKey || 'research',
            reporters:
              (s.reporters && s.reporters.length > 0
                ? s.reporters
                : s.reporter
                ? s.reporter.split(/[/,]/)
                : []
              )
                .map((x) => x.trim())
                .filter((x) => x && x !== 'ฟ้า'),
          }))
        );
        setActiveRoundIds(
          found.activeRoundIds && found.activeRoundIds.length > 0
            ? found.activeRoundIds
            : rounds.map((r) => r.id)
        );
        const cleanLoadedReporters = (
          found.reporters && found.reporters.length > 0
            ? found.reporters
            : found.reporter
            ? found.reporter.split(/[/,]/)
            : []
        )
          .map((x) => x.trim())
          .filter((x) => x && x !== 'ฟ้า');
        setReporters(cleanLoadedReporters);
        setResponsibleUnit(found.responsibleUnit || '');
        return;
      }
    }

    // ค่าเริ่มต้นสำหรับการเพิ่มตัวชี้วัดใหม่
    const defaultStrat = strats.find((s) => s.code === '2.1') || strats[0];
    const defaultStratId = defaultStrat?.id || '';
    setStrategyId(defaultStratId);

    const plansForStrat = allPlans.filter((p) => p.strategyId === defaultStratId);
    const defaultPlan = plansForStrat[0] || allPlans[0];
    setPlanId(defaultPlan?.id || '');

    const allKpis = getStoredKPIs();
    const planCodeStr = defaultPlan?.code || '2.1-1';
    const nextNum =
      allKpis.filter((k) => k.planId === defaultPlan?.id || k.code.startsWith(planCodeStr)).length +
      1;
    setCode(`${planCodeStr} (${nextNum})`);
    setActiveRoundIds(rounds.map((r) => r.id));
  }, [kpiId]);

  // แผนงานที่ผูกกับยุทธศาสตร์ที่เลือก (อ้างอิงด้วย strategyId ภายใน)
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => p.strategyId === strategyId);
  }, [plans, strategyId]);

  const selectedStrategy = useMemo(
    () => strategies.find((s) => s.id === strategyId) || null,
    [strategies, strategyId]
  );

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === planId) || null,
    [plans, planId]
  );

  // เปลี่ยนยุทธศาสตร์ -> เลือกแผนงานแรกภายใต้ยุทธศาสตร์นั้นอัตโนมัติ
  const handleSelectStrategy = (newStrategyId: string) => {
    setStrategyId(newStrategyId);
    const matchingPlans = plans.filter((p) => p.strategyId === newStrategyId);
    const firstPlan = matchingPlans[0];
    const nextPlanId = firstPlan?.id || '';
    setPlanId(nextPlanId);

    if (!isEdit && firstPlan) {
      const allKpis = getStoredKPIs();
      const countInPlan =
        allKpis.filter((k) => k.planId === firstPlan.id || k.code.startsWith(firstPlan.code))
          .length + 1;
      setCode(`${firstPlan.code} (${countInPlan})`);
    }
  };

  // เปลี่ยนแผนงาน -> อัปเดตรหัสตัวชี้วัดแนะนำกรณีเพิ่มใหม่
  const handleSelectPlan = (newPlanId: string, planOpt: { id: string; code: string; name: string }) => {
    setPlanId(newPlanId);
    if (!isEdit && planOpt.code) {
      const allKpis = getStoredKPIs();
      const countInPlan =
        allKpis.filter((k) => k.planId === planOpt.id || k.code.startsWith(planOpt.code)).length + 1;
      setCode(`${planOpt.code} (${countInPlan})`);
    }
  };

  // สร้างยุทธศาสตร์ใหม่แบบ inline ใน dropdown
  const handleCreateStrategy = (newCode: string, newName: string) => {
    const res = createStrategyEntity(newCode, newName);
    if (res.ok) {
      setStrategies(getStoredStrategies());
    }
    return res;
  };

  // แก้ไขยุทธศาสตร์ (ภาพที่ 4)
  const handleUpdateStrategy = (id: string, newCode: string, newName: string) => {
    const res = updateStrategyEntity(id, newCode, newName);
    if (res.ok) {
      setStrategies(getStoredStrategies());
    }
    return res;
  };

  // ลบยุทธศาสตร์ (ภาพที่ 4)
  const handleDeleteStrategy = (id: string) => {
    const res = deleteStrategyEntity(id);
    if (res.ok) {
      setStrategies(getStoredStrategies());
      setPlans(getStoredPlans());
    }
    return res;
  };

  // สร้างแผนงานใหม่แบบ inline ใน dropdown (ผูกกับยุทธศาสตร์ที่เลือก)
  const handleCreatePlan = (newCode: string, newName: string) => {
    const res = createPlanEntity(strategyId, newCode, newName);
    if (res.ok) {
      setPlans(getStoredPlans());
    }
    return res;
  };

  // แก้ไขแผนงาน (ภาพที่ 4)
  const handleUpdatePlan = (id: string, newCode: string, newName: string) => {
    const res = updatePlanEntity(id, newCode, newName);
    if (res.ok) {
      setPlans(getStoredPlans());
    }
    return res;
  };

  // ลบแผนงาน (ภาพที่ 4)
  const handleDeletePlan = (id: string) => {
    const res = deletePlanEntity(id);
    if (res.ok) {
      setPlans(getStoredPlans());
    }
    return res;
  };

  // ตรวจสอบว่าสูตรต้องมีตัวหารแต่ยังไม่มีหรือไม่
  const formulaNeedsDenominator =
    formulaMethod === 'PERCENTAGE' || formulaMethod === 'RATIO';
  const hasDenominatorSub = useMemo(
    () => subIndicators.some((s) => s.formulaRole === 'denominator'),
    [subIndicators]
  );
  const hasNumeratorSub = useMemo(
    () => subIndicators.some((s) => s.formulaRole === 'numerator'),
    [subIndicators]
  );
  const missingDenominatorWarning = formulaNeedsDenominator && !hasDenominatorSub;

  // ตรวจสอบว่าตัวชี้วัดนี้มีผลรายงานแล้วหรือไม่ และมีการแก้ หน่วย, สูตร หรือ เป้า หรือไม่
  const alreadyHasResults = useMemo(() => hasKpiReportedResults(existingKpi), [existingKpi]);
  const changedSensitiveFields = useMemo(() => {
    if (!isEdit || !existingKpi || !alreadyHasResults) return [];
    const changes: string[] = [];
    if (unit.trim() !== (existingKpi.unit || '').trim()) {
      changes.push(`หน่วยนับ ("${existingKpi.unit}" → "${unit.trim()}")`);
    }
    const prevFormula =
      existingKpi.formulaMethod || (existingKpi.unit === 'ร้อยละ' ? 'PERCENTAGE' : 'SUM');
    if (formulaMethod !== prevFormula || calcType !== existingKpi.calcType) {
      changes.push(`สูตรการคำนวณ ("${prevFormula}" → "${formulaMethod}")`);
    }
    if (
      Number(targetValue) !== Number(existingKpi.targetValue) ||
      (targetLabel || '').trim() !== (existingKpi.targetLabel || '').trim()
    ) {
      changes.push(
        `ค่าเป้าหมาย ("${existingKpi.targetLabel || existingKpi.targetValue}" → "${
          targetLabel || targetValue
        }")`
      );
    }
    return changes;
  }, [
    isEdit,
    existingKpi,
    alreadyHasResults,
    unit,
    formulaMethod,
    calcType,
    targetValue,
    targetLabel,
  ]);

  // จัดการตัวชี้วัดย่อย
  const handleAddSubIndicator = () => {
    const nextIdx = subIndicators.length;
    const defaultRole: KPISubFormulaRole = formulaNeedsDenominator
      ? !hasNumeratorSub
        ? 'numerator'
        : !hasDenominatorSub
        ? 'denominator'
        : 'sum_part'
      : 'sum_part';

    setSubIndicators((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}-${nextIdx}`,
        title: '',
        unit: unit === 'ร้อยละ' ? 'ราย' : unit || 'ผลงาน',
        formulaRole: defaultRole,
        valueSource: 'manual',
        linkedDatasetKey: datasetKey || 'research',
        reporters: [...reporters],
        reporter: reporters.join('/'),
      },
    ]);
    // กางแถวที่เพิ่งเพิ่มใหม่อัตโนมัติเพื่อให้ตั้งค่ารายละเอียดได้ทันที
    setExpandedSubRows((prev) => ({ ...prev, [nextIdx]: true }));
  };

  const handleUpdateSubIndicator = (
    idx: number,
    field: keyof KPISubIndicator,
    val: any
  ) => {
    setSubIndicators((prev) =>
      prev.map((row, i) => {
        if (i !== idx) return row;
        const updated = { ...row, [field]: val };
        if (field === 'reporters' && Array.isArray(val)) {
          updated.reporter = val.join('/');
        }
        return updated;
      })
    );
  };

  const handleRemoveSubIndicator = (idx: number) => {
    setSubIndicators((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleSubRowExpand = (idx: number) => {
    setExpandedSubRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleToggleRound = (roundId: string) => {
    setActiveRoundIds((prev) => {
      if (prev.includes(roundId)) {
        if (prev.length <= 1) return prev; // ต้องมีอย่างน้อย 1 รอบ
        return prev.filter((id) => id !== roundId);
      }
      return [...prev, roundId];
    });
  };

  // ฟังก์ชันจัดการรอบการรายงานผลกลางภายใน Modal โดยตรง (ไม่ต้องเปลี่ยนหน้าเว็บ)
  const handleUpdateRoundConfig = (
    roundId: string,
    patch: Partial<KPIReportingRoundConfig>
  ) => {
    setReportingRounds((prev) => {
      const next = prev.map((r) => (r.id === roundId ? { ...r, ...patch } : r));
      saveStoredReportingRounds(next);
      return next;
    });
  };

  const handleAddRoundConfig = () => {
    const newId = `round-custom-${Date.now()}`;
    const nextOrder = reportingRounds.length + 1;
    const newRound: KPIReportingRoundConfig = {
      id: newId,
      name: nextOrder === 3 ? 'รอบ 12 เดือน' : `รอบที่ ${nextOrder}`,
      startDate: '2025-10-01',
      endDate: '2026-09-30',
      dueDate: '2026-10-10',
      isCumulative: true,
      fiscalYear: fiscalYear || '2569',
      sortOrder: nextOrder,
    };
    const next = [...reportingRounds, newRound];
    setReportingRounds(next);
    saveStoredReportingRounds(next);
    setActiveRoundIds((prev) => (prev.includes(newId) ? prev : [...prev, newId]));
  };

  const handleDeleteRoundConfig = (roundId: string) => {
    if (reportingRounds.length <= 1) return;
    const next = reportingRounds
      .filter((r) => r.id !== roundId)
      .map((r, i) => ({ ...r, sortOrder: i + 1 }));
    setReportingRounds(next);
    saveStoredReportingRounds(next);
    setActiveRoundIds((prev) => {
      const filtered = prev.filter((id) => id !== roundId);
      return filtered.length > 0 ? filtered : [next[0].id];
    });
  };

  const handleResetDefaultRounds = () => {
    const defaults = DEFAULT_REPORTING_ROUNDS.map((r) => ({ ...r }));
    setReportingRounds(defaults);
    saveStoredReportingRounds(defaults);
    setActiveRoundIds(defaults.map((r) => r.id));
    if (showToast) {
      showToast('คืนค่ารอบการรายงานผลมาตรฐานสำเร็จ', 'success');
    }
  };

  // ดำเนินการบันทึกจริง
  const executeSave = () => {
    saveStoredReportingRounds(reportingRounds);
    const cleanedSubs: KPISubIndicator[] = subIndicators
      .filter((s) => s.title && s.title.trim() !== '')
      .map((s, idx) => ({
        ...s,
        id: s.id || `sub-${Date.now()}-${idx}`,
        title: s.title.trim(),
        unit: (s.unit || unit || 'หน่วย').trim(),
        formulaRole: s.formulaRole || 'sum_part',
        valueSource: s.valueSource || 'manual',
        linkedDatasetKey: s.linkedDatasetKey || datasetKey,
        reporters: s.reporters && s.reporters.length > 0 ? s.reporters : reporters,
        reporter:
          s.reporters && s.reporters.length > 0
            ? s.reporters.join('/')
            : s.reporter || reporters.join('/'),
      }));

    const stratCode = selectedStrategy?.code || '2.1';
    const stratFullName = selectedStrategy
      ? `ยุทธศาสตร์ที่ ${selectedStrategy.code} : ${selectedStrategy.name}`
      : `ยุทธศาสตร์ที่ ${stratCode}`;
    const pCode = selectedPlan ? `แผนงาน ${selectedPlan.code}` : '';
    const pFullName = selectedPlan
      ? `แผนงาน ${selectedPlan.code} : ${selectedPlan.name}`
      : '';

    const payload: Omit<KPIItem, 'id'> = {
      code: code.trim(),
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      fiscalYear: fiscalYear.trim() || '2569',
      strategyId,
      strategyCode: stratCode,
      strategyName: stratFullName,
      planId,
      planCode: pCode || undefined,
      planName: pFullName || undefined,
      collectionPeriod,
      valueType,
      reportingLevels: reportingLevels.length > 0 ? reportingLevels : ['ส่วนงาน'],
      unit: unit.trim() || 'ผลงาน',
      targetOperator,
      targetValue: Number(targetValue) || 0,
      targetLabel: targetLabel.trim() || undefined,
      departmentTarget: departmentTarget.trim() || undefined,
      formulaMethod,
      calcType,
      datasetKey: datasetKeys[0] || datasetKey || 'research',
      datasetKeys: datasetKeys.length > 0 ? datasetKeys : [datasetKey || 'research'],
      sumField: calcType === 'auto_sum' ? sumField : undefined,
      filterConfig:
        calcType === 'auto_filtered_count'
          ? {
              field: filterField,
              operator: filterOperator,
              value: isNaN(Number(filterValue)) ? filterValue : Number(filterValue),
            }
          : undefined,
      completenessField: calcType === 'auto_completeness' ? 'department' : undefined,
      completenessExpected:
        calcType === 'auto_completeness' ? ENGINEERING_DEPARTMENTS : undefined,
      activeRoundIds:
        activeRoundIds.length > 0 ? activeRoundIds : reportingRounds.map((r) => r.id),
      reporters: reporters.filter((r) => r && r !== 'ฟ้า'),
      reporter: reporters.filter((r) => r && r !== 'ฟ้า').join('/'),
      responsibleUnit: responsibleUnit.trim() || undefined,
      subIndicators: cleanedSubs.length > 0 ? cleanedSubs : undefined,
      // คงค่าผลรายงานและโครงการที่ผูกเดิมไว้ครบถ้วน
      actual6M: existingKpi?.actual6M ?? null,
      actual9M: existingKpi?.actual9M ?? null,
      actual6MText: existingKpi?.actual6MText,
      actual9MText: existingKpi?.actual9MText,
      resultsByRound: existingKpi?.resultsByRound || [],
      evidence: existingKpi?.evidence,
      remarks: existingKpi?.remarks,
      manualProgress: existingKpi?.manualProgress ?? 0,
      manualIncludedProjectIds: existingKpi?.manualIncludedProjectIds || [],
      manualExcludedProjectIds: existingKpi?.manualExcludedProjectIds || [],
    };

    if (isEdit && existingKpi) {
      updateKPI({ ...existingKpi, ...payload });
    } else {
      addKPI(payload);
    }

    setShowSensitiveChangeConfirm(false);
    if (showToast) {
      showToast(isEdit ? 'บันทึกการแก้ไขตัวชี้วัดสำเร็จ' : 'บันทึกรายการตัวชี้วัดใหม่สำเร็จ', 'success');
    }
    if (onSaved) {
      onSaved();
    }
    if (onClose) {
      onClose();
    } else {
      router.push(returnTo);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!strategyId) {
      setFormError('กรุณาเลือกหรือสร้าง "ยุทธศาสตร์"');
      return;
    }
    if (!planId) {
      setFormError('กรุณาเลือกหรือสร้าง "แผนงาน" ภายใต้ยุทธศาสตร์ที่เลือก');
      return;
    }
    if (!code.trim() || !title.trim()) {
      setFormError('กรุณากรอก "รหัสตัวชี้วัด" และ "ชื่อตัวชี้วัด" ให้ครบถ้วน');
      return;
    }

    // ถ้ามีผลรายงานแล้วและมีการเปลี่ยน หน่วย สูตร หรือ เป้า ให้ขึ้นเตือนยืนยันก่อนบันทึก (Requirement 7)
    if (changedSensitiveFields.length > 0) {
      setShowSensitiveChangeConfirm(true);
      return;
    }

    executeSave();
  };

  const handleCancelClick = () => {
    if (onClose) {
      onClose();
    } else {
      router.push(returnTo);
    }
  };

  const renderAlerts = () => (
    <>
      {/* แจ้งเตือนหากตัวชี้วัดมีผลรายงานแล้ว และมีการแก้ หน่วย สูตร หรือเป้า */}
      {alreadyHasResults && changedSensitiveFields.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '14px 18px',
            borderRadius: '12px',
            backgroundColor: '#fffbeb',
            border: '1.5px solid #f59e0b',
            color: '#92400e',
            fontSize: '13px',
          }}
        >
          <FaExclamationTriangle style={{ fontSize: '18px', color: '#d97706', marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, marginBottom: '2px' }}>
              คำเตือน: ตัวชี้วัดนี้มีผลการรายงานในระบบแล้ว
            </div>
            <div>
              คุณกำลังแก้ไข <strong>{changedSensitiveFields.join(', ')}</strong> ซึ่งอาจส่งผลต่อการคำนวณร้อยละความสำเร็จของผลที่รายงานไปแล้ว ระบบจะขอคำยืนยันอีกครั้งก่อนบันทึก
            </div>
          </div>
        </div>
      )}

      {formError && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          {formError}
        </div>
      )}
    </>
  );

  const renderInnerSections = () => (
    <>
        {/* =================================================================== */}
        {/* ชั้นที่ 1 & 2: ตำแหน่งในแผน (ยุทธศาสตร์ → แผนงาน) แบบ Creatable Select */}
        {/* =================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
            <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
              1. ตำแหน่งในแผน: ยุทธศาสตร์ → แผนงาน
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="ยุทธศาสตร์" required>
              <CreatableHierarchySelect
                id="kpi-strategy-select"
                entityLabel="ยุทธศาสตร์"
                options={strategies}
                valueId={strategyId}
                onChange={(newId) => handleSelectStrategy(newId)}
                onCreateNew={handleCreateStrategy}
                onUpdate={handleUpdateStrategy}
                onDelete={handleDeleteStrategy}
                codePlaceholder="เช่น 2.1"
                namePlaceholder="เช่น สร้างองค์ความรู้การวิจัยและนวัตกรรมระดับสากล"
                placeholder="เลือกยุทธศาสตร์ หรือกด + เพิ่มใหม่..."
              />
            </FormField>

            <FormField label="แผนงาน (ผูกกับยุทธศาสตร์ที่เลือก)" required>
              <CreatableHierarchySelect
                id="kpi-plan-select"
                entityLabel="แผนงาน"
                options={filteredPlans}
                valueId={planId}
                onChange={(newId, opt) => handleSelectPlan(newId, opt)}
                onCreateNew={handleCreatePlan}
                onUpdate={handleUpdatePlan}
                onDelete={handleDeletePlan}
                codePlaceholder={selectedStrategy ? `เช่น ${selectedStrategy.code}-1` : 'เช่น 2.1-1'}
                namePlaceholder="เช่น พัฒนาระบบนิเวศงานวิจัยด้านการเกษตร สุขภาพ และสิ่งแวดล้อม"
                placeholder="เลือกแผนงาน หรือกด + เพิ่มใหม่..."
                disabled={!strategyId}
              />
            </FormField>
          </div>

          <p className="text-xs text-slate-500">
            เลือกจากรายการเดิม หรือกด “+ เพิ่มใหม่” เพื่อกรอกเลขและชื่อด้วยตนเอง
          </p>
        </section>

        {/* =================================================================== */}
        {/* ชั้นที่ 3: ตัวชี้วัดหลัก (พร้อม OptionPopoverSelect ทั้ง 3 ช่อง) */}
        {/* =================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
            <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
              2. ตัวชี้วัดหลัก
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <FormField label="รหัสตัวชี้วัด" required>
                <input
                  id="kpi-code-input"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="เช่น 2.1-1 (5)"
                  className="w-full h-10 px-3 text-sm font-bold text-[#006838] bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
                />
              </FormField>
            </div>

            <div className="sm:col-span-8">
              <FormField label="ชื่อตัวชี้วัดตามแผนยุทธศาสตร์" required>
                <input
                  id="kpi-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ระบุชื่อตัวชี้วัดหลัก..."
                  className="w-full h-10 px-3 text-sm text-slate-900 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
                />
              </FormField>
            </div>
          </div>

          <FormField label="คำอธิบายตัวชี้วัด / เกณฑ์การประเมิน">
            <textarea
              id="kpi-desc-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุคำจำกัดความ เงื่อนไข หรือเกณฑ์การประเมินตามเอกสารแผนยุทธศาสตร์..."
              className="w-full p-3 text-sm text-slate-900 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors resize-y"
            />
          </FormField>

          {/* 3 ช่องที่ใช้ OptionPopoverSelect ร่วมกัน */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="รอบการเก็บข้อมูล">
              <OptionPopoverSelect
                id="kpi-collection-period-select"
                title="เลือกรอบการเก็บข้อมูล"
                lookupCategory="collection_period"
                value={collectionPeriod}
                onChange={(val: string) => setCollectionPeriod(val)}
                multiple={false}
                allowCustom={true}
              />
            </FormField>

            <FormField label="ชนิดของค่า">
              <OptionPopoverSelect
                id="kpi-value-type-select"
                title="เลือกชนิดของค่า"
                lookupCategory="value_type"
                value={valueType}
                onChange={(val: string) => {
                  setValueType(val);
                  if (val === 'ร้อยละ') {
                    setUnit('ร้อยละ');
                    setFormulaMethod('PERCENTAGE');
                  } else if (val === 'สัดส่วน A:B') {
                    setUnit('สัดส่วน');
                    setFormulaMethod('RATIO');
                  } else if (val === 'ค่าเฉลี่ย') {
                    setFormulaMethod('AVERAGE');
                  }
                }}
                multiple={false}
                allowCustom={true}
              />
            </FormField>

            <FormField label="ระดับที่รายงาน (เลือกได้หลายรายการ)">
              <OptionPopoverSelect
                id="kpi-reporting-level-select"
                title="เลือกระดับที่รายงาน"
                lookupCategory="reporting_level"
                value={reportingLevels}
                onChange={(vals: string[]) => setReportingLevels(vals)}
                multiple={true}
                allowCustom={true}
              />
            </FormField>
          </div>

          {/* หน่วยนับ + เงื่อนไขเป้าหมาย + ค่าเป้าหมายปี 2569 + เป้าหมายส่วนงาน */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormField label="หน่วยนับ" required>
              <UnitSelectInput
                id="kpi-unit-input"
                value={unit}
                onChange={setUnit}
                placeholder="เช่น ร้อยละ, ผลงาน, โครงการ"
              />
            </FormField>

            <FormField label="เงื่อนไขเป้าหมาย">
              <select
                id="kpi-target-operator"
                value={targetOperator}
                onChange={(e) => setTargetOperator(e.target.value as any)}
                className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
              >
                <option value="gte">มากกว่าหรือเท่ากับ (&ge;)</option>
                <option value="gt">มากกว่า (&gt;)</option>
                <option value="eq">เท่ากับ (=)</option>
                <option value="lte">น้อยกว่าหรือเท่ากับ (&le;)</option>
              </select>
            </FormField>

            <FormField label={`ค่าเป้าหมายปี ${fiscalYear}`} required>
              <input
                id="kpi-target-value"
                type="number"
                step="any"
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full h-10 px-3 text-sm font-bold text-slate-900 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
              />
            </FormField>

            <FormField label="เป้าหมายส่วนงาน / ป้ายแสดงพิเศษ">
              <input
                id="kpi-dept-target"
                type="text"
                value={departmentTarget || targetLabel}
                onChange={(e) => {
                  setDepartmentTarget(e.target.value);
                  if (valueType === 'สัดส่วน A:B' || e.target.value.includes(':')) {
                    setTargetLabel(e.target.value);
                  }
                }}
                placeholder="เช่น ส่วนงาน: 2 หรือ 1.6 : 1"
                className="w-full h-10 px-3 text-sm text-slate-900 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
              />
            </FormField>
          </div>
        </section>

        {/* =================================================================== */}
        {/* ชั้นที่ 4: ตัวชี้วัดย่อย (กดขยายแถว Expandable Row) + วิธีคำนวณตัวชี้วัดหลัก */}
        {/* =================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
              <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
                3. ตัวชี้วัดย่อย: องค์ประกอบของค่า ({subIndicators.length} รายการ)
              </h4>
            </div>

            <button
              type="button"
              onClick={handleAddSubIndicator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00A651] bg-[#f0fbf5] hover:bg-[#e2f7eb] text-[#00A651] text-xs font-semibold transition-colors cursor-pointer"
            >
              <FaPlus className="text-[10px]" />
              <span>+ เพิ่มตัวชี้วัดย่อย</span>
            </button>
          </div>

          {/* ตารางตัวชี้วัดย่อยแบบกดขยายแถว (Expandable Row) */}
          {subIndicators.length === 0 ? (
            <div
              style={{
                padding: '18px',
                borderRadius: '10px',
                border: '1px dashed #cbd5e1',
                backgroundColor: '#f8fafc',
                textAlign: 'center',
                fontSize: '12.5px',
                color: '#64748b',
              }}
            >
              ยังไม่มีตัวชี้วัดย่อย คลิก <strong>&ldquo;+ เพิ่มตัวชี้วัดย่อย&rdquo;</strong> เพื่อกำหนดองค์ประกอบของสูตร (ตัวตั้ง / ตัวหาร / ส่วนของผลรวม)
            </div>
          ) : (
            <div
              style={{
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '13px',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#eaf4ee', color: '#14532d' }}>
                    <th style={{ width: '44px', padding: '10px 8px', textAlign: 'center' }}>#</th>
                    <th style={{ padding: '10px 10px', textAlign: 'left' }}>ชื่อตัวชี้วัดย่อย</th>
                    <th style={{ width: '130px', padding: '10px 8px', textAlign: 'left' }}>หน่วย</th>
                    <th style={{ width: '270px', padding: '10px 8px', textAlign: 'left' }}>
                      สรุปบทบาท / ที่มา / ผู้รายงาน
                    </th>
                    <th style={{ width: '140px', padding: '10px 10px', textAlign: 'right' }}>
                      รายละเอียด
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subIndicators.map((sub, idx) => {
                    const isRowExpanded = Boolean(expandedSubRows[idx]);
                    const roleKey: KPISubFormulaRole = sub.formulaRole || 'sum_part';
                    const roleStyle = ROLE_LABELS[roleKey] || ROLE_LABELS.sum_part;
                    const srcKey: KPISubValueSource = sub.valueSource || 'manual';
                    const subReporterList =
                      sub.reporters && sub.reporters.length > 0
                        ? sub.reporters
                        : sub.reporter
                        ? sub.reporter.split(/[/,]/).map((s) => s.trim()).filter(Boolean)
                        : [];

                    return (
                      <React.Fragment key={sub.id || idx}>
                        {/* แถวหลักของตัวชี้วัดย่อย */}
                        <tr
                          style={{
                            borderTop: '1px solid #e2e8f0',
                            backgroundColor: isRowExpanded ? '#f0fbf5' : '#ffffff',
                          }}
                        >
                          <td
                            style={{
                              padding: '10px 8px',
                              textAlign: 'center',
                              fontWeight: 700,
                              color: '#475569',
                            }}
                          >
                            {idx + 1}
                          </td>
                          <td style={{ padding: '10px' }}>
                            <input
                              type="text"
                              value={sub.title}
                              onChange={(e) =>
                                handleUpdateSubIndicator(idx, 'title', e.target.value)
                              }
                              placeholder="ระบุชื่อตัวชี้วัดย่อย เช่น จำนวนบุคลากรที่ได้รับการรับรอง..."
                              style={{
                                width: '100%',
                                height: '36px',
                                padding: '0 10px',
                                borderRadius: '7px',
                                border: '1px solid #cbd5e1',
                                fontSize: '13px',
                                color: '#0f172a',
                                backgroundColor: '#ffffff',
                                boxSizing: 'border-box',
                              }}
                            />
                          </td>
                          <td style={{ padding: '10px 8px', minWidth: '120px' }}>
                            <UnitSelectInput
                              value={sub.unit || ''}
                              onChange={(val) =>
                                handleUpdateSubIndicator(idx, 'unit', val)
                              }
                              placeholder="เช่น ราย, ผลงาน"
                            />
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '5px',
                              }}
                            >
                              <span
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  backgroundColor: roleStyle.bg,
                                  border: `1px solid ${roleStyle.border}`,
                                  color: roleStyle.color,
                                  fontSize: '11px',
                                  fontWeight: 700,
                                }}
                              >
                                {roleStyle.label}
                              </span>
                              <span
                                style={{
                                  padding: '2px 7px',
                                  borderRadius: '6px',
                                  backgroundColor: '#f1f5f9',
                                  color: '#334155',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                }}
                              >
                                {SOURCE_LABELS[srcKey]}
                              </span>
                              {subReporterList.length > 0 && (
                                <span
                                  style={{
                                    padding: '2px 7px',
                                    borderRadius: '999px',
                                    backgroundColor: '#ecfdf5',
                                    color: '#047857',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                  }}
                                >
                                  {subReporterList.join(', ')}
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => toggleSubRowExpand(idx)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  border: isRowExpanded
                                    ? '1px solid #00A651'
                                    : '1px solid #cbd5e1',
                                  backgroundColor: isRowExpanded ? '#00A651' : '#ffffff',
                                  color: isRowExpanded ? '#ffffff' : '#334155',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                <span>{isRowExpanded ? 'ซ่อนแถว' : 'ตั้งค่าแถว'}</span>
                                {isRowExpanded ? (
                                  <FaChevronUp style={{ fontSize: '10px' }} />
                                ) : (
                                  <FaChevronDown style={{ fontSize: '10px' }} />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveSubIndicator(idx)}
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  backgroundColor: '#fee2e2',
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                                title="ลบตัวชี้วัดย่อย"
                              >
                                <FaTrashAlt style={{ fontSize: '11px' }} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* แถวขยาย (Expandable Row) สำหรับตั้งค่า บทบาทในสูตร, ที่มาของค่า, และผู้รายงาน */}
                        {isRowExpanded && (
                          <tr
                            style={{
                              backgroundColor: '#f8fafc',
                              borderTop: '1px dashed #cbd5e1',
                            }}
                          >
                            <td />
                            <td colSpan={4} style={{ padding: '14px 16px' }}>
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                                  gap: '14px',
                                }}
                              >
                                {/* บทบาทในสูตร */}
                                <div>
                                  <label
                                    style={{
                                      display: 'block',
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      color: '#334155',
                                      marginBottom: '6px',
                                    }}
                                  >
                                    บทบาทในสูตรคำนวณ
                                  </label>
                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {(
                                      [
                                        { key: 'numerator', label: 'ตัวตั้ง' },
                                        { key: 'denominator', label: 'ตัวหาร' },
                                        { key: 'sum_part', label: 'ส่วนของผลรวม' },
                                      ] as const
                                    ).map((r) => {
                                      const active = roleKey === r.key;
                                      return (
                                        <button
                                          key={r.key}
                                          type="button"
                                          onClick={() =>
                                            handleUpdateSubIndicator(idx, 'formulaRole', r.key)
                                          }
                                          style={{
                                            padding: '6px 11px',
                                            borderRadius: '7px',
                                            border: active
                                              ? '1.5px solid #00A651'
                                              : '1px solid #cbd5e1',
                                            backgroundColor: active ? '#f0fbf5' : '#ffffff',
                                            color: active ? '#00A651' : '#334155',
                                            fontSize: '12px',
                                            fontWeight: active ? 700 : 500,
                                            cursor: 'pointer',
                                          }}
                                        >
                                          {r.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* ที่มาของค่า */}
                                <div>
                                  <label
                                    style={{
                                      display: 'block',
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      color: '#334155',
                                      marginBottom: '6px',
                                    }}
                                  >
                                    ที่มาของค่า
                                  </label>
                                  <select
                                    value={srcKey}
                                    onChange={(e) =>
                                      handleUpdateSubIndicator(
                                        idx,
                                        'valueSource',
                                        e.target.value as KPISubValueSource
                                      )
                                    }
                                    style={{
                                      width: '100%',
                                      height: '36px',
                                      padding: '0 10px',
                                      borderRadius: '7px',
                                      border: '1px solid #cbd5e1',
                                      backgroundColor: '#ffffff',
                                      fontSize: '12.5px',
                                      color: '#0f172a',
                                    }}
                                  >
                                    <option value="manual">กรอกเอง</option>
                                    <option value="linked_count">นับจากรายการที่ผูก</option>
                                    <option value="linked_sum">รวมยอดจากรายการที่ผูก</option>
                                  </select>
                                </div>

                                {/* ตารางข้อมูลที่ผูก (แสดงเมื่อเลือกนับ/รวมยอดจากรายการที่ผูก) */}
                                {srcKey !== 'manual' && (
                                  <div>
                                    <label
                                      style={{
                                        display: 'block',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#334155',
                                        marginBottom: '6px',
                                      }}
                                    >
                                      ชุดข้อมูลที่ผูก
                                    </label>
                                    <select
                                      value={sub.linkedDatasetKey || datasetKey}
                                      onChange={(e) =>
                                        handleUpdateSubIndicator(
                                          idx,
                                          'linkedDatasetKey',
                                          e.target.value
                                        )
                                      }
                                      style={{
                                        width: '100%',
                                        height: '36px',
                                        padding: '0 10px',
                                        borderRadius: '7px',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: '#ffffff',
                                        fontSize: '12.5px',
                                        color: '#0f172a',
                                      }}
                                    >
                                      <option value="research">โครงการวิจัย</option>
                                      <option value="academic">โครงการพัฒนาวิชาการ</option>
                                      <option value="publications">ผลงานตีพิมพ์</option>
                                      <option value="service">งานบริการวิชาการ</option>
                                      <option value="ip">ทรัพย์สินทางปัญญา</option>
                                      <option value="personnel">บุคลากรและอาจารย์</option>
                                    </select>
                                  </div>
                                )}

                                {/* เป้าหมายย่อย (ถ้ามี) */}
                                <div>
                                  <label
                                    style={{
                                      display: 'block',
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      color: '#334155',
                                      marginBottom: '6px',
                                    }}
                                  >
                                    เป้าหมายย่อย (ถ้ามี)
                                  </label>
                                  <input
                                    type="text"
                                    value={sub.target ?? ''}
                                    onChange={(e) =>
                                      handleUpdateSubIndicator(idx, 'target', e.target.value)
                                    }
                                    placeholder="เว้นว่างได้หากใช้เป้าหมายหลัก"
                                    style={{
                                      width: '100%',
                                      height: '36px',
                                      padding: '0 10px',
                                      borderRadius: '7px',
                                      border: '1px solid #cbd5e1',
                                      backgroundColor: '#ffffff',
                                      fontSize: '12.5px',
                                      color: '#0f172a',
                                      boxSizing: 'border-box',
                                    }}
                                  />
                                </div>

                                {/* ผู้รายงานของตัวชี้วัดย่อย (เลือกได้หลายคนจากข้อมูลบุคลากรและอาจารย์) */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                  <FormField label="ผู้รายงานตัวชี้วัดย่อยนี้ (เลือกหลายคนจากบุคลากรและอาจารย์ที่มีอยู่)">
                                    <PersonPicker
                                      multiple={true}
                                      values={subReporterList.filter((r) => r && r !== 'ฟ้า')}
                                      onChangeMultiple={(vals) => {
                                        const names = vals
                                          .map((v) => (typeof v === 'string' ? v : v.name))
                                          .filter((n) => n && n !== 'ฟ้า');
                                        handleUpdateSubIndicator(idx, 'reporters', names);
                                      }}
                                      placeholder="ค้นหาชื่ออาจารย์ / บุคลากร..."
                                    />
                                  </FormField>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* วิธีคำนวณค่าตัวชี้วัดหลัก */}
          <div style={{ marginTop: '6px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '8px',
              }}
            >
              วิธีคำนวณค่าตัวชี้วัดหลัก
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {FORMULA_METHODS.map((fm) => {
                const isSel = formulaMethod === fm.key;
                return (
                  <button
                    key={fm.key}
                    type="button"
                    onClick={() => setFormulaMethod(fm.key)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '999px',
                      border: isSel ? '1.5px solid #00A651' : '1px solid #cbd5e1',
                      backgroundColor: isSel ? '#00A651' : '#ffffff',
                      color: isSel ? '#ffffff' : '#334155',
                      fontSize: '13px',
                      fontWeight: isSel ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {fm.label}
                  </button>
                );
              })}
            </div>

            {/* แจ้งเตือนทันทีหากสูตรต้องมีตัวหารแต่ยังไม่มีตัวชี้วัดย่อยที่เป็นตัวหาร */}
            {missingDenominatorWarning ? (
              <div
                role="alert"
                style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#fef2f2',
                  border: '1.5px solid #fca5a5',
                  color: '#b91c1c',
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaExclamationTriangle style={{ fontSize: '15px', flexShrink: 0 }} />
                  <span>
                    <strong>แจ้งเตือนสูตรคำนวณ:</strong> วิธีคำนวณ{' '}
                    <strong>
                      {FORMULA_METHODS.find((f) => f.key === formulaMethod)?.label}
                    </strong>{' '}
                    จำเป็นต้องมีตัวชี้วัดย่อยที่มีบทบาทเป็น <strong>&ldquo;ตัวหาร&rdquo;</strong>{' '}
                    อย่างน้อย 1 รายการ เพื่อป้องกันข้อผิดพลาดการหารด้วยศูนย์ (#REF! / #DIV/0!)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = subIndicators.length;
                    setSubIndicators((prev) => [
                      ...prev,
                      {
                        id: `sub-denom-${Date.now()}`,
                        title: 'จำนวนทั้งหมด (ตัวหาร)',
                        unit: unit === 'ร้อยละ' ? 'ราย' : unit,
                        formulaRole: 'denominator',
                        valueSource: 'manual',
                        reporters: [...reporters],
                        reporter: reporters.join('/'),
                      },
                    ]);
                    setExpandedSubRows((prev) => ({ ...prev, [nextIdx]: true }));
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid #dc2626',
                    backgroundColor: '#ffffff',
                    color: '#dc2626',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  + เพิ่มแถวตัวหารทันที
                </button>
              </div>
            ) : (
              <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#475569' }}>
                <FaInfoCircle style={{ color: '#00A651', marginRight: '5px', verticalAlign: 'middle' }} />
                {FORMULA_METHODS.find((f) => f.key === formulaMethod)?.desc} • เปรียบเทียบกับเป้าหมาย{' '}
                <strong>
                  {targetOperator === 'gte' ? '≥' : targetOperator === 'lte' ? '≤' : '='}{' '}
                  {targetLabel || targetValue} {unit}
                </strong>
              </p>
            )}
          </div>
        </section>

        {/* =================================================================== */}
        {/* ส่วนที่ 4: รอบการรายงานผล (ตั้งค่ารอบการรายงานผลกลาง และเลือกว่าตัวชี้วัดนี้ใช้รอบไหน) */}
        {/* =================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
              <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
                4. รอบการรายงานผล (ตั้งค่ารอบการรายงานผลกลาง และเลือกว่าตัวชี้วัดนี้ใช้รอบไหน)
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaultRounds}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                title="คืนค่ารอบ 6 เดือน และ 9 เดือนมาตรฐาน"
              >
                <FaUndo className="text-[10px]" />
                <span>คืนค่ารอบเริ่มต้น</span>
              </button>

              <button
                type="button"
                onClick={handleAddRoundConfig}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00A651] bg-[#00A651] hover:bg-[#008f45] text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <FaPlus className="text-[10px]" />
                <span>เพิ่มรอบการรายงานผล</span>
              </button>
            </div>
          </div>

          {/* ชิปเลือกรอบการรายงานผล (ค่าเริ่มต้น = ทุกรอบ) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {reportingRounds.map((r) => {
              const isSelected = activeRoundIds.includes(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleToggleRound(r.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    border: isSelected ? '1.5px solid #00A651' : '1px solid #cbd5e1',
                    backgroundColor: isSelected ? '#00A651' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#475569',
                    fontSize: '13px',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {r.name} {isSelected ? '✓' : ''}
                </button>
              );
            })}
          </div>

          {/* ตารางตั้งค่าและแก้ไขรอบการรายงานผลกลางภายใน Modal โดยตรง */}
          <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table
              style={{
                width: '100%',
                minWidth: '720px',
                borderCollapse: 'collapse',
                fontSize: '12.5px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#eaf4ee', color: '#14532d' }}>
                  <th style={{ padding: '9px 10px', textAlign: 'center', width: '74px' }}>ใช้ในตัวชี้วัดนี้</th>
                  <th style={{ padding: '9px 10px', textAlign: 'left', width: '170px' }}>ชื่อรอบการรายงานผล</th>
                  <th style={{ padding: '9px 10px', textAlign: 'left', width: '140px' }}>วันเริ่มต้น</th>
                  <th style={{ padding: '9px 10px', textAlign: 'left', width: '140px' }}>วันสิ้นสุด</th>
                  <th style={{ padding: '9px 10px', textAlign: 'left', width: '140px' }}>กำหนดส่ง</th>
                  <th style={{ padding: '9px 10px', textAlign: 'center', width: '110px' }}>นับสะสมต้นปี</th>
                  <th style={{ padding: '9px 10px', textAlign: 'center', width: '56px' }}>ลบ</th>
                </tr>
              </thead>
              <tbody>
                {reportingRounds.map((r) => {
                  const isUsed = activeRoundIds.includes(r.id);
                  const isProtected = r.id === 'round-6m' || r.id === 'round-9m';
                  return (
                    <tr
                      key={r.id}
                      style={{
                        borderTop: '1px solid #e2e8f0',
                        backgroundColor: isUsed ? '#ffffff' : '#f8fafc',
                      }}
                    >
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isUsed}
                          onChange={() => handleToggleRound(r.id)}
                          style={{ width: '16px', height: '16px', accentColor: '#00A651', cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <input
                          type="text"
                          value={r.name}
                          onChange={(e) => handleUpdateRoundConfig(r.id, { name: e.target.value })}
                          placeholder="เช่น รอบ 6 เดือน"
                          className="w-full h-8 px-2.5 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-[#00A651]"
                        />
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          ช่วง: {formatRoundDateRange(r, true)}
                        </div>
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <input
                          type="date"
                          value={r.startDate || ''}
                          onChange={(e) => handleUpdateRoundConfig(r.id, { startDate: e.target.value })}
                          className="w-full h-8 px-2 text-xs rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#00A651]"
                        />
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <input
                          type="date"
                          value={r.endDate || ''}
                          onChange={(e) => handleUpdateRoundConfig(r.id, { endDate: e.target.value })}
                          className="w-full h-8 px-2 text-xs rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#00A651]"
                        />
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <input
                          type="date"
                          value={r.dueDate || ''}
                          onChange={(e) => handleUpdateRoundConfig(r.id, { dueDate: e.target.value })}
                          className="w-full h-8 px-2 text-xs rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:border-[#00A651]"
                        />
                        {r.dueDate && (
                          <div className="text-[10.5px] text-slate-500 mt-0.5">
                            {formatIsoToThaiShort(r.dueDate, true)}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleUpdateRoundConfig(r.id, { isCumulative: !r.isCumulative })}
                          style={{
                            padding: '3px 9px',
                            borderRadius: '999px',
                            border: r.isCumulative ? '1px solid #86efac' : '1px solid #cbd5e1',
                            backgroundColor: r.isCumulative ? '#ecfdf5' : '#f1f5f9',
                            color: r.isCumulative ? '#047857' : '#64748b',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {r.isCumulative ? 'เปิด (สะสม)' : 'เฉพาะรอบ'}
                        </button>
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        {!isProtected && reportingRounds.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteRoundConfig(r.id)}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                            title="ลบรอบการรายงานผลนี้"
                          >
                            <FaTrashAlt size={11} />
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">หลัก</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* =================================================================== */}
        {/* ส่วนที่ 5: ผู้รับผิดชอบรายงาน และการเชื่อมโยงฐานข้อมูล */}
        {/* =================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <span className="w-1.5 h-4 bg-[#00A651] rounded-full shrink-0" />
            <h4 className="text-[14px] font-bold text-slate-800 tracking-wide">
              5. ผู้รับผิดชอบรายงาน และการเชื่อมโยงฐานข้อมูล
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ภาพที่ 1: ผู้รายงานหลัก -> ใช้ PersonPicker multiple และตัดชื่อฟ้าออก */}
            <FormField label="ผู้รายงานหลัก (เลือกจากบุคลากรและอาจารย์ได้หลายคน)">
              <PersonPicker
                multiple={true}
                values={reporters.filter((r) => r && r !== 'ฟ้า')}
                onChangeMultiple={(vals) => {
                  const names = vals
                    .map((v) => (typeof v === 'string' ? v : v.name))
                    .filter((n) => n && n !== 'ฟ้า');
                  setReporters(names);
                }}
                placeholder="ค้นหาชื่ออาจารย์ / บุคลากร..."
              />
            </FormField>

            {/* ภาพที่ 2: หน่วยงานผู้รับผิดชอบหลัก -> ใช้ DepartmentSelect */}
            <FormField label="หน่วยงานผู้รับผิดชอบหลัก">
              <DepartmentSelect
                value={responsibleUnit}
                onChange={(val) => setResponsibleUnit(val)}
                placeholder="-- เลือกสังกัด / หน่วยงานผู้รับผิดชอบ --"
              />
            </FormField>
          </div>

          {/* ภาพที่ 3: ชุดข้อมูลในคลังข้อมูล (Dataset) Multi-Select Checkboxes */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <FaCalculator className="text-[#00A651]" />
                <span>ชุดข้อมูลหลักที่ใช้ผูกผลงาน/โครงการเป็นหลักฐาน (เลือกได้หลายหมวด)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const allIds = DATASET_CATEGORY_OPTIONS.map((d) => d.id);
                    setDatasetKeys(allIds);
                    if (allIds.length > 0) setDatasetKey(allIds[0]);
                  }}
                  className="text-xs text-[#00A651] hover:underline font-semibold cursor-pointer"
                >
                  เลือกทั้งหมด
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setDatasetKeys([]);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  ล้างทั้งหมด
                </button>
              </div>
            </div>

            {/* Multi-select Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {DATASET_CATEGORY_OPTIONS.map((opt) => {
                const isChecked = datasetKeys.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setDatasetKeys((prev) => {
                        const next = prev.includes(opt.id)
                          ? prev.filter((k) => k !== opt.id)
                          : [...prev, opt.id];
                        if (next.length > 0) {
                          setDatasetKey(next[0]);
                        }
                        return next;
                      });
                    }}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-all select-none',
                      isChecked
                        ? 'bg-[#f0fbf5] border-[#00A651] text-[#006838] shadow-sm font-semibold ring-1 ring-[#00A651]/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50/80 hover:border-slate-300'
                    )}
                  >
                    <div
                      className={cn(
                        'w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors',
                        isChecked
                          ? 'bg-[#00A651] border-[#00A651] text-white'
                          : 'border-slate-300 bg-white'
                      )}
                    >
                      {isChecked && <FaCheck className="text-[9px]" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-xs">{opt.label}</span>
                      <span className="text-[11px] font-normal text-slate-500 truncate">
                        {opt.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* โหมดการดึงค่าเริ่มต้น */}
            <div className="pt-2 border-t border-slate-200">
              <FormField label="โหมดการดึงค่าเริ่มต้น">
                <select
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value as KPICalcType)}
                  className="w-full h-10 px-3 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A651]/20 focus:border-[#00A651] transition-colors"
                >
                  <option value="manual">บันทึกตามรอบการรายงานผล / ผูกโครงการด้วยมือ</option>
                  <option value="auto_count">นับจำนวนรายการทั้งหมดในชุดข้อมูลอัตโนมัติ</option>
                  <option value="auto_filtered_count">นับรายการตามเงื่อนไขที่กรอง</option>
                  <option value="auto_sum">รวมยอดเงิน/ตัวเลขสะสมจากชุดข้อมูล</option>
                  <option value="auto_completeness">ตรวจสอบความครบถ้วนทั้ง 7 ภาควิชา</option>
                </select>
              </FormField>
            </div>
          </div>
        </section>
    </>
  );

  // โหมด Modal เหมือนหมวดหมู่อื่น
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header เขียว KU ตามภาพที่ 1 */}
        <div
          style={{
            padding: '18px 24px',
            backgroundColor: '#00A651',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#86efac',
                fontSize: '18px',
              }}
            >
              <FaBullseye />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                {isEdit
                  ? `แก้ไขข้อมูล: ตัวชี้วัดตามแผนยุทธศาสตร์ (${existingKpi?.code || ''})`
                  : 'เพิ่มรายการใหม่: ตัวชี้วัดตามแผนยุทธศาสตร์'}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#dcfce7' }}>
                กำหนดโครงสร้าง 4 ชั้น (ยุทธศาสตร์ → แผนงาน → ตัวชี้วัดหลัก → ตัวชี้วัดย่อย) ครั้งเดียว ใช้ได้ทุกรอบการรายงานผล
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancelClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '26px',
              cursor: 'pointer',
              padding: '4px',
              lineHeight: 1,
              opacity: 0.85,
            }}
            title="ปิด"
          >
            &times;
          </button>
        </div>

        {/* Modal Form Scrollable Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow: 'hidden',
            margin: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {renderAlerts()}
            {renderInnerSections()}
          </div>

          {/* Modal Footer ตามภาพที่ 1 */}
          <div
            style={{
              padding: '16px 24px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={handleCancelClick}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 22px',
                borderRadius: '8px',
                border: '1px solid #00A651',
                backgroundColor: '#00A651',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
              }}
            >
              <FaSave style={{ fontSize: '14px' }} />
              <span>{isEdit ? 'บันทึกการแก้ไข' : 'บันทึกรายการใหม่'}</span>
            </button>
          </div>
        </form>

        {/* Modal เตือนยืนยัน */}
        <ConfirmActionModal
          isOpen={showSensitiveChangeConfirm}
          type="warning"
          title="ยืนยันการแก้ไขหน่วย สูตร หรือเป้าหมาย?"
          message={`ตัวชี้วัด "${code}" มีผลการรายงานในระบบแล้ว การแก้ไข ${changedSensitiveFields.join(
            ', '
          )} อาจกระทบต่อการคำนวณผลลัพธ์ของรอบที่ได้รายงานไปแล้ว`}
          detail="คุณต้องการยืนยันการบันทึกการเปลี่ยนแปลงโครงสร้างตัวชี้วัดนี้ใช่หรือไม่?"
          confirmText="ยืนยันการบันทึก"
          cancelText="กลับไปตรวจสอบ"
          onConfirm={executeSave}
          onCancel={() => setShowSensitiveChangeConfirm(false)}
        />
      </div>
    </div>
  );
}

export const StrategicKpiModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  kpiId?: string;
  onSaved?: () => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'warning') => void;
}> = ({ isOpen, ...props }) => {
  if (!isOpen) return null;
  return <StrategicKpiFormView {...props} isModal={true} />;
};

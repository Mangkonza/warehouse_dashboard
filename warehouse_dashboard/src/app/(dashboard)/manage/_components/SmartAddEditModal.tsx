'use client';
import { formatPersonName, splitFullName } from '@/lib/formatPersonName';

import React, { useState, useEffect, useRef } from 'react';
import { CategoryConfig, PersonnelRecord } from '@/types/dataManagement';
import { SmartAutocomplete } from './SmartAutocomplete';
import {
  FaFlask,
  FaGraduationCap,
  FaHandsHelping,
  FaBook,
  FaCertificate,
  FaUsers,
  FaSave,
  FaExclamationCircle,
  FaUserTie,
  FaUpload,
  FaTrashAlt,
  FaTimes,
} from 'react-icons/fa';
import { MultiMemberSelector } from './MultiMemberSelector';
import { SDGTagSelector } from './SDGTagSelector';
import { JournalQuartileSelector } from './JournalQuartileSelector';
import { STATUS_LABELS } from '@/lib/projectMonitoringEngine';
import {
  AcademicFormFields,
  ResearchFormFields,
  ServiceFormFields,
  PublicationFormFields,
  IpFormFields,
} from '@/components/form/domain-forms';
import { PersonnelForm } from '@/components/form/PersonnelForm';
import { PersonPicker, PersonPickerValue } from '@/components/form/PersonPicker';
import { MoneyInput } from '@/components/form/MoneyInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { DepartmentSelect, ConfirmActionModal } from '@/components/ui';
import { Spinner } from '@/components/ui/Spinner';

const getCategoryIcon = (key: string) => {
  switch (key) {
    case 'research':
      return <FaFlask style={{ fontSize: '20px', color: '#86efac' }} />;
    case 'academic':
      return <FaGraduationCap style={{ fontSize: '20px', color: '#86efac' }} />;
    case 'service':
      return <FaHandsHelping style={{ fontSize: '20px', color: '#86efac' }} />;
    case 'publications':
      return <FaBook style={{ fontSize: '20px', color: '#86efac' }} />;
    case 'ip':
      return <FaCertificate style={{ fontSize: '20px', color: '#86efac' }} />;
    case 'personnel':
      return <FaUsers style={{ fontSize: '20px', color: '#86efac' }} />;
    default:
      return <FaFlask style={{ fontSize: '20px', color: '#86efac' }} />;
  }
};

interface SmartAddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Record<string, any>) => void;
  config: CategoryConfig;
  initialData?: Record<string, any> | null;
  isSubmitting?: boolean;
}

export const SmartAddEditModal: React.FC<SmartAddEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  config,
  initialData,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formScrollRef = useRef<HTMLFormElement | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Prevent background page from scrolling when modal is open
  useEffect(() => {
    if (!isOpen) {
      setShowDiscardConfirm(false);
      return;
    }

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isOpen]);

  // Handle Escape key to show confirmation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowDiscardConfirm(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowDiscardConfirm(true);
    }
  };

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      const copy = { ...initialData };
      if (config.key === 'personnel') {
        if ((!copy.first_name || !String(copy.first_name).trim()) && (!copy.last_name || !String(copy.last_name).trim()) && (copy.name || copy.name_th)) {
          const split = splitFullName(copy.name || copy.name_th || '', copy.title_th);
          copy.first_name = split.first_name;
          copy.last_name = split.last_name;
          if (!copy.title_th && split.title_th) {
            copy.title_th = split.title_th;
          }
        }
      }
      setFormData(copy);
    } else {
      // Default empty values based on schema
      const initial: Record<string, any> = {};
      config.columns.forEach((col) => {
        if (col.editable !== false) {
          initial[col.key] = col.type === 'currency' || col.type === 'number' ? 0 : '';
        }
      });
      setFormData(initial);
    }
    setErrorMsg('');
    setFieldErrors({});
  }, [initialData, config, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (key: string, val: any) => {
    // Clear error for this field immediately on typing/changing (alert disappears as soon as typing begins)
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFormData((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handlePersonSelect = (person: PersonnelRecord) => {
    setFormData((prev) => {
      const updated = { ...prev };
      // Auto-fill department if department field exists in this schema
      if (config.departmentKey) {
        updated[config.departmentKey] = person.department;
      }
      // Auto-fill email if email field exists
      if (prev.email !== undefined || config.columns.some((c) => c.key === 'email')) {
        updated.email = person.email;
      }
      return updated;
    });
  };

  const focusAndSetError = (field: string, msg: string, customSelector?: string) => {
    setErrorMsg('');
    setFieldErrors({ [field]: msg });
    const sel = customSelector || `#field-${field}, [name="${field}"], [data-field="${field}"]`;
    const el = document.querySelector<HTMLElement>(sel);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (formScrollRef.current) {
        const containerRect = formScrollRef.current.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const relativeTop = elRect.top - containerRect.top + formScrollRef.current.scrollTop - 40;
        formScrollRef.current.scrollTo({ top: Math.max(0, relativeTop), behavior: 'smooth' });
      }
      const focusable = el.matches('input, textarea, select, button')
        ? el
        : el.querySelector<HTMLElement>('input, textarea, select, button');
      if (focusable) {
        setTimeout(() => focusable.focus(), 150);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (config.key === 'academic') {
      const recNo = formData.record_number || formData.req_no;
      if (!recNo || !String(recNo).trim()) {
        focusAndSetError('record_number', 'กรุณาระบุเลขที่คำขอ / เลขระเบียน', '#field-academic-record_number');
        return;
      }
      if (!formData.name || !String(formData.name).trim()) {
        focusAndSetError('name', 'กรุณาระบุชื่อโครงการพัฒนาวิชาการ', '#field-academic-name');
        return;
      }
      if (!formData.client || !String(formData.client).trim()) {
        focusAndSetError('client', 'กรุณาระบุผู้ขอรับบริการ / ว่าจ้าง', '#field-academic-client');
        return;
      }
      const chars = Array.isArray(formData.characteristics)
        ? formData.characteristics
        : typeof formData.characteristics === 'string' && formData.characteristics
        ? formData.characteristics.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      if (chars.length === 0) {
        focusAndSetError('characteristics', 'กรุณาเลือกลักษณะโครงการอย่างน้อย 1 รายการ', '#field-academic-characteristics');
        return;
      }
      if (!formData.head || !String(formData.head).trim()) {
        focusAndSetError('head', 'กรุณาระบุหัวหน้าโครงการ', '#field-academic-head');
        return;
      }
      if (!formData.department || !String(formData.department).trim()) {
        focusAndSetError('department', 'กรุณาระบุสังกัดที่ดำเนินการ', '#field-academic-department');
        return;
      }
      if (formData.co_members_internal === undefined || formData.co_members_internal === null || String(formData.co_members_internal).trim() === '') {
        focusAndSetError('co_members_internal', 'กรุณาระบุจำนวนผู้ร่วมโครงการ (ภายใน)', '#field-academic-co_members_internal');
        return;
      }
      if (formData.co_members_external === undefined || formData.co_members_external === null || String(formData.co_members_external).trim() === '') {
        focusAndSetError('co_members_external', 'กรุณาระบุจำนวนผู้ร่วมโครงการ (ภายนอก)', '#field-academic-co_members_external');
        return;
      }
      if (formData.budget === undefined || formData.budget === null || String(formData.budget).trim() === '') {
        focusAndSetError('budget', 'กรุณาระบุงบประมาณรวมทั้งหมด', '#section-academic-budget');
        return;
      }
      if (!formData.start_date) {
        focusAndSetError('start_date', 'กรุณาระบุวันที่เริ่มต้นดำเนินการ', '#field-academic-start-date');
        return;
      }
      if (!formData.end_date) {
        focusAndSetError('end_date', 'กรุณาระบุวันที่สิ้นสุดดำเนินการ', '#field-academic-end-date');
        return;
      }
      if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
        focusAndSetError('end_date', '"วันที่สิ้นสุดดำเนินการ" ต้องไม่เกิดขึ้นก่อน "วันที่เริ่มต้นดำเนินการ"', '#field-academic-end-date');
        return;
      }

      // Project type category check (research service / consulting / training service, etc.)
      const projCats = Array.isArray(formData.project_type_categories)
        ? formData.project_type_categories
        : Array.isArray(formData.project_type_category)
        ? formData.project_type_category
        : typeof formData.project_type_category === 'string' && formData.project_type_category
        ? formData.project_type_category.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      if (projCats.length === 0) {
        focusAndSetError('project_type_category', 'กรุณาเลือกประเภทโครงการพัฒนาวิชาการอย่างน้อย 1 ประเภท', '#field-academic-project-types');
        return;
      }

      // Conditional Integration Date check
      const hasIntegration = Boolean(
        (Array.isArray(formData.research_projects) && formData.research_projects.length > 0) ||
        (formData.patent_integration && String(formData.patent_integration).trim()) ||
        formData.has_integration
      );
      if (hasIntegration) {
        if (!formData.integration_start_date) {
          focusAndSetError('integration_start_date', 'กรุณาระบุวันที่เริ่มต้นนำไปบูรณาการ', '#field-academic-integration_start_date');
          return;
        }
        if (!formData.integration_end_date) {
          focusAndSetError('integration_end_date', 'กรุณาระบุวันที่สิ้นสุดนำไปบูรณาการ', '#field-academic-integration_end_date');
          return;
        }
      }

      if (
        formData.integration_start_date &&
        formData.integration_end_date &&
        formData.integration_end_date < formData.integration_start_date
      ) {
        focusAndSetError('integration_end_date', '"วันที่สิ้นสุดนำไปบูรณาการ" ต้องไม่เกิดขึ้นก่อน "วันที่เริ่มต้นนำไปบูรณาการ"', '#field-academic-integration_end_date');
        return;
      }
    } else if (config.key === 'research') {
      if (!formData.id || !String(formData.id).trim()) {
        focusAndSetError('id', 'กรุณากรอก "รหัสโครงการวิจัย"', '#field-id');
        return;
      }
      const fy = formData.fiscal_year_be ?? formData.fiscal_year;
      if (fy === undefined || fy === null || String(fy).trim() === '') {
        focusAndSetError('fiscal_year_be', 'กรุณาระบุ "ปีงบประมาณ (พ.ศ.)"', '#field-fiscal_year_be');
        return;
      }
      if (!formData.name || !String(formData.name).trim()) {
        focusAndSetError('name', 'กรุณากรอก "ชื่อโครงการวิจัย (ภาษาไทย)"', '#field-name');
        return;
      }
      if (!formData.fund_source || !String(formData.fund_source).trim()) {
        focusAndSetError('fund_source', 'กรุณากรอกหรือเลือก "แหล่งทุนวิจัย"', '#field-fund_source');
        return;
      }
      if (!formData.fund_type || !String(formData.fund_type).trim()) {
        focusAndSetError('fund_type', 'กรุณาเลือกประเภททุนวิจัย (ทุนภายใน หรือ ทุนภายนอก)', '#field-fund_type');
        return;
      }
      if (!formData.start_date) {
        focusAndSetError('duration', 'กรุณาระบุเดือน/ปี เริ่มต้นโครงการวิจัย', '#field-duration');
        return;
      }
      if (!formData.end_date) {
        focusAndSetError('duration', 'กรุณาระบุเดือน/ปี สิ้นสุดโครงการวิจัย', '#field-duration');
        return;
      }
      if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
        focusAndSetError('duration', '"เดือน/ปี สิ้นสุด" ต้องไม่เกิดขึ้นก่อน "เดือน/ปี เริ่มต้น"', '#field-duration');
        return;
      }
      if (!formData.head || !String(formData.head).trim()) {
        focusAndSetError('head', 'กรุณากรอก "หัวหน้าโครงการวิจัย"', '#field-head');
        return;
      }
      if (!formData.department || !String(formData.department).trim()) {
        focusAndSetError('department', 'กรุณาระบุ "สังกัดที่รับผิดชอบ"', '#field-department');
        return;
      }
      const pNature = Array.isArray(formData.project_nature)
        ? formData.project_nature
        : typeof formData.project_nature === 'string' && formData.project_nature
        ? formData.project_nature.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      if (pNature.length === 0) {
        focusAndSetError('project_nature', 'กรุณาเลือกลักษณะโครงการวิจัยอย่างน้อย 1 ประเภท', '#field-project_nature');
        return;
      }
      if (formData.budget_internal === undefined || formData.budget_internal === null || String(formData.budget_internal).trim() === '') {
        focusAndSetError('budget_internal', 'กรุณาระบุงบประมาณภายใน (สามารถระบุเป็น 0 ได้)', '#field-budget_internal');
        return;
      }
      if (formData.budget_external === undefined || formData.budget_external === null || String(formData.budget_external).trim() === '') {
        focusAndSetError('budget_external', 'กรุณาระบุงบประมาณภายนอก (สามารถระบุเป็น 0 ได้)', '#field-budget_external');
        return;
      }
      const bInt = Number(formData.budget_internal) || 0;
      const bExt = Number(formData.budget_external) || 0;
      const bTot = bInt + bExt;
      if (bTot <= 0) {
        focusAndSetError('budget', 'งบประมาณรวมต้องมากกว่า 0 บาท', '#field-budget');
        return;
      }
    } else if (config.key === 'service') {
      const topicName = formData.name || formData.topic_title;
      if (!topicName || !String(topicName).trim()) {
        focusAndSetError('name', 'กรุณากรอก "เรื่อง / ชื่องานบริการวิชาการ"', '#field-name');
        return;
      }
      if (!formData.target_group || !String(formData.target_group).trim()) {
        focusAndSetError('target_group', 'กรุณากรอก "กลุ่มเป้าหมาย / ผู้เข้าร่วม"', '#field-target_group');
        return;
      }
      const sType = formData.service_type || formData.service_category;
      if (!sType || !String(sType).trim()) {
        focusAndSetError('service_type', 'กรุณาเลือก "ประเภทงานบริการวิชาการ" (1 ใน 6 ประเภท)', '#field-service_type');
        return;
      }
      const personName = formData.person;
      if (!personName || !String(personName).trim()) {
        focusAndSetError('person', 'กรุณากรอก "ชื่อ - นามสกุล" ผู้ให้บริการ / ผู้รับผิดชอบ', '#field-person');
        return;
      }
      if (!formData.department || !String(formData.department).trim()) {
        focusAndSetError('department', 'กรุณาระบุ "สังกัด"', '#field-department');
        return;
      }
      if (!formData.start_date) {
        focusAndSetError('duration', 'กรุณาระบุวันที่เริ่มต้นจัดกิจกรรม', '#field-duration');
        return;
      }
      if (!formData.end_date) {
        focusAndSetError('duration', 'กรุณาระบุวันที่สิ้นสุดจัดกิจกรรม', '#field-duration');
        return;
      }
      if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
        focusAndSetError('duration', '"วันที่สิ้นสุด" ต้องไม่เกิดขึ้นก่อน "วันที่เริ่มต้น"', '#field-duration');
        return;
      }
      const hours = Number(formData.hours_spent);
      if (formData.hours_spent === undefined || formData.hours_spent === null || String(formData.hours_spent).trim() === '' || isNaN(hours) || hours <= 0) {
        focusAndSetError('hours_spent', 'กรุณาระบุจำนวนชั่วโมงเป็นตัวเลขที่มากกว่า 0', '#field-hours_spent');
        return;
      }
      const attendees = Number(formData.attendees_count);
      if (formData.attendees_count === undefined || formData.attendees_count === null || String(formData.attendees_count).trim() === '' || isNaN(attendees) || attendees <= 0) {
        focusAndSetError('attendees_count', 'กรุณาระบุจำนวนคนเข้าร่วมเป็นตัวเลขที่มากกว่า 0', '#field-attendees_count');
        return;
      }
    } else if (config.key === 'publications') {
      if (!formData.name || !String(formData.name).trim()) {
        focusAndSetError('name', 'กรุณากรอกชื่อผลงานทางวิชาการ', '#field-name');
        return;
      }
      if (!formData.type || !String(formData.type).trim()) {
        focusAndSetError('type', 'กรุณาเลือกชนิดของผลงาน', '#field-type');
        return;
      }
      if (!formData.level || !String(formData.level).trim()) {
        focusAndSetError('level', 'กรุณาเลือกระดับ', '#field-level');
        return;
      }
      if (formData.budget === undefined || formData.budget === null || String(formData.budget).trim() === '') {
        focusAndSetError('budget', 'กรุณาระบุจำนวนเงินสนับสนุน (สามารถระบุเป็น 0 ได้)', '#field-budget');
        return;
      }
      const numBudget = parseFloat(formData.budget);
      if (isNaN(numBudget) || numBudget < 0) {
        focusAndSetError('budget', 'จำนวนเงินสนับสนุนต้องเป็นตัวเลขที่ไม่ติดลบ', '#field-budget');
        return;
      }
      const my = formData.month_year || formData.month;
      if (!my || !String(my).trim()) {
        focusAndSetError('month_year', 'กรุณาระบุเดือน/ปี (พ.ศ.)', '#field-month_year');
        return;
      }
      if (!formData.owner || !String(formData.owner).trim()) {
        focusAndSetError('owner', 'กรุณาระบุเจ้าของผลงาน', '#field-owner');
        return;
      }
      if (!formData.department || !String(formData.department).trim()) {
        focusAndSetError('department', 'กรุณาระบุสังกัด', '#field-department');
        return;
      }

      // Co-authors flags (domestic/foreign)
      const hasForeign = Boolean(
        formData.has_foreign_coauthor ??
        formData.has_international_coauthor ??
        (Array.isArray(formData.co_authors_foreign) && formData.co_authors_foreign.length > 0)
      );
      const hasDomestic = Boolean(
        formData.has_domestic_coauthor ??
        (Array.isArray(formData.co_authors_domestic) && formData.co_authors_domestic.length > 0)
      );
      if (!hasForeign && !hasDomestic) {
        focusAndSetError('co_authors', 'กรุณาระบุข้อมูลผู้แต่งร่วม (มีผู้ร่วมต่างชาติ หรือ มีผู้ร่วมภายในประเทศ อย่างน้อย 1 รายการ)', '#field-co_authors');
        return;
      }

      if (formData.type !== 'เตรียมความพร้อมจดอนุสิทธิบัตร') {
        if (!formData.journal || !String(formData.journal).trim()) {
          focusAndSetError('journal', 'กรุณากรอกรายละเอียดวารสาร/การประชุม', '#field-journal');
          return;
        }
        if (!formData.volume || !String(formData.volume).trim()) {
          focusAndSetError('volume', 'กรุณาระบุ Volume (เล่มที่)', '#field-volume');
          return;
        }
        if (!formData.issue || !String(formData.issue).trim()) {
          focusAndSetError('issue', 'กรุณาระบุ Issue (ฉบับที่)', '#field-issue');
          return;
        }
        const pStart = String(formData.page_start || '').trim();
        const pEnd = String(formData.page_end || '').trim();
        if (!pStart) {
          focusAndSetError('page_start', 'กรุณาระบุหน้าเริ่มต้น (Page start)', '#field-page_start');
          return;
        }
        if (!pEnd) {
          focusAndSetError('page_end', 'กรุณาระบุหน้าสิ้นสุด (Page end)', '#field-page_end');
          return;
        }
        const numStart = parseInt(pStart, 10);
        const numEnd = parseInt(pEnd, 10);
        if (isNaN(numStart) || isNaN(numEnd) || numEnd < numStart) {
          focusAndSetError('page_end', 'หน้าสิ้นสุด (Page end) ต้องมากกว่าหรือเท่ากับหน้าเริ่มต้น (Page start)', '#field-page_end');
          return;
        }
      }
    } else if (config.key === 'personnel') {
      if (!formData.first_name || !String(formData.first_name).trim()) {
        focusAndSetError('first_name', 'กรุณากรอก "ชื่อ"');
        return;
      }
      if (!formData.last_name || !String(formData.last_name).trim()) {
        focusAndSetError('last_name', 'กรุณากรอก "นามสกุล"');
        return;
      }
      if (!formData.department || !String(formData.department).trim()) {
        focusAndSetError('department', 'กรุณาระบุ "สังกัด"');
        return;
      }
    } else if (config.key === 'ip') {
      const title = formData.title || formData.name;
      if (!title || !String(title).trim()) {
        focusAndSetError('title', 'กรุณากรอก "ชื่อเรื่อง / ชื่อผลงาน"', '#field-title');
        return;
      }
      const type = formData.type;
      if (!type || !String(type).trim()) {
        focusAndSetError('type', 'กรุณาเลือก "ประเภททรัพย์สินทางปัญญา" (อนุสิทธิบัตร, สิทธิบัตร หรือ ลิขสิทธิ์)', '#field-type');
        return;
      }
      const inventors = formData.inventors;
      const creator = formData.creator;
      const hasInventors = (Array.isArray(inventors) && inventors.length > 0) || (creator && String(creator).trim());
      if (!hasInventors) {
        focusAndSetError('inventors', type === 'ลิขสิทธิ์' ? 'กรุณาระบุ "ผู้สร้างสรรค์" อย่างน้อย 1 ท่าน' : 'กรุณาระบุ "ผู้สร้างผลงาน" อย่างน้อย 1 ท่าน', '#field-inventors');
        return;
      }
      if (type === 'ลิขสิทธิ์') {
        if (!formData.work_category || !String(formData.work_category).trim()) {
          focusAndSetError('work_category', 'กรุณาเลือก "ประเภทงาน" สำหรับลิขสิทธิ์', '#field-work_category');
          return;
        }
        if (formData.application_number && !/^\d{1,10}$/.test(String(formData.application_number))) {
          focusAndSetError('application_number', '"คำขอแจ้งข้อมูลเลขที่" ต้องเป็นตัวเลข 1-10 หลัก', '#field-application_number');
          return;
        }
      } else {
        if (formData.application_number && String(formData.application_number).length !== 10) {
          focusAndSetError('application_number', '"เลขที่คำขอ" ต้องมี 10 หลัก', '#field-application_number');
          return;
        }
      }

      // Petty patent number required
      const regNo = formData.registration_number || formData.reg_no || formData.reg_info;
      if (type === 'อนุสิทธิบัตร') {
        if (!regNo || !String(regNo).trim()) {
          focusAndSetError('registration_number', 'กรุณาระบุ "เลขที่อนุสิทธิบัตร"', '#field-registration_number');
          return;
        }
      }

      // Issue date (start of protection) required
      if (!formData.protection_start || !String(formData.protection_start).trim()) {
        focusAndSetError('protection_start', type === 'ลิขสิทธิ์' ? 'กรุณาระบุ "วันที่ออกหนังสือรับรอง"' : 'กรุณาระบุ "วันที่ออกให้ (เริ่มต้นความคุ้มครอง)"', '#field-protection_start');
        return;
      }

      // Expiry date (end of protection) required for patents / petty patents, and must be >= protection_start
      if (type !== 'ลิขสิทธิ์') {
        if (!formData.protection_end || !String(formData.protection_end).trim()) {
          focusAndSetError('protection_end', 'กรุณาระบุ "วันหมดอายุ (ระยะเวลาคุ้มครองสิ้นสุด)"', '#field-protection_end');
          return;
        }
        if (formData.protection_start && formData.protection_end && formData.protection_end < formData.protection_start) {
          focusAndSetError('protection_end', '"วันหมดอายุ" ต้องไม่เกิดขึ้นก่อน "วันที่เริ่มต้นความคุ้มครอง"', '#field-protection_end');
          return;
        }
      }
    } else {
      // ตรวจสอบ required fields สำหรับตัวชี้วัด (KPI) และหมวดอื่นๆ
      for (const col of config.columns) {
        if (col.required) {
          const val = formData[col.key];
          if (val === undefined || val === null || String(val).trim() === '') {
            focusAndSetError(col.key, `กรุณากรอกข้อมูล "${col.label.replace('\n', ' ')}"`, `#field-${col.key}`);
            return;
          }
        }
      }
    }

    let finalData = { ...formData };
    if (config.key === 'personnel') {
      const prefix = (finalData.title_th || '').trim();
      const first = (finalData.first_name || '').trim();
      const last = (finalData.last_name || '').trim();
      finalData.first_name = first;
      finalData.last_name = last;
      finalData.title_th = prefix;
      // Dual-write: also update the legacy full-name column with the result of formatPersonName(person) (prefix + first + space + last) so legacy readers never see empty data.
      // TODO: remove once legacy full-name column is dropped
      const legacyFullName = formatPersonName({
        title_th: prefix,
        first_name: first,
        last_name: last,
      });
      finalData.name = legacyFullName;
      finalData.name_th = legacyFullName;
    }

    onSave(finalData);
    onClose();
  };

  // กรองเฉพาะคอลัมน์ที่แก้ไขได้
  const editableCols = config.columns.filter((c) => c.editable !== false);

  return (
    <div
      onClick={handleBackdropClick}
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
        overflow: 'hidden',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth:
            config.key === 'academic' ||
            config.key === 'research' ||
            config.key === 'service' ||
            config.key === 'publications' ||
            config.key === 'personnel' ||
            config.key === 'ip'
              ? '880px'
              : '620px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#00A651',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {getCategoryIcon(config.key)}
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                {isEdit ? `แก้ไขข้อมูล: ${config.title}` : `เพิ่มรายการใหม่: ${config.title}`}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#dcfce7' }}>
                {config.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              opacity: 0.9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body Form */}
        <form noValidate ref={formScrollRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>


            {config.key === 'academic' ? (
              <AcademicFormFields
                formData={formData}
                onChange={handleFieldChange}
                setFormData={setFormData}
                errors={fieldErrors}
              />
            ) : config.key === 'research' ? (
              <ResearchFormFields
                formData={formData}
                onChange={handleFieldChange}
                setFormData={setFormData}
                isEdit={isEdit}
                errors={fieldErrors}
              />
            ) : config.key === 'service' ? (
              <ServiceFormFields
                formData={formData}
                onChange={handleFieldChange}
                setFormData={setFormData}
                isEdit={isEdit}
                errors={fieldErrors}
              />
            ) : config.key === 'publications' ? (
              <PublicationFormFields
                formData={formData}
                onChange={handleFieldChange}
                setFormData={setFormData}
                isEdit={isEdit}
                errors={fieldErrors}
              />
            ) : config.key === 'personnel' ? (
              <PersonnelForm
                formData={formData}
                onChange={handleFieldChange}
                setFormData={setFormData}
                isEdit={isEdit}
                errors={fieldErrors}
              />
            ) : config.key === 'ip' ? (
              <IpFormFields
                formData={formData}
                onChange={handleFieldChange}
                setFormData={setFormData}
                isEdit={isEdit}
                errors={fieldErrors}
              />
            ) : (
              editableCols.map((col) => {
              const val = formData[col.key] !== undefined ? formData[col.key] : '';

              return (
                <div key={col.key} id={`field-${col.key}`} data-field={col.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                    {col.key === 'image_url' ? 'รูปภาพประจำตัว' : col.label.replace('\n', ' ')}
                    {col.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                  </label>

                  <div className="relative">
                  {/* Field Renderer based on schema */}
                  {col.type === 'avatar' ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {/* Avatar circular preview */}
                        <div
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            backgroundColor: '#f1f5f9',
                            flexShrink: 0,
                            border: '2px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                          }}
                        >
                          {val ? (
                            <img
                              src={val}
                              alt="Preview"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <FaUserTie style={{ color: '#94a3b8', fontSize: '26px' }} />
                          )}
                        </div>

                        {/* File Upload and Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <label
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                backgroundColor: '#00A651',
                                color: '#ffffff',
                                border: 'none',
                                fontSize: '12.5px',
                                fontWeight: 500,
                                cursor: 'pointer',
                              }}
                            >
                              <FaUpload style={{ fontSize: '11px' }} />
                              <span>เลือกรูปภาพจากเครื่อง</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (uploadEvt) => {
                                      const res = uploadEvt.target?.result as string;
                                      handleFieldChange(col.key, res);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>

                            {val && (
                              <button
                                type="button"
                                onClick={() => handleFieldChange(col.key, '')}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: '#ffffff',
                                  color: '#dc2626',
                                  border: '1px solid #fecaca',
                                  fontSize: '12.5px',
                                  cursor: 'pointer',
                                }}
                              >
                                <FaTrashAlt style={{ fontSize: '11px' }} />
                                <span>ลบรูป</span>
                              </button>
                            )}
                          </div>
                          <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                            รองรับไฟล์ภาพ .jpg, .png จากเครื่อง หรือพิมพ์ Path / URL ในช่องด้านล่าง
                          </span>
                        </div>
                      </div>

                      {/* Direct URL / Path input */}
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleFieldChange(col.key, e.target.value)}
                        placeholder={col.placeholder || '/profile_images/... หรือ https://...'}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          outline: 'none',
                          fontFamily: 'inherit',
                          backgroundColor: '#ffffff',
                        }}
                      />
                    </div>
                  ) : col.autocomplete === 'personnel' || col.key === 'creator' ? (
                    <PersonPicker
                      value={val ? {
                        person_id: formData.person_id || null,
                        name: String(val),
                        department: formData.department,
                      } : null}
                      onChange={(person: PersonPickerValue | null) => {
                        if (person) {
                          handleFieldChange(col.key, person.name);
                          handleFieldChange('person_id', person.person_id ?? null);
                          if (person.department && (!formData.department || formData.department === '-')) {
                            handleFieldChange('department', person.department);
                          }
                        } else {
                          handleFieldChange(col.key, '');
                          handleFieldChange('person_id', null);
                        }
                      }}
                      placeholder="ค้นหาหรือระบุชื่อบุคคล..."
                    />
                  ) : col.key === 'department' || col.autocomplete === 'department' ? (
                    <DepartmentSelect
                      value={val ?? ''}
                      onChange={(newVal) => handleFieldChange(col.key, newVal)}
                      placeholder={col.placeholder || '-- เลือกสังกัด --'}
                      className="w-full"
                    />
                  ) : col.selectOptions ? (
                    <Select value={val ?? ''} onValueChange={(newVal) => handleFieldChange(col.key, newVal ?? '')}>
                      <SelectTrigger className="w-full bg-white text-slate-800 h-10 text-sm">
                        <SelectValue placeholder="-- กรุณาเลือก --" />
                      </SelectTrigger>
                      <SelectContent>
                        {col.selectOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : col.type === 'currency' ? (
                    <MoneyInput
                      value={val !== undefined && val !== '' ? Number(val) : null}
                      onChange={(num) => handleFieldChange(col.key, num ?? 0)}
                      placeholder={col.placeholder || '0.00'}
                    />
                  ) : col.type === 'number' ? (
                    <input
                      type="number"
                      step="any"
                      value={val}
                      onChange={(e) => handleFieldChange(col.key, parseFloat(e.target.value) || 0)}
                      placeholder={col.placeholder || '0'}
                      required={col.required}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  ) : col.type === 'date' ? (() => {
                    let minDate: string | undefined;
                    let maxDate: string | undefined;

                    if (col.key === 'start_date' || col.key === 'startDate') {
                      maxDate = formData.end_date || formData.endDate || undefined;
                    } else if (col.key === 'end_date' || col.key === 'endDate') {
                      minDate = formData.start_date || formData.startDate || undefined;
                    } else if (col.key === 'protection_start') {
                      maxDate = formData.protection_end || undefined;
                    } else if (col.key === 'protection_end') {
                      minDate = formData.protection_start || undefined;
                    } else if (col.key === 'integration_start_date') {
                      maxDate = formData.integration_end_date || undefined;
                    } else if (col.key === 'integration_end_date') {
                      minDate = formData.integration_start_date || undefined;
                    }

                    return (
                      <DatePicker
                        value={val || ''}
                        minDate={minDate}
                        maxDate={maxDate}
                        onChange={(_, dateStr) => {
                          handleFieldChange(col.key, dateStr);
                          if (dateStr) {
                            if ((col.key === 'start_date' || col.key === 'startDate') && maxDate && dateStr > maxDate) {
                              handleFieldChange(col.key === 'start_date' ? 'end_date' : 'endDate', '');
                            } else if ((col.key === 'end_date' || col.key === 'endDate') && minDate && dateStr < minDate) {
                              handleFieldChange(col.key === 'end_date' ? 'start_date' : 'startDate', '');
                            } else if (col.key === 'protection_start' && maxDate && dateStr > maxDate) {
                              handleFieldChange('protection_end', '');
                            } else if (col.key === 'protection_end' && minDate && dateStr < minDate) {
                              handleFieldChange('protection_start', '');
                            } else if (col.key === 'integration_start_date' && maxDate && dateStr > maxDate) {
                              handleFieldChange('integration_end_date', '');
                            } else if (col.key === 'integration_end_date' && minDate && dateStr < minDate) {
                              handleFieldChange('integration_start_date', '');
                            }
                          }
                        }}
                        placeholder="วัน/เดือน/ปี (พ.ศ.)"
                        className="w-full"
                      />
                    );
                  })() : col.type === 'members' ? (
                    <MultiMemberSelector
                      members={
                        Array.isArray(val)
                          ? val
                          : [
                              {
                                name: formData.head || formData.person || formData.owner || 'หัวหน้าโครงการ',
                                role: 'PI',
                                affiliation_type: 'eng_kps',
                                organization: 'คณะวิศวกรรมศาสตร์ กำแพงแสน',
                                contribution_percent: 100,
                              },
                            ]
                      }
                      onChange={(mems) => handleFieldChange(col.key, mems)}
                    />
                  ) : col.type === 'status' ? (
                    <Select value={val || 'active'} onValueChange={(newVal) => handleFieldChange(col.key, newVal ?? 'active')}>
                      <SelectTrigger className="w-full bg-white text-slate-800 h-10 text-sm">
                        <SelectValue placeholder="เลือกสถานะ" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([k, info]) => (
                          <SelectItem key={k} value={k}>
                            {info.labelTh}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleFieldChange(col.key, e.target.value)}
                      placeholder={col.placeholder}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: fieldErrors[col.key] ? '1.5px solid #f43f5e' : '1px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  )}

                  {fieldErrors[col.key] && (
                    <div className="absolute top-[calc(100%+6px)] left-0 z-40 pointer-events-none animate-in fade-in-50 zoom-in-95 duration-150">
                      <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-rose-300 shadow-xl shadow-rose-950/10 text-xs font-medium text-slate-800 pointer-events-auto whitespace-nowrap">
                        <span className="absolute -top-1.5 left-4 size-2.5 bg-white border-t border-l border-rose-300 rotate-45 transform" />
                        <div className="size-4 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                          !
                        </div>
                        <span className="text-rose-700 font-normal">{fieldErrors[col.key]}</span>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              );
            }))}
          </div>

          {/* Modal Footer */}
          <div
            style={{
              padding: '16px 24px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <button
              type="button"
              onClick={onClose}
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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#94a3b8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                gap: '8px',
                padding: '9px 22px',
                borderRadius: '8px',
                border: '1px solid #00A651',
                backgroundColor: '#00A651',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.75 : 1,
                boxShadow: '0 2px 6px rgba(0, 166, 81, 0.25)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                if (isSubmitting) return;
                e.currentTarget.style.backgroundColor = '#0f172a';
                e.currentTarget.style.borderColor = '#0f172a';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(15, 23, 42, 0.35)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                if (isSubmitting) return;
                e.currentTarget.style.backgroundColor = '#00A651';
                e.currentTarget.style.borderColor = '#00A651';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 166, 81, 0.25)';
              }}
            >
              {isSubmitting ? (
                <Spinner size="sm" />
              ) : (
                <FaSave style={{ fontSize: '14px', flexShrink: 0, color: 'currentColor' }} />
              )}
              <span>{isSubmitting ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'บันทึกรายการใหม่'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal when clicking outside / backdrop */}
      <ConfirmActionModal
        isOpen={showDiscardConfirm}
        title="ต้องการปิดโดยไม่บันทึกหรือไม่"
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        type="danger"
        compact={true}
        onConfirm={() => {
          setShowDiscardConfirm(false);
          onClose();
        }}
        onCancel={() => {
          setShowDiscardConfirm(false);
        }}
      />
    </div>
  );
};
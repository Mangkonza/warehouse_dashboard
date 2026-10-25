'use client';

import React, { useState, useEffect } from 'react';
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
} from 'react-icons/fa';
import { MultiMemberSelector } from './MultiMemberSelector';
import { SDGTagSelector } from './SDGTagSelector';
import { JournalQuartileSelector } from './JournalQuartileSelector';
import { STATUS_LABELS } from '@/lib/projectMonitoringEngine';
import { AcademicProjectForm } from './AcademicProjectForm';
import { ResearchProjectForm } from '@/components/form/ResearchProjectForm';
import { AcademicServiceForm } from '@/components/form/AcademicServiceForm';
import { PublicationForm } from '@/components/form/PublicationForm';
import { PersonnelForm } from '@/components/form/PersonnelForm';
import { IntellectualPropertyForm } from '@/components/form/IntellectualPropertyForm';
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
import { DepartmentSelect } from '@/components/ui';
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

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
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
  }, [initialData, config, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (key: string, val: any) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (config.key === 'academic') {
      if (!formData.name || !String(formData.name).trim()) {
        setErrorMsg('กรุณากรอก "ชื่อโครงการพัฒนาวิชาการ"');
        return;
      }
      if (!formData.head || !String(formData.head).trim()) {
        setErrorMsg('กรุณากรอก "หัวหน้าโครงการ"');
        return;
      }
      if (!formData.start_date) {
        setErrorMsg('กรุณาระบุ "วันที่เริ่มต้นดำเนินการ"');
        return;
      }
      if (!formData.end_date) {
        setErrorMsg('กรุณาระบุ "วันที่สิ้นสุดดำเนินการ"');
        return;
      }
      if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
        setErrorMsg('"วันที่สิ้นสุดดำเนินการ" ต้องไม่เกิดขึ้นก่อน "วันที่เริ่มต้นดำเนินการ"');
        return;
      }
      if (
        formData.integration_start_date &&
        formData.integration_end_date &&
        formData.integration_end_date < formData.integration_start_date
      ) {
        setErrorMsg('"วันที่สิ้นสุดนำไปบูรณาการ" ต้องไม่เกิดขึ้นก่อน "วันที่เริ่มต้นนำไปบูรณาการ"');
        return;
      }
    } else if (config.key === 'research') {
      if (!formData.id || !String(formData.id).trim()) {
        setErrorMsg('กรุณากรอก "รหัสโครงการวิจัย"');
        return;
      }
      if (!formData.name || !String(formData.name).trim()) {
        setErrorMsg('กรุณากรอก "ชื่อโครงการวิจัย (ภาษาไทย)"');
        return;
      }
      if (!formData.head || !String(formData.head).trim()) {
        setErrorMsg('กรุณากรอก "หัวหน้าโครงการวิจัย"');
        return;
      }
      if (!formData.department || !String(formData.department).trim()) {
        setErrorMsg('กรุณาระบุ "สังกัดที่รับผิดชอบ"');
        return;
      }
      if (!formData.fund_source || !String(formData.fund_source).trim()) {
        setErrorMsg('กรุณากรอกหรือเลือก "แหล่งทุนวิจัย"');
        return;
      }
      if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
        setErrorMsg('"เดือน/ปี สิ้นสุด" ต้องไม่เกิดขึ้นก่อน "เดือน/ปี เริ่มต้น"');
        return;
      }
    } else if (config.key === 'service') {
      const topicName = formData.name || formData.topic_title;
      if (!topicName || !String(topicName).trim()) {
        setErrorMsg('กรุณากรอก "เรื่อง / ชื่องานบริการวิชาการ"');
        return;
      }
      const sType = formData.service_type || formData.service_category;
      if (!sType || !String(sType).trim()) {
        setErrorMsg('กรุณาเลือก "ประเภทงานบริการวิชาการ" (1 ใน 6 ประเภท)');
        return;
      }
      const personName = formData.person;
      if (!personName || !String(personName).trim()) {
        setErrorMsg('กรุณากรอก "ชื่อ - นามสกุล" ผู้ให้บริการ / ผู้รับผิดชอบ');
        return;
      }
      if (!formData.department || !String(formData.department).trim()) {
        setErrorMsg('กรุณาระบุ "สังกัดภาควิชา / ศูนย์"');
        return;
      }
      if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
        setErrorMsg('"วันที่สิ้นสุด" ต้องไม่เกิดขึ้นก่อน "วันที่เริ่มต้น"');
        return;
      }
    } else if (config.key === 'publications') {
      if (!formData.name || !String(formData.name).trim()) {
        setErrorMsg('กรุณากรอกชื่อผลงานทางวิชาการ');
        return;
      }
      if (!formData.type || !String(formData.type).trim()) {
        setErrorMsg('กรุณาเลือกชนิดของผลงาน');
        return;
      }
      if (!formData.level || !String(formData.level).trim()) {
        setErrorMsg('กรุณาเลือกระดับ');
        return;
      }
      if (!formData.owner || !String(formData.owner).trim()) {
        setErrorMsg('กรุณาระบุเจ้าของผลงาน');
        return;
      }
      if (!formData.department || !String(formData.department).trim()) {
        setErrorMsg('กรุณาระบุสังกัด');
        return;
      }
      if (formData.budget !== undefined && formData.budget !== null && formData.budget !== '') {
        const num = parseFloat(formData.budget);
        if (isNaN(num) || num < 0) {
          setErrorMsg('จำนวนเงินสนับสนุนต้องเป็นตัวเลขที่ไม่ติดลบ');
          return;
        }
      }
      if (formData.type !== 'เตรียมความพร้อมจดอนุสิทธิบัตร') {
        const pStart = String(formData.page_start || '').trim();
        const pEnd = String(formData.page_end || '').trim();
        if (pStart && pEnd) {
          const numStart = parseInt(pStart, 10);
          const numEnd = parseInt(pEnd, 10);
          if (!isNaN(numStart) && !isNaN(numEnd) && numEnd < numStart) {
            setErrorMsg('หน้าสิ้นสุดต้องมากกว่าหรือเท่ากับหน้าเริ่มต้น');
            return;
          }
        }
      }
    } else if (config.key === 'personnel') {
      if (!formData.name || !String(formData.name).trim()) {
        setErrorMsg('กรุณากรอก "ชื่อ-นามสกุล"');
        return;
      }
      if (!formData.department || !String(formData.department).trim()) {
        setErrorMsg('กรุณาระบุ "สังกัด"');
        return;
      }
    } else if (config.key === 'ip') {
      const title = formData.title || formData.name;
      if (!title || !String(title).trim()) {
        setErrorMsg('กรุณากรอก "ชื่อเรื่อง / ชื่อผลงาน"');
        return;
      }
      const type = formData.type;
      if (!type || !String(type).trim()) {
        setErrorMsg('กรุณาเลือก "ประเภททรัพย์สินทางปัญญา" (อนุสิทธิบัตร, สิทธิบัตร หรือ ลิขสิทธิ์)');
        return;
      }
      const inventors = formData.inventors;
      const creator = formData.creator;
      const hasInventors = (Array.isArray(inventors) && inventors.length > 0) || (creator && String(creator).trim());
      if (!hasInventors) {
        setErrorMsg(type === 'ลิขสิทธิ์' ? 'กรุณาระบุ "ผู้สร้างสรรค์" อย่างน้อย 1 ท่าน' : 'กรุณาระบุ "ผู้ประดิษฐ์" อย่างน้อย 1 ท่าน');
        return;
      }
      if (type === 'ลิขสิทธิ์') {
        if (!formData.work_category || !String(formData.work_category).trim()) {
          setErrorMsg('กรุณาเลือก "ประเภทงาน" สำหรับลิขสิทธิ์');
          return;
        }
        if (formData.application_number && !/^\d{1,10}$/.test(String(formData.application_number))) {
          setErrorMsg('"คำขอแจ้งข้อมูลเลขที่" ต้องเป็นตัวเลข 1-10 หลัก');
          return;
        }
      } else {
        if (formData.application_number && String(formData.application_number).length !== 10) {
          setErrorMsg('"เลขที่คำขอ" ต้องมี 10 หลัก');
          return;
        }
      }
      if (formData.protection_start && formData.protection_end && formData.protection_end < formData.protection_start) {
        setErrorMsg('"วันที่สิ้นสุด" ต้องไม่เกิดขึ้นก่อน "วันที่เริ่มต้น"');
        return;
      }
    } else {
      // ตรวจสอบ required fields
      for (const col of config.columns) {
        if (col.required) {
          const val = formData[col.key];
          if (!val || String(val).trim() === '') {
            setErrorMsg(`กรุณากรอกข้อมูล "${col.label}"`);
            return;
          }
        }
      }
    }

    onSave(formData);
    onClose();
  };

  // กรองเฉพาะคอลัมน์ที่แก้ไขได้
  const editableCols = config.columns.filter((c) => c.editable !== false);

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
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px',
              opacity: 0.8,
            }}
          >
            &times;
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {errorMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <FaExclamationCircle />
                <span>{errorMsg}</span>
              </div>
            )}

            {config.key === 'academic' ? (
              <AcademicProjectForm
                formData={formData}
                onChange={handleFieldChange}
                setFormData={setFormData}
              />
            ) : config.key === 'research' ? (
              <ResearchProjectForm
                formData={formData}
                onChange={handleFieldChange}
                setFormData={setFormData}
                isEdit={isEdit}
              />
            ) : config.key === 'service' ? (
              <AcademicServiceForm
                formData={formData}
                onChange={handleFieldChange}
                setFormData={setFormData}
                isEdit={isEdit}
              />
            ) : config.key === 'publications' ? (
              <PublicationForm
                formData={formData}
                onChange={handleFieldChange}
                setFormData={setFormData}
                isEdit={isEdit}
              />
            ) : config.key === 'personnel' ? (
              <PersonnelForm
                formData={formData}
                onChange={handleFieldChange}
                setFormData={setFormData}
                isEdit={isEdit}
              />
            ) : config.key === 'ip' ? (
              <IntellectualPropertyForm
                formData={formData}
                onChange={handleFieldChange}
                setFormData={setFormData}
                isEdit={isEdit}
              />
            ) : (
              editableCols.map((col) => {
              const val = formData[col.key] !== undefined ? formData[col.key] : '';

              return (
                <div key={col.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                    {col.key === 'image_url' ? 'รูปภาพประจำตัว' : col.label.replace('\n', ' ')}
                    {col.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                  </label>

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
                  ) : col.type === 'date' ? (
                    <DatePicker
                      value={val || ''}
                      onChange={(_, dateStr) => handleFieldChange(col.key, dateStr)}
                      placeholder="วว/ดด/ปปปป (พ.ศ.)"
                      className="w-full"
                    />

                  ) : col.type === 'members' ? (
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
                  )}
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
                e.currentTarget.style.transform = 'translateY(0)';
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
    </div>
  );
};
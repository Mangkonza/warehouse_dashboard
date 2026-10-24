'use client';

import * as React from 'react';
import { Search, UserPlus, X, ChevronDown, Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DepartmentBadge } from '@/components/ui/department-badge';
import { DepartmentSelect } from '@/components/ui/department-select';
import { PrefixCombobox, canonicalizePrefix } from './PrefixCombobox';
import { PersonAddConfirmModal } from './PersonAddConfirmModal';
import { searchPersonnel, normalizePersonName, matchPerson } from '@/lib/personnelService';
import { saveCategoryRecord } from '@/lib/dataService';
import { PersonnelRecord } from '@/types/dataManagement';

export interface PersonValue {
  person_id?: number | null;
  name: string;
  prefix?: string;
  clean_name?: string;
  department?: string;
  is_custom?: boolean;
}

export type PersonPickerValue = PersonValue;

export interface PersonPickerProps {
  value?: PersonValue | string | null;
  onChange?: (val: PersonValue | null) => void;
  multiple?: boolean;
  values?: (PersonValue | string)[];
  onChangeMultiple?: (vals: PersonValue[]) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  defaultDepartment?: string;
  required?: boolean;
}

function hasAffiliation(dept?: string | null): boolean {
  if (!dept) return false;
  const trimmed = dept.trim();
  return (
    trimmed !== '' &&
    trimmed !== '-' &&
    trimmed !== 'nan' &&
    trimmed !== 'NaT' &&
    trimmed !== 'ü' &&
    trimmed !== 'P'
  );
}

export function PersonPicker({
  value,
  onChange,
  multiple = false,
  values = [],
  onChangeMultiple,
  placeholder = 'ค้นหาชื่ออาจารย์ / บุคลากร...',
  disabled = false,
  readOnly = false,
  className,
  defaultDepartment = '',
}: PersonPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isAddingNew, setIsAddingNew] = React.useState(false);

  // Inline add state
  const [newPrefix, setNewPrefix] = React.useState('');
  const [newName, setNewName] = React.useState('');
  const [newDepartment, setNewDepartment] = React.useState(defaultDepartment);
  const [newError, setNewError] = React.useState('');

  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [pendingPersonData, setPendingPersonData] = React.useState<{
    fullName: string;
    cleanName: string;
    prefix: string;
    department: string;
  } | null>(null);
  const [isSubmittingPerson, setIsSubmittingPerson] = React.useState(false);

  // Toast feedback state
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync defaultDepartment if changed
  React.useEffect(() => {
    if (defaultDepartment && !newDepartment) {
      setNewDepartment(defaultDepartment);
    }
  }, [defaultDepartment, newDepartment]);

  // Parse single value
  const singleParsedValue: PersonValue | null = React.useMemo(() => {
    if (!value) return null;
    if (typeof value === 'object') {
      return value;
    }
    const str = String(value).trim();
    if (!str) return null;
    const matched = matchPerson(str);
    if (matched) {
      return {
        person_id: Number(matched.id),
        name: matched.name,
        prefix: matched.title_th,
        clean_name: matched.clean_name,
        department: matched.department,
        is_custom: false,
      };
    }
    return {
      person_id: null,
      name: str,
      clean_name: normalizePersonName(str),
      is_custom: true,
    };
  }, [value]);

  // Parse multiple values
  const multipleParsedValues: PersonValue[] = React.useMemo(() => {
    if (!multiple) return [];
    return values
      .map((v) => {
        if (!v) return null;
        if (typeof v === 'object') return v as PersonValue;
        const str = String(v).trim();
        if (!str) return null;
        const matched = matchPerson(str);
        if (matched) {
          return {
            person_id: Number(matched.id),
            name: matched.name,
            prefix: matched.title_th,
            clean_name: matched.clean_name,
            department: matched.department,
            is_custom: false,
          };
        }
        return {
          person_id: null,
          name: str,
          clean_name: normalizePersonName(str),
          is_custom: true,
        };
      })
      .filter(Boolean) as PersonValue[];
  }, [multiple, values]);

  // Search results
  const searchResults = React.useMemo(() => {
    return searchPersonnel(searchTerm, 12);
  }, [searchTerm]);

  // Select existing person
  const handleSelectExisting = (person: PersonnelRecord) => {
    const selected: PersonValue = {
      person_id: Number(person.id),
      name: person.name,
      prefix: person.title_th,
      clean_name: person.clean_name || normalizePersonName(person.name),
      department: person.department,
      is_custom: false,
    };

    if (multiple) {
      const exists = multipleParsedValues.some(
        (v) => (v.person_id && v.person_id === selected.person_id) || v.name === selected.name
      );
      if (!exists && onChangeMultiple) {
        onChangeMultiple([...multipleParsedValues, selected]);
      }
    } else {
      if (onChange) onChange(selected);
      setOpen(false);
    }

    setSearchTerm('');
    setIsAddingNew(false);
  };

  // Trigger inline add submission -> opens confirmation modal
  const handleStartAddNew = () => {
    setNewError('');
    const rawClean = newName.trim();
    if (!rawClean) {
      setNewError('กรุณากรอกชื่อ-นามสกุล');
      return;
    }
    if (!newDepartment.trim()) {
      setNewError('กรุณาระบุสังกัด');
      return;
    }

    const normPrefix = canonicalizePrefix(newPrefix);
    const normName = normalizePersonName(rawClean);
    const fullDisplayName = normPrefix ? `${normPrefix} ${normName}` : normName;

    // If person already exists in personnel, select directly
    const matched = matchPerson(fullDisplayName) || matchPerson(normName);
    if (matched) {
      handleSelectExisting(matched);
      setNewName('');
      setIsAddingNew(false);
      return;
    }

    setPendingPersonData({
      fullName: fullDisplayName,
      cleanName: normName,
      prefix: normPrefix,
      department: newDepartment,
    });

    // Close panel so it stays closed behind modal
    setOpen(false);
    setConfirmModalOpen(true);
  };

  // Cancel modal -> return to inline form with entered values kept
  const handleCancelModal = () => {
    setConfirmModalOpen(false);
    setOpen(true);
    setIsAddingNew(true);
  };

  // Option 1: Add to personnel through API
  const handleConfirmAddAndLink = async () => {
    if (!pendingPersonData) return;
    setIsSubmittingPerson(true);

    try {
      const newPersonPayload = {
        title_th: pendingPersonData.prefix,
        name: pendingPersonData.fullName,
        clean_name: pendingPersonData.cleanName,
        department: pendingPersonData.department,
        position: '',
        email: '',
        image_url: '',
      };

      const res = await saveCategoryRecord('personnel', newPersonPayload, true);
      if (!res.success) {
        showToast(res.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลบุคลากร', 'error');
        return; // Failure toast keeps modal open
      }

      const savedRecord = res.data;
      const newId = savedRecord?.id ? Number(savedRecord.id) : Date.now();

      const createdPerson: PersonValue = {
        person_id: newId,
        name: pendingPersonData.fullName,
        prefix: pendingPersonData.prefix,
        clean_name: pendingPersonData.cleanName,
        department: pendingPersonData.department,
        is_custom: false,
      };

      if (multiple && onChangeMultiple) {
        onChangeMultiple([...multipleParsedValues, createdPerson]);
      } else if (onChange) {
        onChange(createdPerson);
      }

      showToast(`เพิ่มรายชื่อ "${pendingPersonData.fullName}" เข้าข้อมูลบุคลากรสำเร็จ`, 'success');

      setConfirmModalOpen(false);
      setOpen(false);
      setIsAddingNew(false);
      setNewName('');
      setNewPrefix('');
      setPendingPersonData(null);
    } catch (err: any) {
      console.error('Failed to create personnel:', err);
      showToast(err?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลบุคลากร', 'error');
      // Failure keeps modal open
    } finally {
      setIsSubmittingPerson(false);
    }
  };

  // Option 2: Keep as plain text
  const handleKeepPlainText = () => {
    if (!pendingPersonData) return;

    const plainTextPerson: PersonValue = {
      person_id: null,
      name: pendingPersonData.fullName,
      prefix: pendingPersonData.prefix,
      clean_name: pendingPersonData.cleanName,
      department: pendingPersonData.department,
      is_custom: true,
    };

    if (multiple && onChangeMultiple) {
      onChangeMultiple([...multipleParsedValues, plainTextPerson]);
    } else if (onChange) {
      onChange(plainTextPerson);
    }

    setConfirmModalOpen(false);
    setOpen(false);
    setIsAddingNew(false);
    setNewName('');
    setNewPrefix('');
    setPendingPersonData(null);
  };

  // Remove multiple item
  const handleRemoveMultiple = (index: number) => {
    if (!onChangeMultiple) return;
    const next = [...multipleParsedValues];
    next.splice(index, 1);
    onChangeMultiple(next);
  };

  // Clear single item
  const handleClearSingle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) onChange(null);
  };

  return (
    <div className={cn('relative w-full', className)}>
      {/* Toast Alert */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-[120] px-4 py-3 rounded-lg shadow-lg flex items-center gap-2.5 text-sm font-semibold transition-all',
            toast.type === 'success' ? 'bg-[#00A651] text-white' : 'bg-destructive text-destructive-foreground'
          )}
        >
          {toast.type === 'success' ? <Check className="size-4 shrink-0" /> : <AlertTriangle className="size-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Multiple Selection Mode - Multi-select Chips Display */}
      {multiple && multipleParsedValues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {multipleParsedValues.map((p, idx) => (
            <div
              key={`${p.person_id || p.name}_${idx}`}
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-normal border shadow-2xs transition-colors max-w-full',
                p.person_id
                  ? 'bg-emerald-50/80 text-emerald-950 border-emerald-200'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
              )}
            >
              <span className="truncate max-w-[240px] text-sm font-normal" title={p.name}>
                {p.name}
              </span>
              {!disabled && !readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemoveMultiple(idx)}
                  className="text-slate-400 hover:text-red-500 ml-0.5 cursor-pointer shrink-0"
                  title="ลบรายชื่อ"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Popover Selector Trigger */}
      <Popover open={confirmModalOpen || readOnly ? false : open} onOpenChange={(next) => {
        if (!disabled && !readOnly && !confirmModalOpen) setOpen(next);
      }}>
        <PopoverTrigger
          disabled={disabled || readOnly}
          render={
            <div
              role="button"
              tabIndex={disabled || readOnly ? -1 : 0}
              className={cn(
                'w-full justify-between font-normal bg-background border border-input rounded-lg px-3 text-sm min-h-[40px] h-10 flex items-center gap-2 shadow-2xs transition-all outline-none select-none',
                disabled
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                  : readOnly
                  ? 'bg-slate-50 text-slate-700 cursor-default border-slate-200'
                  : 'cursor-pointer hover:bg-accent/40 hover:border-slate-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
                open && !readOnly && !confirmModalOpen && 'border-ring ring-3 ring-ring/50'
              )}
            >
              {multiple ? (
                <span className="text-sm text-muted-foreground font-normal">
                  {readOnly ? '' : '+ คลิกเพื่อค้นหาหรือเพิ่มรายชื่อ...'}
                </span>
              ) : singleParsedValue ? (
                <div className="flex items-center min-w-0 flex-1">
                  <span className="font-normal text-slate-800 text-sm truncate min-w-0 flex-1" title={singleParsedValue.name}>
                    {singleParsedValue.name}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground font-normal">{placeholder}</span>
              )}

              <div className="flex items-center gap-1 shrink-0 ml-1">
                {!multiple && singleParsedValue && !disabled && !readOnly && (
                  <button
                    type="button"
                    onClick={handleClearSingle}
                    className="size-4 rounded flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                    title="ล้างข้อมูล"
                  >
                    <X className="size-4" />
                  </button>
                )}
                {!readOnly && <ChevronDown className="size-4 shrink-0 text-muted-foreground" />}
              </div>
            </div>
          }
        />

        {/* Dropdown Content */}
        <PopoverContent
          className="w-[360px] sm:w-[420px] p-0 shadow-xl border border-slate-200 rounded-xl overflow-hidden bg-white z-50 text-slate-900"
          align="start"
        >
          {/* Search bar & mode switch */}
          <div className="p-2.5 border-b border-slate-100 bg-slate-50/70 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-3 size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsAddingNew(false);
                }}
                placeholder="ค้นหาชื่อ, คำนำหน้า หรือสังกัด..."
                className="w-full h-10 pl-8 pr-3 text-sm font-normal rounded-lg border border-input bg-background outline-none transition-colors hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {isAddingNew ? 'ระบุรายชื่อใหม่ที่ไม่พบในระบบ' : 'รายชื่ออาจารย์และบุคลากร'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(!isAddingNew);
                  if (!isAddingNew && searchTerm.trim()) {
                    setNewName(normalizePersonName(searchTerm));
                  }
                }}
                className="text-xs font-semibold text-[#00A651] hover:text-[#008a43] flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="size-3.5" />
                <span>{isAddingNew ? 'กลับไปค้นหารายชื่อ' : '+ เพิ่มรายชื่อใหม่'}</span>
              </button>
            </div>
          </div>

          {/* Section: Inline Add New Name */}
          {isAddingNew ? (
            <div className="p-3.5 space-y-3 bg-emerald-50/30">
              {newError && (
                <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-2 rounded-md">
                  {newError}
                </div>
              )}

              {/* Row 1: คำนำหน้า (narrow fixed width) and ชื่อ-นามสกุล (remaining width, required) */}
              <div className="flex items-start gap-2">
                <div className="w-[110px] shrink-0">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    คำนำหน้า
                  </label>
                  <PrefixCombobox
                    value={newPrefix}
                    onChange={(val) => setNewPrefix(val)}
                    className="w-full"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ชื่อ-นามสกุล <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      if (newError) setNewError('');
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-normal outline-none transition-colors hover:border-slate-400 focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]"
                  />
                </div>
              </div>

              {/* Row 2: สังกัด (full width, existing affiliation select, required) */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  สังกัด <span className="text-destructive">*</span>
                </label>
                <DepartmentSelect
                  value={newDepartment}
                  onChange={(dept) => {
                    setNewDepartment(dept);
                    if (newError) setNewError('');
                  }}
                  className="w-full"
                />
              </div>

              {/* Buttons: ยกเลิก and บันทึกรายชื่อ */}
              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingNew(false)}
                  className="h-9 px-3.5 text-xs font-medium text-slate-700 bg-white border-input hover:bg-slate-100 cursor-pointer"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleStartAddNew}
                  className="h-9 px-4 text-xs font-medium text-white bg-[#00A651] hover:bg-[#008a43] shadow-xs cursor-pointer"
                >
                  บันทึกรายชื่อ
                </Button>
              </div>
            </div>
          ) : (
            /* Section: Existing Personnel Search Options */
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  <div>ไม่พบรายชื่อในระบบ</div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(true);
                      setNewName(normalizePersonName(searchTerm));
                    }}
                    className="mt-2 text-[#00A651] font-semibold hover:underline cursor-pointer"
                  >
                    + คลิกที่นี่เพื่อเพิ่มรายชื่อใหม่
                  </button>
                </div>
              ) : (
                searchResults.map((p) => {
                  const isSelected = multiple
                    ? multipleParsedValues.some((v) => v.person_id === Number(p.id))
                    : singleParsedValue?.person_id === Number(p.id);

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectExisting(p)}
                      className={cn(
                        'h-[42px] min-h-[42px] px-3 flex items-center justify-between cursor-pointer transition-colors select-none text-sm font-normal text-slate-800',
                        isSelected ? 'bg-emerald-50/70' : 'hover:bg-slate-50'
                      )}
                    >
                      <div className="flex items-center gap-[10px] min-w-0 flex-1">
                        <div className="w-[52px] min-w-[52px] max-w-[52px] flex items-center justify-center shrink-0">
                          {hasAffiliation(p.department) ? (
                            <DepartmentBadge
                              value={p.department}
                              className="w-[52px] min-w-[52px] max-w-[52px] px-1 py-0.5 text-[11px] font-bold text-center justify-center shrink-0"
                            />
                          ) : (
                            <div className="w-[52px] min-w-[52px] max-w-[52px] shrink-0" aria-hidden="true" />
                          )}
                        </div>
                        <span className="text-sm font-normal text-slate-800 truncate min-w-0 flex-1" title={p.name}>
                          {p.name}
                        </span>
                      </div>

                      {isSelected && (
                        <Check className="size-4 text-[#00A651] shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Confirmation Modal */}
      <PersonAddConfirmModal
        isOpen={confirmModalOpen}
        personName={pendingPersonData?.fullName || ''}
        prefix={pendingPersonData?.prefix || ''}
        cleanName={pendingPersonData?.cleanName || ''}
        onAddAndLink={handleConfirmAddAndLink}
        onKeepPlainText={handleKeepPlainText}
        onCancel={handleCancelModal}
        isSubmitting={isSubmittingPerson}
      />
    </div>
  );
}

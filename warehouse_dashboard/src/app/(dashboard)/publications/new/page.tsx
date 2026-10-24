'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaSave } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { PublicationForm } from '@/components/form/PublicationForm';
import { saveCategoryRecord } from '@/lib/dataService';

export default function NewPublicationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({
    name: '',
    type: 'ตีพิมพ์',
    level: 'นานาชาติ',
    budget: 0,
    owner: '',
    department: '',
    journal: '',
    volume: '',
    issue: '',
    page_start: '',
    page_end: '',
    co_authors_foreign: [],
    co_authors_domestic: [],
    remarks: '',
    month: 'ม.ค.',
    month_year: '2025-01',
    fiscal_year_be: 2568,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleFieldChange = (key: string, val: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: val,
    }));
    setIsDirty(true);
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (!confirm('คุณมีข้อมูลที่ยังไม่ได้บันทึก ต้องการยกเลิกและกลับสู่หน้ารายการหรือไม่?')) {
        return;
      }
    }
    router.push('/publications');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!formData.name || !String(formData.name).trim()) {
      errs.name = 'กรุณากรอกชื่อผลงานทางวิชาการ';
    }
    if (!formData.type || !String(formData.type).trim()) {
      errs.type = 'กรุณาเลือกชนิดของผลงาน';
    }
    if (!formData.level || !String(formData.level).trim()) {
      errs.level = 'กรุณาเลือกระดับ';
    }
    if (!formData.owner || !String(formData.owner).trim()) {
      errs.owner = 'กรุณาระบุเจ้าของผลงาน';
    }
    if (!formData.department || !String(formData.department).trim()) {
      errs.department = 'กรุณาระบุสังกัดภาควิชา/สาขาวิชา';
    }
    if (formData.budget !== undefined && formData.budget !== null && formData.budget !== '') {
      const bNum = parseFloat(formData.budget);
      if (isNaN(bNum) || bNum < 0) {
        errs.budget = 'จำนวนเงินสนับสนุนต้องเป็นตัวเลขที่ไม่ติดลบ';
      }
    }
    if (formData.type !== 'เตรียมความพร้อมจดอนุสิทธิบัตร') {
      const pStart = String(formData.page_start || '').trim();
      const pEnd = String(formData.page_end || '').trim();
      if (pStart && pEnd) {
        const numStart = parseInt(pStart, 10);
        const numEnd = parseInt(pEnd, 10);
        if (!isNaN(numStart) && !isNaN(numEnd) && numEnd < numStart) {
          errs.pages = 'หน้าสิ้นสุดต้องมากกว่าหรือเท่ากับหน้าเริ่มต้น';
        }
      }
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveCategoryRecord('publications', formData, true);
      if (res.success) {
        showToast('เพิ่มผลงานทางวิชาการสำเร็จ', 'success');
        setIsDirty(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('ku_data_updated'));
        }
        setTimeout(() => {
          router.push('/publications');
        }, 800);
      } else {
        showToast(res.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      showToast(err?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2.5 text-sm font-semibold transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navigation & Action Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="h-8 px-3 text-slate-600 border-slate-300 hover:bg-slate-50"
          >
            <FaArrowLeft className="mr-1.5 text-xs" />
            กลับ
          </Button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 m-0">เพิ่มผลงานทางวิชาการ</h2>
            <p className="text-xs text-slate-500 m-0">กรอกข้อมูลผลงานทางวิชาการเพื่อบันทึกลงสู่ระบบ</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="h-9 px-4 text-xs font-semibold text-slate-700 bg-white"
          >
            ยกเลิก
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-9 px-5 text-xs font-semibold text-white bg-[#00A651] hover:bg-[#008a43] shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <FaSave className="text-xs" />
            <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</span>
          </Button>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit}>
        <PublicationForm
          formData={formData}
          onChange={handleFieldChange}
          setFormData={setFormData}
          isEdit={false}
          errors={formErrors}
        />

        {/* Bottom Action Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="h-9 px-4 text-xs font-semibold text-slate-700 bg-white"
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9 px-6 text-xs font-semibold text-white bg-[#00A651] hover:bg-[#008a43] shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <FaSave className="text-xs" />
            <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

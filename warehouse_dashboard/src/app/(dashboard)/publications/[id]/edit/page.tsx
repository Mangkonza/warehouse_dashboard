'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaSave, FaSpinner } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { PublicationForm } from '@/components/form/PublicationForm';
import { fetchCategoryData, saveCategoryRecord } from '@/lib/dataService';

export default function EditPublicationPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id as string;
  const publicationId = rawId ? decodeURIComponent(rawId) : '';

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, any> | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load publication record
  useEffect(() => {
    let isMounted = true;

    async function loadRecord() {
      if (!publicationId) {
        setIsLoading(false);
        return;
      }

      try {
        const list = await fetchCategoryData('publications');
        if (!isMounted) return;

        const found = list.find(
          (item: any) => String(item._id) === publicationId || String(item.id) === publicationId
        );

        if (found) {
          setFormData({
            ...found,
            co_authors_foreign: Array.isArray(found.co_authors_foreign)
              ? [...found.co_authors_foreign]
              : [],
            co_authors_domestic: Array.isArray(found.co_authors_domestic)
              ? [...found.co_authors_domestic]
              : [],
          });
        } else {
          setFormData(null);
        }
      } catch (err) {
        console.error('Failed to load publication record:', err);
        showToast('ไม่สามารถโหลดข้อมูลผลงานได้', 'error');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRecord();

    return () => {
      isMounted = false;
    };
  }, [publicationId]);

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
    setFormData((prev) => (prev ? { ...prev, [key]: val } : prev));
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
    if (!formData) return;

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
      const res = await saveCategoryRecord('publications', formData, false);
      if (res.success) {
        showToast('แก้ไขข้อมูลผลงานทางวิชาการสำเร็จ', 'success');
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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-12 flex flex-col items-center justify-center text-slate-500 gap-3">
        <FaSpinner className="animate-spin text-2xl text-[#00A651]" />
        <span className="text-sm">กำลังโหลดข้อมูลผลงาน...</span>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="max-w-2xl mx-auto p-8 my-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <FaExclamationTriangle className="text-4xl text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">ไม่พบข้อมูลผลงานทางวิชาการ</h3>
        <p className="text-xs text-slate-500">
          ไม่พบผลงานรหัส &quot;{publicationId}&quot; ในระบบ อาจถูกลบหรือไม่มีอยู่ในฐานข้อมูล
        </p>
        <Button
          type="button"
          onClick={() => router.push('/publications')}
          className="mt-2 bg-[#00A651] hover:bg-[#008a43] text-white text-xs font-semibold px-4 py-2"
        >
          <FaArrowLeft className="mr-1.5 text-xs" />
          กลับสู่หน้ารายการผลงาน
        </Button>
      </div>
    );
  }

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
            <h2 className="text-xl font-bold text-slate-800 m-0">แก้ไขข้อมูลผลงานทางวิชาการ</h2>
            <p className="text-xs text-slate-500 m-0">
              รหัส: {formData._id || formData.id || '-'}
            </p>
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
            <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}</span>
          </Button>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit}>
        <PublicationForm
          formData={formData}
          onChange={handleFieldChange}
          setFormData={setFormData as React.Dispatch<React.SetStateAction<Record<string, any>>>}
          isEdit={true}
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
            <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

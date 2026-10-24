'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaSave, FaSpinner } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { IntellectualPropertyForm, IntellectualPropertyFormData } from '@/components/form/IntellectualPropertyForm';
import { fetchCategoryData, saveCategoryRecord } from '@/lib/dataService';

export default function EditIPPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id as string;
  const ipId = rawId ? decodeURIComponent(rawId) : '';

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

  // Load IP record
  useEffect(() => {
    let isMounted = true;

    async function loadRecord() {
      if (!ipId) {
        setIsLoading(false);
        return;
      }

      try {
        const list = await fetchCategoryData('ip');
        if (!isMounted) return;

        const found = list.find(
          (item: any) =>
            String(item._id) === ipId ||
            String(item.id) === ipId ||
            String(item.req_no) === ipId ||
            String(item.name) === ipId
        );

        if (found) {
          // Parse inventors if array or reconstruct from creator
          let inventors = Array.isArray(found.inventors) ? [...found.inventors] : [];
          if (inventors.length === 0 && found.creator) {
            const names = String(found.creator).split(',').map((s) => s.trim()).filter(Boolean);
            inventors = names.map((n) => ({
              name: n,
              person_id: found.person_id || null,
              department: found.department || '',
            }));
          }

          // Parse application / registration number if missing but req_no exists
          let appNo = found.application_number || '';
          let regNo = found.registration_number || '';
          if (!appNo && !regNo && found.req_no) {
            const reqParts = String(found.req_no).split('/').map((s) => s.trim());
            if (reqParts.length >= 2) {
              const digits0 = reqParts[0].replace(/\D/g, '');
              const digits1 = reqParts[1].replace(/\D/g, '');
              if (digits0.length === 10) appNo = digits0;
              if (digits1.length === 10) regNo = digits1;
            } else if (reqParts.length === 1) {
              const digits = reqParts[0].replace(/\D/g, '');
              if (digits.length === 10) appNo = digits;
            }
          }

          setFormData({
            ...found,
            title: found.title || found.name || '',
            name: found.name || found.title || '',
            inventors,
            type: found.type === 'สิทธิบัตรการประดิษฐ์' ? 'สิทธิบัตร' : (found.type || 'อนุสิทธิบัตร'),
            application_number: appNo,
            registration_number: regNo,
            support_amount: found.support_amount !== undefined ? Number(found.support_amount) : 0,
          });
        } else {
          setFormData(null);
        }
      } catch (err) {
        console.error('Failed to load IP record:', err);
        showToast('ไม่สามารถโหลดข้อมูลทรัพย์สินทางปัญญาได้', 'error');
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
  }, [ipId]);

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
    setFormData((prev) => (prev ? { ...prev, [key]: val } : null));
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
    router.push('/ip');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const errs: Record<string, string> = {};

    const title = formData.title || formData.name;
    if (!title || !String(title).trim()) {
      errs.name = 'กรุณากรอกชื่อเรื่อง';
    }

    const hasInventors = (Array.isArray(formData.inventors) && formData.inventors.length > 0) || (formData.creator && String(formData.creator).trim());
    if (!hasInventors) {
      errs.inventors = 'กรุณาระบุผู้ประดิษฐ์อย่างน้อย 1 ท่าน';
    }

    if (!formData.type || (formData.type !== 'อนุสิทธิบัตร' && formData.type !== 'สิทธิบัตร')) {
      errs.type = 'กรุณาเลือกประเภททรัพย์สินทางปัญญา';
    }

    if (formData.application_number && String(formData.application_number).length !== 10) {
      errs.application_number = 'เลขที่คำขอต้องมี 10 หลัก';
    }

    if (formData.registration_number && String(formData.registration_number).length !== 10) {
      errs.registration_number = 'เลขที่ต้องมี 10 หลัก';
    }

    if (formData.protection_start && formData.protection_end && formData.protection_end < formData.protection_start) {
      errs.protection_dates = 'วันที่สิ้นสุดต้องไม่เกิดขึ้นก่อนวันที่เริ่มต้น';
    }

    if (formData.support_amount !== undefined && formData.support_amount !== null && formData.support_amount !== '') {
      const bNum = parseFloat(formData.support_amount);
      if (isNaN(bNum) || bNum < 0) {
        errs.support_amount = 'จำนวนเงินสนับสนุนต้องเป็นตัวเลขที่ไม่ติดลบ';
      }
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      showToast('กรุณาตรวจสอบข้อมูลที่จำเป็นให้ครบถ้วน', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        name: title,
        title: title,
      };

      const res = await saveCategoryRecord('ip', payload, false);
      if (res.success) {
        showToast('บันทึกการแก้ไขทรัพย์สินทางปัญญาสำเร็จ', 'success');
        setIsDirty(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('ku_data_updated'));
        }
        setTimeout(() => {
          router.push('/ip');
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
      <div className="max-w-4xl mx-auto p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
        <FaSpinner className="animate-spin text-2xl text-[#00A651]" />
        <span className="text-sm">กำลังโหลดข้อมูลทรัพย์สินทางปัญญา...</span>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-4">
        <div className="text-red-500 text-lg font-bold">ไม่พบข้อมูลงานทรัพย์สินทางปัญญา</div>
        <p className="text-sm text-slate-500">รหัสข้อมูลไม่ถูกต้องหรือรายการนี้อาจถูกลบไปแล้ว</p>
        <Button onClick={() => router.push('/ip')} variant="outline" size="sm">
          <FaArrowLeft className="mr-1.5" />
          กลับสู่หน้ารายการ
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
            <h2 className="text-xl font-bold text-slate-800 m-0">แก้ไขงานทรัพย์สินทางปัญญา</h2>
            <p className="text-xs text-slate-500 m-0 truncate max-w-[450px]">
              {formData.title || formData.name}
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
        <IntellectualPropertyForm
          formData={formData}
          onChange={handleFieldChange}
          setFormData={setFormData as any}
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

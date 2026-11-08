'use client';

import React from 'react';
import { Alert } from '@/components/ui/Alert';
import { ImportRow } from '../types';

export interface ImportIssueAlertProps {
  row: ImportRow;
  onFocusField: (fieldName: string) => void;
}

export const ImportIssueAlert: React.FC<ImportIssueAlertProps> = ({
  row,
  onFocusField,
}) => {
  if (row.excluded) {
    return (
      <Alert variant="info" title="แถวนี้ถูกตั้งค่าเป็น 'ไม่นำเข้า'">
        คุณสามารถกดปุ่ม &ldquo;คืนค่า&rdquo; ด้านบนหากต้องการนำแถวนี้กลับเข้าสู่รายการนำเข้า
      </Alert>
    );
  }

  if (row.status === 'duplicate') {
    return (
      <Alert variant="info" title="รายการซ้ำกับข้อมูลที่มีอยู่แล้ว (อ่านอย่างเดียว)">
        <p className="mb-[0.25rem]">
          {row.duplicateOf || 'รายการนี้ซ้ำกับข้อมูลในระบบหรือซ้ำกับแถวอื่นในไฟล์เดียวกัน'}
        </p>
        <p className="text-[0.6875rem] opacity-85">
          ระบบจะข้ามแถวนี้อัตโนมัติเพื่อป้องกันข้อมูลซ้ำซ้อน
        </p>
      </Alert>
    );
  }

  const errorIssues = row.issues.filter((i) => i.severity === 'error');
  const warningIssues = row.issues.filter((i) => i.severity === 'warning');

  if (errorIssues.length === 0 && warningIssues.length === 0) {
    return (
      <Alert variant="success" title="ข้อมูลครบถ้วน พร้อมนำเข้า">
        ทุกช่องบังคับของหมวด{row.categoryLabel}ครบถ้วนแล้ว การแก้ไขจะมีผลทันทีโดยอัตโนมัติ
      </Alert>
    );
  }

  return (
    <div className="space-y-[0.5rem]">
      {errorIssues.length > 0 && (
        <Alert
          variant="error"
          title={`ต้องแก้ไข ${errorIssues.length} ช่องบังคับก่อนนำเข้า (คลิกเพื่อไปยังช่อง)`}
        >
          <div className="flex flex-wrap gap-[0.375rem] mt-[0.375rem]">
            {errorIssues.map((iss, idx) => (
              <button
                key={`${iss.field}-${idx}`}
                type="button"
                onClick={() => onFocusField(iss.field)}
                className="inline-flex items-center gap-[0.25rem] px-[0.5rem] py-[0.1875rem] rounded-[0.375rem] bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 text-[0.75rem] font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <span>• {iss.label}</span>
              </button>
            ))}
          </div>
        </Alert>
      )}

      {warningIssues.length > 0 && (
        <Alert
          variant="warning"
          title={`ข้อสังเกต ${warningIssues.length} รายการ (นำเข้าได้แต่ควรตรวจสอบ)`}
        >
          <div className="flex flex-wrap gap-[0.375rem] mt-[0.375rem]">
            {warningIssues.map((iss, idx) => (
              <button
                key={`${iss.field}-${idx}`}
                type="button"
                onClick={() => onFocusField(iss.field)}
                className="inline-flex items-center gap-[0.25rem] px-[0.5rem] py-[0.1875rem] rounded-[0.375rem] bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 text-[0.75rem] font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                <span>• {iss.label}: {iss.message}</span>
              </button>
            ))}
          </div>
        </Alert>
      )}
    </div>
  );
};

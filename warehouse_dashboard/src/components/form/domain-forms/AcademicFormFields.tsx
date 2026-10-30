'use client';

import React from 'react';
import { AcademicProjectForm } from '@/app/(dashboard)/manage/_components/AcademicProjectForm';
import { cn } from '@/lib/utils';

export interface AcademicFormFieldsProps {
  formData: Record<string, any>;
  onChange: (key: string, val: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  readOnly?: boolean;
  className?: string;
}

export const AcademicFormFields: React.FC<AcademicFormFieldsProps> = ({
  formData,
  onChange,
  setFormData,
  readOnly = false,
  className,
}) => {
  return (
    <fieldset
      disabled={readOnly}
      className={cn(
        'imp-domain-form border-0 p-0 m-0 min-w-0',
        readOnly && 'opacity-75 pointer-events-none select-none',
        className
      )}
    >
      <AcademicProjectForm
        formData={formData}
        onChange={onChange}
        setFormData={setFormData}
      />
    </fieldset>
  );
};

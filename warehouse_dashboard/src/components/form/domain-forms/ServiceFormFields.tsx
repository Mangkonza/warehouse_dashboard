'use client';

import React from 'react';
import { AcademicServiceForm, AcademicServiceFormProps } from '@/components/form/AcademicServiceForm';
import { cn } from '@/lib/utils';

export interface ServiceFormFieldsProps extends AcademicServiceFormProps {
  readOnly?: boolean;
  className?: string;
}

export const ServiceFormFields: React.FC<ServiceFormFieldsProps> = ({
  formData,
  onChange,
  setFormData,
  isEdit = false,
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
      <AcademicServiceForm
        formData={formData}
        onChange={onChange}
        setFormData={setFormData}
        isEdit={isEdit}
      />
    </fieldset>
  );
};

'use client';

import React from 'react';
import { ResearchProjectForm, ResearchProjectFormProps } from '@/components/form/ResearchProjectForm';
import { cn } from '@/lib/utils';

export interface ResearchFormFieldsProps extends ResearchProjectFormProps {
  readOnly?: boolean;
  className?: string;
}

export const ResearchFormFields: React.FC<ResearchFormFieldsProps> = ({
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
      <ResearchProjectForm
        formData={formData}
        onChange={onChange}
        setFormData={setFormData}
        isEdit={isEdit}
      />
    </fieldset>
  );
};

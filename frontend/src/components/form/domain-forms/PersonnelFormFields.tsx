'use client';

import React from 'react';
import { PersonnelForm } from '@/components/form/PersonnelForm';
import { cn } from '@/lib/utils';

export interface PersonnelFormFieldsProps {
  formData: Record<string, any>;
  onChange: (key: string, val: any) => void;
  setFormData?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  errors?: Record<string, string>;
  readOnly?: boolean;
  className?: string;
}

export const PersonnelFormFields: React.FC<PersonnelFormFieldsProps> = ({
  formData,
  onChange,
  errors = {},
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
      <PersonnelForm
        formData={formData}
        onChange={onChange}
        errors={errors}
        isEdit={true}
      />
    </fieldset>
  );
};

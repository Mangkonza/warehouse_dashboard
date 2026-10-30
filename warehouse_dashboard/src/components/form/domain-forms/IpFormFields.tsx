'use client';

import React from 'react';
import {
  IntellectualPropertyForm,
  IntellectualPropertyFormProps,
} from '@/components/form/IntellectualPropertyForm';
import { cn } from '@/lib/utils';

export interface IpFormFieldsProps extends IntellectualPropertyFormProps {
  readOnly?: boolean;
  className?: string;
}

export const IpFormFields: React.FC<IpFormFieldsProps> = ({
  formData,
  onChange,
  setFormData,
  isEdit = false,
  errors,
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
      <IntellectualPropertyForm
        formData={formData}
        onChange={onChange}
        setFormData={setFormData}
        isEdit={isEdit}
        errors={errors}
      />
    </fieldset>
  );
};

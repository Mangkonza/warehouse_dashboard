'use client';

import React from 'react';
import { PublicationForm, PublicationFormProps } from '@/components/form/PublicationForm';
import { cn } from '@/lib/utils';

export interface PublicationFormFieldsProps extends PublicationFormProps {
  readOnly?: boolean;
  className?: string;
}

export const PublicationFormFields: React.FC<PublicationFormFieldsProps> = ({
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
      <PublicationForm
        formData={formData}
        onChange={onChange}
        setFormData={setFormData}
        isEdit={isEdit}
        errors={errors}
      />
    </fieldset>
  );
};

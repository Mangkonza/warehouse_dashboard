'use client';

import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { cn } from '@/lib/utils';

export interface StepItem {
  step: number;
  label: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className }) => {
  return (
    <nav aria-label="ขั้นตอนการดำเนินการ" className={cn('flex items-center gap-[0.5rem] text-[0.75rem] font-semibold', className)}>
      {steps.map((item, idx) => {
        const isActive = item.step === currentStep;
        const isCompleted = item.step < currentStep;

        return (
          <React.Fragment key={item.step}>
            <div
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'flex items-center gap-[0.375rem] px-[0.75rem] py-[0.25rem] rounded-full border transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : isCompleted
                  ? 'bg-emerald-50/40 border-emerald-200 text-emerald-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              )}
            >
              <span className="w-[1.125rem] h-[1.125rem] rounded-full bg-current/15 flex items-center justify-center text-[0.6875rem] font-bold">
                {item.step}
              </span>
              <span className="hidden md:inline">{item.label}</span>
            </div>

            {idx < steps.length - 1 && (
              <FaChevronRight className="text-slate-300 text-[0.625rem] shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

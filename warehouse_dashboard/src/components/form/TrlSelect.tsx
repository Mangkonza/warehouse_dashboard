'use client';

import * as React from 'react';
import { ChevronDown, Info, Check, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TrlBadge, TRL_COLOR } from '@/components/ui/trl-badge';

export interface TrlDefinition {
  level: number;
  labelTh: string;
  labelEn: string;
  color: string;
}

export const TRL_DEFINITIONS: TrlDefinition[] = [
  {
    level: 1,
    labelTh: 'การสังเกตและรายงานหลักการพื้นฐาน',
    labelEn: 'Basic principles observed and reported',
    color: TRL_COLOR,
  },
  {
    level: 2,
    labelTh: 'การกำหนดแนวคิดหรือการประยุกต์ใช้เทคโนโลยี',
    labelEn: 'Technology concept and/or application formulated',
    color: TRL_COLOR,
  },
  {
    level: 3,
    labelTh: 'การพิสูจน์แนวคิดเชิงวิเคราะห์และการทดลอง',
    labelEn: 'Analytical and experimental critical function / proof of concept',
    color: TRL_COLOR,
  },
  {
    level: 4,
    labelTh: 'การตรวจสอบยืนยันองค์ประกอบในห้องปฏิบัติการ',
    labelEn: 'Component and/or breadboard validation in laboratory environment',
    color: TRL_COLOR,
  },
  {
    level: 5,
    labelTh: 'การตรวจสอบยืนยันองค์ประกอบในสภาพแวดล้อมที่เกี่ยวข้อง',
    labelEn: 'Component validation in relevant environment',
    color: TRL_COLOR,
  },
  {
    level: 6,
    labelTh: 'การสาธิตแบบจำลองระบบในสภาพแวดล้อมที่เกี่ยวข้อง',
    labelEn: 'System/subsystem model demonstration in a relevant environment',
    color: TRL_COLOR,
  },
  {
    level: 7,
    labelTh: 'การสาธิตต้นแบบระบบในสภาพแวดล้อมการทำงานจริง',
    labelEn: 'System prototype demonstration in an operational environment',
    color: TRL_COLOR,
  },
  {
    level: 8,
    labelTh: 'ระบบจริงสมบูรณ์และผ่านการรับรอง',
    labelEn: 'Actual system completed and qualified through test and demonstration',
    color: TRL_COLOR,
  },
  {
    level: 9,
    labelTh: 'ระบบจริงพิสูจน์แล้วผ่านการปฏิบัติการสำเร็จ',
    labelEn: 'Actual system proven through successful mission operations',
    color: TRL_COLOR,
  },
];

export interface TrlSelectProps {
  value?: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'default' | 'sm';
}

export function TrlSelect({
  value,
  onChange,
  placeholder = '-- เลือกระดับ TRL (1-9) --',
  disabled = false,
  className,
  size = 'default',
}: TrlSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDef = React.useMemo(() => {
    if (!value) return null;
    return TRL_DEFINITIONS.find((d) => d.level === value) || null;
  }, [value]);

  return (
    <div className={cn('relative inline-flex items-center w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={disabled}
          render={
            <Button
              type="button"
              variant="outline"
              className={cn(
                'w-full justify-between font-normal bg-background border-input hover:bg-accent/40 rounded-lg gap-2 cursor-pointer shadow-2xs',
                size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-10 px-3 text-sm min-h-[40px]',
                !selectedDef && 'text-muted-foreground'
              )}
            >
              <div className="flex items-center gap-2 truncate">
                {selectedDef ? (
                  <>
                    <TrlBadge level={selectedDef.level} className="shrink-0" />
                    <span className="truncate text-slate-800 text-xs font-normal">
                      {selectedDef.labelTh}
                    </span>
                  </>
                ) : (
                  <span className="truncate text-xs">{placeholder}</span>
                )}
              </div>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </Button>
          }
        />

        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-96 p-2 rounded-xl shadow-lg border border-slate-200 bg-white overflow-hidden text-slate-900"
        >
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 mb-1">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Award className="size-4 text-emerald-600" />
              ระดับความพร้อมทางเทคโนโลยี
            </span>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600"
              >
                ล้างค่า
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 p-0.5">
            {TRL_DEFINITIONS.map((item) => {
              const isSelected = value === item.level;
              return (
                <div
                  key={item.level}
                  onClick={() => {
                    onChange(item.level);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-left group',
                    isSelected
                      ? 'bg-emerald-50/80 border border-emerald-300'
                      : 'hover:bg-slate-50 border border-transparent'
                  )}
                >
                  <TrlBadge level={item.level} className="shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={cn('text-xs font-normal', isSelected ? 'text-emerald-950' : 'text-slate-800')}>
                        {item.labelTh}
                      </span>
                      {isSelected && <Check className="size-3.5 text-emerald-600 shrink-0" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

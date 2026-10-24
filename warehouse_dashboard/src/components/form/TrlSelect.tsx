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

export interface TrlDefinition {
  level: number;
  labelTh: string;
  labelEn: string;
  descriptionTh: string;
  color: string;
}

export const TRL_DEFINITIONS: TrlDefinition[] = [
  {
    level: 1,
    labelTh: 'การสังเกตและรายงานหลักการพื้นฐาน',
    labelEn: 'Basic principles observed and reported',
    descriptionTh: 'การวิจัยทางวิทยาศาสตร์ขั้นพื้นฐาน เริ่มแปลงการวิจัยเป็นการพัฒนา',
    color: '#3b82f6',
  },
  {
    level: 2,
    labelTh: 'การกำหนดแนวคิดหรือการประยุกต์ใช้เทคโนโลยี',
    labelEn: 'Technology concept and/or application formulated',
    descriptionTh: 'เริ่มกำหนดหลักการประยุกต์ใช้งาน การประดิษฐ์ในทางปฏิบัติยังเป็นการคาดการณ์',
    color: '#06b6d4',
  },
  {
    level: 3,
    labelTh: 'การพิสูจน์แนวคิดเชิงวิเคราะห์และการทดลอง',
    labelEn: 'Analytical and experimental critical function / proof of concept',
    descriptionTh: 'การวิจัยและพัฒนาเชิงรุก รวมถึงการศึกษาเชิงวิเคราะห์และในห้องปฏิบัติการเพื่อยืนยันแนวคิด',
    color: '#0ea5e9',
  },
  {
    level: 4,
    labelTh: 'การตรวจสอบยืนยันองค์ประกอบในห้องปฏิบัติการ',
    labelEn: 'Component and/or breadboard validation in laboratory environment',
    descriptionTh: 'บูรณาการองค์ประกอบพื้นฐานของเทคโนโลยีและทดสอบในห้องปฏิบัติการ',
    color: '#10b981',
  },
  {
    level: 5,
    labelTh: 'การตรวจสอบยืนยันองค์ประกอบในสภาพแวดล้อมที่เกี่ยวข้อง',
    labelEn: 'Component validation in relevant environment',
    descriptionTh: 'ความเที่ยงตรงของเทคโนโลยีเพิ่มขึ้นอย่างมาก ทดสอบในสภาพแวดล้อมจำลองเสมือนจริง',
    color: '#14b8a6',
  },
  {
    level: 6,
    labelTh: 'การสาธิตแบบจำลองระบบในสภาพแวดล้อมที่เกี่ยวข้อง',
    labelEn: 'System/subsystem model demonstration in a relevant environment',
    descriptionTh: 'ต้นแบบระบบที่ใช้งานได้จริงในสภาพแวดล้อมจำลอง ก้าวกระโดดสู่การใช้งานภาคสนาม',
    color: '#eab308',
  },
  {
    level: 7,
    labelTh: 'การสาธิตต้นแบบระบบในสภาพแวดล้อมการทำงานจริง',
    labelEn: 'System prototype demonstration in an operational environment',
    descriptionTh: 'ต้นแบบใกล้เคียงระบบจริง สาธิตในสภาพแวดล้อมการทำงานจริงภาคสนาม',
    color: '#f97316',
  },
  {
    level: 8,
    labelTh: 'ระบบจริงสมบูรณ์และผ่านการรับรอง',
    labelEn: 'Actual system completed and qualified through test and demonstration',
    descriptionTh: 'เทคโนโลยีพิสูจน์แล้วว่าทำงานได้สมบูรณ์ในรูปแบบสุดท้าย',
    color: '#ef4444',
  },
  {
    level: 9,
    labelTh: 'ระบบจริงพิสูจน์แล้วผ่านการปฏิบัติการสำเร็จ',
    labelEn: 'Actual system proven through successful mission operations',
    descriptionTh: 'การประยุกต์ใช้เทคโนโลยีจริงในการปฏิบัติการเต็มรูปแบบ',
    color: '#8b5cf6',
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
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: selectedDef.color }}
                    >
                      TRL {selectedDef.level}
                    </span>
                    <span className="truncate text-slate-800 text-xs font-medium">
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
              ระดับความพร้อมทางเทคโนโลยี (TRL 1-9)
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
                    'flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-left group',
                    isSelected
                      ? 'bg-emerald-50/80 border border-emerald-300'
                      : 'hover:bg-slate-50 border border-transparent'
                  )}
                >
                  <span
                    className="px-2 py-0.5 rounded text-xs font-bold text-white shrink-0 mt-0.5 shadow-2xs"
                    style={{ backgroundColor: item.color }}
                  >
                    TRL {item.level}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={cn('text-xs font-semibold', isSelected ? 'text-emerald-950' : 'text-slate-800')}>
                        {item.labelTh}
                      </span>
                      {isSelected && <Check className="size-3.5 text-emerald-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.descriptionTh}
                    </p>
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

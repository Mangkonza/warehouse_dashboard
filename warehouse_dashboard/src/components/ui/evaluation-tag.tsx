'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';
import { EvaluationValue, isEvaluated } from '@/types/evaluation';
import { getCachedEvaluations } from '@/lib/dataService';
import { parseSdgNumber, formatSdgLabel, getSdgInfo } from '@/lib/sdg';
import { SdgTag } from '@/components/ui/SdgTag';
import { SdgTagList, SdgTagListProps } from '@/components/ui/SdgTagList';

export { SdgTag, SdgTagList, type SdgTagListProps };

export type EvaluationTagKind = 'sdg' | 'ia' | 'iam' | 'journal' | 'level';

export interface EvaluationTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  kind: EvaluationTagKind;
  label: string;
  className?: string;
}

/**
 * Single Evaluation Tag with identical size, radius, and typography as DepartmentBadge.
 * When kind === 'sdg', delegates to universal SdgTag with official colors.
 */
export const EvaluationTag: React.FC<EvaluationTagProps> = ({
  kind,
  label,
  className,
  style,
  ...props
}) => {
  if (kind === 'sdg') {
    const parsed = parseSdgNumber(label);
    if (parsed) {
      return (
        <SdgTag
          n={parsed}
          className={className}
          style={style}
          {...props}
        />
      );
    }
  }

  const kindClasses = {
    sdg: 'tag-sdg bg-eval-sdg border border-eval-sdg-border text-white',
    ia: 'tag-iam bg-eval-ia border border-eval-ia-border text-white',
    iam: 'tag-iam bg-eval-ia border border-eval-ia-border text-white',
    journal: 'tag-journal bg-eval-journal border border-eval-journal-border text-white',
    level: 'tag-level bg-eval-level border border-eval-level-border text-white',
  }[kind];

  return (
    <span
      className={cn(BADGE_BASE_CLASSES, kindClasses, className)}
      style={style}
      {...props}
    >
      {label}
    </span>
  );
};

export interface LevelBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: string | null;
  className?: string;
}

/**
 * Global Level Badge ("ชาติ" / "นานาชาติ")
 * Uses design token --color-eval-level (#03254C) and BADGE_BASE_CLASSES
 * Perfectly matches DepartmentBadge and EvaluationTag dimensions
 */
export const LevelBadge: React.FC<LevelBadgeProps> = ({
  value,
  className,
  ...props
}) => {
  if (!value || value === '-' || value === 'nan') {
    return <span className="text-slate-400 font-normal select-none">-</span>;
  }
  return (
    <EvaluationTag
      kind="level"
      label={value}
      className={className}
      {...props}
    />
  );
};

export interface EvaluationTagsProps {
  category: string;
  value?: EvaluationValue | null;
  recordId?: string;
  maxSdgs?: number; // e.g. 3 in tables, undefined/all in drawer
  showUnsetChip?: boolean;
  className?: string;
}

/**
 * Group of Evaluation Tags rendered in order:
 * 1. SDG tags (sorted ascending)
 * 2. I am / I see tag
 * 3. Q / TCI tag
 * 
 * If not evaluated, shows "ยังไม่ประเมิน" chip with a deep link to the evaluation page.
 */
export const EvaluationTags: React.FC<EvaluationTagsProps> = ({
  category,
  value,
  recordId,
  maxSdgs,
  showUnsetChip = true,
  className,
}) => {
  const evaluated = isEvaluated(category, value);

  // If not evaluated and showUnsetChip is true, display the neutral "ยังไม่ประเมิน" chip
  if (!evaluated) {
    if (!showUnsetChip) return null;

    const href = recordId
      ? `/evaluation?category=${category}&highlight=${encodeURIComponent(recordId)}`
      : `/evaluation?category=${category}`;

    return (
      <Link
        href={href}
        className={cn(
          BADGE_BASE_CLASSES,
          'bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-300 transition-colors cursor-pointer select-none no-underline',
          className
        )}
        title="คลิกเพื่อประเมินโครงการนี้"
        onClick={(e) => e.stopPropagation()}
      >
        ยังไม่ประเมิน
      </Link>
    );
  }

  const isPub = category.toLowerCase() === 'publications';
  const rawSdgs = value?.sdg_ids || [];

  return (
    <div className={cn('inline-flex items-center gap-1.5 flex-wrap', className)}>
      {/* 1. SDG tags: uses shared SdgTagList */}
      <SdgTagList sdgs={rawSdgs} maxVisible={maxSdgs} />

      {/* 2. I AM / I SEE tag */}
      {value?.i_type && (
        <EvaluationTag
          kind="iam"
          label={value.i_type === 'I_AM' ? 'I AM' : 'I SEE'}
        />
      )}

      {/* 3. Q / TCI tag (Publications only) */}
      {isPub && value?.journal_index?.value && (
        <EvaluationTag
          kind="journal"
          label={value.journal_index.value}
        />
      )}
    </div>
  );
};

export interface RecordEvaluationTagsProps {
  category: string;
  record?: any;
  item?: any; // alias for record
  evaluation?: EvaluationValue | null;
  maxSdgs?: number;
  showUnsetChip?: boolean;
  className?: string;
  wrap?: boolean;
}

/**
 * Flexible helper component that looks up evaluation from the record or fallback cache.
 * Uses shared SdgTagList component with "SDG 1", "SDG 7" format.
 */
export const RecordEvaluationTags: React.FC<RecordEvaluationTagsProps> = ({
  category,
  record,
  item,
  evaluation,
  maxSdgs,
  showUnsetChip = true,
  className,
}) => {
  const targetRecord = item || record;
  const evalValue: EvaluationValue | null = React.useMemo(() => {
    if (evaluation !== undefined && evaluation !== null) return evaluation;
    if (!targetRecord) return null;
    return getItemEvaluation(targetRecord, category);
  }, [category, targetRecord, evaluation]);

  return (
    <EvaluationTags
      category={category}
      value={evalValue}
      recordId={String(targetRecord?.id || targetRecord?._id || '')}
      maxSdgs={maxSdgs}
      showUnsetChip={showUnsetChip}
      className={className}
    />
  );
};

/**
 * Flexible lookup for evaluation records supporting both (item, category) and (category, item).
 */
export function getItemEvaluation(first: any, second: any): EvaluationValue | null {
  const record = typeof first === 'object' && first !== null ? first : second;
  const category = typeof first === 'string' ? first : typeof second === 'string' ? second : '';

  if (!record) return null;
  if (record.evaluation) return record.evaluation;
  const recId = String(record.id || record._id || record.name || '').trim();
  if (!recId) return null;

  const catKey = category.toLowerCase();
  const cache = getCachedEvaluations();
  return cache[`${catKey}_${recId}`] || null;
}

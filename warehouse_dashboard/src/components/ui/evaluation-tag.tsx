'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BADGE_BASE_CLASSES } from '@/components/ui/badge-base';
import { EvaluationValue, formatSdgLabel, isEvaluated, parseSdgNumber } from '@/types/evaluation';
import { getCachedEvaluations } from '@/lib/dataService';

export type EvaluationTagKind = 'sdg' | 'ia' | 'iam' | 'journal' | 'level';

export interface EvaluationTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  kind: EvaluationTagKind;
  label: string;
  className?: string;
}

/**
 * Single Evaluation Tag with identical size, radius, and typography as DepartmentBadge.
 * Colors are theme tokens from globals.css @theme.
 */
export const EvaluationTag: React.FC<EvaluationTagProps> = ({
  kind,
  label,
  className,
  style,
  ...props
}) => {
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

export interface SdgTagListProps {
  sdgIds?: (number | string)[] | null;
  maxSdgs?: number; // e.g. 3 in EvaluationView table, 0 / undefined = show all (in drawer)
  className?: string;
  wrap?: boolean;
}

/**
 * Global component for rendering SDG Tags ("SDG 1", "SDG 7", etc.)
 * Used across the Evaluation table (EvaluationView) and Data Management drawer (RecordDetailDrawer).
 * Automatically parses numbers, deduplicates, and sorts ascending (1-17).
 */
export const SdgTagList: React.FC<SdgTagListProps> = ({
  sdgIds,
  maxSdgs,
  className,
  wrap = true,
}) => {
  const rawSdgs = Array.isArray(sdgIds) ? [...sdgIds] : [];
  const parsedSdgs = rawSdgs
    .map((s) => parseSdgNumber(s))
    .filter((n): n is number => typeof n === 'number' && n >= 1 && n <= 17);

  const sortedSdgs = Array.from(new Set(parsedSdgs)).sort((a, b) => a - b);
  if (sortedSdgs.length === 0) return null;

  const displaySdgs = maxSdgs && maxSdgs > 0 ? sortedSdgs.slice(0, maxSdgs) : sortedSdgs;
  const remainingSdgs = maxSdgs && maxSdgs > 0 ? sortedSdgs.slice(maxSdgs) : [];

  return (
    <div className={cn("inline-flex items-center gap-1.5", wrap ? "flex-wrap" : "flex-nowrap", className)}>
      {displaySdgs.map((goalNum) => (
        <EvaluationTag
          key={`sdg-${goalNum}`}
          kind="sdg"
          label={formatSdgLabel(goalNum)}
        />
      ))}

      {remainingSdgs.length > 0 && (
        <span
          className={cn(
            BADGE_BASE_CLASSES,
            "bg-slate-100 border border-slate-300 text-slate-700 cursor-default"
          )}
          title={remainingSdgs.map((n) => formatSdgLabel(n)).join(', ')}
        >
          +{remainingSdgs.length}
        </span>
      )}
    </div>
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

    const deepLink = recordId
      ? `/evaluation?category=${encodeURIComponent(category.toLowerCase())}&id=${encodeURIComponent(recordId)}`
      : `/evaluation?category=${encodeURIComponent(category.toLowerCase())}`;

    return (
      <div className={cn("inline-flex items-center", className)}>
        <Link
          href={deepLink}
          className={cn(
            BADGE_BASE_CLASSES,
            "min-w-0 w-auto px-3 border border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-400 transition-colors cursor-pointer"
          )}
          title="คลิกเพื่อไปที่หน้าการประเมินรายการนี้"
        >
          ยังไม่ประเมิน
        </Link>
      </div>
    );
  }

  // I am / I see label (Uppercase: I AM / I SEE)
  const iaLabel = value?.i_type === 'I_AM' ? 'I AM' : value?.i_type === 'I_SEE' ? 'I SEE' : null;

  // Journal label
  const journalLabel = value?.journal_index?.value || null;

  return (
    <div className={cn("inline-flex items-center gap-1.5 flex-wrap", className)}>
      {/* 1. SDG Tags */}
      <SdgTagList
        sdgIds={value?.sdg_ids}
        maxSdgs={maxSdgs}
      />

      {/* 2. I am / I see Tag */}
      {iaLabel && (
        <EvaluationTag
          kind="ia"
          label={iaLabel}
        />
      )}

      {/* 3. Journal Q / TCI Tag */}
      {journalLabel && (
        <EvaluationTag
          kind="journal"
          label={journalLabel}
        />
      )}
    </div>
  );
};

export interface RecordEvaluationTagsProps {
  category: string;
  item?: any;
  evaluation?: EvaluationValue | null;
  maxSdgs?: number;
  className?: string;
  wrap?: boolean;
}

/**
 * Helper to resolve evaluation data for a record robustly:
 * 1. Checks item.evaluation directly (server-joined)
 * 2. Checks item.sdg_ids / item.i_type / item.journal_index
 * 3. Tries permutations of keys in local cached evaluations (id, _id, name, normalized newlines)
 */
export function getItemEvaluation(item: any, category: string): EvaluationValue | null {
  if (!item || !category) return null;

  // 1. Direct attached evaluation on the item
  if (item.evaluation && isEvaluated(category, item.evaluation)) {
    return item.evaluation;
  }
  if (item.sdg_ids && Array.isArray(item.sdg_ids) && item.sdg_ids.length > 0) {
    return {
      sdg_ids: item.sdg_ids,
      i_type: item.i_type ?? null,
      journal_index: item.journal_index ?? null,
    };
  }

  // 2. Lookup in cached evaluations with all possible key permutations
  const cat = String(category).toLowerCase();
  const cached = getCachedEvaluations();

  const candidates = [
    item.id,
    item._id,
    item.name,
    item.id ? String(item.id).replace(/\r?\n/g, ' ') : null,
    item.id ? String(item.id).replace(/\r?\n/g, '\n') : null,
    item._id && item._id.startsWith(`${cat}_`) ? item._id.slice(cat.length + 1) : null,
  ].filter(Boolean);

  for (const cand of candidates) {
    const rawCand = String(cand).trim();
    if (!rawCand) continue;

    // key as `${cat}_${rawCand}`
    const k1 = `${cat}_${rawCand}`;
    if (cached[k1] && isEvaluated(cat, cached[k1])) {
      return cached[k1];
    }

    // key as `${rawCand}`
    if (cached[rawCand] && isEvaluated(cat, cached[rawCand])) {
      return cached[rawCand];
    }
  }

  return null;
}

/**
 * Global component displaying evaluation tags (SDGs, I AM / I SEE, Q / TCI).
 * Uses shared SdgTagList component with "SDG 1", "SDG 7" format.
 * Returns null if not evaluated.
 */
export const RecordEvaluationTags: React.FC<RecordEvaluationTagsProps> = ({
  category,
  item,
  evaluation: evalProp,
  maxSdgs,
  className,
  wrap = true,
}) => {
  const evaluation = evalProp || (item ? getItemEvaluation(item, category) : null);
  if (!category || !evaluation || !isEvaluated(category, evaluation)) {
    return null;
  }

  const iaLabel =
    evaluation.i_type === 'I_AM' ? 'I AM' : evaluation.i_type === 'I_SEE' ? 'I SEE' : null;

  const journalLabel = evaluation.journal_index?.value || null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        wrap ? "flex-wrap" : "flex-nowrap overflow-hidden",
        className
      )}
    >
      {/* 1. SDG tags: uses shared SdgTagList ("SDG 1", "SDG 7", etc.) */}
      <SdgTagList
        sdgIds={evaluation.sdg_ids}
        maxSdgs={maxSdgs}
        wrap={wrap}
      />

      {/* 2. I am / I see tag */}
      {iaLabel && (
        <EvaluationTag
          kind="ia"
          label={iaLabel}
        />
      )}

      {/* 3. Journal Q / TCI tag */}
      {journalLabel && (
        <EvaluationTag
          kind="journal"
          label={journalLabel}
        />
      )}
    </div>
  );
};

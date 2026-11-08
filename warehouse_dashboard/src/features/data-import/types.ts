/**
 * Data Import Feature Types (v2 Split-Pane Responsive Architecture)
 * Faculty of Engineering at Kamphaeng Saen, Kasetsart University
 */

import { CategoryKey } from '@/types/dataManagement';

export type RowStatus = 'ready' | 'warning' | 'error' | 'duplicate' | 'excluded';
export type Severity = 'error' | 'warning';

export interface RowIssue {
  field: string;
  label: string;
  severity: Severity;
  message: string;
}

export interface ImportRowData {
  name: string;
  name_en?: string;
  head_name: string;
  head_personnel_id: number | null;
  department_code: string | null;
  departments?: string[];
  client: string;
  fund_source?: string;
  fund_type?: string;
  funding_type?: string;
  project_type?: string;
  budget: number;
  budget_internal?: number;
  budget_external?: number;
  start_date: string | null;
  end_date: string | null;
  month: string;
  fiscal_year: number | null;
  record_number: string;
  remarks: string;
  // Research specific
  project_code?: string;
  co_researchers?: any;
  collaboration_type?: string | string[];
  project_nature?: string | string[];
  teaching_courses?: unknown[];
  applied_courses?: unknown[];
  academic_service?: string;
  cross_disciplinary?: string;
  trl_start?: number | string;
  trl_end?: number | string;
  trl_outputs?: unknown[];
  duration?: string;
  progress?: number;
  // Academic specific
  percent_faculty?: number;
  alloc_faculty?: number;
  percent_dept?: number;
  alloc_dept?: number;
  percent_ku?: number;
  alloc_ku?: number;
  alloc_remaining?: number;
  project_type_primary?: string;
  project_type_category?: string | string[];
  project_sub_types?: string[];
  research_projects?: string;
  patent_integration?: string;
  integration_start_date?: string | null;
  integration_end_date?: string | null;
  // Publication specific
  co_authors?: string;
  publication_type?: string;
  level?: string;
  publish_month?: string;
  publish_year?: number | string;
  journal_name?: string;
  volume?: string;
  issue?: string;
  page_numbers?: string;
  page_start?: string;
  page_end?: string;
  issn_isbn?: string;
  weight?: number;
  co_authors_foreign?: string;
  co_authors_domestic?: string;
  // Academic service specific
  contributors?: string;
  service_type?: string;
  target_group?: string;
  hours?: number;
  attendees_count?: number;
  satisfaction?: number;
  impact?: string;
  integration?: string;
  // IP specific
  inventors?: string;
  ip_type?: string;
  patent_no?: string;
  req_no?: string;
  work_category?: string;
  work_character?: string;
  filing_date?: string | null;
  protection_start?: string | null;
  protection_end?: string | null;
  status?: string;
  [key: string]: any;
}

export type GlobalImportRowData = ImportRowData;

export interface ImportRow {
  rowId: string;
  category: CategoryKey;
  categoryLabel: string;
  sheetName: string;
  excelRowNumber: number;
  status: RowStatus;
  excluded: boolean;
  duplicateOf?: string;
  issues: RowIssue[];
  data: ImportRowData;
}

export type GlobalImportRow = ImportRow;

export type ImportCategoryFilter = 'all' | CategoryKey;
export type FilterCategory = ImportCategoryFilter;

export type ImportStatusFilter = 'all' | 'ready' | 'error' | 'warning' | 'duplicate';
export type FilterStatus = ImportStatusFilter;

export interface ImportFiltersState {
  category: ImportCategoryFilter;
  status: ImportStatusFilter;
  query: string;
}

export type ImportFilters = ImportFiltersState;

export interface ImportSummary {
  total: number;
  ready: number;
  needsFix: number;
  needsReview: number;
  duplicate: number;
  excluded: number;
  willImport: number;
  byCategory: {
    category: CategoryKey;
    label: string;
    count: number;
    willImport: number;
    needsFix: number;
  }[];
}

export type GlobalSummary = ImportSummary;

export interface ParsedImportSheet {
  sheetName: string;
  category: CategoryKey;
  categoryLabel: string;
  monthName: string;
  fiscalYear: number | null;
  rawRows: unknown[][];
  headerRowIndex: number;
  colMap: Record<string, number>;
  warnings: string[];
  rowCount: number;
}

export type ParsedGlobalSheet = ParsedImportSheet;

export interface ImportFailedItem {
  row: ImportRow;
  reason: string;
}

export type GlobalImportFailedItem = ImportFailedItem;

export interface ImportOutcome {
  total: number;
  successCount: number;
  failedCount: number;
  duplicateSkipped: number;
  excludedSkipped: number;
  byCategoryOutcome: Record<CategoryKey, { success: number; failed: number }>;
  failedRows: ImportFailedItem[];
}

export type GlobalImportOutcome = ImportOutcome;

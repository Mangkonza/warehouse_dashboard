/**
 * Universal Global Excel Import & ETL Types
 * Supports Research, Academic Dev, Academic Services, Publications, IP, Personnel, KPI
 * Faculty of Engineering at Kamphaeng Saen, Kasetsart University
 */

import { CategoryKey } from '@/types/dataManagement';

export type RowStatus = 'ready' | 'warning' | 'error' | 'duplicate' | 'excluded';
export type Severity = 'error' | 'warning';

export interface RowIssue {
  field: string;
  severity: Severity;
  message: string;
}

export interface GlobalImportRow {
  rowId: string; // `${category}-${sheetName}-${excelRowNumber}`
  category: CategoryKey;
  categoryLabel: string;
  sheetName: string;
  excelRowNumber: number;
  status: RowStatus;
  excluded: boolean;
  duplicateOf?: string;
  issues: RowIssue[];
  data: {
    name: string; // Title / Name / Topic
    head_name: string; // Head / First Author / Inventor / Responsible person
    head_personnel_id: number | null;
    department_code: string | null;
    client: string; // Funding source / Client / Target group / Journal / Publisher
    budget: number;
    start_date: string | null; // ISO 'YYYY-MM-DD'
    end_date: string | null; // ISO 'YYYY-MM-DD'
    month: string;
    fiscal_year: number | null;
    record_number: string;
    remarks: string;
    // Category-specific properties
    project_code?: string;
    fund_source?: string;
    publication_type?: string;
    level?: string;
    journal_name?: string;
    volume?: string;
    service_type?: string;
    target_group?: string;
    hours?: number;
    attendees_count?: number;
    patent_no?: string;
    req_no?: string;
    work_category?: string;
    // Academic allocations (5% each)
    percent_faculty?: number;
    alloc_faculty?: number;
    percent_dept?: number;
    alloc_dept?: number;
    percent_ku?: number;
    alloc_ku?: number;
    alloc_remaining?: number;
    research_projects?: string;
    patent_integration?: string;
    integration_start_date?: string | null;
    integration_end_date?: string | null;
    [key: string]: any;
  };
}

export interface GlobalSummary {
  total: number;
  ready: number;
  needsFix: number;
  needsReview: number;
  duplicate: number;
  excluded: number;
  willImport: number;
  byCategory: { category: CategoryKey; label: string; count: number; willImport: number; needsFix: number }[];
  byMonth: { sheetName: string; total: number; willImport: number; needsFix: number }[];
}

export interface ParsedGlobalSheet {
  sheetName: string;
  category: CategoryKey;
  categoryLabel: string;
  monthName: string;
  fiscalYear: number | null;
  rawRows: any[][];
  headerRowIndex: number;
  colMap: Record<string, number>;
  warnings: string[];
  rowCount: number;
}

export type SummaryFilterType = 'all' | 'ready' | 'needsFix' | 'needsReview' | 'skipped';

export interface GlobalImportFailedItem {
  row: GlobalImportRow;
  reason: string;
}

export interface GlobalImportOutcome {
  total: number;
  successCount: number;
  failedCount: number;
  duplicateSkipped: number;
  excludedSkipped: number;
  byCategoryOutcome: Record<CategoryKey, { success: number; failed: number }>;
  failedRows: GlobalImportFailedItem[];
}

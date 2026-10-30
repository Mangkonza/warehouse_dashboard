/**
 * Type definitions for Academic Development Project Excel Import & ETL
 * Faculty of Engineering at Kamphaeng Saen, Kasetsart University
 */

export type RowStatus = 'ready' | 'warning' | 'error' | 'duplicate' | 'excluded';
export type Severity = 'error' | 'warning';

export interface RowIssue {
  field: keyof ImportRow['data'] | 'row';
  severity: Severity;
  message: string; // Thai short actionable message e.g. "ไม่มีชื่อโครงการ", "วันที่สิ้นสุดต้องไม่ก่อนวันเริ่มต้น"
}

export interface ImportRow {
  rowId: string; // `${sheetName}-${excelRowNumber}` unique & stable
  sheetName: string; // e.g. "ม.ค.68"
  excelRowNumber: number; // 1-based index in Excel file for reference
  status: RowStatus; // calculated from issues + duplicate + excluded
  excluded: boolean; // true if user clicked "ไม่นำเข้า"
  duplicateOf?: string; // description of duplicate item in system/file
  issues: RowIssue[];
  data: {
    name: string; // REQUIRED
    head_name: string; // REQUIRED
    head_personnel_id: number | null; // matched personnel id
    department_code: string | null; // standard code e.g. CPE, IRE, ME
    client: string;
    budget: number; // >= 0, default 0
    start_date: string | null; // ISO 'YYYY-MM-DD' REQUIRED
    end_date: string | null; // ISO 'YYYY-MM-DD' REQUIRED, >= start_date
    month: string; // from sheet name e.g. "มกราคม"
    fiscal_year: number | null; // BE 4 digits e.g. 2568
    record_number: string; // e.g. "00307/68"
    remarks: string;
    project_type_primary?: string; // Optional e.g. "งานบริการด้านวิจัย"
    project_sub_types?: string[]; // Optional e.g. ["วิจัย", "วางระบบ"]
    research_projects?: string; // Optional code/name
    patent_integration?: string; // Optional
    integration_start_date?: string | null;
    integration_end_date?: string | null;
  };
}

export interface Summary {
  total: number;
  ready: number; // ready + warning that will be imported
  needsFix: number; // error
  needsReview: number; // warning
  duplicate: number;
  excluded: number;
  willImport: number; // rows with status 'ready' or 'warning' and not excluded
  byMonth: { sheetName: string; total: number; willImport: number; needsFix: number }[];
}

export interface ParsedSheet {
  sheetName: string;
  monthName: string;
  fiscalYear: number | null;
  rawRows: any[][];
  headerRowIndex: number;
  colMap: Record<string, number>;
  warnings: string[];
  rowCount: number;
}

export type SummaryFilterType = 'all' | 'ready' | 'needsFix' | 'needsReview' | 'skipped';

export interface ImportFailedRowItem {
  row: ImportRow;
  reason: string;
}

export interface ImportResultOutcome {
  total: number;
  successCount: number;
  failedCount: number;
  duplicateSkipped: number;
  excludedSkipped: number;
  failedRows: ImportFailedRowItem[];
}

export type CategoryKey = 
  | 'monitoring'
  | 'research' 
  | 'academic' 
  | 'service' 
  | 'publications' 
  | 'ip' 
  | 'personnel'
  | 'kpi';

export type ColumnType = 
  | 'text' 
  | 'number' 
  | 'currency' 
  | 'date' 
  | 'badge' 
  | 'avatar' 
  | 'email'
  | 'select'
  | 'sdg'
  | 'quartile'
  | 'members'
  | 'status'
  | 'academic_members'
  | 'academic_budget'
  | 'academic_timeline'
  | 'academic_integration'
  | 'academic_character';

export interface ColumnDef {
  key: string;
  label: string;
  type: ColumnType;
  width?: string;
  align?: 'left' | 'center' | 'right';
  editable?: boolean;
  required?: boolean;
  placeholder?: string;
  autocomplete?: 'personnel' | 'department';
  selectOptions?: string[];
  badgeColorMap?: (val: any) => { bg: string; text: string; border?: string };
  format?: (val: any, row: any) => string;
}

export interface CategoryConfig {
  key: CategoryKey;
  title: string;
  titleEn: string;
  icon: string;
  color: string;
  description: string;
  primaryKey: string;
  nameKey: string;
  departmentKey?: string;
  personKey?: string;
  columns: ColumnDef[];
  templateSampleRows: Record<string, any>[];
  searchFields: string[];
}

export interface PersonnelRecord {
  _id?: string;
  id: string;
  name: string;
  clean_name: string;
  title_th: string;
  position: string;
  department: string;
  email: string;
  image_url: string;
}

export type RowValidationStatus = 'valid' | 'warning' | 'error';

export interface ValidationIssue {
  field: string;
  level: 'warning' | 'error';
  message: string;
}

export interface ParsedRowResult {
  rowNumber: number;
  data: Record<string, any>;
  status: RowValidationStatus;
  issues: ValidationIssue[];
  matchedPerson?: PersonnelRecord;
}

export interface SheetParseResult {
  sheetName: string;
  categoryKey: CategoryKey;
  totalRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
  rows: ParsedRowResult[];
}

export interface ExcelImportResult {
  fileName: string;
  mode: 'single' | 'master';
  sheets: SheetParseResult[];
}

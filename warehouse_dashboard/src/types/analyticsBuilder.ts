export type FactDomainId = 
  | 'research' 
  | 'academic' 
  | 'publications' 
  | 'service' 
  | 'ip' 
  | 'monitoring';

export type AggregationType = 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX' | 'PERCENT';

export type FormatType = 'currency' | 'number' | 'percent';

export type DimensionType = 'categorical' | 'time' | 'hierarchy';

export type ChartType = 
  | 'bar'                 // คอลัมน์แนวตั้ง
  | 'horizontal_bar'      // แถบแนวนอน
  | 'stacked_bar'         // คอลัมน์ซ้อน
  | 'stacked_bar_percent' // คอลัมน์ซ้อนร้อยละ 100%
  | 'grouped_bar'         // คอลัมน์กลุ่มเปรียบเทียบ
  | 'line'                // กราฟเส้นมาตรฐาน
  | 'smooth_line'         // กราฟเส้นโค้งมนสมูท (Curved Spline)
  | 'stepped_line'        // กราฟเส้นขั้นบันได
  | 'area'                // พื้นที่ไล่เฉดสี
  | 'stacked_area'        // พื้นที่ซ้อน
  | 'donut'               // โดนัททรงโมเดิร์น
  | 'pie'                 // วงกลมมาตรฐาน
  | 'polar'               // พื้นที่เชิงขั้ว (Polar Area)
  | 'radar'               // ใยแมงมุม (Radar/Spider)
  | 'scatter'             // กระจายตัว (Scatter/Bubble Metric)
  | 'pivot';              // ตาราง Pivot Matrix สรุปสถิติ

export interface MeasureDef {
  id: string;
  label: string;
  field: string;
  aggregation: AggregationType;
  format: FormatType;
  description: string;
}

export interface DimensionDef {
  id: string;
  label: string;
  field: string;
  type: DimensionType;
  description: string;
}

export interface FactDomainDef {
  id: FactDomainId;
  nameTh: string;
  nameEn: string;
  description: string;
  iconName: string;
  color: string;
  measures: MeasureDef[];
  dimensions: DimensionDef[];
}

export interface AnalyticsQuery {
  factDomain: FactDomainId;
  measureId: string;
  primaryDimensionId: string;
  secondaryDimensionId?: string;
  aggregationFn?: AggregationType;
  chartType?: ChartType;
  selectedYear?: string;
  selectedDept?: string;
  sortBy?: 'value_desc' | 'value_asc' | 'label_asc';
  limit?: number;
}

export interface AggregatedSeries {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  fill?: boolean;
}

export interface AggregatedChartData {
  labels: string[];
  datasets: AggregatedSeries[];
  totalValue: number;
  averageValue: number;
  count: number;
  maxValue: number;
  minValue: number;
  format: FormatType;
  recommendedChartType: ChartType;
  recommendationReason: string;
  tableRows: {
    category: string;
    subCategory?: string;
    value: number;
    formattedValue: string;
    sharePercent: string;
  }[];
}

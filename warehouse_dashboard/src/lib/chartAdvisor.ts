import { ChartType, DimensionType } from '../types/analyticsBuilder';

export interface ChartRecommendation {
  recommended: ChartType;
  alternatives: ChartType[];
  reasonTh: string;
}

/**
 * แนะนำประเภทกราฟที่เหมาะสมที่สุดสำหรับชุดข้อมูล Fact, Measure และ Dimension ที่ผู้ใช้เลือก
 * รองรับคลังกราฟ 16 รูปแบบระดับมืออาชีพ
 */
export function recommendChartType(
  primaryDimType: DimensionType,
  hasSecondaryDim: boolean,
  categoriesCount: number,
  aggregation: string,
  primaryDimId?: string
): ChartRecommendation {
  // 1. มีมิติย่อยซ้อน (2 Dimensions: เช่น ภาควิชา x แหล่งทุน, หรือ ปีงบประมาณ x ระดับวารสาร)
  if (hasSecondaryDim) {
    if (primaryDimType === 'time') {
      return {
        recommended: 'stacked_area',
        alternatives: ['grouped_bar', 'stacked_bar', 'smooth_line', 'pivot'],
        reasonTh: 'ข้อมูลตามช่วงเวลาที่มีการแยกมิติย่อย เหมาะกับกราฟพื้นที่ซ้อน (Stacked Area) หรือกราฟแท่งแบบกลุ่ม (Grouped Bar) เพื่อเห็นแนวโน้มและสัดส่วนย่อยพร้อมกัน',
      };
    }
    return {
      recommended: 'stacked_bar',
      alternatives: ['grouped_bar', 'stacked_bar_percent', 'horizontal_bar', 'pivot'],
      reasonTh: 'การมีมิติย่อยซ้อน 2 ระดับ เหมาะสมที่สุดกับกราฟแท่งแบบเรียงซ้อน (Stacked Bar) หรือกราฟแท่งแบบกลุ่มเปรียบเทียบ (Grouped Bar) เพื่อเห็นสัดส่วนองค์ประกอบย่อยในแต่ละกลุ่ม',
    };
  }

  // 2. มิติด้านเวลา (Time Dimension: ปีงบประมาณ, ไตรมาส, เดือน)
  if (primaryDimType === 'time') {
    return {
      recommended: 'smooth_line',
      alternatives: ['area', 'bar', 'stepped_line', 'pivot'],
      reasonTh: 'มิติด้านเวลาเหมาะกับกราฟเส้นโค้งมนสมูท (Curved Spline Line) หรือกราฟพื้นที่ไล่เฉดสี (Filled Area) เพื่อแสดงทิศทางการเติบโตและแนวโน้มตามลำดับเวลา (Trend Analysis)',
    };
  }

  // 3. หมวดหมู่ที่เป็น 11 ภาควิชาหรือมีจำนวนกลุ่มมาก (> 7 กลุ่ม) -> แนวนอน หรือ Radar
  if (primaryDimId === 'department' || categoriesCount >= 8) {
    return {
      recommended: 'horizontal_bar',
      alternatives: ['bar', 'radar', 'donut', 'pivot'],
      reasonTh: 'ข้อมูลที่มีมากกว่า 7 กลุ่มหรือชื่อหมวดยาว (เช่น ภาควิชาหรือแหล่งทุน) เหมาะสมที่สุดกับกราฟแถบแนวนอน (Horizontal Bar) อ่านชื่อเต็มง่ายและเปรียบเทียบชัดเจน',
    };
  }

  // 4. หมวดหมู่น้อยกว่าหรือเท่ากับ 6 หมวด (เช่น ระดับวารสาร, สถานะโครงการ) -> Donut / Polar
  if (categoriesCount <= 6 && (aggregation === 'COUNT' || aggregation === 'SUM' || aggregation === 'PERCENT')) {
    return {
      recommended: 'donut',
      alternatives: ['polar', 'pie', 'bar', 'pivot'],
      reasonTh: 'ข้อมูลมีไม่เกิน 6 กลุ่ม เหมาะสมกับกราฟโดนัททรงโมเดิร์น (Modern Donut) หรือกราฟพื้นที่เชิงขั้ว (Polar Area) เพื่อเปรียบเทียบสัดส่วนเปอร์เซ็นต์อย่างชัดเจนและสะดุดตา',
    };
  }

  // 5. กรณีทั่วไป -> Bar Chart
  return {
    recommended: 'bar',
    alternatives: ['horizontal_bar', 'donut', 'smooth_line', 'radar', 'pivot'],
    reasonTh: 'ข้อมูลเชิงเปรียบเทียบระหว่างหมวดหมู่ เหมาะสมที่สุดกับกราฟแท่งแนวตั้ง (Vertical Column Bar) อ่านค่าง่าย แม่นยำ และเปรียบเทียบชัดเจน',
  };
}

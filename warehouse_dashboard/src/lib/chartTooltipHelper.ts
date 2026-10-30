import { extractItemBudget } from './sdgEngine';
import { formatMoney } from '@/components/ui/RecordDetailDrawer';

export interface RichTooltipOptions {
  maxItems?: number;
  showBudget?: boolean;
  clickHint?: string;
}

/**
 * สร้างบรรทัดข้อความเพิ่มเติมใน Tooltip ของ Chart.js (afterBody)
 * เพื่อแสดงรายชื่อโครงการ/ผลงานเด่น 3 อันดับแรกในแท่งกราฟนั้นโดยไม่ทำให้หน้าจอรกรุงรัง
 */
export function formatTopItemsForTooltip(
  items: any[],
  options: RichTooltipOptions = {}
): string[] {
  const {
    maxItems = 3,
    showBudget = true,
    clickHint = '',
  } = options;

  if (!items || items.length === 0) return [];

  // เรียงลำดับตามงบประมาณสูงสุดก่อน หากเท่ากันเรียงตามลำดับเดิม
  const sorted = [...items].sort((a, b) => extractItemBudget(b) - extractItemBudget(a));
  const top = sorted.slice(0, maxItems);

  const lines: string[] = ['────────────────────────'];
  lines.push(`ตัวอย่างรายการ (${items.length.toLocaleString()} รายการ):`);

  top.forEach((item) => {
    const rawName = String(item.name || item.title || item.topic_title || 'ไม่ระบุชื่อ').replace(/[\r\n]+/g, ' ').trim();
    const shortName = rawName.length > 48 ? `${rawName.slice(0, 48)}...` : rawName;
    const budget = extractItemBudget(item);
    const budgetSuffix = showBudget && budget > 0 ? ` (${formatMoney(budget)} บาท)` : '';
    lines.push(`• ${shortName}${budgetSuffix}`);
  });

  if (items.length > maxItems) {
    lines.push(`  (+ อีก ${(items.length - maxItems).toLocaleString()} รายการ)`);
  }

  if (clickHint) {
    lines.push(`▸ ${clickHint}`);
  }

  return lines;
}

/**
 * ดึง index และ datasetIndex จากการคลิกบน Chart.js
 * รองรับทั้งการคลิกบนแท่งกราฟโดยตรง และการคลิกบริเวณตัวเลข/แถวของแท่งกราฟที่มีขนาดเล็ก (intersect: false fallback)
 */
export function getClickedChartElement(
  event: any,
  elements: any[],
  chart: any,
  mode: 'x' | 'y' | 'nearest' = 'nearest'
): { index: number; datasetIndex: number } | null {
  if (elements && elements.length > 0) {
    return {
      index: elements[0].index,
      datasetIndex: elements[0].datasetIndex ?? 0,
    };
  }
  if (chart && event) {
    try {
      const nativeEvent = event.native || event;
      const found = chart.getElementsAtEventForMode(
        nativeEvent,
        mode,
        { intersect: false },
        true
      );
      if (found && found.length > 0) {
        return {
          index: found[0].index,
          datasetIndex: found[0].datasetIndex ?? 0,
        };
      }
    } catch {
      // ignore fallback errors
    }
  }
  return null;
}

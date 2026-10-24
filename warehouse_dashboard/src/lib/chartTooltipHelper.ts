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
    clickHint = 'คลิกที่กราฟเพื่อดูรายการในกลุ่มนี้',
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

/**
 * Centralized Navigation and Routing Configuration
 * Holds valid tab identifiers, display titles, icons, and route mapping rules.
 */

export interface MenuItemConfig {
  id: string;
  label: string;
  path: string;
  iconName: string;
  adminOnly?: boolean;
}

export const VALID_TABS = [
  "overview",
  "studio",
  "monitoring",
  "evaluation",
  "research",
  "academic",
  "publications",
  "service",
  "services", // legacy alias
  "ip",
  "kpi",
  "manage",
] as const;

export type TabKey = typeof VALID_TABS[number];

export const LEGACY_TAB_ALIASES: Record<string, string> = {
  services: "service",
};

export const TAB_TITLES: Record<string, string> = {
  overview: "แดชบอร์ด ภาพรวม",
  studio: "วิเคราะห์ข้อมูล (BI Studio)",
  monitoring: "ติดตามสถานะโครงการ",
  evaluation: "การประเมิน",
  research: "โครงการวิจัย",
  academic: "โครงการพัฒนาวิชาการ",
  publications: "ผลงานตีพิมพ์ทางวิชาการ",
  service: "งานบริการวิชาการ",
  services: "งานบริการวิชาการ",
  ip: "งานทรัพย์สินทางปัญญา",
  kpi: "ตัวชี้วัดตามแผนยุทธศาสตร์",
  manage: "ระบบจัดการข้อมูล",
};

export const MAIN_MENU_ITEMS: MenuItemConfig[] = [
  { id: "overview", label: "แดชบอร์ด ภาพรวม", path: "/overview", iconName: "FaThLarge" },
  { id: "studio", label: "วิเคราะห์ข้อมูล (BI Studio)", path: "/studio", iconName: "FaChartLine" },
  { id: "monitoring", label: "ติดตามสถานะโครงการ", path: "/monitoring", iconName: "FaClock" },
  { id: "evaluation", label: "การประเมิน", path: "/evaluation", iconName: "FaClipboardCheck" },
  { id: "research", label: "โครงการวิจัย", path: "/research", iconName: "FaFlask" },
  { id: "academic", label: "โครงการพัฒนาวิชาการ", path: "/academic", iconName: "FaGraduationCap" },
  { id: "publications", label: "ผลงานตีพิมพ์ทางวิชาการ", path: "/publications", iconName: "FaBook" },
  { id: "service", label: "งานบริการวิชาการ", path: "/service", iconName: "FaHandsHelping" },
  { id: "ip", label: "งานทรัพย์สินทางปัญญา", path: "/ip", iconName: "FaCertificate" },
  { id: "kpi", label: "ตัวชี้วัดตามแผนยุทธศาสตร์", path: "/kpi", iconName: "FaBullseye" },
];

export const ADMIN_MENU_ITEM: MenuItemConfig = {
  id: "manage",
  label: "ระบบจัดการข้อมูล",
  path: "/manage",
  iconName: "FaUserCog",
  adminOnly: true,
};

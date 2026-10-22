import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DashboardApp from "../../components/DashboardApp";

const VALID_TABS = [
  "overview",
  "studio",
  "research",
  "academic",
  "publications",
  "service",
  "services",
  "ip",
  "kpi",
  "manage",
];

const TAB_TITLES: Record<string, string> = {
  overview: "แดชบอร์ด ภาพรวม",
  studio: "วิเคราะห์ข้อมูล (BI Studio)",
  research: "โครงการวิจัย",
  academic: "โครงการพัฒนาวิชาการ",
  publications: "ผลงานตีพิมพ์ทางวิชาการ",
  service: "งานบริการวิชาการ",
  services: "งานบริการวิชาการ",
  ip: "งานทรัพย์สินทางปัญญา",
  kpi: "ตัวชี้วัดตามแผนยุทธศาสตร์",
  manage: "ระบบจัดการข้อมูล",
};

export function generateStaticParams() {
  return VALID_TABS.map((tab) => ({ tab }));
}

interface TabPageProps {
  params: Promise<{ tab: string }>;
}

export async function generateMetadata({ params }: TabPageProps): Promise<Metadata> {
  const { tab } = await params;
  const label = TAB_TITLES[tab.toLowerCase()] || "แดชบอร์ด";
  return {
    title: `${label} | ระบบคลังข้อมูลหน่วยวิจัยและนวัตกรรม คณะวิศวกรรมศาสตร์ กำแพงแสน มหาวิทยาลัยเกษตรศาสตร์`,
  };
}

export default async function TabPage({ params }: TabPageProps) {
  const { tab } = await params;
  const lowerTab = tab.toLowerCase();

  if (!VALID_TABS.includes(lowerTab)) {
    notFound();
  }

  const resolvedTab = lowerTab === "services" ? "service" : lowerTab;

  return <DashboardApp initialTab={resolvedTab} />;
}

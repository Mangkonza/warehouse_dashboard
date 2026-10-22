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

export function generateStaticParams() {
  return VALID_TABS.map((tab) => ({ tab }));
}

interface TabPageProps {
  params: Promise<{ tab: string }>;
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

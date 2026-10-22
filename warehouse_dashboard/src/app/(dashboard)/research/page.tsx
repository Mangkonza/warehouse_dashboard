import type { Metadata } from 'next';
import { ResearchView } from './_components/ResearchView';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `โครงการวิจัย | ${SITE_CONFIG.name}`,
};

export default function ResearchPage() {
  return <ResearchView />;
}

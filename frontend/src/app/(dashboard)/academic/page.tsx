import type { Metadata } from 'next';
import { AcademicView } from './_components/AcademicView';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `โครงการพัฒนาวิชาการ | ${SITE_CONFIG.name}`,
};

export default function AcademicPage() {
  return <AcademicView />;
}

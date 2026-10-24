import type { Metadata } from 'next';
import { OverviewView } from './_components/OverviewView';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `แดชบอร์ด ภาพรวม | ${SITE_CONFIG.name}`,
};

export default function OverviewPage() {
  return <OverviewView />;
}

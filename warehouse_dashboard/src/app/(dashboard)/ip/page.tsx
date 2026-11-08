import type { Metadata } from 'next';
import { IPView } from './_components/IPView';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: `งานทรัพย์สินทางปัญญา | ${SITE_CONFIG.name}`,
};

export default function IPPage() {
  return <IPView />;
}

import { PersonnelDetailView } from './_components/PersonnelDetailView';

interface PersonnelDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ name?: string }>;
}

export const metadata = {
  title: 'แฟ้มผลงานคณาจารย์และบุคลากร | คณะวิศวกรรมศาสตร์ กำแพงแสน',
  description: 'รายละเอียดผลงาน 5 พันธกิจหลักสะสมรายบุคคล',
};

export default async function PersonnelDetailPage({ params, searchParams }: PersonnelDetailPageProps) {
  const { id } = await params;
  const sp = searchParams ? await searchParams : undefined;
  return <PersonnelDetailView personnelId={id} fallbackName={sp?.name} />;
}
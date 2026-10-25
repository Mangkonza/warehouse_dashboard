import { PersonnelDetailView } from './_components/PersonnelDetailView';

interface PersonnelDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'แฟ้มผลงานอาจารย์และบุคลากร | คณะวิศวกรรมศาสตร์ กำแพงแสน',
  description: 'รายละเอียดผลงาน 5 พันธกิจหลักสะสมรายบุคคล',
};

export default async function PersonnelDetailPage({ params }: PersonnelDetailPageProps) {
  const { id } = await params;
  return <PersonnelDetailView personnelId={id} />;
}

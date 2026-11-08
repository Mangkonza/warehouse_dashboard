import { redirect } from 'next/navigation';

export default function NewIPPage() {
  redirect('/manage?tab=ip');
}

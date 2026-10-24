import { redirect } from 'next/navigation';

export default function EditIPPage() {
  redirect('/manage?tab=ip');
}

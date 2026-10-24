import { redirect } from 'next/navigation';

export default function NewPublicationPage() {
  redirect('/manage?tab=publications');
}

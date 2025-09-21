import { getCookie } from '@actions/auth-actions';
import dynamic from 'next/dynamic';

const RequestList = dynamic(
  () => import('@components').then((mod) => mod.RequestList),
  {
    loading: () => (
      <p className="text-center text-violet-950">Loading request history...</p>
    ),
  }
);

export default async function HistoryPage() {
  const userId = await getCookie('userUid');

  if (!userId) {
    return <div className="text-center">Authentication required</div>;
  }

  return <RequestList />;
}

import { getData } from '@/lib/db';
import WorshipManager from '@/components/admin/WorshipManager';

export default async function AdminWorshipPage() {
  const times = await getData('worship_times');
  
  return (
    <div className="admin-page">
      <WorshipManager initialTimes={times} />
    </div>
  );
}

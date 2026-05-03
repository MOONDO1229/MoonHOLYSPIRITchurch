import { getData } from '@/lib/db';
import WorshipManager from '@/components/admin/WorshipManager';

export default function AdminWorshipPage() {
  const times = getData('worship_times');
  
  return (
    <div className="admin-page">
      <WorshipManager initialTimes={times} />
    </div>
  );
}

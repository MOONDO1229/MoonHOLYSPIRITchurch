import { getData } from '@/lib/db';
import SermonManager from '@/components/admin/SermonManager';

export default function AdminSermonsPage() {
  const sermons = getData('sermons');
  
  return (
    <div className="admin-page">
      <SermonManager initialSermons={sermons} />
    </div>
  );
}

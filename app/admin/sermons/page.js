import { getData } from '@/lib/db';
import SermonManager from '@/components/admin/SermonManager';

export default async function AdminSermonsPage() {
  const sermons = await getData('sermons');
  
  return (
    <div className="admin-page">
      <SermonManager initialSermons={sermons} />
    </div>
  );
}

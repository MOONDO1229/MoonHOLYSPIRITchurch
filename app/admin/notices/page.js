import { getAllNotices } from '@/lib/db';
import NoticeManager from '@/components/admin/NoticeManager';

export default async function AdminNoticesPage() {
  const notices = await getAllNotices();
  
  return (
    <div className="admin-page">
      <NoticeManager initialNotices={notices} />
    </div>
  );
}

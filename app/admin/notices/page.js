import { getAllNotices } from '@/lib/db';
import NoticeManager from '@/components/admin/NoticeManager';

export default function AdminNoticesPage() {
  const notices = getAllNotices();
  
  return (
    <div className="admin-page">
      <NoticeManager initialNotices={notices} />
    </div>
  );
}

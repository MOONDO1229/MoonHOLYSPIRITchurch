import { getData } from '@/lib/db';
import BulletinManager from '@/components/admin/BulletinManager';

export default function AdminBulletinsPage() {
  const bulletins = getData('bulletins');
  
  return (
    <div className="admin-page">
      <BulletinManager initialBulletins={bulletins} />
    </div>
  );
}

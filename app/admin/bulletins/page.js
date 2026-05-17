import { getData } from '@/lib/db';
import BulletinManager from '@/components/admin/BulletinManager';

export default async function AdminBulletinsPage() {
  const bulletins = await getData('bulletins');
  
  return (
    <div className="admin-page">
      <BulletinManager initialBulletins={bulletins} />
    </div>
  );
}

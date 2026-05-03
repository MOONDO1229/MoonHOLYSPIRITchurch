import { getData } from '@/lib/db';
import PopupManager from '@/components/admin/PopupManager';

export default async function PopupsPage() {
  const popups = await getData('popups');
  
  return (
    <div className="admin-page">
      <PopupManager initialPopups={popups} />
    </div>
  );
}

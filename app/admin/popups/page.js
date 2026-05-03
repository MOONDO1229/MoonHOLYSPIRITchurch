import { getData } from '@/lib/db';
import PopupManager from '@/components/admin/PopupManager';

export default function PopupsPage() {
  const popups = getData('popups');
  
  return (
    <div className="admin-page">
      <PopupManager initialPopups={popups} />
    </div>
  );
}

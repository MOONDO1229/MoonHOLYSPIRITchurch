import { getData } from '@/lib/db';
import PopupList from '@/components/admin/PopupList';

export default function PopupsPage() {
  const popups = getData('popups');
  
  return (
    <div className="admin-page">
      <PopupList initialPopups={popups} />
    </div>
  );
}

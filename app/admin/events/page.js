import { getData } from '@/lib/db';
import EventManager from '@/components/admin/EventManager';

export default async function AdminEventsPage() {
  const events = await getData('events');
  
  return (
    <div className="admin-page">
      <EventManager initialEvents={events} />
    </div>
  );
}

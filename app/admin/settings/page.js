import { getSettings } from '@/lib/db';
import SettingsForm from '@/components/admin/SettingsForm';

export default function SettingsPage() {
  const settings = getSettings();
  
  return (
    <SettingsForm initialSettings={settings} />
  );
}

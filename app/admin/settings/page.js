import { getSettings } from '@/lib/db';
import SettingsForm from '@/components/admin/SettingsForm';

export default async function SettingsPage() {
  const settings = await getSettings();
  
  return (
    <SettingsForm initialSettings={settings} />
  );
}

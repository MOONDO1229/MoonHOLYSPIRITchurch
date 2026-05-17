import { getSettings } from '@/lib/db';
import LocationClient from './LocationClient';

export default async function LocationPage() {
  const settings = await getSettings();
  
  return <LocationClient settings={settings} />;
}

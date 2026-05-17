'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import PopupOverlay from '@/components/PopupOverlay';

export default function LayoutWrapper({ children, settings, popups }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  if (isAdminPage) {
    return <div id="admin-wrapper">{children}</div>;
  }

  return (
    <>
      {pathname === '/' && <PopupOverlay popups={popups} />}
      <Header settings={settings} />
      <div id="app-wrapper">
        {children}
        <Footer settings={settings} />
      </div>
    </>
  );
}

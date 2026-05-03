'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import PopupOverlay from '@/components/PopupOverlay';

export default function LayoutWrapper({ children, settings }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  if (isAdminPage) {
    return <div id="admin-wrapper">{children}</div>;
  }

  return (
    <>
      <PopupOverlay settings={settings} />
      <Header settings={settings} />
      <div id="app-wrapper" style={{ paddingBottom: '76px' }}>
        {children}
        <Footer />
      </div>
      <BottomNav />
    </>
  );
}

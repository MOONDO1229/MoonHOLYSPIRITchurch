import './globals.css';
import './church.css';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import PopupOverlay from '@/components/PopupOverlay';
import Footer from '@/components/Footer';
import { getActivePopups } from '@/lib/db';

export const metadata = {
  title: '퇴촌성령교회 - 어르신 친화형 홈페이지',
  description: '어르신들이 쉽고 편하게 이용하실 수 있는 퇴촌성령교회 홈페이지입니다.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  const activePopups = getActivePopups();

  return (
    <html lang="ko">
      <body>
        <PopupOverlay popups={activePopups} />
        <Header />
        <div id="app-wrapper" style={{ paddingBottom: '76px' }}>
          {children}
          <Footer />
        </div>
        <BottomNav />
      </body>
    </html>
  );
}

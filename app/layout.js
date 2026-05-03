import './globals.css';
import './church.css';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import PopupOverlay from '@/components/PopupOverlay';
import Footer from '@/components/Footer';
import { getSettings } from '@/lib/db';

export const metadata = {
  title: '퇴촌성령교회',
  description: '성령의 능력으로 세상을 변화시키는 퇴촌성령교회 홈페이지입니다.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // 주보 확대를 위해 스케일 제한 완화
  userScalable: true,
};

export default function RootLayout({ children }) {
  const settings = getSettings();
  const theme = settings.theme || { primaryColor: '#1b4d3e', secondaryColor: '#c9a55c' };

  return (
    <html lang="ko">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary-color: ${theme.primaryColor};
            --primary-dark: ${theme.primaryColor}dd;
            --secondary-color: ${theme.secondaryColor};
          }
        `}} />
      </head>
      <body>
        <PopupOverlay settings={settings} />
        <Header settings={settings} />
        <div id="app-wrapper" style={{ paddingBottom: '76px' }}>
          {children}
          <Footer />
        </div>
        <BottomNav />
      </body>
    </html>
  );
}

import './globals.css';
import './church.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import { getSettings, getActivePopups } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const metadata = {
  title: '퇴촌성령교회',
  description: '성령의 능력으로 세상을 변화시키는 퇴촌성령교회 홈페이지입니다.',
  icons: {
    icon: '/favicon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({ children }) {
  const settings = await getSettings();
  const activePopups = await getActivePopups();
  const theme = settings.theme || { primaryColor: '#1b4d3e', secondaryColor: '#c9a55c' };

  return (
    <html lang="ko">
      <head>
        <script src="https://unpkg.com/@phosphor-icons/web" async></script>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary-color: ${theme.primaryColor};
            --primary-dark: ${theme.primaryColor}dd;
            --secondary-color: ${theme.secondaryColor};
          }
        `}} />
      </head>
      <body>
        <LayoutWrapper settings={settings} popups={activePopups}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}

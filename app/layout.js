import './globals.css';
import './church.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import { getSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const metadata = {
  title: '퇴촌성령교회',
  description: '성령의 능력으로 세상을 변화시키는 퇴촌성령교회 홈페이지입니다.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({ children }) {
  const settings = await getSettings();
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
        <LayoutWrapper settings={settings}>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}

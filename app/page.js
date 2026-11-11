import { getSettings, getLatestSermon, getNotices, getLatestBulletin } from '@/lib/db';
import HomeSections from '@/components/HomeSections';
import Link from 'next/link';
import { Play, Calendar, ChevronRight, MapPin, Phone, Mail } from 'lucide-react';

export default async function Home() {
  const settings = await getSettings();
  const latestSermon = await getLatestSermon();
  const notices = (await getNotices()).slice(0, 3);
  const latestBulletin = await getLatestBulletin();

  return (
    <main>
      {/* Hero Section */}
      <header className="relative bg-brand-dark overflow-hidden py-32 md:py-48 lg:py-72 flex items-center justify-center hero-section-container min-h-[500px] md:min-h-[700px]">
        {/* Actual background image if provided */}
        {settings.churchImage && (
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${settings.churchImage})` }}
          ></div>
        )}


      </header>

      {/* Quick Links Menu */}
      <section className="relative z-30 max-w-6xl mx-auto px-6 -mt-16 mb-24 quick-menu-container">
        <div className="quick-menu-grid bg-white rounded-3xl shadow-md p-4 md:p-8 border border-gray-100/50">
          <Link href="/worship" className="quick-card group">
            <div className="icon-bg bg-blue-50">🙏</div>
            <span className="card-title">예배시간</span>
          </Link>
          <Link href="/location" className="quick-card group">
            <div className="icon-bg bg-red-50">📍</div>
            <span className="card-title">오시는길</span>
          </Link>
          <Link href="/album" className="quick-card group">
            <div className="icon-bg bg-orange-50">📸</div>
            <span className="card-title">교회 앨범</span>
          </Link>
          <Link href="/about#support" className="quick-card group">
            <div className="icon-bg bg-pink-50">💝</div>
            <span className="card-title">헌금안내</span>
          </Link>
        </div>
      </section>

      <HomeSections 
        settings={settings} 
        latestSermon={latestSermon} 
        notices={notices}
        latestBulletin={latestBulletin}
      />
    </main>
  );
}

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
      <header className="relative bg-brand-dark overflow-hidden py-24 md:py-32 lg:py-48 flex items-center justify-center hero-section-container">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#2A2320]/80 z-10"></div>
        
        {/* Actual background image if provided */}
        {settings.churchImage && (
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${settings.churchImage})` }}
          ></div>
        )}

        {/* Decorative subtle cross in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] z-10 pointer-events-none">
          <i className="ph-fill ph-cross text-[600px] text-white"></i>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* High-Contrast Premium Text Box */}
          <div className="hero-premium-box p-8 md:p-32 rounded-[40px] relative overflow-hidden animate-in zoom-in-95 duration-1000 max-w-7xl mx-auto">
            {/* Elegant Corner Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-gold/10 to-transparent rounded-bl-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="inline-block px-5 py-2 rounded-full bg-brand-dark/5 border border-brand-dark/10 text-brand-dark text-sm font-bold mb-8 tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-700">
                {settings?.welcomeBadge || "성령교회에 오신 것을 환영합니다"}
              </div>
              
              <h1 className="text-4xl md:text-8xl font-black text-brand-dark mb-6 md:mb-10 tracking-tighter leading-[1] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 text-shadow-premium">
                {settings?.welcomeTitle || "성령교회"}
              </h1>
              
              <p className="text-lg md:text-2xl text-brand-muted font-medium mb-12 max-w-4xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
                {settings.welcomeSubtitle || '성령의 능력으로 세상을 변화시키는 교회'}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
                <Link href="/worship" 
                  className="w-full sm:w-auto px-10 py-4.5 md:px-14 md:py-5 text-white text-base md:text-xl font-black rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  <i className="ph-fill ph-calendar-check text-xl md:text-2xl"></i> 예배 안내
                </Link>
                <Link href="/about" 
                  className="w-full sm:w-auto px-10 py-4.5 md:px-14 md:py-5 bg-white border-2 border-gray-100 text-brand-dark text-base md:text-xl font-black rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
                >
                  <i className="ph-fill ph-info text-xl md:text-2xl" style={{ color: 'var(--primary-color)' }}></i> 교회 소개
                </Link>
              </div>
            </div>
          </div>
        </div>
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
          <Link href="/news" className="quick-card group">
            <div className="icon-bg bg-orange-50">📢</div>
            <span className="card-title">교회소식</span>
          </Link>
          <Link href="/support" className="quick-card group">
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

      {/* Quick Contact Bar */}
      <section className="bg-gray-100 py-12 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-lg text-brand-dark font-medium">
          <div className="flex items-center gap-3">
            <i className="ph ph-map-pin text-2xl text-brand-gold"></i>
            <span>{settings.address || '경기도 광주시 퇴촌면 광동로52번길 27'}</span>
          </div>
          <div className="flex items-center gap-3">
            <i className="ph ph-phone text-2xl text-brand-gold"></i>
            <span>{settings.phone || '031-766-8847'}</span>
          </div>
          <div className="flex items-center gap-3">
            <i className="ph ph-envelope-simple text-2xl text-brand-gold"></i>
            <span>{settings.email || 'spirit-church@church.com'}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

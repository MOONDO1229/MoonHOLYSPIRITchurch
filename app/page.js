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
      {/* 히어로 섹션: Admin에서 업로드한 이미지 반영 */}
      <section className="hero-section" style={{
        backgroundImage: settings.churchImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${settings.churchImage})` : 'none',
        backgroundColor: settings.churchImage ? 'transparent' : 'var(--primary-color)'
      }}>
        <div className="container hero-content">
          <div className="hero-badge">퇴촌성령교회에 오신 것을 환영합니다</div>
          <h1>{settings.welcomeTitle}</h1>
          <p className="hero-subtitle">{settings.welcomeSubtitle}</p>
          <div className="hero-btns">
            <Link href="/worship" className="btn-hero-primary">예배 안내</Link>
            <Link href="/about" className="btn-hero-secondary">교회 소개</Link>
          </div>
        </div>
      </section>

      {/* 퀵 메뉴 */}
      <section className="quick-menu-container">
        <div className="container">
          <div className="quick-menu-grid">
            <Link href="/worship" className="quick-item">
              <div className="qi-icon">🙏</div>
              <span>예배시간</span>
            </Link>
            <Link href="/location" className="quick-item">
              <div className="qi-icon">📍</div>
              <span>오시는길</span>
            </Link>
            <Link href="/news" className="quick-item">
              <div className="qi-icon">📢</div>
              <span>교회소식</span>
            </Link>
            <Link href="/support" className="quick-item">
              <div className="qi-icon">💝</div>
              <span>헌금안내</span>
            </Link>
          </div>
        </div>
      </section>

      <HomeSections 
        settings={settings} 
        latestSermon={latestSermon} 
        notices={notices}
        latestBulletin={latestBulletin}
      />

      {/* 하단 연락처 바 */}
      <section className="bottom-info-bar">
        <div className="container bib-inner">
          <div className="bib-item">
            <MapPin size={20} />
            <span>{settings.address || '경기도 광주시 퇴촌면 광동로52번길 27'}</span>
          </div>
          <div className="bib-item">
            <Phone size={20} />
            <span>{settings.phone || '031 766 8847'}</span>
          </div>
          <div className="bib-item">
            <Mail size={20} />
            <span>{settings.email || 'tc-spirit@church.com'}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

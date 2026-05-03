'use client';
import Link from 'next/link';
import { PlayCircle, BookOpen, Video, MapPin, UserPlus, Heart, Phone, Clock, Megaphone } from 'lucide-react';

export function HeroBanner({ settings }) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <span className="badge">오늘의 말씀</span>
        <h2 className="hero-title">{settings?.welcomeTitle || '퇴촌성령교회'}</h2>
        {settings?.welcomeSubtitle && <p className="hero-desc">{settings.welcomeSubtitle}</p>}
        <div className="hero-btns">
          <Link href="/worship" className="btn btn-primary">예배 시간 안내</Link>
          <Link href="/location" className="btn btn-secondary">오시는 길</Link>
        </div>
      </div>
    </section>
  );
}

export function QuickMenuGrid() {
  const menus = [
    { icon: <Clock size={40} />, label: '예배시간', href: '/worship', color: '#3498db' },
    { icon: <BookOpen size={40} />, label: '주보보기', href: '/bulletin', color: '#27ae60' },
    { icon: <Video size={40} />, label: '설교듣기', href: '/sermon', color: '#e67e22' },
    { icon: <Megaphone size={40} />, label: '교회소식', href: '/notices', color: '#e74c3c' },
    { icon: <MapPin size={40} />, label: '오시는 길', href: '/location', color: '#9b59b6' },
    { icon: <UserPlus size={40} />, label: '새가족 안내', href: '/newcomer', color: '#1abc9c' },
    { icon: <Heart size={40} />, label: '온라인헌금', href: '/support', color: '#f1c40f' },
    { icon: <Phone size={40} />, label: '전화문의', href: 'tel:031-766-8847', color: '#34495e' },
  ];

  return (
    <section className="container section">
      <div className="quick-menu-grid">
        {menus.map((menu, i) => (
          <Link key={i} href={menu.href} className="menu-card">
            <div className="icon-wrap" style={{ backgroundColor: menu.color }}>{menu.icon}</div>
            <span className="menu-label">{menu.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function WelcomeCTA() {
  return (
    <section className="live-cta">
      <div className="container live-inner">
        <div className="live-content">
          <h3>함께 예배드리는 기쁨, 퇴촌성령교회</h3>
          <p>예수님의 사랑이 넘치는 공동체로 여러분을 초대합니다.</p>
        </div>
        <Link href="/notices" className="btn btn-secondary live-btn">
          <Megaphone size={24} /> 교회 소식 보기
        </Link>
      </div>
    </section>
  );
}

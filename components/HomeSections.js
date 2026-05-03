'use client';
import Link from 'next/link';
import { PlayCircle, BookOpen, Video, MapPin, UserPlus, Heart, Phone, Clock } from 'lucide-react';

export function HeroBanner({ settings }) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <span className="badge">오늘의 말씀</span>
        <h2 className="hero-title">{settings?.welcomeTitle || '주와 함께 동행하는 은혜의 하루'}</h2>
        <p className="hero-desc">{settings?.welcomeSubtitle || '은혜샘교회는 당신을 위해 항상 기도합니다.'}</p>
        <div className="hero-btns">
          <Link href="/worship" className="btn btn-primary">오늘의 예배 보기</Link>
          <Link href="/newcomer" className="btn btn-secondary">처음 오셨나요?</Link>
        </div>
      </div>
    </section>
  );
}

export function QuickMenuGrid() {
  const menus = [
    { icon: <Clock size={40} />, label: '예배시간', href: '/worship', color: '#3498db' },
    { icon: <BookOpen size={40} />, label: '주보보기', href: '/bulletin', color: '#27ae60' },
    { icon: <Video size={40} />, label: '설교듣기', href: '/sermons', color: '#e67e22' },
    { icon: <PlayCircle size={40} />, label: '생방송보기', href: '/live', color: '#e74c3c' },
    { icon: <MapPin size={40} />, label: '오시는 길', href: '/location', color: '#9b59b6' },
    { icon: <UserPlus size={40} />, label: '새가족 안내', href: '/newcomer', color: '#1abc9c' },
    { icon: <Heart size={40} />, label: '온라인헌금', href: '/support', color: '#f1c40f' },
    { icon: <Phone size={40} />, label: '전화문의', href: 'tel:02-123-4567', color: '#34495e' },
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

export function LiveCTA() {
  return (
    <section className="live-cta">
      <div className="container live-inner">
        <div className="live-content">
          <h3>지금 예배를 드릴 수 있습니다</h3>
          <p>오늘의 실시간 예배와 지난 예배 영상을 확인하세요.</p>
        </div>
        <Link href="/live" className="btn btn-secondary live-btn">
          <PlayCircle size={32} /> 생방송 바로가기
        </Link>
      </div>
    </section>
  );
}

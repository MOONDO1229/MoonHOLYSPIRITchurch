'use client';
import '../admin.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Bell, 
  Image, 
  BookOpen, 
  Video, 
  Clock, 
  Settings, 
  Home, 
  History, 
  LogOut,
  CalendarDays
} from 'lucide-react';

import { useState } from 'react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: '대시보드' },
    { href: '/admin/settings', icon: Settings, label: '사이트 설정' },
    { href: '/admin/popups', icon: Image, label: '팝업 포스터 관리' },
  ];

  const contentItems = [
    { href: '/admin/notices', icon: Bell, label: '공지사항 관리' },
    { href: '/admin/bulletins', icon: BookOpen, label: '주보 관리' },
    { href: '/admin/sermons', icon: Video, label: '설교 관리' },
    { href: '/admin/events', icon: CalendarDays, label: '교회 행사 관리' },
    { href: '/admin/worship', icon: Clock, label: '예배시간 관리' },
  ];

  const systemItems = [
    { href: '/admin/audit-logs', icon: History, label: '수정 이력 확인' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          성령교회 관리
        </div>
        
        <nav className="admin-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                <item.icon size={22} /> {item.label}
              </Link>
            );
          })}

          <div className="nav-section-title">콘텐츠 관리</div>
          {contentItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                <item.icon size={22} /> {item.label}
              </Link>
            );
          })}

          <div className="nav-section-title">시스템</div>
          {systemItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                <item.icon size={22} /> {item.label}
              </Link>
            );
          })}

          <div className="nav-footer">
            <Link href="/" target="_blank" className="nav-home-link">
              <Home size={22} /> 홈페이지 가기
            </Link>
          </div>

          <button 
            onClick={() => setShowLogoutModal(true)}
            className="btn-logout-sidebar"
          >
            <LogOut size={22} /> 로그아웃
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">
              <LogOut size={40} />
            </div>
            <h2 className="modal-title">로그아웃 하시겠습니까?</h2>
            <p className="modal-desc">
              로그아웃하시면 관리자 세션이 종료됩니다.<br/>
              다시 로그인하려면 관리자 계정 정보가 필요합니다.
            </p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="btn-modal-cancel"
              >
                취소
              </button>
              <button 
                onClick={handleLogout}
                className="btn-modal-confirm"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

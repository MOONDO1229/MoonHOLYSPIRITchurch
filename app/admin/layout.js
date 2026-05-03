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
  LogOut 
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await fetch('/api/auth/login', { method: 'DELETE' });
      router.push('/login');
      router.refresh();
    }
  };

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: '대시보드' },
    { href: '/admin/settings', icon: Settings, label: '사이트 설정' },
  ];

  const contentItems = [
    { href: '/admin/notices', icon: Bell, label: '공지사항 관리' },
    { href: '/admin/bulletins', icon: BookOpen, label: '주보 관리' },
    { href: '/admin/sermons', icon: Video, label: '설교 관리' },
    { href: '/admin/worship', icon: Clock, label: '예배시간 관리' },
  ];

  const systemItems = [
    { href: '/admin/popups', icon: Image, label: '팝업 포스터 관리' },
    { href: '/admin/audit-logs', icon: History, label: '수정 이력 확인' },
  ];

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f4f7f6' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ 
        width: '280px', 
        background: '#1a1a1a', 
        color: 'white', 
        padding: '30px 20px', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }}>
        <div className="admin-logo" style={{ 
          fontSize: '1.4rem', 
          fontWeight: '900', 
          marginBottom: '30px', 
          paddingBottom: '20px', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}>
          퇴촌성령교회 관리자
        </div>
        
        <nav className="admin-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, overflowY: 'auto' }}>
          {/* Main Menus */}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', textDecoration: 'none',
                  color: isActive ? 'white' : '#aaa', background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  fontWeight: isActive ? '700' : '500', transition: 'all 0.2s'
                }}>
                <item.icon size={20} /> {item.label}
              </Link>
            );
          })}

          <div style={{ margin: '15px 0 10px', paddingLeft: '16px', fontSize: '0.75rem', color: '#555', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>콘텐츠 관리</div>
          {contentItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', textDecoration: 'none',
                  color: isActive ? 'white' : '#aaa', background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  fontWeight: isActive ? '700' : '500', transition: 'all 0.2s'
                }}>
                <item.icon size={20} /> {item.label}
              </Link>
            );
          })}

          <div style={{ margin: '15px 0 10px', paddingLeft: '16px', fontSize: '0.75rem', color: '#555', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>시스템 & 도구</div>
          {systemItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', textDecoration: 'none',
                  color: isActive ? 'white' : '#aaa', background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  fontWeight: isActive ? '700' : '500', transition: 'all 0.2s'
                }}>
                <item.icon size={20} /> {item.label}
              </Link>
            );
          })}
          
          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#aaa', textDecoration: 'none', transition: '0.2s' }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = '#aaa'}>
              <Home size={20} /> 홈페이지 가기
            </Link>
          </div>
        </nav>

        <button 
          onClick={handleLogout}
          style={{
            marginTop: 'auto',
            background: 'rgba(231, 76, 60, 0.1)',
            color: '#e74c3c',
            border: 'none',
            padding: '14px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <LogOut size={18} /> 로그아웃
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main" style={{ 
        flexGrow: 1, 
        marginLeft: '280px', 
        padding: '40px',
        minHeight: '100vh'
      }}>
        {children}
      </main>
    </div>
  );
}

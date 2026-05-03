'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Video, Clock, Users, Settings, Home, History, LogOut } from 'lucide-react';

// Megaphone icon component defined outside to avoid initialization error
const MegaphoneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
  </svg>
);

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
    { href: '/admin/notices', icon: MegaphoneIcon, label: '공지사항 관리' },
    { href: '/admin/bulletins', icon: FileText, label: '주보 관리' },
    { href: '/admin/sermons', icon: Video, label: '설교 관리' },
    { href: '/admin/worship', icon: Clock, label: '예배시간 관리' },
    { href: '/admin/staff', icon: Users, label: '교역자 관리' },
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
          marginBottom: '40px', 
          paddingBottom: '20px', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center'
        }}>
          퇴촌성령교회 관리자
        </div>
        
        <nav className="admin-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: isActive ? 'white' : '#aaa',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  fontWeight: isActive ? '700' : '500',
                  transition: 'all 0.2s'
                }}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
          
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Link href="/admin/settings" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#aaa', textDecoration: 'none' }}>
              <Settings size={20} /> 사이트 설정
            </Link>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#aaa', textDecoration: 'none' }}>
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

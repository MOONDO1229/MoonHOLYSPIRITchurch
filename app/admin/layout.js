'use client';
import Link from 'next/link';
import { LayoutDashboard, FileText, Video, Clock, Users, Settings, Home, History, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await fetch('/api/auth/login', { method: 'DELETE' });
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          교회 홈페이지 관리
        </div>
        <nav className="admin-nav">
          <Link href="/admin"><LayoutDashboard /> 대시보드</Link>
          <Link href="/admin/notices"><FileText /> 공지사항 관리</Link>
          <Link href="/admin/bulletins"><FileText /> 주보 관리</Link>
          <Link href="/admin/sermons"><Video /> 설교 관리</Link>
          <Link href="/admin/worship"><Clock /> 예배시간 관리</Link>
          <Link href="/admin/staff"><Users /> 교역자 관리</Link>
          <Link href="/admin/audit-logs"><History /> 수정 이력 확인</Link>
          <hr />
          <Link href="/admin/settings"><Settings /> 사이트 설정</Link>
          <Link href="/"><Home /> 홈페이지 가기</Link>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={18} /> 로그아웃
          </button>
        </nav>
      </aside>

      {/* Admin Content */}
      <main className="admin-main">
        {children}
      </main>

    </div>
  );
}

import { 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  FileText, 
  Video, 
  Megaphone, 
  Settings, 
  Clock, 
  ChevronRight, 
  Bell, 
  Image, 
  BookOpen,
  History,
  Activity,
  ArrowUpRight,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { getLatestSermon, getLatestBulletin, getAllNotices, getSettings } from '@/lib/db';

export default function AdminDashboard() {
  const latestSermon = getLatestSermon();
  const latestBulletin = getLatestBulletin();
  const allNotices = getAllNotices().slice(0, 5);
  const settings = getSettings();

  const today = new Date();
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - today.getDay());
  const lastSundayStr = lastSunday.toISOString().split('T')[0];

  const hasSermonThisWeek = latestSermon && latestSermon.date >= lastSundayStr;
  const hasBulletinThisWeek = latestBulletin && latestBulletin.date >= lastSundayStr;

  return (
    <div className="admin-dashboard-premium" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header with Glassmorphism Effect */}
      <div className="dashboard-header" style={{ 
        marginBottom: '40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1b4d3e 0%, #0a2e24 100%)',
        padding: '40px',
        borderRadius: '24px',
        color: 'white',
        boxShadow: '0 20px 40px rgba(27,77,62,0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>안녕하세요, 관리자님</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '8px', fontSize: '1.1rem' }}>성령교회 홈페이지를 최신 상태로 유지하고 있습니다.</p>
        </div>
        <div style={{ 
          position: 'relative', 
          zIndex: 1,
          padding: '12px 24px', 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '16px', 
          fontWeight: '700', 
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Clock size={20} />
          {today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </div>
        {/* Background Decorative Element */}
        <div style={{ 
          position: 'absolute', 
          top: '-20%', 
          right: '-5%', 
          width: '300px', 
          height: '300px', 
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
      </div>
      
      {/* Status Bento Grid */}
      <div className="bento-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px', 
        marginBottom: '40px' 
      }}>
        <StatusCard 
          icon={<BookOpen size={24} />}
          title="이번 주 주보"
          value={hasBulletinThisWeek ? '업로드 완료' : '업로드 필요'}
          desc={`최근 등록: ${latestBulletin?.date || '없음'}`}
          status={hasBulletinThisWeek ? 'success' : 'warning'}
          href="/admin/bulletins"
        />
        <StatusCard 
          icon={<Video size={24} />}
          title="이번 주 설교"
          value={hasSermonThisWeek ? '업로드 완료' : '업로드 필요'}
          desc={`최근 등록: ${latestSermon?.date || '없음'}`}
          status={hasSermonThisWeek ? 'success' : 'warning'}
          href="/admin/sermons"
        />
        <StatusCard 
          icon={<Image size={24} />}
          title="팝업 공지"
          value={settings.popup?.enabled ? '노출 중' : '비활성'}
          desc="메인 화면 팝업 게시 상태"
          status={settings.popup?.enabled ? 'success' : 'info'}
          href="/admin/popups"
        />
        <StatusCard 
          icon={<Activity size={24} />}
          title="시스템 리포트"
          value="정상 작동"
          desc="모든 서비스가 원활합니다."
          status="success"
          href="/admin/audit-logs"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '30px', marginBottom: '40px' }}>
        {/* Recent Activity List */}
        <div style={{ background: 'white', padding: '35px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={24} color="#1b4d3e" /> 최근 게시물 현황
            </h3>
            <Link href="/admin/notices" className="view-all-btn">
              전체보기 <ArrowUpRight size={18}/>
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {allNotices.length > 0 ? allNotices.map((notice, idx) => (
              <div key={idx} className="notice-item" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '18px 24px', 
                background: '#fcfcfc', 
                borderRadius: '16px',
                border: '1px solid #f0f0f0',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    background: notice.category === '긴급' ? '#e74c3c' : '#27ae60' 
                  }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#2c3e50', marginBottom: '4px' }}>{notice.title}</div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{notice.date} • <span style={{ color: '#64748b' }}>{notice.category}</span></div>
                  </div>
                </div>
                <div style={{ 
                  padding: '6px 16px', 
                  background: '#f1f5f9', 
                  color: '#475569', 
                  borderRadius: '100px', 
                  fontSize: '0.85rem', 
                  fontWeight: '700' 
                }}>
                  게시완료
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                <Activity size={40} style={{ opacity: 0.2, marginBottom: '15px' }} />
                <p>아직 등록된 공지사항이 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Quick Actions */}
        <div style={{ 
          background: 'linear-gradient(180deg, #1b4d3e 0%, #153a2f 100%)', 
          padding: '35px', 
          borderRadius: '24px', 
          color: 'white', 
          boxShadow: '0 20px 50px rgba(27,77,62,0.2)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ margin: '0 0 30px 0', fontSize: '1.5rem', fontWeight: '800', color: 'rgba(255,255,255,0.95)' }}>퀵 액션 가이드</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flexGrow: 1 }}>
            <QuickAction icon={<Plus size={24} />} title="새 주보 등록" desc="이번 주 주보 파일을 업로드합니다." href="/admin/bulletins" />
            <QuickAction icon={<Video size={24} />} title="설교 영상 게시" desc="유튜브 설교 영상을 업데이트합니다." href="/admin/sermons" />
            <QuickAction icon={<Settings size={24} />} title="사이트 전체 설정" desc="교회 로고 및 프로필 정보를 수정합니다." href="/admin/settings" />
          </div>
          <Link href="/" style={{ 
            marginTop: 'auto',
            padding: '20px', 
            background: 'white', 
            color: '#1b4d3e', 
            borderRadius: '18px', 
            fontWeight: '800', 
            textDecoration: 'none',
            textAlign: 'center',
            fontSize: '1.1rem',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <Home size={20} /> 홈페이지로 바로가기
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ icon, title, value, desc, status, href }) {
  const colors = {
    success: { border: '#27ae60', bg: '#f1f9f5', icon: '#27ae60' },
    warning: { border: '#f1c40f', bg: '#fef9e7', icon: '#d4ac0d' },
    info: { border: '#3498db', bg: '#ebf5fb', icon: '#3498db' }
  };
  
  const current = colors[status] || colors.info;

  return (
    <Link href={href} style={{ 
      background: 'white',
      borderRadius: '24px',
      padding: '30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      border: '1px solid #f0f0f0',
      borderLeft: `8px solid ${current.border}`,
      textDecoration: 'none',
      color: 'inherit',
      display: 'block'
    }} className="status-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', fontWeight: '700', marginBottom: '20px', fontSize: '1rem' }}>
        <div style={{ padding: '8px', background: current.bg, color: current.icon, borderRadius: '12px' }}>{icon}</div>
        {title}
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b', marginBottom: '8px', letterSpacing: '-0.02em' }}>
        {value}
      </div>
      <div style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{desc}</div>
    </Link>
  );
}

function QuickAction({ icon, title, desc, href }) {
  return (
    <Link href={href} style={{ 
      display: 'flex', 
      gap: '20px', 
      alignItems: 'center', 
      textDecoration: 'none', 
      color: 'inherit',
      padding: '20px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '20px',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.3s'
    }} className="quick-action-card">
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '14px', 
        borderRadius: '16px',
        color: 'white'
      }}>{icon}</div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '1.15rem', color: 'white' }}>{title}</div>
        <p style={{ margin: '4px 0 0 0', opacity: 0.7, fontSize: '0.95rem', fontWeight: '500' }}>{desc}</p>
      </div>
    </Link>
  );
}

import { CheckCircle, AlertCircle, Plus, FileText, Video, Megaphone, Settings, User, Clock, ChevronRight } from 'lucide-react';
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

  const cardStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid #f0f0f0',
    display: 'block',
    textDecoration: 'none'
  };

  return (
    <div className="admin-dashboard-v2" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#1a1a1a', margin: 0 }}>교회 운영 현황</h1>
          <p style={{ color: '#666', marginTop: '5px', fontSize: '1.1rem' }}>성령교회 홈페이지의 주요 업데이트 상태를 확인하세요.</p>
        </div>
        <div style={{ padding: '10px 20px', background: 'white', borderRadius: '30px', fontWeight: '700', border: '1px solid #eee' }}>
          {today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ ...cardStyle, borderTop: `6px solid ${hasBulletinThisWeek ? '#27ae60' : '#f1c40f'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontWeight: '700', marginBottom: '15px' }}>
            <FileText size={20} /> 이번 주 주보
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2c3e50' }}>
            {hasBulletinThisWeek ? '업로드 완료' : '업로드 필요'}
          </div>
          <p style={{ marginTop: '10px', color: '#999', fontSize: '0.9rem' }}>최근 등록: {latestBulletin?.date || '없음'}</p>
        </div>

        <div style={{ ...cardStyle, borderTop: `6px solid ${hasSermonThisWeek ? '#27ae60' : '#f1c40f'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontWeight: '700', marginBottom: '15px' }}>
            <Video size={20} /> 이번 주 설교
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2c3e50' }}>
            {hasSermonThisWeek ? '업로드 완료' : '업로드 필요'}
          </div>
          <p style={{ marginTop: '10px', color: '#999', fontSize: '0.9rem' }}>최근 등록: {latestSermon?.date || '없음'}</p>
        </div>

        <div style={{ ...cardStyle, borderTop: `6px solid ${settings.popup?.enabled ? '#27ae60' : '#bdc3c7'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontWeight: '700', marginBottom: '15px' }}>
            <Megaphone size={20} /> 팝업 공지
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2c3e50' }}>
            {settings.popup?.enabled ? '사용 중' : '미사용'}
          </div>
          <p style={{ marginTop: '10px', color: '#999', fontSize: '0.9rem' }}>홈페이지 상단 팝업 노출 상태</p>
        </div>

        <div style={{ ...cardStyle, borderTop: '6px solid #3498db' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontWeight: '700', marginBottom: '15px' }}>
            <Clock size={20} /> 시스템 상태
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2c3e50' }}>정상 작동</div>
          <p style={{ marginTop: '10px', color: '#999', fontSize: '0.9rem' }}>데이터베이스 연결 안정적</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>최근 공지사항 내역</h3>
            <Link href="/admin/notices" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
              전체보기 <ChevronRight size={16}/>
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {allNotices.map((notice, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' }}>{notice.title}</div>
                  <div style={{ fontSize: '0.9rem', color: '#999' }}>{notice.date} • {notice.category}</div>
                </div>
                <span style={{ padding: '4px 12px', background: '#eef2f0', color: '#1b4d3e', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' }}>
                  {notice.status || '게시중'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...cardStyle, background: '#1b4d3e', color: 'white' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.4rem', fontWeight: '800' }}>빠른 작업 가이드</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '10px' }}><Plus size={24}/></div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>새 주보 올리기</div>
                <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '0.95rem' }}>예배 후 주보 사진 2장을 등록하세요.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '10px' }}><Video size={24}/></div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>설교 영상 업데이트</div>
                <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '0.95rem' }}>유튜브 링크만 넣으면 바로 등록됩니다.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '10px' }}><Settings size={24}/></div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>교회 정보 수정</div>
                <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '0.95rem' }}>전화번호나 주소 변경 시 사용하세요.</p>
              </div>
            </div>
          </div>
          <button style={{ width: '100%', marginTop: '30px', padding: '15px', background: 'white', color: '#1b4d3e', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>
            관리자 매뉴얼 보기
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <Link href="/admin/bulletins" className="dashboard-link-card" style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: '#27ae60', color: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <FileText size={30} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#2c3e50' }}>주보 관리</span>
        </Link>
        <Link href="/admin/sermons" className="dashboard-link-card" style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: '#2980b9', color: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <Video size={30} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#2c3e50' }}>설교 관리</span>
        </Link>
        <Link href="/admin/notices" className="dashboard-link-card" style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: '#f39c12', color: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <Megaphone size={30} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#2c3e50' }}>공지사항</span>
        </Link>
        <Link href="/admin/settings" className="dashboard-link-card" style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', background: '#8e44ad', color: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <Settings size={30} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#2c3e50' }}>전체 설정</span>
        </Link>
      </div>
    </div>
  );
}

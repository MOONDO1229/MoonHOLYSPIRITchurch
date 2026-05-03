import { HeroBanner, QuickMenuGrid, LiveCTA } from '@/components/HomeSections';
import { getNotices, getSermons, getLatestBulletin, getSettings } from '@/lib/db';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const notices = getNotices().filter(n => n.status === '게시').slice(0, 3);
  const sermons = getSermons().filter(s => s.status === '게시').sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 1);
  const latestBulletin = getLatestBulletin();
  const settings = getSettings();

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <main>
      <HeroBanner settings={settings} />
      <LiveCTA />
      <QuickMenuGrid />

      {/* Latest Bulletin Section */}
      <section className="container section">
        <div className="section-header">
          <h2>이번 주 주보</h2>
          <Link href="/bulletin" className="more-link">전체보기 <ChevronRight size={20} /></Link>
        </div>
        {latestBulletin && (
          <div className="bulletin-card">
            <div className="bulletin-info">
              <h3>{latestBulletin.title}</h3>
              <p className="summary">{latestBulletin.summary?.notices?.substring(0, 100)}...</p>
              <div className="bulletin-actions">
                <Link href={`/bulletin/${latestBulletin.id}`} className="btn btn-outline">모바일 요약 주보 읽기</Link>
                <a href={latestBulletin.pdf_url} download className="btn btn-primary">주보 다운로드 (PDF)</a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Latest Sermon Section */}
      <section className="container section bg-offset">
        <div className="section-header">
          <h2>최신 설교</h2>
          <Link href="/sermon" className="more-link">전체보기 <ChevronRight size={20} /></Link>
        </div>
        {sermons[0] && (
          <div className="sermon-main-card">
            <div className="video-thumb">
              <img src={sermons[0].thumbnail || `https://img.youtube.com/vi/${getYoutubeId(sermons[0].youtube_url)}/0.jpg`} alt={sermons[0].title} />
              <div className="play-overlay">▶</div>
              <Link href={`/sermon`} className="stretched-link" />
            </div>
            <div className="sermon-info">
              <span className="type">{sermons[0].category}</span>
              <h3>{sermons[0].title}</h3>
              <p className="details">{sermons[0].preacher} | {sermons[0].passage}</p>
              <Link href="/sermon" className="btn btn-primary">말씀 듣기</Link>
            </div>
          </div>
        )}
      </section>

      {/* Notices Section */}
      <section className="container section">
        <div className="section-header">
          <h2>교회 소식</h2>
          <Link href="/notices" className="more-link">전체보기 <ChevronRight size={20} /></Link>
        </div>
        <div className="notice-list">
          {notices.map(notice => (
            <Link key={notice.id} href={`/notices/${notice.id}`} className="notice-item">
              <span className="notice-cat">{notice.category}</span>
              <span className="notice-title">{notice.title}</span>
              <span className="notice-date">{notice.date}</span>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}

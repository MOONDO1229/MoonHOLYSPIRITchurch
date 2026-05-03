import { HeroBanner, QuickMenuGrid, WelcomeCTA } from '@/components/HomeSections';
import { getNotices, getSermons, getLatestBulletin, getSettings } from '@/lib/db';
import Link from 'next/link';
import { ChevronRight, Play } from 'lucide-react';

export default function Home() {
  const notices = getNotices().filter(n => n.status === '게시').slice(0, 4);
  const sermons = getSermons().filter(s => s.status === '게시').sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 1);
  const latestBulletin = getLatestBulletin();
  const settings = getSettings();

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = sermons[0] ? getYoutubeId(sermons[0].youtube_url) : null;

  return (
    <main>
      <HeroBanner settings={settings} />
      <WelcomeCTA />
      <QuickMenuGrid />

      {/* Latest Sermon Section - 유튜브 임베드 */}
      <section className="container section bg-offset">
        <div className="section-header">
          <h2>최신 설교 영상</h2>
          <Link href="/sermon" className="more-link">전체보기 <ChevronRight size={20} /></Link>
        </div>
        {sermons[0] && (
          <div className="sermon-home-wrap">
            <div className="video-embed-container">
              {videoId ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="no-video">영상이 없습니다.</div>
              )}
            </div>
            <div className="sermon-home-info">
              <span className="type">{sermons[0].category}</span>
              <h3>{sermons[0].title}</h3>
              <p className="details">
                <strong>본문:</strong> {sermons[0].passage}<br/>
                <strong>설교:</strong> {sermons[0].preacher} 목사<br/>
                <strong>일자:</strong> {sermons[0].date}
              </p>
              <Link href="/sermon" className="btn btn-primary">다른 설교 목록보기</Link>
            </div>
          </div>
        )}
      </section>

      {/* Latest Bulletin Section - 이미지 위주 */}
      <section className="container section">
        <div className="section-header">
          <h2>이번 주 주보</h2>
          <Link href="/bulletin" className="more-link">전체보기 <ChevronRight size={20} /></Link>
        </div>
        {latestBulletin && (
          <div className="bulletin-home-card">
            <div className="bulletin-thumb">
              {latestBulletin.image_url ? (
                <img src={latestBulletin.image_url} alt="주보 이미지" />
              ) : (
                <div className="placeholder">주보 이미지가 등록되지 않았습니다.</div>
              )}
              <Link href={`/bulletin/${latestBulletin.id}`} className="stretched-link" />
            </div>
            <div className="bulletin-home-info">
              <h3>{latestBulletin.title}</h3>
              <p className="date">{latestBulletin.date}</p>
              <div className="btn-group">
                <Link href={`/bulletin/${latestBulletin.id}`} className="btn btn-outline">주보 크게보기 (이미지)</Link>
                {latestBulletin.pdf_url && (
                  <a href={latestBulletin.pdf_url} download className="btn btn-secondary">주보 다운로드 (PDF)</a>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Notices Section */}
      <section className="container section bg-offset">
        <div className="section-header">
          <h2>교회 소식</h2>
          <Link href="/notices" className="more-link">전체보기 <ChevronRight size={20} /></Link>
        </div>
        <div className="notice-grid">
          {notices.map(notice => (
            <Link key={notice.id} href={`/notices/${notice.id}`} className="notice-card-simple">
              <div className="notice-meta">
                <span className="cat">{notice.category}</span>
                <span className="date">{notice.date}</span>
              </div>
              <h4 className="title">{notice.title}</h4>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}

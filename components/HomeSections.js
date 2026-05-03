'use client';
import Link from 'next/link';
import { PlayCircle, BookOpen, Video, MapPin, UserPlus, Heart, Phone, Clock, Megaphone, ChevronRight } from 'lucide-react';

export default function HomeSections({ settings, latestSermon, notices, latestBulletin }) {
  return (
    <div className="home-sections">
      {/* 최신 설교 섹션 */}
      <section className="container section">
        <div className="section-header">
          <h2>최신 설교 말씀</h2>
          <Link href="/worship" className="more-link">전체보기 <ChevronRight size={20}/></Link>
        </div>
        
        {latestSermon ? (
          <div className="sermon-home-wrap">
            <div className="video-embed-container">
              <iframe 
                src={`https://www.youtube.com/embed/${getYouTubeId(latestSermon.youtube_url)}`}
                title={latestSermon.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%' }}
              ></iframe>
            </div>
            <div className="sermon-home-info">
              <span className="badge">최신 설교</span>
              <h3>{latestSermon.title}</h3>
              <p className="details">
                {latestSermon.date} • {latestSermon.pastor} 목사<br/>
                성경말씀: {latestSermon.scripture}
              </p>
              <Link href={`/worship`} className="btn btn-primary">설교 목록 보기</Link>
            </div>
          </div>
        ) : (
          <div className="no-data-card">준비된 설교 영상이 없습니다.</div>
        )}
      </section>

      {/* 이번주 주보 섹션 */}
      <section className="bg-offset">
        <div className="container section">
          <div className="section-header">
            <h2>이번주 주보</h2>
            <Link href="/news" className="more-link">지난 주보 <ChevronRight size={20}/></Link>
          </div>
          {latestBulletin ? (
            <div className="bulletin-home-card">
              <div className="bulletin-thumb">
                <img src={latestBulletin.thumbnail || latestBulletin.image} alt="주보 썸네일" />
              </div>
              <div className="bulletin-home-info">
                <span className="badge">주간 소식</span>
                <h3>{latestBulletin.title}</h3>
                <p className="date">{latestBulletin.date} 발행</p>
                <div className="btn-group">
                  <Link href={`/bulletin/${latestBulletin.id}`} className="btn btn-primary">주보 크게보기</Link>
                  <Link href="/news" className="btn btn-outline">교회 소식</Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-data-card">등록된 주보가 없습니다.</div>
          )}
        </div>
      </section>

      {/* 교회 소식 섹션 */}
      <section className="container section">
        <div className="section-header">
          <h2>교회 소식</h2>
          <Link href="/news" className="more-link">더보기 <ChevronRight size={20}/></Link>
        </div>
        <div className="notice-grid">
          {notices && notices.length > 0 ? notices.map(notice => (
            <Link key={notice.id} href={`/news/${notice.id}`} className="notice-card-simple">
              <div className="notice-meta">
                <span className="cat">{notice.category}</span>
                <span className="date">{notice.date}</span>
              </div>
              <h4 className="title">{notice.title}</h4>
            </Link>
          )) : (
            <div className="no-data-card">등록된 소식이 없습니다.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function getYouTubeId(url) {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
}

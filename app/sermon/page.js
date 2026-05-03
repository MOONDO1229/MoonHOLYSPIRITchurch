import PageHeader from '@/components/PageHeader';
import { getData } from '@/lib/db';
import { Play, Youtube, Calendar, User } from 'lucide-react';
import Link from 'next/link';

export default async function SermonPage() {
  const sermons = (await getData('sermons')).filter(s => s.status === '게시').sort((a,b) => new Date(b.date) - new Date(a.date));
  const latest = sermons[0];

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <main>
      <PageHeader title="설교 말씀" subtitle="성령교회 담임목사님의 은혜로운 말씀입니다." />

      <section className="container section">
        {latest && (
          <div className="latest-sermon-hero">
            <div className="video-container">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${getYoutubeId(latest.youtube_url)}`}
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="sermon-info-hero">
              <span className="badge">최신 설교</span>
              <span className="category">{latest.category}</span>
              <h2>{latest.title}</h2>
              <div className="meta-grid">
                <div className="meta-item"><Calendar size={18} /> {latest.date}</div>
                <div className="meta-item"><User size={18} /> {latest.preacher}</div>
              </div>
              <p className="passage">본문: {latest.passage}</p>
              <p className="summary">{latest.summary}</p>
            </div>
          </div>
        )}

        <div className="sermon-list-section">
          <h3 className="section-title">지난 설교 영상</h3>
          <div className="sermon-grid">
            {sermons.slice(1).map(item => (
              <div key={item.id} className="sermon-card">
                <div className="card-thumb">
                  <img src={item.thumbnail || `https://img.youtube.com/vi/${getYoutubeId(item.youtube_url)}/0.jpg`} alt={item.title} />
                  <div className="play-overlay"><Play size={40} /></div>
                  <span className="card-cat">{item.category}</span>
                </div>
                <div className="card-content">
                  <p className="card-date">{item.date}</p>
                  <h4>{item.title}</h4>
                  <p className="card-passage">{item.passage}</p>
                </div>
                <Link href={`https://www.youtube.com/watch?v=${getYoutubeId(item.youtube_url)}`} target="_blank" className="stretched-link" />
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

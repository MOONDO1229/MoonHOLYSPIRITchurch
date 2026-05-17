'use client';
import Link from 'next/link';
import { PlayCircle, BookOpen, Video, MapPin, UserPlus, Heart, Phone, Clock, Megaphone, ChevronRight } from 'lucide-react';

export default function HomeSections({ settings, latestSermon, notices, latestBulletin }) {
  return (
    <div className="max-w-6xl mx-auto px-6 space-y-32 mb-32">
      {/* Latest Sermon Section */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-10 gap-4 text-center">
          <div className="w-full">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-2">최신 설교 말씀</h2>
            <p className="text-base md:text-lg text-brand-muted mb-4">성령의 감동이 있는 주일 설교 말씀입니다</p>
            <Link href="/sermon" className="inline-flex items-center gap-2 text-brand-gold font-bold hover:text-brand-brown transition-colors">
              전체말씀 보기
              <i className="ph ph-arrow-right"></i>
            </Link>
          </div>
        </div>
        
        <div className="sermon-home-wrap group shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[32px] overflow-hidden border border-gray-100">
          <div className="video-embed-container flex-1">
            {latestSermon?.youtube_url ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeId(latestSermon.youtube_url)}`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full bg-brand-dark/5 flex items-center justify-center">
                <i className="ph ph-play-circle text-6xl text-brand-gold/30"></i>
              </div>
            )}
          </div>
          <div className="sermon-home-info flex-1 p-5 md:p-10 lg:p-16 flex flex-col items-center md:items-start justify-center bg-white text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-md bg-brand-gold/10 text-brand-gold text-[10px] md:text-sm font-bold mb-3 md:mb-4 w-fit">최근 설교</span>
            <h3 className="text-xl md:text-3xl font-black text-brand-dark mb-3 md:mb-4 leading-snug">{latestSermon?.title || '설교 말씀 준비 중입니다'}</h3>
            <div className="details text-brand-muted text-sm md:text-lg space-y-1 mb-5 md:mb-8">
              <p className="flex items-center justify-center md:justify-start gap-2"><i className="ph ph-calendar-blank"></i> {latestSermon?.date}</p>
              <p className="flex items-center justify-center md:justify-start gap-2"><i className="ph ph-book-open"></i> {latestSermon?.passage}</p>
            </div>
            <Link href="/sermon" 
              className="inline-flex items-center justify-center px-6 py-2 md:px-8 md:py-3 text-white rounded-full font-bold text-xs md:text-base transition-colors shadow-md w-fit"
              style={{ backgroundColor: 'var(--primary-color)' }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              설교 영상 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Bulletin Section */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <div className="flex flex-col items-center mb-10 gap-4 text-center">
          <div className="w-full">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-2">이번주 주보</h2>
            <p className="text-base md:text-lg text-brand-muted mb-4">이번 주 성령교회 소식과 예배 순서입니다</p>
            <Link href="/bulletin" className="inline-flex items-center gap-2 text-brand-gold font-bold hover:text-brand-brown transition-colors">
              주보 목록 보기
              <i className="ph ph-arrow-right"></i>
            </Link>
          </div>
        </div>
        
        <div className="bulletin-home-card group bg-white border border-gray-100 hover:border-brand-gold/30 hover:shadow-2xl transition-all duration-500 p-8 rounded-[32px] flex flex-col md:flex-row items-center gap-12">
          <div className="bulletin-thumb w-full md:w-64 bg-gray-50 p-4 rounded-2xl shadow-inner group-hover:scale-105 transition-transform duration-500">
            {latestBulletin?.image_url ? (
              <img src={latestBulletin.image_url} alt="이번주 주보" className="w-full shadow-lg rounded-lg" />
            ) : (
              <div className="aspect-[3/4] bg-white flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <i className="ph ph-file-pdf text-4xl text-gray-300"></i>
              </div>
            )}
          </div>
          <div className="bulletin-home-info flex-1 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-[#2A4B41] mb-2">{latestBulletin?.title || '주보 업데이트 예정'}</h3>
            <p className="text-lg md:text-xl text-brand-muted mb-6 md:mb-8 font-medium">{latestBulletin?.date}</p>
            <div className="flex justify-center md:justify-start gap-3">
              <Link href={`/bulletin/${latestBulletin?.id}`} 
                className="px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-base transition-colors"
                style={{ backgroundColor: 'var(--secondary-color)', color: 'white' }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                주보 크게 보기
              </Link>
              {latestBulletin?.pdf_url && (
                <a href={latestBulletin.pdf_url} 
                  target="_blank" 
                  className="px-6 py-2.5 md:px-8 md:py-3 text-white rounded-full font-bold text-sm md:text-base transition-colors shadow-md"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                  PDF 다운로드
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* News & Notices Section */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="flex flex-col items-center mb-10 gap-4 text-center">
          <div className="w-full">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mb-2">교회 소식</h2>
            <p className="text-base md:text-lg text-brand-muted">하나님의 사랑을 전하는 교회의 발자취입니다</p>
          </div>
        </div>

        <div className="notice-grid">
          {notices && notices.length > 0 ? notices.map((notice) => (
            <Link key={notice.id} href={`/news/${notice.id}`} className="notice-card-simple group">
              <div className="notice-meta flex justify-between items-center mb-4">
                <span className="cat px-3 py-1 rounded-md bg-brand-gold text-white text-xs font-bold shadow-sm">{notice.category || '공지사항'}</span>
                <span className="date text-gray-400 text-sm">{notice.date}</span>
              </div>
              <h4 className="title group-hover:text-brand-gold">{notice.title}</h4>
            </Link>
          )) : (
            <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
              <p>현재 등록된 소식이 없습니다.</p>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/news" className="inline-flex items-center gap-2 text-brand-gold font-bold hover:text-brand-brown transition-colors">
            교회 소식 전체보기
            <i className="ph ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </Link>
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

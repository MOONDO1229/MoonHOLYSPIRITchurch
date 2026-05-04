'use client';
import Link from 'next/link';
import { PlayCircle, BookOpen, Video, MapPin, UserPlus, Heart, Phone, Clock, Megaphone, ChevronRight } from 'lucide-react';

export default function HomeSections({ settings, latestSermon, notices, latestBulletin }) {
  return (
    <div className="max-w-6xl mx-auto px-6 space-y-32 mb-32">
      {/* Latest Sermon Section */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight mb-2">말씀의 은혜</h2>
            <p className="text-lg text-brand-muted">성령의 감동이 있는 주일 설교 말씀입니다</p>
          </div>
          <Link href="/sermon" className="group flex items-center gap-2 text-brand-gold font-bold text-lg hover:text-brand-brown transition-colors">
            전체말씀 보기
            <i className="ph ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </Link>
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
          <div className="sermon-home-info flex-1 p-10 lg:p-16 flex flex-col justify-center bg-white">
            <span className="inline-block px-3 py-1 rounded-md bg-brand-gold/10 text-brand-gold text-sm font-bold mb-4">최근 설교</span>
            <h3 className="text-3xl font-black text-brand-dark mb-4 leading-snug">{latestSermon?.title || '설교 말씀 준비 중입니다'}</h3>
            <div className="details text-brand-muted text-lg space-y-1 mb-8">
              <p className="flex items-center gap-2"><i className="ph ph-calendar-blank"></i> {latestSermon?.date}</p>
              <p className="flex items-center gap-2"><i className="ph ph-book-open"></i> {latestSermon?.passage}</p>
            </div>
            <Link href="/sermon" className="inline-flex items-center justify-center px-8 py-3 bg-brand-brown text-white rounded-full font-bold hover:bg-brand-dark transition-colors shadow-md">
              설교 영상 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Bulletin Section */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight mb-2">교회 주보</h2>
            <p className="text-lg text-brand-muted">이번 주 성령교회 소식과 예배 순서입니다</p>
          </div>
          <Link href="/bulletin" className="group flex items-center gap-2 text-brand-gold font-bold text-lg hover:text-brand-brown transition-colors">
            주보 아카이브
            <i className="ph ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </Link>
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
          <div className="bulletin-home-info flex-1">
            <h3 className="text-3xl font-black text-[#2A4B41] mb-2">{latestBulletin?.title || '주보 업데이트 예정'}</h3>
            <p className="text-xl text-brand-muted mb-8 font-medium">{latestBulletin?.date}</p>
            <div className="flex gap-3">
              <Link href={`/bulletin/${latestBulletin?.id}`} className="px-8 py-3 bg-[#EBF3F0] text-[#2A4B41] rounded-full font-bold hover:bg-[#D9EAE4] transition-colors">
                자세히 보기
              </Link>
              {latestBulletin?.pdf_url && (
                <a href={latestBulletin.pdf_url} target="_blank" className="px-8 py-3 bg-brand-brown text-white rounded-full font-bold hover:bg-brand-dark transition-colors shadow-md">
                  PDF 다운로드
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* News & Notices Section */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-brand-dark tracking-tight mb-2">성령 소식</h2>
            <p className="text-lg text-brand-muted">하나님의 사랑을 전하는 교회의 발자취입니다</p>
          </div>
          <Link href="/news" className="group flex items-center gap-2 text-brand-gold font-bold text-lg hover:text-brand-brown transition-colors">
            소식 전체보기
            <i className="ph ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>

        <div className="notice-grid">
          {notices && notices.length > 0 ? notices.map((notice) => (
            <Link key={notice.id} href={`/news/${notice.id}`} className="notice-card-simple group">
              <div className="notice-meta flex justify-between items-center mb-4">
                <span className="cat px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold">{notice.category || '공지사항'}</span>
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

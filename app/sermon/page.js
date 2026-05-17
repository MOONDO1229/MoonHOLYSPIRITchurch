import PageHeader from '@/components/PageHeader';
import { getData } from '@/lib/db';
import { Play, Calendar, User, BookOpen, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function SermonPage() {
  const sermons = (await getData('sermons')).filter(s => s.status === '게시').sort((a,b) => new Date(b.date) - new Date(a.date));
  const latest = sermons[0];

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <main className="bg-[#fcfbf9] min-h-screen pb-32">
      {/* 1. 페이지 헤더 영역: 정돈된 타이틀과 설명 */}
      <section className="sermon-page-header pt-24 pb-12 px-6 text-center max-w-4xl mx-auto animate-in fade-in duration-700">
        <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-6 tracking-tight">설교 말씀</h1>
        <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full"></div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* 2. 대표 설교(최신 설교) 메인 카드 */}
        {latest && (
          <div className="sermon-featured-wrap mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <div className="sermon-featured-card bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
              {/* 대형 영상 영역 */}
              <div className="aspect-video w-full bg-black relative group">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${getYoutubeId(latest.youtube_url)}?autoplay=0&rel=0`}
                  frameBorder="0" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              
              {/* 정보 영역: 영상 아래 배치하여 안정감 확보 */}
              <div className="sermon-featured-body p-10 md:p-24">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-brand-gold text-white text-xs font-bold uppercase tracking-widest shadow-sm">
                      Latest Sermon
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-brand-dark/5 text-brand-muted text-xs font-bold uppercase tracking-widest">
                      {latest.category || '주일예배'}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-16 leading-tight tracking-tighter">
                    {latest.title}
                  </h2>
                
                  {/* 메타 정보 리스트 - 제목의 왼쪽 라인에 맞춰 수직 정렬하여 안정감 향상 */}
                  <div className="sermon-meta-list flex flex-col gap-10 py-14 border-y border-gray-100">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
                        <Calendar size={28} />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-widest mb-1.5">선포일</p>
                        <p className="text-brand-dark font-black text-xl md:text-3xl">{latest.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
                        <User size={28} />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-widest mb-1.5">설교자</p>
                        <p className="text-brand-dark font-black text-xl md:text-3xl">{latest.preacher}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
                        <BookOpen size={28} />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-widest mb-1.5">성경 본문</p>
                        <p className="text-brand-dark font-black text-xl md:text-3xl">{latest.passage}</p>
                      </div>
                    </div>
                  </div>
                
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. 지난 설교 영상 영역 */}
        <section className="sermon-archive-section pt-16 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
          <div className="sermon-archive-header flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-brand-dark mb-4 tracking-tight">지난 설교 영상</h3>
              <p className="text-lg text-brand-muted font-medium">이전의 은혜로운 말씀들을 다시 보실 수 있습니다.</p>
            </div>
            <div className="hidden md:block">
              <span className="text-sm font-bold text-brand-gold bg-brand-gold/5 px-4 py-2 rounded-full border border-brand-gold/10">
                총 {sermons.length}개의 말씀
              </span>
            </div>
          </div>
          
          {/* 설교 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {sermons.slice(1).map(item => {
              const videoId = getYoutubeId(item.youtube_url);
              return (
                <div key={item.id} className="group flex flex-col">
                  <Link href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" className="relative block mb-6">
                    <div className="relative aspect-video rounded-[24px] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-700">
                      <img 
                        src={item.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        onError={(e) => {
                          e.target.src = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                        }}
                      />
                      {/* 호버 시 플레이 아이콘 노출 */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-all duration-500 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100 border border-white/30">
                          <Play size={28} fill="currentColor" className="ml-1" />
                        </div>
                      </div>
                      {/* 카테고리 뱃지 */}
                      <div className="absolute top-5 left-5">
                        <span className="px-3 py-1 rounded-md bg-white/90 backdrop-blur-sm text-brand-dark text-[10px] font-black uppercase tracking-widest shadow-sm">
                          {item.category || '주일예배'}
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="flex-1 px-2">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">{item.date}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.preacher}</span>
                    </div>
                    
                    <Link href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" className="block group-hover:text-brand-gold transition-colors">
                      <h4 className="text-xl md:text-2xl font-black text-brand-dark mb-4 leading-snug line-clamp-2 tracking-tight">
                        {item.title}
                      </h4>
                    </Link>
                    
                    <div className="flex items-center gap-2 text-brand-muted text-sm font-medium pt-4 border-t border-gray-100">
                      <BookOpen size={14} className="text-brand-gold/60" />
                      <span className="line-clamp-1">{item.passage}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 설교가 없을 경우 */}
          {sermons.length <= 1 && (
            <div className="py-32 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
              <i className="ph ph-video-camera-slash text-6xl text-gray-200 mb-6 block"></i>
              <p className="text-xl text-gray-400 font-bold">이전 설교 영상이 아직 등록되지 않았습니다.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

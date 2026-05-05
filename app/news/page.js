import { getNotices } from '@/lib/db';
import NewsListClient from '@/components/NewsListClient';

export default async function NewsPage() {
  const notices = await getNotices();

  return (
    <main className="bg-[#fafafa] min-h-screen">
      {/* 상단 소개 영역 */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* 장식용 배경 요소 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-brand-gold blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-dark blur-3xl"></div>
        </div>

        <div className="container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] text-brand-gold bg-brand-gold/10 rounded-full animate-in fade-in slide-in-from-bottom-2">
            CHURCH NEWS
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-700">
            교회 소식
          </h1>
          <div className="w-16 h-1 bg-brand-gold mx-auto mb-8 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-brand-muted leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000">
            성령교회의 따뜻한 나눔과 <br className="md:hidden" />
            다양한 공지사항을 정성껏 전해드립니다.
          </p>
        </div>
      </section>

      {/* 리스트 영역 (클라이언트 컴포넌트) */}
      <NewsListClient initialNotices={notices} />
    </main>
  );
}

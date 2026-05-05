import { getSettings } from '@/lib/db';
import { Users, Heart, Anchor, ShieldCheck, Clock, Cross, Star, Home, Globe, Sparkles, BookOpen } from 'lucide-react';

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <main className="bg-[#fafafa]">
      {/* 상단 페이지 소개 영역 */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-brand-gold blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-dark blur-3xl"></div>
        </div>

        <div className="container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] text-brand-gold bg-brand-gold/10 rounded-full animate-in fade-in slide-in-from-bottom-2">
            교회 소개
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-700">
            성령교회 소개
          </h1>
          <div className="w-16 h-1 bg-brand-gold mx-auto mb-8 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-brand-muted leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {settings.subtitle || "성령교회는 하나님의 사랑을 전하고 지역사회를 섬기는 복된 공동체입니다."}
          </p>
        </div>
      </section>

      {/* 목사님 인사말 영역 */}
      <section className="py-24 md:py-32">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="pastor-layout">
            {/* 왼쪽: 목사님 사진 */}
            <div className="pastor-photo-card animate-in fade-in slide-in-from-left-8 duration-1000">
              {settings.pastorImage ? (
                <img src={settings.pastorImage} alt={settings.pastor} />
              ) : (
                <div className="w-full h-full bg-brand-light flex items-center justify-center text-brand-muted font-bold text-center p-8">
                  성령교회<br/>{settings.pastor} 목사
                </div>
              )}
            </div>

            {/* 오른쪽: 인사말 텍스트 */}
            <div className="pastor-quote-box animate-in fade-in slide-in-from-right-8 duration-1000">
               <span className="text-brand-gold font-bold tracking-widest text-sm mb-4 block uppercase">인사말</span>
              <h3>{settings.pastorTitle || '"예수님의 사랑으로 여러분을 환영합니다"'}</h3>
              
              <div className="pastor-message space-y-6">
                {settings.pastorGreeting ? (
                  settings.pastorGreeting.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))
                ) : (
                  <>
                    <p>안녕하십니까? 성령교회 홈페이지를 방문해주신 여러분을 진심으로 환영합니다.</p>
                    <p>우리 교회는 하나님의 말씀 위에 든든히 서서 성령의 능력으로 세상을 변화시키고자 노력하는 교회입니다. </p>
                    <p>지친 영혼이 쉼을 얻고, 주님의 사랑 안에서 새로운 소망을 발견하는 복된 자리가 되기를 기도합니다.</p>
                    <p>함께 예배하며 주님의 은혜를 나누는 귀한 만남이 있기를 기대합니다.</p>
                  </>
                )}
              </div>

              <div className="pastor-signature">
                <span className="text-brand-muted font-medium text-base mr-3 italic">성령교회 담임목사</span>
                <strong>{settings.pastor}</strong> <span className="text-base font-normal ml-1 text-gray-500">올림</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 교회 핵심 가치 영역 */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-6">교회 핵심 가치</h2>
            <p className="text-brand-muted text-lg font-medium">성령교회가 지향하는 4가지 비전입니다.</p>
          </div>
          
          <div className="value-grid">
            {(settings.visions || []).length > 0 ? (
              settings.visions.map((vision, idx) => {
                const icons = { Anchor, Heart, Users, ShieldCheck, Cross, Star, Home, Globe, Sparkles, BookOpen };
                const IconComp = icons[vision.icon] || Anchor;
                return (
                  <div key={idx} className="value-card animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 150}ms` }}>
                    <div className="icon-wrap"><IconComp size={32} strokeWidth={1.5} /></div>
                    <h4>{vision.title}</h4>
                    <p>{vision.content}</p>
                  </div>
                );
              })
            ) : (
              <>
                <div className="value-card animate-in fade-in slide-in-from-bottom-4">
                  <div className="icon-wrap"><BookOpen size={32} strokeWidth={1.5} /></div>
                  <h4>말씀 중심</h4>
                  <p>변치 않는 하나님의 말씀을 삶의 유일한 기준으로 삼습니다.</p>
                </div>
                <div className="value-card animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '150ms' }}>
                  <div className="icon-wrap"><Heart size={32} strokeWidth={1.5} /></div>
                  <h4>사랑의 교제</h4>
                  <p>예수님의 사랑으로 서로를 아끼고 돌보는 가족 같은 공동체입니다.</p>
                </div>
                <div className="value-card animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '300ms' }}>
                  <div className="icon-wrap"><Users size={32} strokeWidth={1.5} /></div>
                  <h4>다음 세대</h4>
                  <p>미래의 주역인 아이들을 신앙 안에서 바르게 양육합니다.</p>
                </div>
                <div className="value-card animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '450ms' }}>
                  <div className="icon-wrap"><Cross size={32} strokeWidth={1.5} /></div>
                  <h4>지역 섬김</h4>
                  <p>지역 사회에 빛과 소금이 되어 이웃을 섬깁니다.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 교회 연혁 영역 */}
      <section className="py-24 md:py-32 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-gold/10 text-brand-gold mb-6">
              <Clock size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-6">교회 연혁</h2>
            <p className="text-brand-muted text-lg font-medium">성령교회가 걸어온 믿음의 발자취입니다.</p>
          </div>
          
          <div className="history-timeline-v2">
            {settings.history && settings.history.length > 0 ? (
              [...settings.history].sort((a, b) => b.year - a.year).map((item, idx) => (
                <div key={idx} className="history-node animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="history-content-card">
                    <span className="year-label">{item.year}</span>
                    <span className="month-label">{item.month}월</span>
                    <p>{item.content.replace('퇴촌성령교회', '성령교회')}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-gray-400 font-medium">
                등록된 연혁이 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

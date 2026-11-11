import { getSettings } from '@/lib/db';
import { Users, Heart, Anchor, ShieldCheck, Clock, Cross, Star, Home, Globe, Sparkles, BookOpen, Info, Phone, ReceiptText } from 'lucide-react';
import CopyButton from '@/components/CopyButton';

export default async function AboutPage() {
  const settings = await getSettings();
  const offering = settings?.offering || {
    bank: "농협",
    account: "351-1188-7505-13",
    holder: "성령교회",
    info: "교회 통장으로 직접 송금하실 수 있습니다.",
    types: "십일조 / 감사헌금 / 주일헌금 / 선교헌금 / 건축헌금 등"
  };
  const accountNum = offering.account;

  return (
    <main className="bg-[#fafafa]">
      {/* 상단 페이지 소개 영역 */}
      <section className="relative py-32 md:py-48 overflow-hidden bg-white">
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
      <section className="py-32 md:py-48">
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
              
              <div className="pastor-message space-y-8">
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
      <section className="py-32 md:py-48 bg-white">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-28">
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

      {/* 헌금 및 후원 안내 영역 */}
      <section id="support" className="py-32 md:py-48 bg-[#fafafa] scroll-mt-24">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] text-brand-gold bg-brand-gold/10 rounded-full">
              헌금 및 후원
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-6">온라인 헌금 안내</h2>
            <div className="w-16 h-1 bg-brand-gold mx-auto mb-8 rounded-full"></div>
            <p className="max-w-2xl mx-auto text-lg text-brand-muted leading-relaxed font-medium">
              신령과 진정으로 드려진 소중한 예물은 <br className="hidden md:block" />
              하나님 나라 확장과 이웃 사랑을 위해 귀하게 사용됩니다.
            </p>
          </div>

          <div className="support-main-card animate-in fade-in zoom-in-95 duration-700 mx-auto max-w-3xl">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-brand-light rounded-3xl flex items-center justify-center text-brand-gold">
                <Heart size={40} fill="currentColor" />
              </div>
            </div>
            
            <span className="support-bank-tag text-lg px-6 py-2 mx-auto block w-fit">
              {offering.bank === "농협" ? "농협은행" : offering.bank}
            </span>
            
            <div className="support-acc-display my-8 text-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <span className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter">
                  {accountNum}
                </span>
                <CopyButton text={accountNum} />
              </div>
              <p className="text-xl md:text-2xl font-bold text-brand-muted mt-4">예금주: {offering.holder}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50 bg-gray-50/50 rounded-2xl p-6 flex items-start gap-3 text-left">
              <Info className="text-brand-gold flex-shrink-0 mt-0.5" size={20} />
              <p className="text-brand-muted font-bold leading-relaxed">
                교회 통장으로 직접 송금하실 수 있습니다.
              </p>
            </div>
          </div>

          {/* 하단 세부 가이드 안내 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
            {/* 헌금 방법 안내 */}
            <div className="support-guide-card animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 justify-center md:justify-start">
                <Heart className="text-brand-gold" size={20} />
                헌금 방법 안내
              </h3>
              <p className="text-brand-muted font-semibold leading-relaxed text-base">
                온라인 헌금 시 입금자명: <span className="text-brand-gold">이름헌금종류</span><br/>
                (예: 홍길동십일조) 와 같이 부탁드립니다.
              </p>
            </div>

            {/* 기부금 영수증 안내 */}
            <div className="support-guide-card animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 justify-center md:justify-start">
                <ReceiptText className="text-brand-gold" size={20} />
                기부금 영수증 안내
              </h3>
              <p className="text-brand-muted leading-relaxed font-semibold text-base">
                연말정산을 위한 기부금 영수증 발급이 필요하신 분은 교회 사무실로 문의해 주시기 바랍니다.
              </p>
            </div>

            {/* 문의 안내 */}
            <div className="support-guide-card animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 justify-center md:justify-start">
                <Phone className="text-brand-gold" size={20} />
                문의 안내
              </h3>
              <div className="flex flex-col gap-4 text-center md:text-left">
                <p className="text-brand-muted font-semibold text-base">헌금 관련 문의사항이 있으시면 아래 번호로 연락주세요.</p>
                <a href={`tel:${settings?.phone?.replace(/-/g, '') || '0317668847'}`} className="text-2xl font-black text-brand-dark hover:text-brand-gold transition-colors">
                  {settings?.phone || '031-766-8847'}
                </a>
                <p className="text-xs text-gray-400 font-bold">{settings?.churchName || '성령교회'} 사무실</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


import { Heart, Info, Phone, ReceiptText } from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import { getSettings } from '@/lib/db';

export default async function SupportPage() {
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
    <main className="bg-[#fafafa] min-h-screen">
      {/* 상단 히어로/소개 영역 */}
      <section className="support-hero-section">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-brand-gold blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-dark blur-3xl"></div>
        </div>
        
        <div className="container relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] text-brand-gold bg-brand-gold/10 rounded-full animate-in fade-in slide-in-from-bottom-2">
            헌금 및 후원
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-700">
            온라인 헌금 안내
          </h1>
          <div className="w-16 h-1 bg-brand-gold mx-auto mb-8 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-brand-muted leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000">
            신령과 진정으로 드려진 소중한 예물은 <br className="hidden md:block" />
            하나님 나라 확장과 이웃 사랑을 위해 귀하게 사용됩니다.
          </p>
        </div>
      </section>

      {/* 메인 계좌 정보 섹션 (상단 카드) */}
      <section className="support-account-section px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-4">계좌 이체 안내</h2>
            <p className="text-brand-muted font-medium">정성껏 준비하신 헌금을 아래 계좌로 송금하실 수 있습니다.</p>
          </div>

          <div className="support-main-card animate-in fade-in zoom-in-95 duration-700">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-brand-light rounded-3xl flex items-center justify-center text-brand-gold">
                <Heart size={40} fill="currentColor" />
              </div>
            </div>
            
            <span className="support-bank-tag text-lg px-6 py-2">
              {offering.bank === "농협" ? "농협은행" : offering.bank}
            </span>
            
            <div className="support-acc-display my-8">
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
        </div>
      </section>

      {/* 하단 안내 섹션 (3개 카드) */}
      <section className="support-guide-section px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 헌금 방법 안내 */}
            <div className="support-guide-card animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3>헌금 방법 안내</h3>
              <p className="text-brand-muted font-bold leading-relaxed text-lg">
                온라인 헌금 시 입금자명: <span className="text-brand-gold">이름헌금종류</span><br/>
                (예: 홍길동십일조) 와 같이 부탁드립니다.
              </p>
            </div>

            {/* 기부금 영수증 안내 */}
            <div className="support-guide-card animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <h3>
                <ReceiptText className="text-brand-gold" size={20} />
                기부금 영수증 안내
              </h3>
              <p className="text-brand-muted leading-relaxed font-medium">
                연말정산을 위한 기부금 영수증 발급이 필요하신 분은 교회 사무실로 문의해 주시기 바랍니다.
              </p>
            </div>

            {/* 문의 안내 */}
            <div className="support-guide-card animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <h3>
                <Phone className="text-brand-gold" size={20} />
                문의 안내
              </h3>
              <div className="flex flex-col gap-4">
                <p className="text-brand-muted font-medium">헌금 관련 문의사항이 있으시면 아래 번호로 연락주세요.</p>
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

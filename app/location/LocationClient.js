'use client';
import { useState } from 'react';
import { MapPin, Phone, Car, Copy, ExternalLink, Navigation } from 'lucide-react';

export default function LocationClient({ settings }) {
  const [copied, setCopied] = useState(false);
  const address = settings?.address || "경기도 광주시 퇴촌면 광동로52번길 27 (성령교회)";
  const phone = settings?.phone || "031-766-8847";
  const locationGuide = settings?.location?.guide || "성령교회는 경기도 광주시 퇴촌면 광동로에 위치하고 있습니다. \n\n교회 전용 주차장 및 주변의 넉넉한 주차 공간을 편리하게 이용하실 수 있습니다.";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedAddress = encodeURIComponent(address);
  const naverMapUrl = `https://map.naver.com/v5/search/${encodedAddress}`;
  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodedAddress}`;
  const freeGoogleMapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <main className="bg-[#fafafa] min-h-screen">
      {/* 상단 페이지 소개 영역 */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-brand-gold blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-dark blur-3xl"></div>
        </div>

        <div className="container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] text-brand-gold bg-brand-gold/10 rounded-full animate-in fade-in slide-in-from-bottom-2">
            LOCATION
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-700">
            오시는 길
          </h1>
          <div className="w-16 h-1 bg-brand-gold mx-auto mb-8 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-brand-muted leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000">
            성령교회는 여러분을 항상 환영합니다. <br className="md:hidden" />
            언제든 편안하게 방문해 주세요.
          </p>
        </div>
      </section>

      {/* 메인 레이아웃 (2단 구성) */}
      <section className="py-24 md:py-32">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 location-layout-grid">
            
            {/* 왼쪽: 지도 영역 */}
            <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-4 duration-1000">
              <div className="location-map-wrapper">
                <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-[24px] overflow-hidden">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight="0" 
                    marginWidth="0" 
                    src={freeGoogleMapUrl}
                    className="grayscale-[0.2] contrast-[1.1]"
                  ></iframe>
                </div>
              </div>

              {/* 지도 버튼 그룹 */}
              <div className="location-action-grid">
                <button 
                  onClick={copyToClipboard}
                  className={`flex items-center justify-center gap-2 h-[56px] rounded-2xl font-bold transition-all ${
                    copied ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-brand-dark hover:border-brand-gold'
                  }`}
                >
                  <Copy size={20} />
                  {copied ? '주소 복사 완료' : '주소 복사'}
                </button>
                <a 
                  href={naverMapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 h-[56px] bg-[#03C75A] text-white rounded-2xl font-bold hover:opacity-90 transition-all"
                >
                  <Navigation size={20} /> 네이버 지도
                </a>
                <a 
                  href={kakaoMapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 h-[56px] bg-[#FEE500] text-[#3C1E1E] rounded-2xl font-bold hover:opacity-90 transition-all"
                >
                  <Navigation size={20} /> 카카오 맵
                </a>
              </div>
            </div>

            {/* 오른쪽: 정보 카드 스택 */}
            <div className="lg:col-span-5 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-1000">
              {/* 주소 카드 */}
              <div className="location-detail-card">
                <div className="icon-label">
                  <MapPin size={24} strokeWidth={2.5} />
                  <h3>주소</h3>
                </div>
                <p className="content">
                  {address}
                </p>
              </div>

              {/* 전화번호 카드 */}
              <div className="location-detail-card">
                <div className="icon-label">
                  <Phone size={24} strokeWidth={2.5} />
                  <h3>문의 전화</h3>
                </div>
                <div className="flex flex-col">
                  <p className="content mb-4">{phone}</p>
                  <a href={`tel:${phone.replace(/-/g, '')}`} className="location-cta-btn group">
                    <Phone size={20} />
                    전화 문의하기
                    <ExternalLink size={16} className="opacity-50 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* 오시는 길 / 주차 안내 카드 */}
              <div className="location-detail-card">
                <div className="icon-label">
                  <Car size={24} strokeWidth={2.5} />
                  <h3>교통 및 주차 안내</h3>
                </div>
                <p className="content whitespace-pre-line">
                  {locationGuide}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

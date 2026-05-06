import { getWorshipTimes } from '@/lib/db';
import { Clock, MapPin } from 'lucide-react';

export default async function WorshipPage() {
  const worshipTimes = await getWorshipTimes();

  const getBadgeInfo = (name) => {
    if (name.includes('주일') || name.includes('오전') || name.includes('오후')) {
      return { label: '주일예배', class: 'sunday' };
    }
    if (name.includes('어린이') || name.includes('꿈땅')) {
      return { label: '교회학교', class: 'youth' };
    }
    return { label: '주중예배', class: 'weekday' };
  };

  const formatTime = (time) => {
    // 오전 9시 -> 오전 9:00 등으로 통일감이 필요한 경우 처리 (현재는 그대로 유지하되 스타일로 보정)
    return time;
  };

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
            예배 안내
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-700">
            예배 시간 안내
          </h1>
          <div className="w-16 h-1 bg-brand-gold mx-auto mb-8 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-brand-muted leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000">
            신령과 진정으로 드리는 성령교회의 예배에 <br className="md:hidden" />
            당신을 정중히 초대합니다.
          </p>
        </div>
      </section>

      {/* 예배 카드 그리드 영역 */}
      <section className="py-24 md:py-32">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 worship-grid-v2">
            {worshipTimes.map((time, idx) => {
              const badge = getBadgeInfo(time.name);
              return (
                <div 
                  key={time.id} 
                  className="worship-time-card animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="name-row">
                    <h3>{time.name}</h3>
                    <span className={`worship-badge-v2 ${badge.class}`}>
                      {badge.label}
                    </span>
                  </div>
                  
                  <div className="worship-card-divider"></div>
                  
                  <div className="worship-info-stack">
                    <div className="worship-info-item">
                      <div className="icon-box">
                        <Clock size={20} strokeWidth={2} />
                      </div>
                      <div className="text-group">
                        <span className="label">시간</span>
                        <span className="value">{formatTime(time.time)}</span>
                      </div>
                    </div>
                    
                    <div className="worship-info-item">
                      <div className="icon-box">
                        <MapPin size={20} strokeWidth={2} />
                      </div>
                      <div className="text-group">
                        <span className="label">장소</span>
                        <span className="value">{time.place}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </section>
    </main>
  );
}

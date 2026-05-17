import { Clock } from 'lucide-react';

export default function HistoryPage() {
  const historyData = [
    { year: "1954", month: "4", content: "4월 4일 십자군 전도대에 의하여 시작. 북을 치고 나팔을 불며 전도, 천막집회. 현 광동반점 자리를 매입. 전도대원중 한사람이었던 안전도사가 사역." },
    { year: "1956", month: "", content: "임사순장로 사역." },
    { year: "1958", month: "", content: "김광석목사 사역, 이홍수전도사, 한철인전도사, 이홍의 장로." },
    { year: "1959", month: "", content: "김형환전도사 사역. 어떻게든지 믿으라고 전도." },
    { year: "1961", month: "", content: "홍정길목사 부임." },
    { year: "1963", month: "", content: "박길복목사 부임. 현 교회터인 광동리 산1번지에 시멘트 벽돌, 기와지붕의 교회지음." },
    { year: "1965", month: "", content: "이무경목사 부임." },
    { year: "1970", month: "", content: "최영두전도사 부임." },
    { year: "1982", month: "", content: "양세창목사 부임." },
    { year: "1985", month: "", content: "류윤석목사 부임. 조립식 교회건물 신축." },
    { year: "1992", month: "", content: "김영원목사 부임." },
    { year: "1994", month: "1", content: "1월 김정오목사 부임." },
    { year: "2000", month: "9", content: "9월 조병수목사 부임." },
    { year: "2001", month: "12", content: "12월 김진선목사 부임 ~ 현재" },
    { year: "2008", month: "5", content: "5월 25일 시멘트골조, 적 벽돌, 슬라브 지붕으로 1.2층 건물 봉헌. (80평)" }
  ];

  return (
    <main className="bg-[#fafafa] min-h-screen">
      {/* Header Section */}
      <section className="relative py-32 md:py-48 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-brand-gold blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-dark blur-3xl"></div>
        </div>

        <div className="container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] text-brand-gold bg-brand-gold/10 rounded-full">
            CHURCH HISTORY
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-8 tracking-tight">
            교회 연혁
          </h1>
          <div className="w-16 h-1 bg-brand-gold mx-auto mb-8 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-brand-muted leading-relaxed font-medium">
            성령교회가 걸어온 은혜와 믿음의 발자취입니다.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 md:py-32">
        <div className="container px-6">
          <div className="timeline-container">
            {historyData.map((item, idx) => (
              <div key={idx} className="timeline-row">
                {/* Timeline Dot */}
                <div className="timeline-dot"></div>
                
                {/* Year Bubble Wrap */}
                <div className="timeline-side">
                  <div className="timeline-year-wrap">
                    <div className="timeline-year-badge">
                      {item.year}
                    </div>
                  </div>
                </div>

                {/* Content Card Wrap */}
                <div className="timeline-card-wrap">
                  <div className="timeline-card">
                    <div className="month">
                      <Clock size={18} />
                      <span>{item.month ? `${item.month}월` : '연중'}</span>
                    </div>
                    <p>
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

import PageHeader from '@/components/PageHeader';
import { getSettings } from '@/lib/db';
import { Users, Heart, Anchor, ShieldCheck, Clock } from 'lucide-react';

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <main>
      <PageHeader title="교회 소개" subtitle="퇴촌성령교회는 하나님의 사랑을 전하고 지역사회를 섬기는 공동체입니다." />

      {/* 목사님 인사말 */}
      <section className="container section">
        <div className="pastor-intro">
          <div className="pastor-image">
            {settings.pastorImage ? (
              <img src={settings.pastorImage} alt={settings.pastor} className="img-full" />
            ) : (
              <div className="image-placeholder">퇴촌성령교회<br/>{settings.pastor}</div>
            )}
          </div>
          <div className="pastor-content">
            <span className="badge">목사님 인사말</span>
            <h2>"예수님의 사랑으로 여러분을 환영합니다"</h2>
            <div className="message">
              <p>안녕하십니까? 퇴촌성령교회 홈페이지를 방문해주신 여러분을 진심으로 환영합니다.</p>
              <p>우리 교회는 하나님의 말씀 위에 든든히 서서 성령의 능력으로 세상을 변화시키고자 노력하는 교회입니다. </p>
              <p>지친 영혼이 쉼을 얻고, 주님의 사랑 안에서 새로운 소망을 발견하는 복된 자리가 되기를 기도합니다.</p>
              <p>함께 예배하며 주님의 은혜를 나누는 귀한 만남이 있기를 기대합니다.</p>
            </div>
            <p className="pastor-name"><strong>{settings.pastor}</strong> 올림</p>
          </div>
        </div>
      </section>

      {/* 교회 연혁 섹션 */}
      <section className="bg-offset">
        <div className="container section">
          <div className="section-header center">
            <div className="icon-badge"><Clock size={32} color="var(--primary-color)" /></div>
            <h2>교회 연혁</h2>
            <p>퇴촌성령교회가 걸어온 믿음의 발자취입니다.</p>
          </div>
          
          <div className="history-timeline">
            {settings.history && settings.history.length > 0 ? (
              settings.history.sort((a, b) => b.year - a.year).map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="time">
                    <span className="year">{item.year}</span>
                    <span className="month">{item.month}월</span>
                  </div>
                  <div className="content">
                    <p>{item.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data" style={{textAlign: 'center', color: '#999'}}>등록된 연혁이 없습니다.</p>
            )}
          </div>
        </div>
      </section>

      {/* 교회 비전 */}
      <section>
        <div className="container section">
          <div className="section-header center">
            <h2>교회 핵심 가치</h2>
            <p>퇴촌성령교회가 지향하는 4가지 비전입니다.</p>
          </div>
          
          <div className="vision-grid">
            <div className="vision-card">
              <div className="v-icon"><Anchor /></div>
              <h3>말씀 중심</h3>
              <p>변치 않는 하나님의 말씀을 삶의 유일한 기준으로 삼습니다.</p>
            </div>
            <div className="vision-card">
              <div className="v-icon"><Heart /></div>
              <h3>사랑의 교제</h3>
              <p>예수님의 사랑으로 서로를 아끼고 돌보는 가족 같은 공동체입니다.</p>
            </div>
            <div className="vision-card">
              <div className="v-icon"><Users /></div>
              <h3>다음 세대</h3>
              <p>미래의 주역인 아이들을 신앙 안에서 바르게 양육합니다.</p>
            </div>
            <div className="vision-card">
              <div className="v-icon"><ShieldCheck /></div>
              <h3>지역 섬김</h3>
              <p>퇴촌 지역 사회에 빛과 소금이 되어 이웃을 섬깁니다.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

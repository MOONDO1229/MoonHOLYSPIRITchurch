import PageHeader from '@/components/PageHeader';
import { getWorshipTimes } from '@/lib/db';
import { Play } from 'lucide-react';

export default function WorshipPage() {
  const worshipTimes = getWorshipTimes();

  return (
    <main>
      <PageHeader title="예배 시간 안내" subtitle="신령과 진정으로 드리는 은혜샘교회의 예배입니다." />
      
      <section className="container section">
        {/* Desktop Table View */}
        <div className="desktop-table-view">
          <table className="worship-table">
            <thead>
              <tr>
                <th>예배명</th>
                <th>요일</th>
                <th>시간</th>
                <th>장소</th>
                <th>대상</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              {worshipTimes.map(time => (
                <tr key={time.id}>
                  <td className="bold">{time.name}</td>
                  <td>{time.day}</td>
                  <td className="time">{time.time}</td>
                  <td>{time.location}</td>
                  <td>{time.target}</td>
                  <td>{time.online_link ? <a href={time.online_link} className="online-link">온라인 생중계</a> : time.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="mobile-card-view">
          {worshipTimes.map(time => (
            <div key={time.id} className="worship-card">
              <div className="card-header">
                <span className="type-badge">{time.type}</span>
                <h3>{time.name}</h3>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="label">일시</span>
                  <span className="value">{time.day} {time.time}</span>
                </div>
                <div className="info-row">
                  <span className="label">장소</span>
                  <span className="value">{time.location}</span>
                </div>
              </div>
              {time.online_link && (
                <a href={time.online_link} className="btn btn-primary card-btn">
                  <Play size={24} /> 지금 온라인 예배 드리기
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}

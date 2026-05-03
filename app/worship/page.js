import PageHeader from '@/components/PageHeader';
import { getWorshipTimes } from '@/lib/db';
import { Play } from 'lucide-react';

export default async function WorshipPage() {
  const worshipTimes = await getWorshipTimes();

  return (
    <main>
      <PageHeader title="예배 시간 안내" subtitle="신령과 진정으로 드리는 퇴촌성령교회의 예배입니다." />
      
      <section className="container section">
        {/* Desktop Table View */}
        <div className="desktop-table-view">
          <table className="worship-table">
            <thead>
              <tr>
                <th>예배명</th>
                <th>시간</th>
                <th>장소</th>
              </tr>
            </thead>
            <tbody>
              {worshipTimes.map(time => (
                <tr key={time.id}>
                  <td className="bold">{time.name}</td>
                  <td className="time">{time.time}</td>
                  <td>{time.place}</td>
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
                <h3>{time.name}</h3>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="label">시간</span>
                  <span className="value">{time.time}</span>
                </div>
                <div className="info-row">
                  <span className="label">장소</span>
                  <span className="value">{time.place}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

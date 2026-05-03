import PageHeader from '@/components/PageHeader';
import { getData } from '@/lib/db';
import { Download, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function BulletinPage() {
  const bulletins = (await getData('bulletins')).filter(b => b.status === '게시').sort((a,b) => new Date(b.date) - new Date(a.date));
  const latest = bulletins[0];

  return (
    <main>
      <PageHeader title="주보 안내" subtitle="매주 발행되는 퇴촌성령교회의 소식지입니다." />

      <section className="container section">
        {latest && (
          <div className="latest-bulletin-card">
            <div className="latest-header">
              <span className="badge">최신 주보</span>
              <h2>{latest.title}</h2>
              <p className="date">{latest.date}</p>
            </div>
            
            <div className="bulletin-main-actions">
              <a href={latest.pdf_url} download className="btn btn-primary main-btn">
                <Download size={28} /> PDF 주보 전체 다운로드
              </a>
              <Link href={`/bulletin/${latest.id}`} className="btn btn-secondary main-btn">
                <FileText size={28} /> 모바일 요약 주보 읽기
              </Link>
            </div>
          </div>
        )}

        <div className="bulletin-list-section">
          <h3 className="section-title">지난 주보 목록</h3>
          <div className="bulletin-grid">
            {bulletins.slice(1).map(item => (
              <div key={item.id} className="bulletin-item-card">
                <div className="item-thumb">
                  <img src={item.image_url} alt={item.title} />
                </div>
                <div className="item-info">
                  <h4>{item.title}</h4>
                  <p>{item.date}</p>
                  <div className="item-actions">
                    <a href={item.pdf_url} download className="item-link"><Download size={20} /> PDF 다운로드</a>
                    <Link href={`/bulletin/${item.id}`} className="item-link"><FileText size={20} /> 요약보기</Link>
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

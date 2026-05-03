import PageHeader from '@/components/PageHeader';
import { getData } from '@/lib/db';
import { ChevronLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function BulletinDetailPage({ params }) {
  const { id } = params;
  const bulletin = getData('bulletins').find(b => b.id === parseInt(id));

  if (!bulletin) notFound();

  return (
    <main>
      <div className="detail-top-nav container">
        <Link href="/bulletin" className="btn-back"><ChevronLeft size={24} /> 목록으로 돌아가기</Link>
      </div>

      <section className="container bulletin-detail-section">
        <div className="bulletin-detail-header">
          <h1>{bulletin.title} 요약</h1>
          <p className="date">{bulletin.date} 발행</p>
          <a href={bulletin.pdf_url} download className="btn btn-primary download-btn">
            <Download size={24} /> 전체 주보 PDF 다운로드
          </a>
        </div>

        <div className="summary-content">
          <div className="summary-card">
            <h2>📋 예배 순서</h2>
            <p className="pre-wrap">{bulletin.summary.order}</p>
          </div>

          <div className="summary-card">
            <h2>📢 교회 소식</h2>
            <p className="pre-wrap">{bulletin.summary.notices}</p>
          </div>

          <div className="summary-grid">
            <div className="summary-card">
              <h2>⛪ 행사 및 모집</h2>
              <p className="pre-wrap">{bulletin.summary.missions}</p>
            </div>
            <div className="summary-card">
              <h2>💞 교우 소식</h2>
              <p className="pre-wrap">{bulletin.summary.fellowship}</p>
            </div>
          </div>

          <div className="summary-card offering-card">
            <h2>💰 헌금 안내</h2>
            <p className="pre-wrap">{bulletin.summary.offering}</p>
          </div>
        </div>
      </section>

    </main>
  );
}

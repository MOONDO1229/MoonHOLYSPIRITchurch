import { getData } from '@/lib/db';
import { ChevronLeft, Download, Maximize2 } from 'lucide-react';
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
          <h1>{bulletin.title}</h1>
          <p className="date">{bulletin.date} 발행</p>
        </div>

        {/* 주보 이미지 뷰어 - 모바일에서 확대 가능하도록 설정 */}
        <div className="bulletin-viewer">
          {bulletin.image_url ? (
            <div className="bulletin-image-wrap">
              <a href={bulletin.image_url} target="_blank" rel="noopener noreferrer" title="이미지를 클릭하면 크게 볼 수 있습니다.">
                <img 
                  src={bulletin.image_url} 
                  alt={`${bulletin.title} 이미지`} 
                  className="zoomable-image"
                />
              </a>
              <div className="viewer-hint">
                <Maximize2 size={16} /> 이미지를 클릭하거나 손가락으로 벌려 확대해서 보실 수 있습니다.
              </div>
            </div>
          ) : (
            <div className="no-image-placeholder">
              등록된 주보 이미지가 없습니다. 아래의 PDF 다운로드나 요약 내용을 확인해 주세요.
            </div>
          )}
        </div>

        <div className="bulletin-actions-bottom">
          {bulletin.pdf_url && (
            <a href={bulletin.pdf_url} download className="btn btn-primary">
              <Download size={24} /> 전체 주보 PDF 다운로드
            </a>
          )}
        </div>

        {/* 요약 내용은 하단에 배치 */}
        <div className="summary-content" style={{ marginTop: '50px' }}>
          <h2 className="section-subtitle">주보 요약 안내</h2>
          <div className="summary-card">
            <h3>📋 예배 순서</h3>
            <p className="pre-wrap">{bulletin.summary.order}</p>
          </div>

          <div className="summary-card">
            <h3>📢 교회 소식</h3>
            <p className="pre-wrap">{bulletin.summary.notices}</p>
          </div>

          <div className="summary-grid">
            <div className="summary-card">
              <h3>⛪ 행사 및 모집</h3>
              <p className="pre-wrap">{bulletin.summary.missions}</p>
            </div>
            <div className="summary-card">
              <h3>💞 교우 소식</h3>
              <p className="pre-wrap">{bulletin.summary.fellowship}</p>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}

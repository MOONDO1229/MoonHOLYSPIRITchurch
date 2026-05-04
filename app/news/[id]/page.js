import { getNoticeById } from '@/lib/db';
import { ChevronLeft, Download, Calendar, FileText, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function NewsDetailPage({ params }) {
  const { id } = await params;
  const item = await getNoticeById(id);

  if (!item) notFound();

  return (
    <main>
      <div className="detail-top-nav container">
        <Link href="/news" className="btn-back"><ChevronLeft size={24} /> 목록으로 돌아가기</Link>
      </div>

      <section className="container news-detail-section">
        <article className="news-article">
          <header className="article-header">
            <span className="badge">{item.category}</span>
            <h1>{item.title}</h1>
            <div className="meta">
              <span><Calendar size={18} /> {item.date}</span>
            </div>
          </header>

          <div className="article-content">
            {/* 이미지 첨부가 있을 경우 상단 노출 */}
            {item.image_url && (
              <div className="content-image">
                <img src={item.image_url} alt="공지 이미지" />
              </div>
            )}

            {/* 본문 텍스트 */}
            <div className="text-content pre-wrap">
              {item.content}
            </div>

            {/* 파일 첨부가 있을 경우 하단 노출 */}
            {item.file_url && (
              <div className="file-attachment">
                <h3><FileText size={20} /> 첨부 파일</h3>
                <a href={item.file_url} download className="btn btn-outline file-btn">
                  <Download size={18} /> {item.file_name || '첨부파일 다운로드'}
                </a>
                {item.file_url.toLowerCase().endsWith('.pdf') && (
                  <div className="pdf-preview-hint">
                    💡 PDF 파일은 다운로드 후 바로 확인하실 수 있습니다.
                  </div>
                )}
              </div>
            )}
          </div>
        </article>
      </section>


    </main>
  );
}

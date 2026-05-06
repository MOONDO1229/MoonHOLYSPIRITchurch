import AlbumGallery from '@/components/AlbumGallery';
import { getAlbumPostById } from '@/lib/db';
import { Calendar, Camera, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function AlbumDetailPage({ params }) {
  const { id } = await params;
  const album = await getAlbumPostById(id);

  if (!album) notFound();

  const images = album.album_images || [];

  return (
    <main>
      <div className="detail-top-nav container">
        <Link href="/album" className="btn-back">
          <ChevronLeft size={24} aria-hidden="true" /> 앨범 목록으로 돌아가기
        </Link>
      </div>

      <section className="container album-detail-section">
        <article className="album-detail-article">
          <header className="album-detail-header">
            <span className="album-card-badge">{album.category || '기타'}</span>
            <h1>{album.title}</h1>
            <div className="album-detail-meta">
              <span><Calendar size={18} aria-hidden="true" /> {album.event_date || album.created_at?.slice(0, 10)}</span>
              <span><Camera size={18} aria-hidden="true" /> 사진 {images.length}장</span>
            </div>
            {album.content && (
              <p className="album-detail-desc">{album.content}</p>
            )}
          </header>

          <div className="album-detail-body">
            <AlbumGallery title={album.title} images={images} />
          </div>
        </article>

        <div className="album-bottom-actions">
          <Link href="/album" className="main-btn secondary-btn">
            <ChevronLeft size={18} aria-hidden="true" /> 앨범 목록으로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}

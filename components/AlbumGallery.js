'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react';

export default function AlbumGallery({ title, images = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }, [images]);

  const activeImage = activeIndex !== null ? sortedImages[activeIndex] : null;

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => Math.max(0, current - 1));
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => Math.min(sortedImages.length - 1, current + 1));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeIndex, sortedImages.length]);

  if (sortedImages.length === 0) {
    return (
      <div className="album-gallery-empty">
        <ImageOff size={48} aria-hidden="true" />
        <p>등록된 사진이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="album-hero-photo">
        <img
          src={sortedImages[0].image_url}
          alt={sortedImages[0].alt_text || `${title} 대표 사진`}
          loading="eager"
        />
      </div>

      <div className="album-gallery-grid">
        {sortedImages.map((image, index) => (
          <button
            type="button"
            key={image.id || image.image_url}
            className="album-gallery-item"
            onClick={() => setActiveIndex(index)}
            aria-label={`${image.alt_text || title} 크게 보기`}
          >
            <img
              src={image.thumbnail_url || image.image_url}
              alt={image.alt_text || `${title} 사진 ${index + 1}`}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {activeImage && (
        <div className="album-lightbox" role="dialog" aria-modal="true" aria-label="앨범 이미지 크게 보기">
          <button
            type="button"
            className="album-lightbox-close"
            onClick={() => setActiveIndex(null)}
            aria-label="이미지 크게 보기 닫기"
          >
            <X size={28} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="album-lightbox-nav prev"
            onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
            disabled={activeIndex === 0}
            aria-label="이전 이미지"
          >
            <ChevronLeft size={30} aria-hidden="true" />
          </button>

          <img
            src={activeImage.image_url}
            alt={activeImage.alt_text || `${title} 사진`}
          />

          <button
            type="button"
            className="album-lightbox-nav next"
            onClick={() => setActiveIndex((current) => Math.min(sortedImages.length - 1, current + 1))}
            disabled={activeIndex === sortedImages.length - 1}
            aria-label="다음 이미지"
          >
            <ChevronRight size={30} aria-hidden="true" />
          </button>

          <div className="album-lightbox-count">
            {activeIndex + 1} / {sortedImages.length}
          </div>
        </div>
      )}
    </>
  );
}

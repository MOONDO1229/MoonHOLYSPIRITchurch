'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, Camera, ChevronRight, ImageOff, Search } from 'lucide-react';

const FALLBACK_CATEGORIES = ['전체', '예배', '행사', '다음세대', '교제', '기타'];

function stripText(value = '') {
  return String(value).replace(/<[^>]*>/g, '').trim();
}

export default function AlbumListClient({ initialAlbums = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => {
    const merged = new Set(FALLBACK_CATEGORIES);
    initialAlbums.forEach((album) => {
      if (album.category) merged.add(album.category);
    });
    return [...merged];
  }, [initialAlbums]);

  const filteredAlbums = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return initialAlbums.filter((album) => {
      const matchesCategory = selectedCategory === '전체' || album.category === selectedCategory;
      const text = `${album.title || ''} ${album.content || ''}`.toLowerCase();
      const matchesSearch = !keyword || text.includes(keyword);
      return matchesCategory && matchesSearch;
    });
  }, [initialAlbums, searchTerm, selectedCategory]);

  return (
    <div className="album-list-wrap max-w-7xl mx-auto px-6 pb-32">
      <div className="album-filter-panel">
        <div className="album-category-tabs" aria-label="앨범 카테고리">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={selectedCategory === category ? 'active' : ''}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <label className="album-search-box">
          <Search size={18} aria-hidden="true" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="앨범 제목 또는 설명 검색"
            aria-label="앨범 검색"
          />
        </label>
      </div>

      {filteredAlbums.length > 0 ? (
        <div className="album-card-grid">
          {filteredAlbums.map((album) => {
            const imageCount = album.album_images?.length || album.image_count || 0;
            const cover = album.cover_image_url;
            const excerpt = stripText(album.content).slice(0, 90);

            return (
              <Link key={album.id} href={`/album/${album.id}`} className="album-card">
                <div className="album-card-image">
                  {cover ? (
                    <img src={cover} alt={`${album.title} 대표 이미지`} loading="lazy" />
                  ) : (
                    <div className="album-image-empty">
                      <ImageOff size={34} aria-hidden="true" />
                    </div>
                  )}
                  <span className="album-card-badge">{album.category || '기타'}</span>
                </div>

                <div className="album-card-body">
                  <div className="album-card-meta">
                    <span><Calendar size={15} aria-hidden="true" /> {album.event_date || album.created_at?.slice(0, 10)}</span>
                    <span><Camera size={15} aria-hidden="true" /> {imageCount}장</span>
                  </div>
                  <h2>{album.title}</h2>
                  <p>{excerpt || '성령교회의 모습을 사진으로 전합니다.'}</p>
                  <span className="album-card-link">
                    자세히 보기 <ChevronRight size={17} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="album-empty-state">
          <ImageOff size={52} aria-hidden="true" />
          <h2>등록된 교회 앨범이 아직 없습니다.</h2>
          <p>새로운 예배와 공동체의 사진이 준비되면 이곳에 전해드리겠습니다.</p>
        </div>
      )}
    </div>
  );
}

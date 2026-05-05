'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Calendar, ChevronRight } from 'lucide-react';

export default function NewsListClient({ initialNotices }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = useMemo(() => {
    const cats = ['전체', '중요'];
    initialNotices.forEach(item => {
      if (item.category && !cats.includes(item.category)) {
        cats.push(item.category);
      }
    });
    return cats;
  }, [initialNotices]);

  const filteredNotices = useMemo(() => {
    return initialNotices.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '전체' || 
                             (selectedCategory === '중요' && item.is_pinned) ||
                             item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, initialNotices]);

  const getBadgeClass = (item) => {
    if (item.is_pinned) return 'important';
    if (item.category === '공지') return 'notice';
    if (item.category === '모집') return 'recruit';
    return 'general';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-32">
      {/* 필터 및 검색 바 영역 */}
      <div className="news-archive-container mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="news-filter-bar">
          {/* 카테고리 필터 칩 */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 검색창 */}
          <div className="search-input-wrap">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="제목 또는 내용 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 뉴스/공지 목록 구조 */}
        <div className="news-list-rows">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((item, index) => (
              <Link 
                key={item.id} 
                href={`/news/${item.id}`} 
                className="news-item-row animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex md:block">
                  <span className={`news-badge ${getBadgeClass(item)}`}>
                    {item.is_pinned ? '중요' : (item.category || '소식')}
                  </span>
                </div>
                
                <div className="news-info">
                  <h4 className="line-clamp-1">{item.title}</h4>
                  <p className="excerpt line-clamp-1">{item.content.replace(/<[^>]*>/g, '').substring(0, 100)}</p>
                </div>
                
                <div className="date text-right flex items-center justify-end gap-2 text-gray-400 font-medium">
                  <Calendar size={14} className="opacity-60" />
                  {item.date}
                </div>
              </Link>
            ))
          ) : (
            <div className="py-32 text-center text-gray-400 font-bold bg-white">
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </div>
      
      {/* 페이지 하단 안내 */}
      <div className="text-center text-brand-muted text-sm font-medium opacity-60">
        성령교회의 모든 소식은 실시간으로 업데이트됩니다.
      </div>
    </div>
  );
}

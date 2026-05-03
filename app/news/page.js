import PageHeader from '@/components/PageHeader';
import { getNotices } from '@/lib/db';
import Link from 'next/link';
import { ChevronRight, Calendar, User, Tag } from 'lucide-react';

export default function NewsPage() {
  const notices = getNotices();

  return (
    <main>
      <PageHeader title="교회 소식" subtitle="퇴촌성령교회의 다양한 소식과 공지사항을 전해드립니다." />

      <section className="container section">
        <div className="news-list">
          {notices.length > 0 ? (
            notices.map(item => (
              <Link key={item.id} href={`/news/${item.id}`} className="news-item-card">
                <div className="news-content">
                  <div className="news-meta">
                    <span className={`cat-badge ${item.is_pinned ? 'pinned' : ''}`}>
                      {item.is_pinned ? '중요' : item.category}
                    </span>
                    <span className="date"><Calendar size={14} /> {item.date}</span>
                  </div>
                  <h3 className="news-title">{item.title}</h3>
                  <p className="news-excerpt">{item.content.substring(0, 150)}...</p>
                </div>
                <div className="news-arrow">
                  <ChevronRight size={24} />
                </div>
              </Link>
            ))
          ) : (
            <div className="no-data">등록된 소식이 없습니다.</div>
          )}
        </div>
      </section>


    </main>
  );
}

import { getData } from '@/lib/db';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export default function NoticeListPage() {
  const notices = getData('notices').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="notice-list-page">
      <div className="admin-header">
        <h1>공지사항 관리</h1>
        <Link href="/admin/notices/new" className="btn-primary">
          <Plus size={20} /> 새 공지 등록
        </Link>
      </div>

      <div className="admin-card search-bar">
        <div className="search-input-wrap">
          <Search size={20} />
          <input type="text" placeholder="제목으로 검색..." />
        </div>
        <div className="filter-tabs">
          <button className="active">전체</button>
          <button>공지</button>
          <button>행사</button>
          <button>교우소식</button>
        </div>
      </div>

      <div className="admin-card table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>카테고리</th>
              <th>제목</th>
              <th>등록일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice, index) => (
              <tr key={notice.id}>
                <td>{notices.length - index}</td>
                <td><span className="cat-tag">{notice.category}</span></td>
                <td className="title-td">{notice.title}</td>
                <td>{notice.createdAt?.split('T')[0]}</td>
                <td><span className={`status-tag ${notice.status === '게시' ? 'active' : ''}`}>{notice.status}</span></td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon"><Edit2 size={16} /></button>
                    <button className="btn-icon danger"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

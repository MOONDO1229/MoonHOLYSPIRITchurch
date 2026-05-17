'use client';
import { useState } from 'react';
import { createItem, updateItem, deleteItem } from '@/lib/actions';
import { Plus, Edit2, Trash2, Bell, Save, X, Eye, Search, Pin } from 'lucide-react';
import FileUpload from './FileUpload';

export default function NoticeManager({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('전체');

  const handleEdit = (item) => {
    setCurrent(item);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrent({
      title: '',
      content: '',
      category: '공지',
      date: new Date().toISOString().split('T')[0],
      is_pinned: false,
      status: '게시',
      image_url: ''
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (current.id) {
        await updateItem('notices', current.id, current);
      } else {
        await createItem('notices', current);
      }
      alert('저장되었습니다.');
      window.location.reload();
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteItem('notices', id);
        alert('삭제되었습니다.');
        window.location.reload();
      } catch (err) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const filteredNotices = notices
    .filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === '전체' || n.category === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return b.is_pinned ? -1 : 1;
      return new Date(b.date) - new Date(a.date);
    });

  return (
    <div className="notice-manager">
      <div className="admin-header">
        <h1>공지사항 관리</h1>
        <button className="btn-primary" onClick={handleAddNew}><Plus size={20} /> 새 공지 등록</button>
      </div>

      {!isEditing ? (
        <>
          <div className="admin-card search-bar">
            <div className="search-input-wrap">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="제목으로 검색..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              {['전체', '공지', '행사', '교우소식', '기타'].map(cat => (
                <button 
                  key={cat}
                  className={filter === cat ? 'active' : ''}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-card table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th>카테고리</th>
                  <th>제목</th>
                  <th>작성일</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotices.map(item => (
                  <tr key={item.id} className={item.is_pinned ? 'pinned-row' : ''}>
                    <td>{item.is_pinned ? <Pin size={16} className="pin-icon" /> : '-'}</td>
                    <td><span className="cat-tag">{item.category}</span></td>
                    <td className="title-td">{item.title}</td>
                    <td>{item.date}</td>
                    <td><span className={`status-tag ${item.status === '게시' ? 'active' : ''}`}>{item.status}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon" onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
                        <button className="btn-icon danger" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredNotices.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>등록된 공지사항이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="edit-view">
          <form onSubmit={handleSave} className="admin-card edit-form">
            <div className="form-header">
              <h2>{current.id ? '공지사항 수정' : '새 공지 등록'}</h2>
              <button type="button" className="btn-close" onClick={() => setIsEditing(false)}><X /></button>
            </div>

            <div className="form-row">
              <div className="form-section">
                <label>공지 제목</label>
                <input 
                  value={current.title} 
                  onChange={e => setCurrent({...current, title: e.target.value})} 
                  placeholder="공지사항 제목을 입력하세요"
                  required 
                />
              </div>
              <div className="form-section">
                <label>카테고리</label>
                <select value={current.category} onChange={e => setCurrent({...current, category: e.target.value})}>
                  <option>공지</option>
                  <option>행사</option>
                  <option>교우소식</option>
                  <option>기타</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-section">
                <label>작성 날짜</label>
                <input type="date" value={current.date} onChange={e => setCurrent({...current, date: e.target.value})} required />
              </div>
              <div className="form-section" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '10px' }}>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={current.is_pinned} 
                    onChange={e => setCurrent({...current, is_pinned: e.target.checked})} 
                  /> 
                  상단 고정 (공지사항 상단에 항상 노출)
                </label>
              </div>
            </div>

            <div className="form-section">
              <label>상세 내용</label>
              <textarea 
                rows="10" 
                value={current.content} 
                onChange={e => setCurrent({...current, content: e.target.value})} 
                placeholder="공지내용을 상세히 입력하세요..."
                required
              />
            </div>

            <div className="form-section">
              <FileUpload 
                label="대표 이미지 업로드 (선택사항)" 
                onUploadComplete={url => setCurrent({...current, image_url: url})} 
              />
              {current.image_url && <p className="file-info">현재 이미지: {current.image_url}</p>}
            </div>

            <div className="form-row options">
              <div className="status-select">
                <label>게시 상태:</label>
                <select value={current.status} onChange={e => setCurrent({...current, status: e.target.value})}>
                  <option>게시</option>
                  <option>임시저장</option>
                  <option>숨김</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>취소</button>
              <button type="submit" className="btn-primary"><Save size={20} /> 저장하기</button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .notice-manager { width: 100%; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .btn-primary { background: #1b4d3e; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px; border: none; cursor: pointer; }
        
        .search-bar { display: flex; justify-content: space-between; align-items: center; padding: 20px; margin-bottom: 20px; gap: 20px; }
        .search-input-wrap { flex: 1; display: flex; align-items: center; gap: 10px; background: #f0f2f5; padding: 10px 15px; border-radius: 8px; color: #7f8c8d; }
        .search-input-wrap input { border: none; background: none; width: 100%; font-size: 16px; outline: none; }
        .filter-tabs { display: flex; gap: 10px; }
        .filter-tabs button { padding: 8px 16px; border-radius: 20px; border: 1px solid #ddd; background: white; cursor: pointer; color: #7f8c8d; font-weight: 700; transition: all 0.2s; }
        .filter-tabs button.active { background: #1b4d3e; color: white; border-color: #1b4d3e; }

        .table-card { background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
        .admin-table th { background: #f8f9fa; padding: 15px 20px; font-weight: 700; color: #34495e; border-bottom: 1px solid #eee; }
        .admin-table td { padding: 15px 20px; border-bottom: 1px solid #f0f2f5; font-size: 16px; }
        .pinned-row { background: #fffdf0; }
        .pin-icon { color: #f1c40f; }
        .cat-tag { background: #ebf5fb; color: #3498db; padding: 4px 10px; border-radius: 4px; font-size: 14px; font-weight: 700; }
        .title-td { font-weight: 700; color: #2c3e50; }
        .status-tag { padding: 4px 10px; border-radius: 4px; font-size: 14px; background: #eee; }
        .status-tag.active { background: #eafaf1; color: #27ae60; }
        .action-btns { display: flex; gap: 8px; }
        .btn-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer; color: #7f8c8d; transition: all 0.2s; }
        .btn-icon:hover { background: #f0f2f5; color: #1b4d3e; border-color: #1b4d3e; }
        .btn-icon.danger:hover { background: #fadbd8; color: #e74c3c; border-color: #e74c3c; }

        .edit-view { max-width: 900px; margin: 0 auto; }
        .edit-form { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .btn-close { background: none; border: none; cursor: pointer; color: #95a5a6; }
        .form-section { margin-bottom: 20px; }
        .form-section label { display: block; font-weight: 700; margin-bottom: 8px; color: #34495e; font-size: 16px; }
        .form-section input, .form-section textarea, .form-section select { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; font-family: inherit; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 10px; }
        .checkbox-label { display: flex !important; align-items: center; gap: 10px; cursor: pointer; color: #2c3e50 !important; font-weight: 700 !important; }
        .checkbox-label input { width: auto !important; height: 20px; width: 20px !important; }
        .options { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 10px; }
        .status-select { display: flex; align-items: center; gap: 15px; font-weight: 700; }
        .status-select select { width: 150px; padding: 8px; }

        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .btn-secondary { background: white; border: 1px solid #ddd; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }
        
        .file-info { font-size: 14px; color: #7f8c8d; margin-top: 8px; }

        @media (max-width: 768px) {
          .search-bar { flex-direction: column; align-items: stretch; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

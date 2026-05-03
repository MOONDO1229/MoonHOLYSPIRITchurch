'use client';
import { useState } from 'react';
import { createItem, updateItem, deleteItem } from '@/lib/actions';
import { Plus, Edit2, Trash2, Save, X, PlayCircle as Youtube, Search } from 'lucide-react';
import FileUpload from './FileUpload';

export default function SermonManager({ initialSermons }) {
  const [sermons, setSermons] = useState(initialSermons);
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
      date: new Date().toISOString().split('T')[0],
      preacher: '김은혜 담임목사',
      passage: '',
      category: '주일예배',
      youtube_url: '',
      summary: '',
      thumbnail: '',
      show_on_main: true,
      status: '게시'
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (current.id) {
        await updateItem('sermons', current.id, current);
      } else {
        await createItem('sermons', current);
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
        await deleteItem('sermons', id);
        alert('삭제되었습니다.');
        window.location.reload();
      } catch (err) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const filteredSermons = (sermons || [])
    .filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === '전체' || s.category === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="sermon-manager">
      <div className="admin-header">
        <h1>설교 영상 관리</h1>
        <button className="btn-primary" onClick={handleAddNew}><Plus size={20} /> 새 설교 등록</button>
      </div>

      {!isEditing ? (
        <>
          <div className="admin-card search-bar">
            <div className="search-input-wrap">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="제목 또는 본문 검색..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              {['전체', '주일예배', '수요예배', '금요예배', '청년예배', '새벽기도'].map(cat => (
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
                  <th>날짜</th>
                  <th>구분</th>
                  <th>설교 제목</th>
                  <th>설교자</th>
                  <th>메인</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredSermons.map(item => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td><span className="cat-tag">{item.category}</span></td>
                    <td className="title-td">{item.title}</td>
                    <td>{item.preacher}</td>
                    <td>{item.show_on_main ? '✅' : '-'}</td>
                    <td><span className={`status-tag ${item.status === '게시' ? 'active' : ''}`}>{item.status}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon" onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
                        <button className="btn-icon danger" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSermons.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>등록된 설교 영상이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="edit-view">
          <div className="edit-layout">
            <form onSubmit={handleSave} className="admin-card edit-form">
              <div className="form-header">
                <h2>{current.id ? '설교 수정' : '새 설교 등록'}</h2>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}><X /></button>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <label>설교 제목</label>
                  <input value={current.title} onChange={e => setCurrent({...current, title: e.target.value})} required />
                </div>
                <div className="form-section">
                  <label>설교 날짜</label>
                  <input type="date" value={current.date} onChange={e => setCurrent({...current, date: e.target.value})} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <label>설교자</label>
                  <input value={current.preacher} onChange={e => setCurrent({...current, preacher: e.target.value})} required />
                </div>
                <div className="form-section">
                  <label>성경 본문</label>
                  <input value={current.passage} onChange={e => setCurrent({...current, passage: e.target.value})} placeholder="예: 시편 23:1-6" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <label>예배 구분</label>
                  <select value={current.category} onChange={e => setCurrent({...current, category: e.target.value})}>
                    <option>주일예배</option>
                    <option>새벽기도</option>
                    <option>수요예배</option>
                    <option>금요예배</option>
                    <option>청년예배</option>
                    <option>기타</option>
                  </select>
                </div>
                <div className="form-section">
                  <label>유튜브 URL</label>
                  <div className="youtube-input-wrap">
                    <Youtube size={20} />
                    <input value={current.youtube_url} onChange={e => setCurrent({...current, youtube_url: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." required />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <label>설교 요약</label>
                <textarea rows="4" value={current.summary} onChange={e => setCurrent({...current, summary: e.target.value})} placeholder="설교 핵심 내용을 짧게 적어주세요." />
              </div>

              <div className="form-section">
                <FileUpload label="대표 이미지 (썸네일 미입력 시 유튜브 썸네일 사용)" onUploadComplete={url => setCurrent({...current, thumbnail: url})} />
                {current.thumbnail && <p className="file-info">현재 이미지: {current.thumbnail}</p>}
              </div>

              <div className="form-row options">
                <label className="checkbox-label"><input type="checkbox" checked={current.show_on_main} onChange={e => setCurrent({...current, show_on_main: e.target.checked})} /> 메인 노출</label>
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

            <div className="preview-area">
              <div className="preview-header">영상 미리보기</div>
              <div className="admin-card video-preview">
                {getYoutubeId(current.youtube_url) ? (
                  <iframe 
                    width="100%" 
                    height="200" 
                    src={`https://www.youtube.com/embed/${getYoutubeId(current.youtube_url)}`}
                    frameBorder="0" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="no-video">유튜브 링크를 입력하세요</div>
                )}
                <div className="preview-info">
                  <span className="cat">{current.category}</span>
                  <h3>{current.title || '설교 제목'}</h3>
                  <p>{current.preacher} | {current.passage || '성경 본문'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .sermon-manager { width: 100%; }
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
        .cat-tag { background: #ebf5fb; color: #3498db; padding: 4px 10px; border-radius: 4px; font-size: 14px; font-weight: 700; }
        .title-td { font-weight: 700; color: #2c3e50; }
        .status-tag { padding: 4px 10px; border-radius: 4px; font-size: 14px; background: #eee; }
        .status-tag.active { background: #eafaf1; color: #27ae60; }
        .action-btns { display: flex; gap: 8px; }
        .btn-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer; color: #7f8c8d; }
        .btn-icon:hover { border-color: #1b4d3e; color: #1b4d3e; background: #f0f2f5; }
        .btn-icon.danger:hover { background: #fadbd8; color: #e74c3c; border-color: #e74c3c; }

        .edit-view { max-width: 1200px; margin: 0 auto; }
        .edit-layout { display: grid; grid-template-columns: 1fr 400px; gap: 30px; align-items: start; }
        .edit-form { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .btn-close { background: none; border: none; cursor: pointer; color: #95a5a6; }
        .form-section { margin-bottom: 15px; }
        .form-section label { display: block; font-weight: 700; margin-bottom: 6px; color: #34495e; }
        .form-section input, .form-section textarea, .form-section select { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; font-family: inherit; }
        .youtube-input-wrap { display: flex; align-items: center; gap: 10px; background: #fdf2f2; padding: 0 10px; border: 1px solid #fadbd8; border-radius: 8px; color: #e74c3c; }
        .youtube-input-wrap input { border: none; background: none; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .options { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; font-weight: 700; cursor: pointer; }
        .checkbox-label input { width: 20px; height: 20px; }
        .status-select { display: flex; align-items: center; gap: 10px; font-weight: 700; }
        .status-select select { width: 120px; padding: 8px; }

        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
        .btn-secondary { background: white; border: 1px solid #ddd; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }

        .preview-area { position: sticky; top: 20px; }
        .preview-header { color: #888; font-size: 12px; text-align: center; margin-bottom: 8px; }
        .video-preview { overflow: hidden; padding: 0; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .no-video { height: 200px; background: #eee; display: flex; align-items: center; justify-content: center; color: #7f8c8d; font-weight: 700; }
        .preview-info { padding: 20px; }
        .preview-info .cat { color: #3498db; font-size: 14px; font-weight: 800; }
        .preview-info h3 { margin: 5px 0; font-size: 18px; }
        .preview-info p { color: #7f8c8d; font-size: 15px; }
        .file-info { font-size: 14px; color: #7f8c8d; margin-top: 8px; }

        @media (max-width: 1024px) {
          .edit-layout { grid-template-columns: 1fr; }
          .preview-area { display: none; }
        }
      `}</style>
    </div>
  );
}

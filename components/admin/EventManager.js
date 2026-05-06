'use client';
import { useState } from 'react';
import { createItem, updateItem, deleteItem } from '@/lib/actions';
import { Plus, Edit2, Trash2, Save, X, PlayCircle as Youtube, Search, MapPin, AlignLeft } from 'lucide-react';
import FileUpload from './FileUpload';

export default function EventManager({ initialEvents }) {
  const [events, setEvents] = useState(initialEvents);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (item) => {
    setCurrent(item);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      place: '',
      content: '',
      youtube_url: '',
      thumbnail: '',
      status: '게시'
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (current.id) {
        await updateItem('events', current.id, current);
      } else {
        await createItem('events', current);
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
        await deleteItem('events', id);
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

  const filteredEvents = (events || [])
    .filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="event-manager">
      <div className="admin-header">
        <h1>교회 행사 관리</h1>
        <button className="btn-primary" onClick={handleAddNew}><Plus size={20} /> 새 행사 등록</button>
      </div>

      {!isEditing ? (
        <>
          <div className="admin-card search-bar">
            <div className="search-input-wrap">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="행사명 검색..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-card table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>행사명</th>
                  <th>장소</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(item => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td className="title-td">{item.title}</td>
                    <td>{item.place}</td>
                    <td><span className={`status-tag ${item.status === '게시' ? 'active' : ''}`}>{item.status}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon" onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
                        <button className="btn-icon danger" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>등록된 행사가 없습니다.</td>
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
                <h2>{current.id ? '행사 수정' : '새 행사 등록'}</h2>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}><X /></button>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <label>행사명</label>
                  <input value={current.title} onChange={e => setCurrent({...current, title: e.target.value})} required />
                </div>
                <div className="form-section">
                  <label>행사일</label>
                  <input type="date" value={current.date} onChange={e => setCurrent({...current, date: e.target.value})} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <label>행사위치</label>
                  <div className="input-with-icon">
                    <MapPin size={18} className="icon" />
                    <input value={current.place} onChange={e => setCurrent({...current, place: e.target.value})} placeholder="예: 본당, 1층 교육관 등" required />
                  </div>
                </div>
                <div className="form-section">
                  <label>유튜브 URL (영상이 있을 경우)</label>
                  <div className="youtube-input-wrap">
                    <Youtube size={20} />
                    <input value={current.youtube_url} onChange={e => setCurrent({...current, youtube_url: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <label>행사내용</label>
                <div className="input-with-icon align-start">
                  <AlignLeft size={18} className="icon mt-3" />
                  <textarea rows="6" value={current.content} onChange={e => setCurrent({...current, content: e.target.value})} placeholder="행사의 상세 내용을 적어주세요." required />
                </div>
              </div>

              <div className="form-section">
                <FileUpload label="대표 이미지 (영상 미입력 시 썸네일로 사용)" onUploadComplete={url => setCurrent({...current, thumbnail: url})} />
                {current.thumbnail && <p className="file-info">현재 이미지: {current.thumbnail}</p>}
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

            <div className="preview-area">
              <div className="preview-header">행사 미리보기</div>
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
                  <div className="no-video">영상 없음</div>
                )}
                <div className="preview-info">
                  <h3>{current.title || '행사명'}</h3>
                  <p>{current.date} | {current.place || '장소'}</p>
                  <p className="mt-2 text-sm line-clamp-3">{current.content || '행사 내용...'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .event-manager { width: 100%; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .btn-primary { background: #1b4d3e; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px; border: none; cursor: pointer; }
        
        .search-bar { padding: 20px; margin-bottom: 20px; }
        .search-input-wrap { display: flex; align-items: center; gap: 10px; background: #f0f2f5; padding: 10px 15px; border-radius: 8px; color: #7f8c8d; }
        .search-input-wrap input { border: none; background: none; width: 100%; font-size: 16px; outline: none; }

        .table-card { background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
        .admin-table th { background: #f8f9fa; padding: 15px 20px; font-weight: 700; color: #34495e; border-bottom: 1px solid #eee; }
        .admin-table td { padding: 15px 20px; border-bottom: 1px solid #f0f2f5; font-size: 16px; }
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
        
        .input-with-icon { display: flex; align-items: center; gap: 10px; border: 1px solid #ddd; border-radius: 8px; padding-left: 12px; }
        .input-with-icon.align-start { align-items: flex-start; }
        .input-with-icon .icon { color: #95a5a6; }
        .input-with-icon input, .input-with-icon textarea { border: none; padding-left: 0; }
        
        .youtube-input-wrap { display: flex; align-items: center; gap: 10px; background: #fdf2f2; padding: 0 10px; border: 1px solid #fadbd8; border-radius: 8px; color: #e74c3c; }
        .youtube-input-wrap input { border: none; background: none; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .options { display: flex; justify-content: flex-start; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
        .status-select { display: flex; align-items: center; gap: 10px; font-weight: 700; }
        .status-select select { width: 120px; padding: 8px; }

        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
        .btn-secondary { background: white; border: 1px solid #ddd; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }

        .preview-area { position: sticky; top: 20px; }
        .preview-header { color: #888; font-size: 12px; text-align: center; margin-bottom: 8px; }
        .video-preview { overflow: hidden; padding: 0; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .no-video { height: 200px; background: #eee; display: flex; align-items: center; justify-content: center; color: #7f8c8d; font-weight: 700; }
        .preview-info { padding: 20px; }
        .preview-info h3 { margin: 5px 0; font-size: 18px; }
        .preview-info p { color: #7f8c8d; font-size: 15px; }
        .file-info { font-size: 14px; color: #7f8c8d; margin-top: 8px; }
        .mt-2 { margin-top: 8px; }
        .mt-3 { margin-top: 12px; }

        @media (max-width: 1024px) {
          .edit-layout { grid-template-columns: 1fr; }
          .preview-area { display: none; }
        }
      `}</style>
    </div>
  );
}

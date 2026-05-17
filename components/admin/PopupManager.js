'use client';
import { useState } from 'react';
import { createPopup, updatePopup, deleteItem } from '@/lib/actions';
import { Plus, Edit2, Trash2, Smartphone, Monitor, Save, X, Search, Calendar, ExternalLink } from 'lucide-react';
import FileUpload from './FileUpload';

export default function PopupManager({ initialPopups }) {
  const [popups, setPopups] = useState(initialPopups || []);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(null);
  const [isPreviewMobile, setIsPreviewMobile] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (item) => {
    setCurrent(item);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrent({
      title: '',
      pc_image: '',
      mobile_image: '',
      link: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      show_on_pc: true,
      show_on_mobile: true,
      use_today_hide: true,
      status: '게시'
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (current.id) {
        await updatePopup(current.id, current);
      } else {
        await createPopup(current);
      }
      alert('저장되었습니다.');
      window.location.reload();
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('정말로 이 팝업을 삭제하시겠습니까?')) {
      try {
        await deleteItem('popups', id);
        alert('삭제되었습니다.');
        window.location.reload();
      } catch (err) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const filteredPopups = popups
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  return (
    <div className="popup-manager">
      <div className="admin-header">
        <h1>팝업 및 행사 포스터 관리</h1>
        <button className="btn-primary" onClick={handleAddNew}><Plus size={20} /> 새 팝업 등록</button>
      </div>

      {!isEditing ? (
        <>
          <div className="admin-card search-bar">
            <div className="search-input-wrap">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="팝업 제목 검색..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="popup-grid">
            {filteredPopups.map(popup => (
              <div key={popup.id} className="admin-card popup-item">
                <div className="popup-thumb">
                  <img src={popup.mobile_image || popup.pc_image} alt={popup.title} />
                  <div className="popup-badge">{popup.status}</div>
                </div>
                <div className="popup-info">
                  <h3>{popup.title}</h3>
                  <div className="info-row">
                    <Calendar size={14} />
                    <span>{popup.start_date} ~ {popup.end_date}</span>
                  </div>
                  <div className="status-tags">
                    {popup.show_on_pc && <span className="tag pc"><Monitor size={12} /> PC</span>}
                    {popup.show_on_mobile && <span className="tag mobile"><Smartphone size={12} /> 모바일</span>}
                    {popup.link && <span className="tag link"><ExternalLink size={12} /> 링크</span>}
                  </div>
                </div>
                <div className="popup-actions">
                  <button className="btn-edit" onClick={() => handleEdit(popup)}><Edit2 size={16} /> 수정</button>
                  <button className="btn-delete" onClick={() => handleDelete(popup.id)}><Trash2 size={16} /> 삭제</button>
                </div>
              </div>
            ))}
            {filteredPopups.length === 0 && (
              <div className="no-data">등록된 팝업이 없습니다.</div>
            )}
          </div>
        </>
      ) : (
        <div className="edit-view">
          <div className="edit-layout">
            <form onSubmit={handleSave} className="admin-card edit-form">
              <div className="form-header">
                <h2>{current.id ? '팝업 수정' : '새 팝업 등록'}</h2>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}><X /></button>
              </div>

              <div className="form-section">
                <label>팝업 제목</label>
                <input 
                  value={current.title} 
                  onChange={e => setCurrent({...current, title: e.target.value})} 
                  placeholder="예: 2024년 성령강림절 특별집회"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-section">
                  <FileUpload 
                    label="PC용 이미지 (권장 1000x1200)" 
                    onUploadComplete={url => setCurrent({...current, pc_image: url})} 
                  />
                  {current.pc_image && <p className="file-info">PC 이미지 업로드됨</p>}
                </div>
                <div className="form-section">
                  <FileUpload 
                    label="모바일용 이미지 (권장 600x800)" 
                    onUploadComplete={url => setCurrent({...current, mobile_image: url})} 
                  />
                  {current.mobile_image && <p className="file-info">모바일 이미지 업로드됨</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <label>노출 시작일</label>
                  <input 
                    type="date" 
                    value={current.start_date} 
                    onChange={e => setCurrent({...current, start_date: e.target.value})} 
                    required
                  />
                </div>
                <div className="form-section">
                  <label>노출 종료일</label>
                  <input 
                    type="date" 
                    value={current.end_date} 
                    onChange={e => setCurrent({...current, end_date: e.target.value})} 
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <label>클릭 시 이동할 링크 (선택사항)</label>
                <input 
                  value={current.link} 
                  onChange={e => setCurrent({...current, link: e.target.value})} 
                  placeholder="https://..."
                />
              </div>

              <div className="form-row options">
                <label className="checkbox-label"><input type="checkbox" checked={current.show_on_pc} onChange={e => setCurrent({...current, show_on_pc: e.target.checked})} /> PC 노출</label>
                <label className="checkbox-label"><input type="checkbox" checked={current.show_on_mobile} onChange={e => setCurrent({...current, show_on_mobile: e.target.checked})} /> 모바일 노출</label>
                <label className="checkbox-label"><input type="checkbox" checked={current.use_today_hide} onChange={e => setCurrent({...current, use_today_hide: e.target.checked})} /> '오늘 하루 보지 않기' 사용</label>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <label>게시 상태</label>
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
              <div className="preview-toggle">
                <button className={!isPreviewMobile ? 'active' : ''} onClick={() => setIsPreviewMobile(false)}><Monitor size={18} /> PC 버전</button>
                <button className={isPreviewMobile ? 'active' : ''} onClick={() => setIsPreviewMobile(true)}><Smartphone size={18} /> 모바일 버전</button>
              </div>
              <div className={`preview-container ${isPreviewMobile ? 'mobile' : 'pc'}`}>
                <div className="popup-preview-box">
                  <div className="preview-img">
                    {isPreviewMobile ? (
                      (current.mobile_image || current.pc_image) ? <img src={current.mobile_image || current.pc_image} alt="미리보기" /> : <div className="no-img">모바일 이미지 없음</div>
                    ) : (
                      current.pc_image ? <img src={current.pc_image} alt="미리보기" /> : <div className="no-img">PC 이미지 없음</div>
                    )}
                  </div>
                  <div className="preview-footer">
                    <div className="today-hide">오늘 하루 보지 않기</div>
                    <div className="close-btn">닫기</div>
                  </div>
                </div>
              </div>
              <p className="preview-help">※ 실제 팝업창은 중앙 또는 지정된 위치에 나타납니다.</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .popup-manager { width: 100%; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .btn-primary { background: #1b4d3e; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px; border: none; cursor: pointer; }
        
        .search-bar { padding: 20px; margin-bottom: 20px; }
        .search-input-wrap { display: flex; align-items: center; gap: 10px; background: #f0f2f5; padding: 10px 15px; border-radius: 8px; color: #7f8c8d; max-width: 400px; }
        .search-input-wrap input { border: none; background: none; width: 100%; font-size: 16px; outline: none; }

        .popup-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .popup-item { display: flex; flex-direction: column; overflow: hidden; padding: 0; }
        .popup-thumb { width: 100%; aspect-ratio: 1/1.2; background: #f8f9fa; position: relative; overflow: hidden; }
        .popup-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .popup-badge { position: absolute; top: 12px; left: 12px; background: #1b4d3e; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; }
        
        .popup-info { padding: 16px; flex: 1; }
        .popup-info h3 { margin: 0 0 8px; font-size: 1.1rem; color: #2c3e50; }
        .info-row { display: flex; align-items: center; gap: 6px; color: #7f8c8d; font-size: 13px; margin-bottom: 12px; }
        
        .status-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .tag { font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 700; display: flex; align-items: center; gap: 4px; }
        .tag.pc { background: #e8f4fd; color: #2980b9; }
        .tag.mobile { background: #fef9e7; color: #f39c12; }
        .tag.link { background: #ebf5fb; color: #3498db; }

        .popup-actions { display: flex; border-top: 1px solid #f0f2f5; }
        .popup-actions button { flex: 1; padding: 12px; border: none; background: white; cursor: pointer; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; }
        .btn-edit { color: #34495e; border-right: 1px solid #f0f2f5 !important; }
        .btn-edit:hover { background: #f8f9fa; color: #1b4d3e; }
        .btn-delete { color: #e74c3c; }
        .btn-delete:hover { background: #fdf2f2; }

        .no-data { grid-column: 1/-1; padding: 80px; text-align: center; color: #999; font-weight: 700; }

        .edit-view { max-width: 1200px; margin: 0 auto; }
        .edit-layout { display: grid; grid-template-columns: 1fr 400px; gap: 30px; align-items: start; }
        .edit-form { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .btn-close { background: none; border: none; cursor: pointer; color: #95a5a6; }
        
        .form-section { margin-bottom: 15px; }
        .form-section label { display: block; font-weight: 700; margin-bottom: 6px; color: #34495e; }
        .form-section input, .form-section select { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; font-family: inherit; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        
        .options { display: flex; flex-direction: column; gap: 10px; padding: 15px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; font-weight: 700; cursor: pointer; }
        .checkbox-label input { width: 18px; height: 18px; }

        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .btn-secondary { background: white; border: 1px solid #ddd; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }

        .preview-area { position: sticky; top: 20px; }
        .preview-toggle { display: flex; gap: 10px; margin-bottom: 15px; }
        .preview-toggle button { flex: 1; padding: 10px; border: 1px solid #ddd; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; cursor: pointer; }
        .preview-toggle button.active { background: #1b4d3e; color: white; border-color: #1b4d3e; }
        
        .preview-container { background: #f0f2f5; padding: 20px; border-radius: 12px; border: 1px solid #ddd; min-height: 400px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .preview-container.mobile { background: #1a1a1a; border: 10px solid #333; border-radius: 36px; width: 300px; height: 500px; padding: 10px; }
        .popup-preview-box { background: white; border-radius: 8px; overflow: hidden; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .preview-img { width: 100%; aspect-ratio: 1/1.2; background: #eee; overflow: hidden; display: flex; align-items: center; justify-content: center; color: #999; font-size: 14px; font-weight: 700; }
        .preview-img img { width: 100%; height: 100%; object-fit: cover; }
        .preview-footer { display: flex; justify-content: space-between; padding: 12px; border-top: 1px solid #eee; font-size: 13px; font-weight: 800; background: #fcfcfc; }
        .close-btn { color: #e74c3c; }
        
        .preview-help { font-size: 12px; color: #999; text-align: center; margin-top: 10px; }
        .file-info { font-size: 13px; color: #27ae60; margin-top: 6px; font-weight: 700; }

        @media (max-width: 1024px) {
          .edit-layout { grid-template-columns: 1fr; }
          .preview-area { display: none; }
        }
      `}</style>
    </div>
  );
}

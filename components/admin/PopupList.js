'use client';
import { useState } from 'react';
import { createPopup, updatePopup, deleteItem } from '@/lib/actions';
import { Plus, Edit2, Trash2, Smartphone, Monitor, Save, X } from 'lucide-react';
import FileUpload from './FileUpload';

export default function PopupList({ initialPopups }) {
  const [popups, setPopups] = useState(initialPopups);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPopup, setCurrentPopup] = useState(null);
  const [isPreviewMobile, setIsPreviewMobile] = useState(true);

  const handleEdit = (popup) => {
    setCurrentPopup(popup);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentPopup({
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
      if (currentPopup.id) {
        await updatePopup(currentPopup.id, currentPopup);
      } else {
        await createPopup(currentPopup);
      }
      alert('저장되었습니다.');
      window.location.reload(); // Simple way to refresh data
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('정말로 이 팝업을 삭제하시겠습니까?')) {
      await deleteItem('popups', id);
      window.location.reload();
    }
  };

  return (
    <div className="popup-manager">
      <div className="admin-header">
        <h1>팝업 및 행사 포스터 관리</h1>
        <button className="btn-primary" onClick={handleAddNew}><Plus size={20} /> 새 팝업 등록</button>
      </div>

      {!isEditing ? (
        <div className="popup-grid">
          {popups.map(popup => (
            <div key={popup.id} className="admin-card popup-item">
              <div className="popup-thumb">
                <img src={popup.mobile_image || popup.pc_image} alt={popup.title} />
              </div>
              <div className="popup-info">
                <h3>{popup.title}</h3>
                <p className="period">{popup.start_date} ~ {popup.end_date}</p>
                <div className="status-tags">
                  <span className={`tag ${popup.status === '게시' ? 'success' : 'gray'}`}>{popup.status}</span>
                  {popup.show_on_pc && <span className="tag blue">PC 노출</span>}
                  {popup.show_on_mobile && <span className="tag blue">모바일 노출</span>}
                </div>
              </div>
              <div className="popup-actions">
                <button onClick={() => handleEdit(popup)}><Edit2 size={18} /> 수정</button>
                <button className="danger" onClick={() => handleDelete(popup.id)}><Trash2 size={18} /> 삭제</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="edit-view">
          <div className="edit-layout">
            <form onSubmit={handleSave} className="admin-card edit-form">
              <div className="form-header">
                <h2>{currentPopup.id ? '팝업 수정' : '새 팝업 등록'}</h2>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}><X /></button>
              </div>

              <div className="form-section">
                <label>팝업 제목</label>
                <input 
                  value={currentPopup.title} 
                  onChange={e => setCurrentPopup({...currentPopup, title: e.target.value})} 
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-section">
                  <FileUpload 
                    label="PC용 이미지 (권장 1000x1200)" 
                    onUploadComplete={url => setCurrentPopup({...currentPopup, pc_image: url})} 
                  />
                  {currentPopup.pc_image && <p className="file-info">현재 파일: {currentPopup.pc_image}</p>}
                </div>
                <div className="form-section">
                  <FileUpload 
                    label="모바일용 이미지 (권장 600x800)" 
                    onUploadComplete={url => setCurrentPopup({...currentPopup, mobile_image: url})} 
                  />
                  {currentPopup.mobile_image && <p className="file-info">현재 파일: {currentPopup.mobile_image}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <label>노출 시작일</label>
                  <input 
                    type="date" 
                    value={currentPopup.start_date} 
                    onChange={e => setCurrentPopup({...currentPopup, start_date: e.target.value})} 
                    required
                  />
                </div>
                <div className="form-section">
                  <label>노출 종료일</label>
                  <input 
                    type="date" 
                    value={currentPopup.end_date} 
                    onChange={e => setCurrentPopup({...currentPopup, end_date: e.target.value})} 
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <label>클릭 시 이동할 링크</label>
                <input 
                  value={currentPopup.link} 
                  onChange={e => setCurrentPopup({...currentPopup, link: e.target.value})} 
                />
              </div>

              <div className="form-row options">
                <label><input type="checkbox" checked={currentPopup.show_on_pc} onChange={e => setCurrentPopup({...currentPopup, show_on_pc: e.target.checked})} /> PC 노출</label>
                <label><input type="checkbox" checked={currentPopup.show_on_mobile} onChange={e => setCurrentPopup({...currentPopup, show_on_mobile: e.target.checked})} /> 모바일 노출</label>
                <label><input type="checkbox" checked={currentPopup.use_today_hide} onChange={e => setCurrentPopup({...currentPopup, use_today_hide: e.target.checked})} /> '오늘 하루 보지 않기' 사용</label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>취소</button>
                <button type="submit" className="btn-primary"><Save size={20} /> 저장하기</button>
              </div>
            </form>

            <div className="preview-area">
              <div className="preview-toggle">
                <button className={!isPreviewMobile ? 'active' : ''} onClick={() => setIsPreviewMobile(false)}><Monitor /> PC</button>
                <button className={isPreviewMobile ? 'active' : ''} onClick={() => setIsPreviewMobile(true)}><Smartphone /> 모바일</button>
              </div>
              <div className={`preview-container ${isPreviewMobile ? 'mobile' : 'pc'}`}>
                <div className="popup-preview-box">
                  <div className="preview-img">
                    <img src={isPreviewMobile ? (currentPopup.mobile_image || currentPopup.pc_image) : currentPopup.pc_image} alt="미리보기" />
                  </div>
                  <div className="preview-footer">
                    <div className="today-hide">오늘 하루 보지 않기</div>
                    <div className="close-btn">닫기</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .popup-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .popup-item { display: flex; flex-direction: column; height: 100%; }
        .popup-thumb { width: 100%; aspect-ratio: 4/5; background: #eee; border-radius: 8px; overflow: hidden; margin-bottom: 12px; }
        .popup-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .popup-info h3 { font-size: 18px; margin-bottom: 4px; }
        .period { font-size: 14px; color: #7f8c8d; margin-bottom: 10px; }
        .status-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 15px; }
        .tag { font-size: 12px; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
        .tag.success { background: #eafaf1; color: #27ae60; }
        .tag.gray { background: #f4f6f7; color: #7f8c8d; }
        .tag.blue { background: #ebf5fb; color: #3498db; }
        .popup-actions { display: flex; gap: 10px; margin-top: auto; border-top: 1px solid #eee; padding-top: 15px; }
        .popup-actions button { flex: 1; padding: 8px; border-radius: 6px; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: 600; border: 1px solid #ddd; background: white; cursor: pointer; }
        .popup-actions button.danger { color: #e74c3c; border-color: #fadbd8; }
        .popup-actions button:hover { background: #f8f9fa; }

        .edit-view { max-width: 1200px; margin: 0 auto; }
        .edit-layout { display: grid; grid-template-columns: 1fr 400px; gap: 30px; }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .btn-close { background: none; border: none; cursor: pointer; color: #7f8c8d; }
        .form-section { margin-bottom: 15px; }
        .form-section label { display: block; font-weight: 700; margin-bottom: 6px; color: #34495e; }
        .form-section input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .options { display: flex; gap: 20px; margin: 20px 0; }
        .options label { display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; }
        .btn-primary { background: #1b4d3e; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .btn-secondary { background: white; border: 1px solid #ddd; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }

        .preview-area { position: sticky; top: 20px; }
        .preview-toggle { display: flex; gap: 10px; margin-bottom: 15px; }
        .preview-toggle button { flex: 1; padding: 10px; border: 1px solid #ddd; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; cursor: pointer; }
        .preview-toggle button.active { background: #1b4d3e; color: white; border-color: #1b4d3e; }
        .preview-container { background: #f0f2f5; padding: 20px; border-radius: 12px; border: 1px solid #ddd; min-height: 400px; display: flex; align-items: center; justify-content: center; }
        .preview-container.mobile { background: #333; border: 8px solid #444; border-radius: 30px; width: 300px; height: 500px; padding: 10px; }
        .popup-preview-box { background: white; border-radius: 8px; overflow: hidden; width: 100%; max-width: 260px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .preview-img { width: 100%; aspect-ratio: 4/5; background: #eee; overflow: hidden; }
        .preview-img img { width: 100%; height: 100%; object-fit: cover; }
        .preview-footer { display: flex; justify-content: space-between; padding: 12px; border-top: 1px solid #eee; font-size: 13px; font-weight: 700; }
        .close-btn { color: #e74c3c; }

        @media (max-width: 1024px) {
          .edit-layout { grid-template-columns: 1fr; }
          .preview-area { display: none; }
        }
      `}</style>
    </div>
  );
}

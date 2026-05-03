'use client';
import { useState } from 'react';
import { createItem, updateItem, deleteItem } from '@/lib/actions';
import { Plus, Edit2, Trash2, FileText, Save, X, Eye, Download } from 'lucide-react';
import FileUpload from './FileUpload';

export default function BulletinManager({ initialBulletins }) {
  const [bulletins, setBulletins] = useState(initialBulletins);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  const handleEdit = (item) => {
    setCurrent(item);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      pdf_url: '',
      image_url: '',
      summary: {
        order: '',
        notices: '',
        missions: '',
        fellowship: '',
        offering: ''
      },
      show_on_main: true,
      status: '게시'
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (current.id) {
        await updateItem('bulletins', current.id, current);
      } else {
        await createItem('bulletins', current);
      }
      alert('저장되었습니다.');
      window.location.reload();
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bulletin-manager">
      <div className="admin-header">
        <h1>주보 관리</h1>
        <button className="btn-primary" onClick={handleAddNew}><Plus size={20} /> 새 주보 등록</button>
      </div>

      {!isEditing ? (
        <div className="admin-card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>주보 제목</th>
                <th>메인 노출</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {bulletins.sort((a,b) => new Date(b.date) - new Date(a.date)).map(item => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td className="title-td">{item.title}</td>
                  <td>{item.show_on_main ? '✅' : '-'}</td>
                  <td><span className={`status-tag ${item.status === '게시' ? 'active' : ''}`}>{item.status}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
                      <button className="btn-icon danger" onClick={() => deleteItem('bulletins', item.id).then(() => window.location.reload())}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="edit-view">
          <div className="edit-layout">
            <form onSubmit={handleSave} className="admin-card edit-form">
              <div className="form-header">
                <h2>{current.id ? '주보 수정' : '새 주보 등록'}</h2>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}><X /></button>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <label>주보 제목</label>
                  <input value={current.title} onChange={e => setCurrent({...current, title: e.target.value})} required />
                </div>
                <div className="form-section">
                  <label>발행 날짜</label>
                  <input type="date" value={current.date} onChange={e => setCurrent({...current, date: e.target.value})} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <FileUpload label="주보 PDF 파일 업로드" accept="application/pdf" maxSize={20} onUploadComplete={url => setCurrent({...current, pdf_url: url})} />
                  {current.pdf_url && <p className="file-info">현재 파일: {current.pdf_url}</p>}
                </div>
                <div className="form-section">
                  <FileUpload label="주보 대표 이미지 (썸네일)" onUploadComplete={url => setCurrent({...current, image_url: url})} />
                </div>
              </div>

              <h3 className="section-subtitle">모바일 요약 주보 내용</h3>
              <div className="form-section">
                <label>예배 순서</label>
                <textarea rows="3" value={current.summary.order} onChange={e => setCurrent({...current, summary: {...current.summary, order: e.target.value}})} />
              </div>
              <div className="form-section">
                <label>이번 주 소식</label>
                <textarea rows="4" value={current.summary.notices} onChange={e => setCurrent({...current, summary: {...current.summary, notices: e.target.value}})} />
              </div>
              <div className="form-row">
                <div className="form-section">
                  <label>행사/모집</label>
                  <textarea rows="2" value={current.summary.missions} onChange={e => setCurrent({...current, summary: {...current.summary, missions: e.target.value}})} />
                </div>
                <div className="form-section">
                  <label>교우 소식</label>
                  <textarea rows="2" value={current.summary.fellowship} onChange={e => setCurrent({...current, summary: {...current.summary, fellowship: e.target.value}})} />
                </div>
              </div>

              <div className="form-row options">
                <label><input type="checkbox" checked={current.show_on_main} onChange={e => setCurrent({...current, show_on_main: e.target.checked})} /> 메인 노출</label>
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
                <button type="button" className="btn-preview" onClick={() => setIsPreview(!isPreview)}><Eye size={20} /> 미리보기</button>
                <button type="submit" className="btn-primary"><Save size={20} /> 저장하기</button>
              </div>
            </form>

            {isPreview && (
              <div className="preview-area">
                <div className="preview-frame mobile">
                  <div className="preview-header">모바일 주보 미리보기</div>
                  <div className="preview-content mobile-bulletin">
                    <div className="bulletin-header">
                      <h1>{current.title}</h1>
                      <p className="date">{current.date}</p>
                    </div>
                    <div className="bulletin-actions">
                      <button className="btn-pdf"><Download size={20} /> PDF 주보 다운로드</button>
                    </div>
                    <div className="bulletin-section">
                      <h2>📋 예배 순서</h2>
                      <p className="pre-wrap">{current.summary.order}</p>
                    </div>
                    <div className="bulletin-section">
                      <h2>📢 교회 소식</h2>
                      <p className="pre-wrap">{current.summary.notices}</p>
                    </div>
                    <div className="bulletin-section">
                      <h2>⛪ 행사 및 모집</h2>
                      <p className="pre-wrap">{current.summary.missions}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .bulletin-manager { width: 100%; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .btn-primary { background: #1b4d3e; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px; border: none; cursor: pointer; }
        
        .table-card { background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
        .admin-table th { background: #f8f9fa; padding: 15px 20px; font-weight: 700; color: #34495e; border-bottom: 1px solid #eee; }
        .admin-table td { padding: 15px 20px; border-bottom: 1px solid #f0f2f5; font-size: 16px; }
        .title-td { font-weight: 700; color: #2c3e50; }
        .status-tag { padding: 4px 10px; border-radius: 4px; font-size: 14px; background: #eee; }
        .status-tag.active { background: #eafaf1; color: #27ae60; }
        .action-btns { display: flex; gap: 8px; }
        .btn-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer; color: #7f8c8d; }
        .btn-icon.danger:hover { background: #fadbd8; color: #e74c3c; border-color: #e74c3c; }

        .edit-view { max-width: 1200px; margin: 0 auto; }
        .edit-layout { display: grid; grid-template-columns: 1fr 400px; gap: 30px; align-items: start; }
        .edit-form { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .section-subtitle { margin: 30px 0 15px; padding-bottom: 8px; border-bottom: 2px solid #f0f2f5; color: #1b4d3e; }
        .form-section { margin-bottom: 15px; }
        .form-section label { display: block; font-weight: 700; margin-bottom: 6px; color: #34495e; }
        .form-section input, .form-section textarea, .form-section select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; font-family: inherit; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .options { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
        .options label { display: flex; align-items: center; gap: 8px; font-weight: 700; cursor: pointer; }
        .status-select { display: flex; align-items: center; gap: 10px; font-weight: 700; }
        .status-select select { padding: 8px; border-radius: 6px; border: 1px solid #ddd; }

        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; }
        .btn-secondary { background: white; border: 1px solid #ddd; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .btn-preview { background: #34495e; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }

        .preview-area { position: sticky; top: 20px; }
        .preview-frame.mobile { background: #333; border: 8px solid #444; border-radius: 30px; width: 340px; height: 600px; padding: 10px; overflow: hidden; }
        .preview-header { color: #888; font-size: 12px; text-align: center; margin-bottom: 8px; }
        .preview-content { background: white; height: calc(100% - 20px); border-radius: 20px; overflow-y: auto; padding: 20px; }
        
        .mobile-bulletin h1 { font-size: 20px; text-align: center; color: #2c3e50; }
        .mobile-bulletin .date { text-align: center; color: #7f8c8d; font-size: 14px; margin-bottom: 20px; }
        .bulletin-actions { margin-bottom: 24px; }
        .btn-pdf { width: 100%; padding: 15px; background: #f0f2f5; border: 2px solid #ddd; border-radius: 12px; font-weight: 800; font-size: 18px; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .bulletin-section { margin-bottom: 24px; }
        .bulletin-section h2 { font-size: 18px; color: #1b4d3e; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #eafaf1; }
        .pre-wrap { white-space: pre-wrap; font-size: 16px; line-height: 1.6; color: #444; }

        @media (max-width: 1024px) {
          .edit-layout { grid-template-columns: 1fr; }
          .preview-area { display: none; }
        }
      `}</style>
    </div>
  );
}

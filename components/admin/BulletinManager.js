'use client';
import { useState } from 'react';
import { createItem, updateItem, deleteItem } from '@/lib/actions';
import { Plus, Edit2, Trash2, FileText, Save, X, Eye, Download, Search } from 'lucide-react';
import FileUpload from './FileUpload';

export default function BulletinManager({ initialBulletins }) {
  const [bulletins, setBulletins] = useState(initialBulletins || []);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDelete = async (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteItem('bulletins', id);
        alert('삭제되었습니다.');
        window.location.reload();
      } catch (err) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const filteredBulletins = bulletins
    .filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="bulletin-manager">
      <div className="admin-header">
        <h1>주보 관리</h1>
        <button className="btn-primary" onClick={handleAddNew}><Plus size={20} /> 새 주보 등록</button>
      </div>

      {!isEditing ? (
        <>
          <div className="admin-card search-bar">
            <div className="search-input-wrap">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="주보 제목 검색..." 
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
                  <th>주보 제목</th>
                  <th>메인 노출</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredBulletins.map(item => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td className="title-td">
                      <div className="title-with-icon">
                        <FileText size={16} className="title-icon" />
                        {item.title}
                      </div>
                    </td>
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
                {filteredBulletins.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>등록된 주보가 없습니다.</td>
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
                <h2>{current.id ? '주보 수정' : '새 주보 등록'}</h2>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}><X /></button>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <label>주보 제목</label>
                  <input value={current.title} onChange={e => setCurrent({...current, title: e.target.value})} placeholder="예: 2024년 5월 5일 주보" required />
                </div>
                <div className="form-section">
                  <label>발행 날짜</label>
                  <input type="date" value={current.date} onChange={e => setCurrent({...current, date: e.target.value})} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <FileUpload label="주보 PDF 파일 업로드" accept="application/pdf" maxSize={20} onUploadComplete={url => setCurrent({...current, pdf_url: url})} />
                  {current.pdf_url && <p className="file-info">현재 파일: {current.pdf_url.split('/').pop()}</p>}
                </div>
                <div className="form-section">
                  <FileUpload label="주보 대표 이미지 (썸네일)" onUploadComplete={url => setCurrent({...current, image_url: url})} />
                  {current.image_url && <p className="file-info">이미지 업로드됨</p>}
                </div>
              </div>

              <div className="section-divider">
                <h3 className="section-subtitle">모바일 요약 주보 내용</h3>
                <p className="section-desc">홈페이지에서 텍스트로 바로 볼 수 있는 내용입니다.</p>
              </div>

              <div className="form-section">
                <label>예배 순서</label>
                <textarea rows="3" value={current.summary.order} onChange={e => setCurrent({...current, summary: {...current.summary, order: e.target.value}})} placeholder="예배 순서를 입력하세요." />
              </div>
              <div className="form-section">
                <label>이번 주 소식</label>
                <textarea rows="4" value={current.summary.notices} onChange={e => setCurrent({...current, summary: {...current.summary, notices: e.target.value}})} placeholder="공지사항 및 교회 소식을 입력하세요." />
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
                <button type="button" className="btn-preview" onClick={() => setIsPreview(!isPreview)}><Eye size={20} /> {isPreview ? '미리보기 닫기' : '모바일 미리보기'}</button>
                <button type="submit" className="btn-primary"><Save size={20} /> 저장하기</button>
              </div>
            </form>

            {isPreview && (
              <div className="preview-area">
                <div className="preview-frame mobile">
                  <div className="preview-header">모바일 주보 미리보기</div>
                  <div className="preview-content mobile-bulletin">
                    <div className="bulletin-header">
                      <h1>{current.title || '주보 제목'}</h1>
                      <p className="date">{current.date}</p>
                    </div>
                    <div className="bulletin-actions">
                      <button className="btn-pdf-preview" onClick={e => e.preventDefault()}><Download size={20} /> PDF 주보 다운로드</button>
                    </div>
                    <div className="bulletin-section">
                      <h2>📋 예배 순서</h2>
                      <div className="pre-wrap">{current.summary.order || '예배 순서가 없습니다.'}</div>
                    </div>
                    <div className="bulletin-section">
                      <h2>📢 교회 소식</h2>
                      <div className="pre-wrap">{current.summary.notices || '소식이 없습니다.'}</div>
                    </div>
                    <div className="bulletin-section">
                      <h2>⛪ 행사 및 모집</h2>
                      <div className="pre-wrap">{current.summary.missions || '행사가 없습니다.'}</div>
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
        
        .search-bar { padding: 20px; margin-bottom: 20px; }
        .search-input-wrap { display: flex; align-items: center; gap: 10px; background: #f0f2f5; padding: 10px 15px; border-radius: 8px; color: #7f8c8d; max-width: 400px; }
        .search-input-wrap input { border: none; background: none; width: 100%; font-size: 16px; outline: none; }

        .table-card { background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
        .admin-table th { background: #f8f9fa; padding: 15px 20px; font-weight: 700; color: #34495e; border-bottom: 1px solid #eee; }
        .admin-table td { padding: 15px 20px; border-bottom: 1px solid #f0f2f5; font-size: 16px; }
        
        .title-with-icon { display: flex; align-items: center; gap: 8px; }
        .title-icon { color: #1b4d3e; }
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
        
        .section-divider { margin: 30px 0 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .section-subtitle { margin: 0; color: #1b4d3e; font-size: 1.1rem; font-weight: 800; }
        .section-desc { font-size: 0.9rem; color: #7f8c8d; margin: 4px 0 0; }
        
        .form-section { margin-bottom: 15px; }
        .form-section label { display: block; font-weight: 700; margin-bottom: 6px; color: #34495e; }
        .form-section input, .form-section textarea, .form-section select { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; font-family: inherit; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        
        .options { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; font-weight: 700; cursor: pointer; }
        .checkbox-label input { width: 20px; height: 20px; }
        .status-select { display: flex; align-items: center; gap: 10px; font-weight: 700; }
        .status-select select { padding: 8px; border-radius: 6px; border: 1px solid #ddd; }

        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .btn-secondary { background: white; border: 1px solid #ddd; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .btn-preview { background: #34495e; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }

        .preview-area { position: sticky; top: 20px; }
        .preview-frame.mobile { background: #1a1a1a; border: 12px solid #333; border-radius: 36px; width: 340px; height: 600px; padding: 0; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
        .preview-header { color: #888; font-size: 11px; text-align: center; padding: 10px 0; background: #333; letter-spacing: 1px; font-weight: 700; }
        .preview-content { background: white; height: calc(100% - 31px); overflow-y: auto; padding: 0; }
        
        .mobile-bulletin { padding: 20px; }
        .bulletin-header { text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px dashed #ddd; }
        .mobile-bulletin h1 { font-size: 20px; color: #2c3e50; margin: 0 0 5px; }
        .mobile-bulletin .date { color: #7f8c8d; font-size: 14px; margin: 0; }
        
        .bulletin-actions { margin-bottom: 24px; }
        .btn-pdf-preview { width: 100%; padding: 12px; background: #1b4d3e; color: white; border: none; border-radius: 8px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: default; }
        
        .bulletin-section { margin-bottom: 24px; }
        .bulletin-section h2 { font-size: 16px; color: #1b4d3e; margin-bottom: 10px; padding: 8px 12px; background: #eafaf1; border-radius: 6px; }
        .pre-wrap { white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #444; padding: 0 10px; }

        .file-info { font-size: 14px; color: #7f8c8d; margin-top: 6px; }

        @media (max-width: 1024px) {
          .edit-layout { grid-template-columns: 1fr; }
          .preview-area { display: none; }
        }
      `}</style>
    </div>
  );
}

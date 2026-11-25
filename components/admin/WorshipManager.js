'use client';
import { useState } from 'react';
import { createItem, updateItem, deleteItem } from '@/lib/actions';
import { Plus, Edit2, Trash2, Clock, Save, X, ArrowUp, ArrowDown, MapPin } from 'lucide-react';

export default function WorshipManager({ initialTimes }) {
  const [times, setTimes] = useState(initialTimes || []);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const sortedTimes = [...times].sort((a, b) => a.order - b.order);

  const handleEdit = (item) => {
    setCurrent(item);
    setSaveError('');
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrent({
      name: '',
      time: '',
      place: '',
      order: (sortedTimes.at(-1)?.order ?? 0) + 1,
      is_visible: true
    });
    setSaveError('');
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    const details = {
      name: current.name.trim(),
      time: current.time.trim(),
      place: (current.place ?? '').trim(),
      is_visible: current.is_visible,
    };
    if (!details.name || !details.time) {
      setSaveError('예배명과 시간을 입력해 주세요.');
      return;
    }

    setSaveError('');
    setIsSaving(true);
    try {
      const saved = current.id
        ? await updateItem('worship_times', current.id, details)
        : await createItem('worship_times', { ...details, order: current.order });
      setTimes((previous) => current.id
        ? previous.map((item) => item.id === saved.id ? saved : item)
        : [...previous, saved]);
      setIsEditing(false);
    } catch {
      setSaveError('예배 시간을 저장하지 못했습니다. 잠시 후 다시 시도하거나 관리자에 다시 로그인해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('정말로 이 예배 정보를 삭제하시겠습니까?')) {
      try {
        await deleteItem('worship_times', id);
        alert('삭제되었습니다.');
        window.location.reload();
      } catch (err) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const moveOrder = async (id, direction) => {
    const index = sortedTimes.findIndex(t => t.id === id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const item = sortedTimes[index];
    const target = sortedTimes[targetIndex];
    if (!item || !target) return;

    await updateItem('worship_times', item.id, { order: target.order });
    await updateItem('worship_times', target.id, { order: item.order });
    window.location.reload();
  };

  return (
    <div className="worship-manager">
      <div className="admin-header">
        <h1>예배 시간 관리</h1>
        <button className="btn-primary" onClick={handleAddNew}><Plus size={20} /> 새 예배 추가</button>
      </div>

      {!isEditing ? (
        <div className="admin-card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th width="80">순서</th>
                <th>예배명</th>
                <th>시간</th>
                <th>장소</th>
                <th width="80">노출</th>
                <th width="120">관리</th>
              </tr>
            </thead>
            <tbody>
              {sortedTimes.map((item, idx) => (
                <tr key={item.id}>
                  <td>
                    <div className="order-btns">
                      <button className="btn-order" onClick={() => moveOrder(item.id, 'up')} disabled={idx === 0} title="위로"><ArrowUp size={14} /></button>
                      <button className="btn-order" onClick={() => moveOrder(item.id, 'down')} disabled={idx === times.length - 1} title="아래로"><ArrowDown size={14} /></button>
                    </div>
                  </td>
                  <td className="title-td">{item.name}</td>
                  <td>
                    <div className="time-info">
                      <Clock size={14} />
                      {item.time}
                    </div>
                  </td>
                  <td>{item.place}</td>
                  <td>{item.is_visible ? <span className="visible-check">✅</span> : <span className="hidden-check">-</span>}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" aria-label={`${item.name} 수정`} onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
                      <button className="btn-icon danger" aria-label={`${item.name} 삭제`} onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedTimes.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>등록된 예배 시간이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="edit-view">
          <form onSubmit={handleSave} className="admin-card edit-form">
            <div className="form-header">
              <h2>{current.id ? '예배 정보 수정' : '새 예배 등록'}</h2>
              <button type="button" className="btn-close" aria-label="편집 닫기" disabled={isSaving} onClick={() => setIsEditing(false)}><X /></button>
            </div>

            <div className="form-row">
              <div className="form-section">
                <label htmlFor="worship-name">예배명</label>
                <input id="worship-name" value={current.name} onChange={e => setCurrent({...current, name: e.target.value})} placeholder="예: 주일 1부 예배" required />
              </div>
              <div className="form-section">
                <label htmlFor="worship-time">시간</label>
                <input id="worship-time" value={current.time} onChange={e => setCurrent({...current, time: e.target.value})} placeholder="예: 오후 1시 40분" required />
              </div>
            </div>

            <div className="form-section">
              <label htmlFor="worship-place"><MapPin size={16} style={{display:'inline', marginRight:4}} aria-hidden="true" /> 장소</label>
              <input id="worship-place" value={current.place ?? ''} onChange={e => setCurrent({...current, place: e.target.value})} placeholder="예: 본당" />
            </div>

            <div className="form-row options">
              <label className="checkbox-label"><input type="checkbox" checked={Boolean(current.is_visible)} onChange={e => setCurrent({...current, is_visible: e.target.checked})} /> 홈페이지 노출 여부</label>
              <div className="order-info">정렬 순서: <strong>{current.order}</strong></div>
            </div>

            {saveError && <p className="save-error" role="alert">{saveError}</p>}
            <div className="form-actions">
              <button type="button" className="btn-secondary" disabled={isSaving} onClick={() => setIsEditing(false)}>취소</button>
              <button type="submit" className="btn-primary" disabled={isSaving}><Save size={20} /> {isSaving ? '저장 중' : '저장하기'}</button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .worship-manager { width: 100%; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .btn-primary { background: #1b4d3e; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px; border: none; cursor: pointer; }
        
        .table-card { background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow-x: auto; }
        .admin-table { width: 100%; min-width: 640px; border-collapse: collapse; text-align: left; }
        .admin-table th { background: #f8f9fa; padding: 15px 20px; font-weight: 700; color: #34495e; border-bottom: 1px solid #eee; }
        .admin-table td { padding: 15px 20px; border-bottom: 1px solid #f0f2f5; font-size: 16px; }
        
        .order-btns { display: flex; align-items: center; gap: 4px; }
        .btn-order { background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; padding: 4px; display: flex; color: #7f8c8d; }
        .btn-order:hover:not(:disabled) { border-color: #1b4d3e; color: #1b4d3e; background: #f8f9fa; }
        .btn-order:disabled { opacity: 0.3; cursor: not-allowed; }
        
        .title-td { font-weight: 700; color: #2c3e50; }
        .time-info { display: flex; align-items: center; gap: 6px; color: #34495e; }
        
        .visible-check { color: #27ae60; font-weight: bold; }
        .hidden-check { color: #ccc; }

        .action-btns { display: flex; gap: 8px; }
        .btn-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer; color: #7f8c8d; }
        .btn-icon:hover { border-color: #1b4d3e; color: #1b4d3e; background: #f0f2f5; }
        .btn-icon.danger:hover { background: #fadbd8; color: #e74c3c; border-color: #e74c3c; }

        .edit-view { max-width: 800px; margin: 0 auto; }
        .edit-form { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .btn-close { background: none; border: none; cursor: pointer; color: #95a5a6; }
        
        .form-section { margin-bottom: 20px; }
        .form-section label { display: block; font-weight: 700; margin-bottom: 8px; color: #34495e; }
        .form-section input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; font-family: inherit; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        
        .options { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
        .checkbox-label { display: flex; align-items: center; gap: 10px; font-weight: 700; cursor: pointer; color: #1b4d3e; }
        .checkbox-label input { width: 18px; height: 18px; }
        .order-info { color: #7f8c8d; font-size: 14px; }

        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .btn-secondary { background: white; border: 1px solid #ddd; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .save-error { color: #a02720; }
        .form-actions button:disabled { opacity: 0.65; cursor: wait; }

        @media (max-width: 640px) {
          .edit-form { padding: 20px; }
          .form-row { grid-template-columns: 1fr; gap: 0; }
          .options { flex-wrap: wrap; gap: 12px; }
        }
      `}</style>
    </div>
  );
}

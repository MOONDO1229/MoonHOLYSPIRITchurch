'use client';
import { useState } from 'react';
import { createItem, updateItem, deleteItem } from '@/lib/actions';
import { Plus, Edit2, Trash2, Clock, Save, X, ArrowUp, ArrowDown, MapPin, Users, Globe } from 'lucide-react';

export default function WorshipManager({ initialTimes }) {
  const [times, setTimes] = useState(initialTimes || []);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(null);

  const handleEdit = (item) => {
    setCurrent(item);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrent({
      name: '',
      type: '주일예배',
      day: '일요일',
      time: '오전 11:00',
      location: '대예배실 (3층)',
      target: '전 성도',
      online_link: '',
      note: '',
      order: times.length + 1,
      is_visible: true
    });
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (current.id) {
        await updateItem('worship_times', current.id, current);
      } else {
        await createItem('worship_times', current);
      }
      alert('저장되었습니다.');
      window.location.reload();
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
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
    const index = times.findIndex(t => t.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === times.length - 1) return;

    const newTimes = [...times];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const tempOrder = newTimes[index].order;
    newTimes[index].order = newTimes[targetIndex].order;
    newTimes[targetIndex].order = tempOrder;

    await updateItem('worship_times', newTimes[index].id, { order: newTimes[index].order });
    await updateItem('worship_times', newTimes[targetIndex].id, { order: newTimes[targetIndex].order });
    window.location.reload();
  };

  const sortedTimes = (times || []).sort((a, b) => a.order - b.order);

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
                <th width="120">구분</th>
                <th>예배명</th>
                <th>요일/시간</th>
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
                  <td><span className={`cat-tag ${item.type === '주일예배' ? 'primary' : 'secondary'}`}>{item.type}</span></td>
                  <td className="title-td">{item.name}</td>
                  <td>
                    <div className="time-info">
                      <Clock size={14} />
                      {item.day} {item.time}
                    </div>
                  </td>
                  <td>{item.location}</td>
                  <td>{item.is_visible ? <span className="visible-check">✅</span> : <span className="hidden-check">-</span>}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedTimes.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>등록된 예배 시간이 없습니다.</td>
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
              <button type="button" className="btn-close" onClick={() => setIsEditing(false)}><X /></button>
            </div>

            <div className="form-row">
              <div className="form-section">
                <label>예배명</label>
                <input value={current.name} onChange={e => setCurrent({...current, name: e.target.value})} placeholder="예: 주일 1부 예배" required />
              </div>
              <div className="form-section">
                <label>예배 구분</label>
                <select value={current.type} onChange={e => setCurrent({...current, type: e.target.value})}>
                  <option>주일예배</option>
                  <option>평일예배</option>
                  <option>교회학교</option>
                  <option>기타</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-section">
                <label>요일</label>
                <input value={current.day} onChange={e => setCurrent({...current, day: e.target.value})} placeholder="예: 일요일, 매일, 수요일" required />
              </div>
              <div className="form-section">
                <label>시간</label>
                <input value={current.time} onChange={e => setCurrent({...current, time: e.target.value})} placeholder="예: 오전 09:00, 오후 19:30" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-section">
                <label><MapPin size={16} style={{display:'inline', marginRight:4}}/> 장소</label>
                <input value={current.location} onChange={e => setCurrent({...current, location: e.target.value})} placeholder="예: 대예배실 (3층)" />
              </div>
              <div className="form-section">
                <label><Users size={16} style={{display:'inline', marginRight:4}}/> 대상</label>
                <input value={current.target} onChange={e => setCurrent({...current, target: e.target.value})} placeholder="예: 전 성도, 유치부 어린이" />
              </div>
            </div>

            <div className="form-section">
              <label><Globe size={16} style={{display:'inline', marginRight:4}}/> 온라인 예배 링크 (유튜브 라이브 등)</label>
              <input value={current.online_link} onChange={e => setCurrent({...current, online_link: e.target.value})} placeholder="https://youtube.com/live/..." />
            </div>

            <div className="form-section">
              <label>비고 (추가 설명)</label>
              <textarea rows="2" value={current.note} onChange={e => setCurrent({...current, note: e.target.value})} placeholder="예: 성찬식 진행, 연합예배 등" style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #ddd'}}/>
            </div>

            <div className="form-row options">
              <label className="checkbox-label"><input type="checkbox" checked={current.is_visible} onChange={e => setCurrent({...current, is_visible: e.target.checked})} /> 홈페이지 노출 여부</label>
              <div className="order-info">정렬 순서: <strong>{current.order}</strong></div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>취소</button>
              <button type="submit" className="btn-primary"><Save size={20} /> 저장하기</button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .worship-manager { width: 100%; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .btn-primary { background: #1b4d3e; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px; border: none; cursor: pointer; }
        
        .table-card { background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
        .admin-table th { background: #f8f9fa; padding: 15px 20px; font-weight: 700; color: #34495e; border-bottom: 1px solid #eee; }
        .admin-table td { padding: 15px 20px; border-bottom: 1px solid #f0f2f5; font-size: 16px; }
        
        .order-btns { display: flex; align-items: center; gap: 4px; }
        .btn-order { background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; padding: 4px; display: flex; color: #7f8c8d; }
        .btn-order:hover:not(:disabled) { border-color: #1b4d3e; color: #1b4d3e; background: #f8f9fa; }
        .btn-order:disabled { opacity: 0.3; cursor: not-allowed; }
        
        .cat-tag { padding: 4px 10px; border-radius: 4px; font-size: 14px; font-weight: 700; }
        .cat-tag.primary { background: #eafaf1; color: #27ae60; }
        .cat-tag.secondary { background: #ebf5fb; color: #3498db; }
        
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
        .form-section input, .form-section select { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; font-family: inherit; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        
        .options { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
        .checkbox-label { display: flex; align-items: center; gap: 10px; font-weight: 700; cursor: pointer; color: #1b4d3e; }
        .checkbox-label input { width: 18px; height: 18px; }
        .order-info { color: #7f8c8d; font-size: 14px; }

        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .btn-secondary { background: white; border: 1px solid #ddd; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }
      `}</style>
    </div>
  );
}

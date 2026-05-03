'use client';
import { useState } from 'react';
import { createItem, updateItem, deleteItem } from '@/lib/actions';
import { Plus, Edit2, Trash2, Clock, Save, X, ArrowUp, ArrowDown } from 'lucide-react';

export default function WorshipManager({ initialTimes }) {
  const [times, setTimes] = useState(initialTimes);
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
      time: '00:00',
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

  const moveOrder = async (id, direction) => {
    const index = times.findIndex(t => t.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === times.length - 1) return;

    const newTimes = [...times];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap orders
    const tempOrder = newTimes[index].order;
    newTimes[index].order = newTimes[targetIndex].order;
    newTimes[targetIndex].order = tempOrder;

    // Save both
    await updateItem('worship_times', newTimes[index].id, { order: newTimes[index].order });
    await updateItem('worship_times', newTimes[targetIndex].id, { order: newTimes[targetIndex].order });
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
                <th>순서</th>
                <th>구분</th>
                <th>예배명</th>
                <th>요일/시간</th>
                <th>장소</th>
                <th>노출</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {times.sort((a,b) => a.order - b.order).map((item, idx) => (
                <tr key={item.id}>
                  <td>
                    <div className="order-btns">
                      <button onClick={() => moveOrder(item.id, 'up')} disabled={idx === 0}><ArrowUp size={14} /></button>
                      <button onClick={() => moveOrder(item.id, 'down')} disabled={idx === times.length - 1}><ArrowDown size={14} /></button>
                    </div>
                  </td>
                  <td><span className="cat-tag">{item.type}</span></td>
                  <td className="title-td">{item.name}</td>
                  <td>{item.day} {item.time}</td>
                  <td>{item.location}</td>
                  <td>{item.is_visible ? '✅' : '-'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" onClick={() => handleEdit(item)}><Edit2 size={16} /></button>
                      <button className="btn-icon danger" onClick={() => deleteItem('worship_times', item.id).then(() => window.location.reload())}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="edit-view">
          <form onSubmit={handleSave} className="admin-card edit-form full-width">
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
                <input value={current.time} onChange={e => setCurrent({...current, time: e.target.value})} placeholder="예: 09:00, 오전 11:30" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-section">
                <label>장소</label>
                <input value={current.location} onChange={e => setCurrent({...current, location: e.target.value})} placeholder="예: 대예배실 (3층)" />
              </div>
              <div className="form-section">
                <label>대상</label>
                <input value={current.target} onChange={e => setCurrent({...current, target: e.target.value})} placeholder="예: 전 성도, 유치부 어린이" />
              </div>
            </div>

            <div className="form-section">
              <label>온라인 예배 링크 (유튜브 라이브 등)</label>
              <input value={current.online_link} onChange={e => setCurrent({...current, online_link: e.target.value})} placeholder="https://..." />
            </div>

            <div className="form-section">
              <label>비고</label>
              <input value={current.note} onChange={e => setCurrent({...current, note: e.target.value})} placeholder="예: 성찬식, 연합예배 등" />
            </div>

            <div className="form-row options">
              <label><input type="checkbox" checked={current.is_visible} onChange={e => setCurrent({...current, is_visible: e.target.checked})} /> 홈페이지 노출</label>
              <div className="order-info">정렬 순서: {current.order}</div>
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
        .admin-table td { padding: 12px 20px; border-bottom: 1px solid #f0f2f5; font-size: 16px; }
        
        .order-btns { display: flex; flex-direction: column; gap: 2px; }
        .order-btns button { background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; padding: 2px; }
        .order-btns button:disabled { opacity: 0.3; cursor: not-allowed; }
        
        .cat-tag { background: #eafaf1; color: #27ae60; padding: 4px 10px; border-radius: 4px; font-size: 14px; font-weight: 700; }
        .title-td { font-weight: 700; color: #2c3e50; }
        .action-btns { display: flex; gap: 8px; }
        .btn-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer; color: #7f8c8d; }

        .edit-view { max-width: 800px; margin: 0 auto; }
        .full-width { width: 100%; }
        .edit-form { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .form-section { margin-bottom: 15px; }
        .form-section label { display: block; font-weight: 700; margin-bottom: 6px; color: #34495e; }
        .form-section input, .form-section select { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .options { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
        .options label { display: flex; align-items: center; gap: 8px; font-weight: 700; cursor: pointer; }
        .order-info { color: #7f8c8d; font-size: 14px; }

        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 30px; }
        .btn-secondary { background: white; border: 1px solid #ddd; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }
      `}</style>
    </div>
  );
}

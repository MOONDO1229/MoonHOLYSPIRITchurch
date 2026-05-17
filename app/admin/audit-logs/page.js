import { getData } from '@/lib/db';
import { History, User, Tag, Activity, Clock, Search, Filter } from 'lucide-react';

export default async function AuditLogsPage() {
  const logs = (await getData('audit_logs')) || [];
  
  // Sort by date descending
  const sortedLogs = [...logs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="audit-logs-premium">
      <div className="admin-header">
        <div className="header-info">
          <h1>사이트 수정 이력</h1>
          <p className="subtitle">관리자 활동 및 데이터 변경 내역을 투명하게 확인합니다.</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="label">전체 로그</span>
            <span className="value">{sortedLogs.length}건</span>
          </div>
        </div>
      </div>

      <div className="admin-card table-card">
        <div className="table-header">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="작업 내용 검색..." />
          </div>
          <div className="filter-group">
            <button className="btn-filter active">전체</button>
            <button className="btn-filter">수정</button>
            <button className="btn-filter">삭제</button>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th width="180">일시</th>
              <th width="150">대상</th>
              <th width="100">작업</th>
              <th>상세 정보</th>
            </tr>
          </thead>
          <tbody>
            {sortedLogs.length > 0 ? sortedLogs.map((log, idx) => (
              <tr key={log.id || idx}>
                <td className="timestamp">
                  <div className="time-wrap">
                    <Clock size={14} />
                    {new Date(log.created_at).toLocaleString('ko-KR', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                </td>
                <td>
                  <span className="cat-badge" style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {log.target}
                  </span>
                </td>
                <td>
                  <span className={`action-badge ${log.action}`}>
                    {log.action === 'create' ? '신규등록' : log.action === 'update' ? '정보수정' : log.action === 'delete' ? '영구삭제' : log.action}
                  </span>
                </td>
                <td className="detail-td">
                  <div className="detail-content" style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                    {log.details?.after?.title || log.details?.after?.name || (log.action === 'delete' ? '데이터 삭제됨' : '상세 정보 없음')}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="no-data">
                  <div className="empty-state">
                    <Activity size={48} />
                    <p>기록된 수정 이력이 없습니다.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { getData } from '@/lib/db';
import { History, User, Tag, Activity, Clock, Search, Filter } from 'lucide-react';

export default function AuditLogsPage() {
  const logs = getData('audit_logs') || [];
  
  // Sort by date descending
  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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
              <th width="200">일시</th>
              <th width="150">작업자</th>
              <th width="120">카테고리</th>
              <th width="100">작업</th>
              <th>상세 내용</th>
            </tr>
          </thead>
          <tbody>
            {sortedLogs.length > 0 ? sortedLogs.map((log, idx) => (
              <tr key={idx}>
                <td className="timestamp">
                  <div className="time-wrap">
                    <Clock size={14} />
                    {new Date(log.timestamp).toLocaleString('ko-KR', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </td>
                <td>
                  <div className="user-info">
                    <div className="avatar-mini"><User size={12} /></div>
                    {log.user || '관리자'}
                  </div>
                </td>
                <td><span className="cat-badge">{log.type}</span></td>
                <td>
                  <span className={`action-badge ${log.action}`}>
                    {log.action === 'create' ? '신규등록' : log.action === 'update' ? '정보수정' : log.action === 'delete' ? '영구삭제' : log.action}
                  </span>
                </td>
                <td className="detail-td">
                  <div className="detail-content">
                    {log.details?.title || log.id || '-'}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="no-data">
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

      <style jsx>{`
        .audit-logs-premium { width: 100%; max-width: 1400px; margin: 0 auto; }
        .admin-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; }
        .header-info h1 { margin: 0; font-size: 2.2rem; font-weight: 900; color: #1b4d3e; letter-spacing: -0.02em; }
        .subtitle { color: #64748b; margin-top: 8px; font-size: 1.1rem; }
        
        .header-stats { background: white; padding: 15px 30px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
        .stat-item { display: flex; flex-direction: column; align-items: center; }
        .stat-item .label { font-size: 0.85rem; color: #94a3b8; font-weight: 700; margin-bottom: 4px; }
        .stat-item .value { font-size: 1.4rem; font-weight: 900; color: #1b4d3e; }

        .table-card { background: white; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; overflow: hidden; }
        .table-header { padding: 20px 30px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #fafbfc; }
        
        .search-box { display: flex; align-items: center; gap: 10px; background: white; padding: 8px 18px; border-radius: 12px; border: 1px solid #e2e8f0; width: 300px; }
        .search-box input { border: none; outline: none; font-size: 0.95rem; width: 100%; }
        .filter-group { display: flex; gap: 8px; }
        .btn-filter { padding: 8px 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; font-weight: 700; color: #64748b; cursor: pointer; font-size: 0.9rem; }
        .btn-filter.active { background: #1b4d3e; color: white; border-color: #1b4d3e; }

        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { padding: 20px 30px; text-align: left; background: #f8fafc; font-weight: 800; color: #475569; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .admin-table td { padding: 18px 30px; border-bottom: 1px solid #f1f5f9; font-size: 1rem; color: #1e293b; }
        
        .time-wrap { display: flex; align-items: center; gap: 8px; color: #64748b; font-weight: 500; }
        .user-info { display: flex; align-items: center; gap: 10px; font-weight: 700; }
        .avatar-mini { width: 24px; height: 24px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1b4d3e; }
        
        .cat-badge { padding: 4px 12px; background: #f1f5f9; color: #475569; border-radius: 6px; font-size: 0.85rem; font-weight: 700; }
        
        .action-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 800; }
        .action-badge.create { background: #eafaf1; color: #27ae60; }
        .action-badge.update { background: #ebf5fb; color: #3498db; }
        .action-badge.delete { background: #fadbd8; color: #e74c3c; }
        
        .detail-td { font-weight: 600; color: #334155; }
        
        .no-data { text-align: center; padding: 100px 0; }
        .empty-state { display: flex; flex-direction: column; align-items: center; color: #cbd5e1; }
        .empty-state p { margin-top: 15px; font-size: 1.1rem; font-weight: 600; }

        tr:hover td { background: #fcfcfc; }
      `}</style>
    </div>
  );
}

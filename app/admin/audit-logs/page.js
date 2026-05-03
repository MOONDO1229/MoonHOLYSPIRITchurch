import { getData } from '@/lib/db';
import { History, User, Tag, Activity } from 'lucide-react';

export default function AuditLogsPage() {
  const logs = getData('audit_logs') || [];
  
  // Sort by date descending
  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="audit-logs-page">
      <div className="admin-header">
        <h1>수정 이력 (Audit Logs)</h1>
        <p className="subtitle">누가, 언제, 무엇을 변경했는지 기록합니다.</p>
      </div>

      <div className="admin-card table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>일시</th>
              <th>작업자</th>
              <th>대상</th>
              <th>유형</th>
              <th>내용</th>
            </tr>
          </thead>
          <tbody>
            {sortedLogs.length > 0 ? sortedLogs.map((log, idx) => (
              <tr key={idx}>
                <td className="timestamp">{new Date(log.timestamp).toLocaleString('ko-KR')}</td>
                <td><span className="user-badge"><User size={14} /> {log.user || '관리자'}</span></td>
                <td><span className="type-badge">{log.type}</span></td>
                <td>
                  <span className={`action-badge ${log.action}`}>
                    {log.action === 'create' ? '생성' : log.action === 'update' ? '수정' : log.action === 'delete' ? '삭제' : log.action}
                  </span>
                </td>
                <td className="title-td">{log.details?.title || log.id || '-'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="no-data">기록된 이력이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

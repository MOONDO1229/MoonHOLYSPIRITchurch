import { CheckCircle, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="dashboard">
      <h1>교회 홈페이지 관리 대시보드</h1>
      
      {/* Summary Cards */}
      <div className="status-grid">
        <div className="status-card success">
          <div className="card-top">
            <CheckCircle size={32} />
            <span>이번 주 주보</span>
          </div>
          <div className="card-body">등록 완료</div>
        </div>
        <div className="status-card warning">
          <div className="card-top">
            <AlertCircle size={32} />
            <span>이번 주 설교</span>
          </div>
          <div className="card-body">미등록</div>
        </div>
        <div className="status-card info">
          <div className="card-top">
            <CheckCircle size={32} />
            <span>예배 시간표</span>
          </div>
          <div className="card-body">6건 노출 중</div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ marginTop: '40px' }}>빠른 등록</h2>
      <div className="quick-actions">
        <Link href="/admin/notices/new" className="action-btn-link">
          <button className="action-btn"><Plus /> 공지사항 등록</button>
        </Link>
        <Link href="/admin/bulletins" className="action-btn-link">
          <button className="action-btn"><Plus /> 주보 등록</button>
        </Link>
        <Link href="/admin/sermons" className="action-btn-link">
          <button className="action-btn"><Plus /> 설교 등록</button>
        </Link>
        <Link href="/admin/settings" className="action-btn-link">
          <button className="action-btn"><Plus /> 사이트 정보 수정</button>
        </Link>
      </div>

      {/* Recent History */}
      <h2 style={{ marginTop: '40px' }}>최근 수정 내역</h2>
      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>수정자</th>
              <th>내용</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2024-05-21 14:30</td>
              <td>김사무 (사무실)</td>
              <td>5월 19일 주보 등록</td>
              <td>수정</td>
            </tr>
            <tr>
              <td>2024-05-20 10:15</td>
              <td>이전도 (미디어)</td>
              <td>주일 설교 영상 링크 업데이트</td>
              <td>수정</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

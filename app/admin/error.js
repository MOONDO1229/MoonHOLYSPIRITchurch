'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminErrorPage({ error, reset }) {
  useEffect(() => {
    console.error('Admin Render Error:', error);
  }, [error]);

  const isUnauthorized = error?.message?.includes('로그인') || error?.message?.includes('권한') || error?.message?.includes('Unauthorized');

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
      <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1b4d3e', marginBottom: '12px' }}>
        {isUnauthorized ? '관리자 인증이 필요합니다.' : '관리자 기능 처리 중 오류가 발생했습니다.'}
      </h1>
      <p style={{ color: '#64748b', maxWidth: '500px', lineHeight: '1.6', marginBottom: '24px' }}>
        {isUnauthorized 
          ? '관리자 세션이 만료되었습니다. 아래 버튼을 눌러 다시 로그인해 주세요.' 
          : (error?.message || '잠시 후 다시 시도해 보시거나 관리자 대시보드로 돌아가세요.')}
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link
          href="/login"
          style={{
            backgroundColor: '#1b4d3e',
            color: 'white',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '700'
          }}
        >
          로그인 페이지로
        </Link>
        <button
          onClick={() => reset()}
          style={{
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          새로고침
        </button>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalErrorPage({ error, reset }) {
  useEffect(() => {
    console.error('Page Render Error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '16px'
      }}>⚠️</div>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '800',
        color: '#1b4d3e',
        marginBottom: '12px'
      }}>페이지를 불러오는 중 오류가 발생했습니다.</h1>
      <p style={{
        color: '#64748b',
        maxWidth: '500px',
        lineHeight: '1.6',
        marginBottom: '24px'
      }}>
        일시적인 오류이거나 접속 권한/네트워크 문제가 발생했을 수 있습니다.<br />
        다시 시도해 보시거나 메인 페이지로 이동해 주세요.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => reset()}
          style={{
            backgroundColor: '#1b4d3e',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          다시 시도
        </button>
        <Link
          href="/"
          style={{
            backgroundColor: '#f1f5f9',
            color: '#475569',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '700'
          }}
        >
          홈으로 이동
        </Link>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: 'white',
        padding: '64px',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '80px',
          fontWeight: '900',
          color: '#1b4d3e',
          marginBottom: '32px',
          lineHeight: '1'
        }}>
          404
        </div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '800',
          color: '#1e293b',
          marginBottom: '16px'
        }}>
          길을 잃으셨나요?
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#64748b',
          marginBottom: '48px',
          lineHeight: '1.6',
          wordBreak: 'keep-all'
        }}>
          죄송합니다. 요청하신 페이지를 찾을 수 없습니다.<br/>
          입력하신 주소가 정확한지 다시 한번 확인해주세요.
        </p>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: '#1b4d3e',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '700',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}>
            <Home size={20} />
            홈으로 돌아가기
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              color: '#1b4d3e',
              padding: '16px 24px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '700',
              border: '2px solid #1b4d3e',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={20} />
            이전 페이지로
          </button>
        </div>
        
        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid #f1f5f9',
          fontSize: '14px',
          color: '#94a3b8'
        }}>
          © 성령교회. 모든 권리 보유.
        </div>
      </div>
    </div>
  );
}

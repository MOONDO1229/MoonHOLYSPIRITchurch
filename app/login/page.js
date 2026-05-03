'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="icon-circle">
            <Lock size={32} />
          </div>
          <h1>관리자 로그인</h1>
          <p>교회 홈페이지 관리를 위해 로그인해 주세요.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label><User size={20} /> 아이디</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="아이디를 입력하세요"
              required
            />
          </div>
          <div className="input-group">
            <label><Lock size={20} /> 비밀번호</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-login">로그인 하기</button>
        </form>

        <div className="login-footer">
          <p>비밀번호를 잊으셨나요? 사무실에 문의해 주세요.</p>
          <a href="/">홈페이지로 돌아가기</a>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f2f5;
          padding: 20px;
        }
        .login-card {
          background: white;
          width: 100%;
          max-width: 450px;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .icon-circle {
          width: 64px;
          height: 64px;
          background: #1b4d3e;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .login-header h1 { font-size: 28px; font-weight: 800; color: #2c3e50; margin-bottom: 10px; }
        .login-header p { color: #7f8c8d; font-size: 16px; }

        .input-group { margin-bottom: 24px; }
        .input-group label { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 18px; margin-bottom: 10px; color: #34495e; }
        .input-group input {
          width: 100%;
          padding: 16px;
          border: 2px solid #ddd;
          border-radius: 12px;
          font-size: 18px;
          transition: border-color 0.3s;
        }
        .input-group input:focus {
          border-color: #1b4d3e;
          outline: none;
        }

        .error-msg { color: #e74c3c; font-weight: 700; margin-bottom: 20px; text-align: center; }

        .btn-login {
          width: 100%;
          padding: 18px;
          background: #1b4d3e;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 20px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.3s;
        }
        .btn-login:hover { background: #143a2f; }

        .login-footer { margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
        .login-footer p { font-size: 14px; color: #7f8c8d; margin-bottom: 10px; }
        .login-footer a { color: #1b4d3e; font-weight: 700; text-decoration: none; font-size: 16px; }
      `}</style>
    </div>
  );
}

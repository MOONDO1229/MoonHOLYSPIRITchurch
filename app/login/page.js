'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const u = username.trim();
    const p = password.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: u, password: p }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        window.location.href = '/admin';
      } else {
        // 서버에서 보내주는 구체적인 에러 메시지 표시
        setError(data.message || '인증 실패 (알 수 없는 이유)');
        if (data.debug) {
          console.log('Debug Info:', data.debug);
        }
      }
    } catch (err) {
      setError('네트워크 연결 오류: ' + err.message);
    } finally {
      setLoading(false);
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
            <label htmlFor="username"><User size={20} /> 아이디</label>
            <input 
              id="username"
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="아이디를 입력하세요"
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password"><Lock size={20} /> 비밀번호</label>
            <div className="password-input-wrapper">
              <input 
                id="password"
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <button 
                type="button" 
                className="btn-show-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-box">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <div className="loading-content">
                <Loader2 className="animate-spin" size={24} />
                <span>확인 중...</span>
              </div>
            ) : '로그인 하기'}
          </button>
        </form>

        <div className="login-footer">
          <p>도움이 필요하시면 사무실(031-766-8847)로 문의해 주세요.</p>
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
          border-radius: 24px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .icon-circle {
          width: 72px;
          height: 72px;
          background: #1b4d3e;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 4px 15px rgba(27, 77, 62, 0.2);
        }
        .login-header h1 { font-size: 30px; font-weight: 800; color: #2c3e50; margin-bottom: 12px; }
        .login-header p { color: #7f8c8d; font-size: 17px; }

        .input-group { margin-bottom: 28px; }
        .input-group label { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 19px; margin-bottom: 12px; color: #34495e; }
        .input-group input {
          width: 100%;
          padding: 16px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 14px;
          font-size: 19px;
          transition: all 0.3s;
          background: #fafafa;
        }
        .input-group input:focus {
          border-color: #1b4d3e;
          background: white;
          outline: none;
          box-shadow: 0 0 0 4px rgba(27, 77, 62, 0.1);
        }
        .input-group input:disabled { background: #eee; cursor: not-allowed; }

        .password-input-wrapper { position: relative; }
        .btn-show-password {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #95a5a6;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          transition: color 0.2s;
        }
        .btn-show-password:hover:not(:disabled) { color: #1b4d3e; }

        .error-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff5f5;
          color: #e74c3c;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 25px;
          border-left: 5px solid #e74c3c;
          font-weight: 600;
          word-break: break-all;
        }

        .btn-login {
          width: 100%;
          padding: 20px;
          background: #1b4d3e;
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 22px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(27, 77, 62, 0.3);
        }
        .btn-login:hover:not(:disabled) { background: #143a2f; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(27, 77, 62, 0.4); }
        .btn-login:disabled { background: #95a5a6; cursor: not-allowed; transform: none; }
        
        .loading-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .login-footer { margin-top: 40px; text-align: center; border-top: 1px solid #f0f0f0; padding-top: 25px; }
        .login-footer p { font-size: 15px; color: #95a5a6; margin-bottom: 12px; }
        .login-footer a { color: #1b4d3e; font-weight: 800; text-decoration: none; font-size: 17px; }
        .login-footer a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

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

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password.trim() 
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다. 인터넷 연결을 확인해 주세요.');
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
              required
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
                required
              />
              <button 
                type="button" 
                className="btn-show-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
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
            {loading ? '로그인 중...' : '로그인 하기'}
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
        .btn-show-password:hover { color: #1b4d3e; }

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

        .login-footer { margin-top: 40px; text-align: center; border-top: 1px solid #f0f0f0; padding-top: 25px; }
        .login-footer p { font-size: 15px; color: #95a5a6; margin-bottom: 12px; }
        .login-footer a { color: #1b4d3e; font-weight: 800; text-decoration: none; font-size: 17px; }
        .login-footer a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

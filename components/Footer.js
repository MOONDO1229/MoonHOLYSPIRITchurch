import { getSettings } from '@/lib/db';

export default function Footer() {
  const settings = getSettings();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-info">
            <h2 className="footer-logo">은혜샘교회</h2>
            <p>📍 {settings.address}</p>
            <p>📞 {settings.phone}</p>
            <p>📧 holy-spirit@church.com</p>
          </div>
          <div className="footer-links">
            <h3>바로가기</h3>
            <ul>
              <li><a href="/about">교회소개</a></li>
              <li><a href="/worship">예배안내</a></li>
              <li><a href="/location">오시는 길</a></li>
              <li><a href="/admin">관리자</a></li>
            </ul>
          </div>
          <div className="footer-social">
            <h3>온라인 채널</h3>
            <div className="social-btns">
              {settings.youtubeLink && <a href={settings.youtubeLink} target="_blank" rel="noreferrer">유튜브</a>}
              {settings.kakaoLink && <a href={settings.kakaoLink} target="_blank" rel="noreferrer">카카오톡</a>}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 은혜샘교회. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

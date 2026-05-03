import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer({ settings }) {
  const churchName = settings?.welcomeTitle?.split('에')[0] || '퇴촌성령교회';

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-info">
            <h2 className="footer-logo">{churchName}</h2>
            <p><MapPin size={18} /> {settings?.address || '경기도 광주시 퇴촌면 광동로52번길 27'}</p>
            <p><Phone size={18} /> {settings?.phone || '031 766 8847'}</p>
            <p><Mail size={18} /> tc-spirit@church.com</p>
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
              {settings?.youtubeLink && <a href={settings.youtubeLink} target="_blank" rel="noreferrer">유튜브</a>}
              {settings?.kakaoLink && <a href={settings.kakaoLink} target="_blank" rel="noreferrer">카카오톡</a>}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 {churchName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';

export default function Footer({ settings }) {
  const currentYear = new Date().getFullYear();
  const churchName = settings?.churchName || '성령교회';
  const slogan = settings?.footerSlogan || '성령의 능력으로 세상을 변화시키고\n예수 그리스도의 사랑을 실천하는 믿음의 공동체';

  return (
    <footer className="footer site-footer pt-32 pb-20 text-brand-dark overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="site-footer-grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="footer-panel footer-brand-panel space-y-8">
            <Link href="/" className="flex items-center gap-3" aria-label={`${churchName} 홈으로 이동`}>
              <img src="/church_logo.jpg" alt={churchName} className="footer-logo-img" />
            </Link>
            <p className="text-brand-dark font-bold leading-relaxed text-lg whitespace-pre-line">
              {slogan}
            </p>
          </div>

          <div className="footer-panel footer-contact-panel space-y-6">
            <h3 className="text-brand-brown text-lg font-black uppercase tracking-widest">교회 연락처</h3>
            <ul className="space-y-4 text-brand-dark font-bold text-lg">
              <li className="footer-info-row">
                <i className="ph ph-map-pin"></i>
                <span>{settings?.address || '경기도 광주시 퇴촌면 광동로52번길 27'}</span>
              </li>
              <li className="footer-info-row">
                <i className="ph ph-phone"></i>
                <span>{settings?.phone || '031-766-8847'}</span>
              </li>
              <li className="footer-info-row">
                <i className="ph ph-envelope-simple"></i>
                <span>{settings?.email || 'spirit-church@church.com'}</span>
              </li>
            </ul>
          </div>

          <div className="footer-panel space-y-6">
            <h3 className="text-brand-brown text-lg font-black uppercase tracking-widest">온라인 채널</h3>
            <div className="flex flex-wrap gap-3">
              {settings?.youtubeLink && (
                <a
                  href={settings.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="성령교회 유튜브 채널로 이동"
                  className="footer-social-btn"
                >
                  <i className="ph-fill ph-youtube-logo"></i>
                </a>
              )}
              {settings?.kakaoLink && (
                <a
                  href={settings.kakaoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="성령교회 카카오톡 채널로 이동"
                  className="footer-social-btn"
                >
                  <i className="ph-fill ph-chat-circle-text"></i>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <p>© {settings?.copyrightYear || currentYear} {churchName}. 모든 권리 보유.</p>
        </div>
      </div>
    </footer>
  );
}

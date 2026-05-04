import Link from 'next/link';

export default function Footer({ settings }) {
  const currentYear = new Date().getFullYear();
  const churchName = '퇴촌성령교회';

  return (
    <footer className="footer pt-24 pb-12 bg-transparent text-brand-dark overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-brand-brown p-2 rounded-lg">
                <i className="ph ph-cross text-white text-xl"></i>
              </div>
              <span className="text-2xl font-black tracking-tighter text-brand-dark">{churchName}</span>
            </div>
            <p className="text-brand-dark font-bold leading-relaxed text-lg">
              성령의 능력으로 세상을 변화시키고<br />
              예수 그리스도의 사랑을 실천하는 믿음의 공동체
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-brand-brown text-lg font-bold uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-4 text-brand-dark font-bold text-lg">
              <li className="flex items-start gap-3">
                <i className="ph ph-map-pin text-xl text-brand-brown mt-1"></i>
                <span className="text-sm md:text-base">{settings?.address || '경기도 광주시 퇴촌면 광동로52번길 27'}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="ph ph-phone text-xl text-brand-brown"></i>
                <span>{settings?.phone || '031-766-8847'}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="ph ph-envelope-simple text-xl text-brand-brown"></i>
                <span>{settings?.email || 'tc-spirit@church.com'}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h3 className="text-brand-brown text-lg font-bold uppercase tracking-widest">Online Channel</h3>
            <div className="flex flex-wrap gap-3">
              {settings?.youtubeLink && (
                <a href={settings.youtubeLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-brand-brown/5 border border-brand-brown/10 flex items-center justify-center hover:bg-brand-brown hover:border-brand-brown transition-all group">
                  <i className="ph-fill ph-youtube-logo text-2xl text-brand-brown group-hover:text-white group-hover:scale-110 transition-transform"></i>
                </a>
              )}
              {settings?.kakaoLink && (
                <a href={settings.kakaoLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-brand-brown/5 border border-brand-brown/10 flex items-center justify-center hover:bg-brand-brown hover:border-brand-brown transition-all group">
                  <i className="ph-fill ph-chat-circle-text text-2xl text-brand-brown group-hover:text-white group-hover:scale-110 transition-transform"></i>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-brown/10 flex flex-col md:flex-row justify-between items-center gap-4 text-brand-dark font-bold">
          <p>© {settings?.copyrightYear || currentYear} {churchName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

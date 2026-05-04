import Link from 'next/link';

export default function Footer({ settings }) {
  const currentYear = new Date().getFullYear();
  const churchName = '퇴촌성령교회';

  return (
    <footer className="footer pt-24 pb-12 bg-[#1A1817] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-brand-brown p-2 rounded-lg">
                <i className="ph ph-cross text-white text-xl"></i>
              </div>
              <span className="text-2xl font-black tracking-tighter">{churchName}</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg">
              성령의 능력으로 세상을 변화시키고<br />
              예수 그리스도의 사랑을 실천하는 믿음의 공동체
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-brand-gold text-lg font-bold uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-lg">
              <li className="flex items-start gap-3">
                <i className="ph ph-map-pin text-xl text-brand-gold mt-1"></i>
                <span>{settings?.address || '경기도 광주시 퇴촌면 광동로52번길 27'}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="ph ph-phone text-xl text-brand-gold"></i>
                <span>{settings?.phone || '031-766-8847'}</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="ph ph-envelope-simple text-xl text-brand-gold"></i>
                <span>{settings?.email || 'tc-spirit@church.com'}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h3 className="text-brand-gold text-lg font-bold uppercase tracking-widest">Online Channel</h3>
            <div className="flex flex-wrap gap-3">
              {settings?.youtubeLink && (
                <a href={settings.youtubeLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-brown hover:border-brand-brown transition-all group">
                  <i className="ph-fill ph-youtube-logo text-2xl group-hover:scale-110 transition-transform"></i>
                </a>
              )}
              {settings?.kakaoLink && (
                <a href={settings.kakaoLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-brown hover:border-brand-brown transition-all group">
                  <i className="ph-fill ph-chat-circle-text text-2xl group-hover:scale-110 transition-transform"></i>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 font-medium">
          <p>© {settings?.copyrightYear || currentYear} {churchName}. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/about" className="hover:text-white transition-colors">교회소개</Link>
            <Link href="/location" className="hover:text-white transition-colors">오시는 길</Link>
            <Link href="/admin" className="hover:text-white transition-colors">관리자</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

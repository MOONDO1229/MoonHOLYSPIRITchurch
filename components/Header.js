'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, Search, X } from 'lucide-react';

export default function Header({ settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileActiveMenu, setMobileActiveMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const churchName = settings?.churchName || '성령교회';
  const denomination = settings?.denomination || '기독교대한성결교회';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setMobileActiveMenu(null);
  };

  const menuItems = [
    {
      title: 'About us',
      links: [
        { name: '교회소개', href: '/about' },
        { name: '교회연혁', href: '/history' },
        { name: '오시는 길', href: '/location' },
        { name: '헌금 및 후원', href: '/about#support' },
      ],
    },
    { title: '예배안내', href: '/worship' },
    { title: '설교말씀', href: '/sermon' },
    {
      title: '교회소식',
      links: [
        { name: '교회소식', href: '/news' },
        { name: '교회행사', href: '/event' },
        { name: '교회 앨범', href: '/album' },
      ],
    },
  ];

  return (
    <nav className={`site-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white py-4 md:py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center group" aria-label={`${churchName} 홈으로 이동`}>
          <img
            src="/church_logo.jpg"
            alt={churchName}
            className="site-header-logo h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <div className="hidden md:flex items-center gap-3 lg:gap-5">
          {menuItems.map((item, idx) => (
            <div
              key={item.title}
              className="relative group py-2"
              onMouseEnter={() => setActiveMenu(idx)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className={`desktop-menu-pill text-[16px] font-bold transition-all flex items-center gap-1 ${
                    item.isHighlight ? 'highlight' : ''
                  }`}
                >
                  {item.title}
                </Link>
              ) : (
                <button className="desktop-menu-pill text-[16px] font-bold transition-all flex items-center gap-1">
                  {item.title}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                    activeMenu === idx ? 'rotate-180' : ''
                  } group-hover:rotate-180`} />
                </button>
              )}

              {item.links && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 ${
                  activeMenu === idx ? 'opacity-100 visible translate-y-0' : ''
                }`}>
                  <div className="desktop-dropdown bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden min-w-[180px] py-2">
                    {item.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-6 py-3 text-[15px] text-gray-700 hover:bg-[#f3eee8] hover:text-brand-brown transition-colors whitespace-nowrap font-bold"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button aria-label="검색" className="p-2 text-brand-text hover:text-brand-gold transition-colors">
            <Search className="w-6 h-6" />
          </button>
          <button
            aria-label="메뉴 열기"
            className="md:hidden p-2 text-brand-text hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mobile-menu-overlay md:hidden fixed inset-0 z-[100] flex flex-col justify-center items-center animate-in fade-in duration-500">
          <button
            aria-label="메뉴 닫기"
            onClick={closeMobileMenu}
            className="mobile-menu-close absolute top-6 right-6 p-3 text-brand-dark hover:text-brand-gold transition-colors focus:outline-none"
          >
            <X className="w-8 h-8" />
          </button>

          <nav className="mobile-menu-list w-full max-w-md px-8 flex flex-col justify-center items-center gap-4 overflow-y-auto py-16">
            {menuItems.map((item, idx) => (
              <div key={item.title} className="w-full text-center">
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`mobile-menu-link block py-4 text-xl font-extrabold text-center transition-all duration-200 ${
                      item.isHighlight ? 'highlight' : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <div className="py-1">
                    <button
                      onClick={() => setMobileActiveMenu(mobileActiveMenu === idx ? null : idx)}
                      className="mobile-menu-link w-full relative py-4 text-xl font-extrabold text-brand-dark text-center focus:outline-none duration-200"
                    >
                      <span>{item.title}</span>
                      <ChevronDown className={`absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 transition-transform duration-300 ${
                        mobileActiveMenu === idx ? 'rotate-180 text-brand-gold' : 'text-gray-400'
                      }`} />
                    </button>

                    <div className={`mobile-submenu-panel grid grid-cols-1 gap-2 overflow-hidden transition-all duration-300 ${
                      mobileActiveMenu === idx ? 'max-h-[300px] opacity-100 mt-2 mb-2' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}>
                      {item.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeMobileMenu}
                          className="mobile-submenu-link text-center py-3 px-4 text-base font-bold rounded-xl transition-all block"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="absolute bottom-8 text-center w-full px-6">
            <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase mb-1">{denomination}</p>
            <p className="text-base font-black text-brand-dark">{churchName}</p>
          </div>
        </div>
      )}
    </nav>
  );
}

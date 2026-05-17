'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ChevronDown } from 'lucide-react';

export default function Header({ settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileActiveMenu, setMobileActiveMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const churchName = settings?.churchName || '성령교회';
  const denomination = settings?.denomination || '기독교대한성결교회';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    {
      title: 'About us',
      links: [
        { name: '교회소개', href: '/about' },
        { name: '교회연혁', href: '/history' },
        { name: '오시는 길', href: '/location' },
      ]
    },
    {
      title: '예배안내',
      href: '/worship'
    },
    {
      title: '설교말씀',
      href: '/sermon'
    },
    {
      title: '교회소식',
      links: [
        { name: '교회소식', href: '/news' },
        { name: '교회행사', href: '/event' },
      ]
    },
    {
      title: '헌금 및 후원',
      href: '/support',
      isHighlight: true
    }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center group">
          <img 
            src="/church_logo.jpg" 
            alt={churchName} 
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {menuItems.map((item, idx) => (
            <div 
              key={idx} 
              className="relative group py-2"
              onMouseEnter={() => setActiveMenu(idx)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              {item.href ? (
                <Link 
                  href={item.href} 
                  className={`text-[17px] font-bold transition-all flex items-center gap-1 ${
                    item.isHighlight ? 'text-brand-gold hover:text-brand-brown' : 'text-brand-text hover:text-brand-gold'
                  }`}
                >
                  {item.title}
                </Link>
              ) : (
                <button className="text-[17px] font-bold text-brand-text group-hover:text-brand-gold transition-all flex items-center gap-1">
                  {item.title}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeMenu === idx ? 'rotate-180' : ''} group-hover:rotate-180`} />
                </button>
              )}

              {/* Dropdown Menu */}
              {item.links && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 ${
                  activeMenu === idx ? 'opacity-100 visible translate-y-0' : ''
                }`}>
                  <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden min-w-[160px] py-2">
                    {item.links.map((link, lIdx) => (
                      <Link 
                        key={lIdx} 
                        href={link.href}
                        className="block px-6 py-3 text-[15px] text-gray-600 hover:bg-gray-50 hover:text-brand-gold transition-colors whitespace-nowrap font-medium"
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

        {/* Actions */}
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

      {/* Mobile Menu Overlay (Full-screen Transparent White Glassmorphism) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-white/90 backdrop-blur-xl flex flex-col justify-center items-center animate-in fade-in duration-500">
          {/* Close Button */}
          <button 
            aria-label="메뉴 닫기" 
            onClick={() => { setIsOpen(false); setMobileActiveMenu(null); }} 
            className="absolute top-6 right-6 p-3 text-brand-dark hover:text-brand-gold transition-colors focus:outline-none"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Centered Menu List */}
          <nav className="w-full max-w-md px-8 flex flex-col justify-center items-center gap-6 overflow-y-auto py-16">
            {menuItems.map((item, idx) => (
              <div key={idx} className="w-full text-center">
                {item.href ? (
                  <Link 
                    href={item.href} 
                    onClick={() => { setIsOpen(false); setMobileActiveMenu(null); }}
                    className={`block py-3 text-2xl font-extrabold transition-all hover:scale-105 duration-200 ${
                      item.isHighlight ? 'text-brand-gold' : 'text-brand-dark'
                    }`}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <div className="py-1">
                    <button 
                      onClick={() => setMobileActiveMenu(mobileActiveMenu === idx ? null : idx)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-2xl font-extrabold text-brand-dark focus:outline-none hover:scale-105 duration-200"
                    >
                      <span>{item.title}</span>
                      <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${mobileActiveMenu === idx ? 'rotate-180 text-brand-gold' : 'text-gray-400'}`} />
                    </button>
                    
                    <div className={`grid grid-cols-1 gap-2 overflow-hidden transition-all duration-300 ${
                      mobileActiveMenu === idx ? 'max-h-[300px] opacity-100 mt-2 mb-2' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}>
                      {item.links.map((link, lIdx) => (
                        <Link 
                          key={lIdx} 
                          href={link.href}
                          onClick={() => { setIsOpen(false); setMobileActiveMenu(null); }}
                          className="text-center py-2 px-4 text-lg font-bold text-gray-500 hover:text-brand-gold rounded-xl transition-all block"
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
          
          {/* Centered Footer */}
          <div className="absolute bottom-8 text-center w-full px-6">
            <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase mb-1">{denomination}</p>
            <p className="text-base font-black text-brand-dark">{churchName}</p>
          </div>
        </div>
      )}
    </nav>
  );
}

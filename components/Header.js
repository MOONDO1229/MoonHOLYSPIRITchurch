'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Type } from 'lucide-react';

export default function Header({ settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const churchName = settings?.churchName || '성령교회';
  const denomination = settings?.denomination || '기독교대한성결교회';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center group">
          <img 
            src="/church_logo.jpg" 
            alt={churchName} 
            className="h-10 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 text-[16px] font-semibold text-brand-text">
          <Link href="/worship" className="nav-link transition-colors py-1">예배안내</Link>
          <Link href="/sermon" className="nav-link transition-colors py-1">설교말씀</Link>
          <Link href="/event" className="nav-link transition-colors py-1">교회행사</Link>
          <Link href="/news" className="nav-link transition-colors py-1">교회소식</Link>
          <Link href="/album" className="nav-link transition-colors py-1">교회 앨범</Link>
          <Link href="/support" className="nav-link transition-colors py-1">헌금 및 후원</Link>
          <Link href="/about" className="nav-link transition-colors py-1">교회소개</Link>
          <Link href="/history" className="nav-link transition-colors py-1">교회연혁</Link>
          <Link href="/location" className="nav-link transition-colors py-1">오시는 길</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button aria-label="검색" className="p-2 text-brand-text hover:text-brand-gold transition-colors">
            <i className="ph ph-magnifying-glass text-2xl"></i>
          </button>
          <button aria-label="메뉴 열기" className="md:hidden p-2 text-brand-text hamburger-icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <i className="ph ph-x text-2xl"></i> : <i className="ph ph-list text-2xl"></i>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Semi-transparent backdrop with stronger blur */}
          <div className="md:hidden fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="md:hidden fixed inset-y-0 right-0 h-screen w-[280px] bg-white z-[110] shadow-2xl flex flex-col animate-in fade-in slide-in-from-right duration-300 ease-out">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <span className="font-bold text-xl text-brand-dark tracking-tight">{churchName}</span>
              <button aria-label="메뉴 닫기" onClick={() => setIsOpen(false)} className="p-2 text-brand-dark hover:bg-gray-100 rounded-full transition-colors">
                <i className="ph ph-x text-2xl"></i>
              </button>
            </div>
            
            <nav className="flex flex-col py-4 overflow-y-auto">
              <Link href="/worship" onClick={() => setIsOpen(false)} className="px-8 py-4 text-lg font-medium text-brand-dark hover:bg-gray-50 transition-colors">
                예배안내
              </Link>
              <Link href="/sermon" onClick={() => setIsOpen(false)} className="px-8 py-4 text-lg font-medium text-brand-dark hover:bg-gray-50 transition-colors">
                설교말씀
              </Link>
              <Link href="/event" onClick={() => setIsOpen(false)} className="px-8 py-4 text-lg font-medium text-brand-dark hover:bg-gray-50 transition-colors">
                교회행사
              </Link>
              <Link href="/news" onClick={() => setIsOpen(false)} className="px-8 py-4 text-lg font-medium text-brand-dark hover:bg-gray-50 transition-colors">
                교회소식
              </Link>
              <Link href="/album" onClick={() => setIsOpen(false)} className="px-8 py-4 text-lg font-medium text-brand-dark hover:bg-gray-50 transition-colors">
                교회 앨범
              </Link>
              <Link href="/support" onClick={() => setIsOpen(false)} className="px-8 py-4 text-lg font-medium text-brand-dark hover:bg-gray-50 transition-colors">
                헌금 및 후원
              </Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="px-8 py-4 text-lg font-medium text-brand-dark hover:bg-gray-50 transition-colors">
                교회소개
              </Link>
              <Link href="/history" onClick={() => setIsOpen(false)} className="px-8 py-4 text-lg font-medium text-brand-dark hover:bg-gray-50 transition-colors">
                교회연혁
              </Link>
              <Link href="/location" onClick={() => setIsOpen(false)} className="px-8 py-4 text-lg font-medium text-brand-dark hover:bg-gray-50 transition-colors">
                오시는 길
              </Link>
            </nav>
            
            <div className="mt-auto p-8 border-t border-gray-100 bg-gray-50/50">
              <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase mb-1">{denomination}</p>
              <p className="text-lg font-bold text-brand-dark tracking-tight">{churchName}</p>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .nav-link:hover {
          color: var(--primary-color);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 0;
          background-color: var(--primary-color);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>
    </nav>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Type } from 'lucide-react';

export default function Header({ settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const churchName = '성령교회';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2.5 rounded-xl transition-all duration-300 shadow-md" style={{ backgroundColor: 'var(--primary-color)' }}>
            <i className="ph ph-cross text-white text-2xl"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-tight text-brand-dark tracking-tight">{churchName}</span>
            <span className="text-[10px] text-brand-muted tracking-widest uppercase font-medium">기독교대한성결교회</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-[17px] font-semibold text-brand-text">
          <Link href="/worship" className="nav-link transition-colors py-1">예배안내</Link>
          <Link href="/sermon" className="nav-link transition-colors py-1">설교말씀</Link>
          <Link href="/news" className="nav-link transition-colors py-1">교회소식</Link>
          <Link href="/support" className="nav-link transition-colors py-1">헌금 및 후원</Link>
          <Link href="/about" className="nav-link transition-colors py-1">교회소개</Link>
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
          <div className="md:hidden fixed inset-0 z-[45] bg-black/70 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
          
          <div className="md:hidden fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[50] shadow-[-20px_0_60px_rgba(0,0,0,0.3)] p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-right-full duration-500 ease-out">
            <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--primary-color)' }}>
                  <i className="ph ph-cross text-white text-lg"></i>
                </div>
                <span className="font-black text-2xl text-brand-dark tracking-tighter">{churchName}</span>
              </div>
              <button aria-label="메뉴 닫기" onClick={() => setIsOpen(false)} className="p-2.5 text-brand-dark hover:bg-gray-100 rounded-full transition-colors border border-gray-100 shadow-sm">
                <i className="ph-bold ph-x text-2xl"></i>
              </button>
            </div>
            
            <nav className="flex flex-col gap-3">
              <Link href="/worship" onClick={() => setIsOpen(false)} className="flex items-center gap-5 text-xl font-black p-5 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 text-brand-dark shadow-sm hover:shadow-md">
                <i className="ph-fill ph-calendar-check text-3xl" style={{ color: 'var(--primary-color)' }}></i>
                예배안내
              </Link>
              <Link href="/sermon" onClick={() => setIsOpen(false)} className="flex items-center gap-5 text-xl font-black p-5 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 text-brand-dark shadow-sm hover:shadow-md">
                <i className="ph-fill ph-play-circle text-3xl" style={{ color: 'var(--primary-color)' }}></i>
                설교말씀
              </Link>
              <Link href="/news" onClick={() => setIsOpen(false)} className="flex items-center gap-5 text-xl font-black p-5 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 text-brand-dark shadow-sm hover:shadow-md">
                <i className="ph-fill ph-megaphone text-3xl" style={{ color: 'var(--primary-color)' }}></i>
                교회소식
              </Link>
              <Link href="/support" onClick={() => setIsOpen(false)} className="flex items-center gap-5 text-xl font-black p-5 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 text-brand-dark shadow-sm hover:shadow-md">
                <i className="ph-fill ph-heart text-3xl" style={{ color: 'var(--primary-color)' }}></i>
                헌금 및 후원
              </Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-5 text-xl font-black p-5 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 text-brand-dark shadow-sm hover:shadow-md">
                <i className="ph-fill ph-church text-3xl" style={{ color: 'var(--primary-color)' }}></i>
                교회소개
              </Link>
              <Link href="/location" onClick={() => setIsOpen(false)} className="flex items-center gap-5 text-xl font-black p-5 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 text-brand-dark shadow-sm hover:shadow-md">
                <i className="ph-fill ph-map-pin text-3xl" style={{ color: 'var(--primary-color)' }}></i>
                오시는 길
              </Link>
            </nav>
 
            <div className="mt-auto pt-8 text-center bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
              <p className="text-xs text-brand-muted font-bold tracking-widest uppercase mb-2">기독교대한성결교회</p>
              <p className="text-2xl font-black text-brand-dark tracking-tighter">{churchName}</p>
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

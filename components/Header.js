'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Type } from 'lucide-react';

export default function Header({ settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const churchName = '퇴촌성령교회';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between md:justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex flex-1 md:flex-none items-center justify-center md:justify-start gap-3 group">
          <div className="bg-brand-brown p-2.5 rounded-xl group-hover:bg-brand-brown/90 transition-all duration-300 shadow-md">
            <i className="ph ph-cross text-white text-2xl"></i>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-bold text-xl leading-tight text-brand-dark tracking-tight">{churchName}</span>
            <span className="text-[10px] text-brand-muted tracking-widest uppercase font-medium">기독교대한성결교회</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-[17px] font-semibold text-brand-text">
          <Link href="/worship" className="nav-link hover:text-brand-brown transition-colors py-1">예배안내</Link>
          <Link href="/sermon" className="nav-link hover:text-brand-brown transition-colors py-1">설교말씀</Link>
          <Link href="/news" className="nav-link hover:text-brand-brown transition-colors py-1">교회소식</Link>
          <Link href="/support" className="nav-link hover:text-brand-brown transition-colors py-1">헌금 및 후원</Link>
          <Link href="/about" className="nav-link hover:text-brand-brown transition-colors py-1">교회소개</Link>
          <Link href="/location" className="nav-link hover:text-brand-brown transition-colors py-1">오시는 길</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button aria-label="검색" className="p-2 text-brand-text hover:text-brand-gold transition-colors">
            <i className="ph ph-magnifying-glass text-2xl"></i>
          </button>
          <button className="md:hidden p-2 text-brand-text" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <i className="ph ph-x text-2xl"></i> : <i className="ph ph-list text-2xl"></i>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <Link href="/worship" onClick={() => setIsOpen(false)} className="text-lg font-bold p-2 border-b border-gray-50">예배안내</Link>
          <Link href="/sermon" onClick={() => setIsOpen(false)} className="text-lg font-bold p-2 border-b border-gray-50">설교말씀</Link>
          <Link href="/news" onClick={() => setIsOpen(false)} className="text-lg font-bold p-2 border-b border-gray-50">교회소식</Link>
          <Link href="/support" onClick={() => setIsOpen(false)} className="text-lg font-bold p-2 border-b border-gray-50">헌금 및 후원</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-bold p-2 border-b border-gray-50">교회소개</Link>
          <Link href="/location" onClick={() => setIsOpen(false)} className="text-lg font-bold p-2 border-b border-gray-50">오시는 길</Link>
        </div>
      )}

      <style jsx>{`
        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 0;
          background-color: var(--brand-brown);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>
    </nav>
  );
}

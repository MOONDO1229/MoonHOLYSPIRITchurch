'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Type } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          <span className="logo-text">은혜샘교회</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <Link href="/worship">예배와 말씀</Link>
          <Link href="/newcomer">새가족</Link>
          <Link href="/news">교회소식</Link>
          <Link href="/life">교회생활</Link>
          <Link href="/support">성도지원</Link>
          <Link href="/about">교회소개</Link>
          <Link href="/location">오시는 길</Link>
        </nav>

        <div className="header-actions">
          <button className="icon-btn"><Search size={24} /><span className="sr-only">검색</span></button>
          <button className="icon-btn"><Type size={24} /><span className="sr-only">글자크기</span></button>
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="mobile-menu-overlay">
          <nav className="mobile-menu-nav">
            <Link href="/worship" onClick={() => setIsOpen(false)}>예배와 말씀</Link>
            <Link href="/newcomer" onClick={() => setIsOpen(false)}>새가족</Link>
            <Link href="/news" onClick={() => setIsOpen(false)}>교회소식</Link>
            <Link href="/life" onClick={() => setIsOpen(false)}>교회생활</Link>
            <Link href="/support" onClick={() => setIsOpen(false)}>성도지원</Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>교회소개</Link>
            <Link href="/location" onClick={() => setIsOpen(false)}>오시는 길</Link>
          </nav>
        </div>
      )}

    </header>
  );
}

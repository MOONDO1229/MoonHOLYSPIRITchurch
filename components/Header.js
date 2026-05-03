'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Type } from 'lucide-react';

export default function Header({ settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const churchName = '퇴촌성령교회';

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          {settings.logoImage ? (
            <img src={settings.logoImage} alt={churchName} className="header-logo-img" />
          ) : (
            <span className="logo-text">{churchName}</span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <Link href="/worship">예배와 말씀</Link>
          <Link href="/news">교회소식</Link>
          <Link href="/support">헌금 및 후원</Link>
          <Link href="/about">교회소개</Link>
          <Link href="/location">오시는 길</Link>
        </nav>

        <div className="header-actions">
          <button className="icon-btn" title="검색"><Search size={24} /></button>
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="mobile-menu-overlay">
          <nav className="mobile-menu-nav">
            <Link href="/" onClick={() => setIsOpen(false)}>홈으로</Link>
            <Link href="/worship" onClick={() => setIsOpen(false)}>예배와 말씀</Link>
            <Link href="/news" onClick={() => setIsOpen(false)}>교회소식</Link>
            <Link href="/support" onClick={() => setIsOpen(false)}>헌금 및 후원</Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>교회소개</Link>
            <Link href="/location" onClick={() => setIsOpen(false)}>오시는 길</Link>
          </nav>
        </div>
      )}

      <style jsx>{`
        .header-logo-img { height: 45px; width: auto; object-fit: contain; }
      `}</style>
    </header>
  );
}

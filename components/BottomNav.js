'use client';
import Link from 'next/link';
import { Home, Play, BookOpen, MapPin, Phone } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <Link href="/" className="nav-item">
        <Home size={28} />
        <span>홈</span>
      </Link>
      <Link href="/worship" className="nav-item">
        <Play size={28} />
        <span>예배</span>
      </Link>
      <Link href="/bulletin" className="nav-item">
        <BookOpen size={28} />
        <span>주보</span>
      </Link>
      <Link href="/location" className="nav-item">
        <MapPin size={28} />
        <span>길찾기</span>
      </Link>
      <a href="tel:02-123-4567" className="nav-item">
        <Phone size={28} />
        <span>문의</span>
      </a>

    </nav>
  );
}

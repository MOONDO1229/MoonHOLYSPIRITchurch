'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function PopupOverlay({ popups }) {
  const [activePopups, setActivePopups] = useState([]);

  useEffect(() => {
    // Filter by "today hide" logic
    const filtered = popups.filter(popup => {
      const hideDate = localStorage.getItem(`hide-popup-${popup.id}`);
      if (hideDate) {
        const today = new Date().toISOString().split('T')[0];
        return hideDate !== today;
      }
      return true;
    });
    setActivePopups(filtered);
  }, [popups]);

  const handleClose = (id, hideToday = false) => {
    if (hideToday) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`hide-popup-${id}`, today);
    }
    setActivePopups(prev => prev.filter(p => p.id !== id));
  };

  if (activePopups.length === 0) return null;

  return (
    <div className="popup-overlay-container">
      {activePopups.map((popup, index) => (
        <div key={popup.id} className="popup-wrapper" style={{ zIndex: 2000 + index }}>
          <div className="popup-content">
            <Link href={popup.link || '#'} onClick={() => handleClose(popup.id)}>
              <picture>
                <source media="(max-width: 768px)" srcSet={popup.mobile_image || popup.pc_image} />
                <img src={popup.pc_image} alt={popup.title} className="popup-img" />
              </picture>
            </Link>
            <div className="popup-footer">
              <button className="btn-hide" onClick={() => handleClose(popup.id, true)}>
                오늘 하루 보지 않기
              </button>
              <button className="btn-close" onClick={() => handleClose(popup.id)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}

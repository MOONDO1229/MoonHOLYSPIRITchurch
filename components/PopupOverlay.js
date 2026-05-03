'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function PopupOverlay({ popups }) {
  const [activePopups, setActivePopups] = useState([]);

  useEffect(() => {
    if (popups && popups.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const filtered = popups.filter(p => {
        const hideDate = localStorage.getItem(`hide-popup-${p.id}`);
        return hideDate !== today;
      });
      setActivePopups(filtered);
    }
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
        <div 
          key={popup.id} 
          className="popup-wrapper" 
          style={{ 
            zIndex: 1000 + index,
            transform: `translate(${index * 20}px, ${index * 20}px)`
          }}
        >
          <div className="popup-content">
            <div className="popup-body">
              {popup.link ? (
                <a href={popup.link} target="_blank" rel="noopener noreferrer">
                  <img src={popup.pc_image || popup.mobile_image} alt={popup.title} className="popup-img" />
                </a>
              ) : (
                <img src={popup.pc_image || popup.mobile_image} alt={popup.title} className="popup-img" />
              )}
            </div>
            <div className="popup-footer">
              <button className="btn-hide" onClick={() => handleClose(popup.id, true)}>
                오늘 하루 보지 않기
              </button>
              <button className="btn-close" onClick={() => handleClose(popup.id, false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

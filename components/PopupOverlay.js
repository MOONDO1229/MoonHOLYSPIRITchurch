'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function PopupOverlay({ settings }) {
  const [show, setShow] = useState(false);
  const popup = settings?.popup;

  useEffect(() => {
    if (popup && popup.enabled && popup.imageUrl) {
      const hideDate = localStorage.getItem(`hide-popup-main`);
      const today = new Date().toISOString().split('T')[0];
      
      if (hideDate !== today) {
        setShow(true);
      }
    }
  }, [popup]);

  const handleClose = (hideToday = false) => {
    if (hideToday) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`hide-popup-main`, today);
    }
    setShow(false);
  };

  if (!show || !popup || !popup.imageUrl) return null;

  return (
    <div className="popup-overlay-container">
      <div className="popup-wrapper">
        <div className="popup-content">
          <div className="popup-body">
            {popup.linkUrl ? (
              <a href={popup.linkUrl} target="_blank" rel="noopener noreferrer">
                <img src={popup.imageUrl} alt="공지 팝업" className="popup-img" />
              </a>
            ) : (
              <img src={popup.imageUrl} alt="공지 팝업" className="popup-img" />
            )}
          </div>
          <div className="popup-footer">
            <button className="btn-hide" onClick={() => handleClose(true)}>
              오늘 하루 보지 않기
            </button>
            <button className="btn-close" onClick={() => handleClose(false)}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

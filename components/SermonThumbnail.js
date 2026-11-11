'use client';

import { useState } from 'react';

export default function SermonThumbnail({ videoId, thumbnail, title, className }) {
  const primarySrc = thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '');
  const fallbackSrc = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '';
  const [src, setSrc] = useState(primarySrc);

  if (!src) {
    return (
      <div className={`${className || ''} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-400 text-sm font-bold">영상 준비중</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title || '설교 영상'}
      className={className}
      onError={() => {
        if (fallbackSrc && src !== fallbackSrc) {
          setSrc(fallbackSrc);
        }
      }}
    />
  );
}

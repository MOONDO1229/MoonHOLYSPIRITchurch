'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button 
      onClick={handleCopy} 
      className={`copy-btn ${copied ? 'success' : ''}`}
      title="복사하기"
    >
      {copied ? (
        <><Check size={14} /> 복사됨</>
      ) : (
        <><Copy size={14} /> 복사</>
      )}
    </button>
  );
}

'use client';
import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { MapPin, Phone, Car, Bus, Copy, ExternalLink } from 'lucide-react';

export default function LocationPage() {
  const [copied, setCopied] = useState(false);
  const address = "경기도 광주시 퇴촌면 광동로52번길 27 (성령교회)";
  const phone = "031-766-8847";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedAddress = encodeURIComponent(address);
  const naverMapUrl = `https://map.naver.com/v5/search/${encodedAddress}`;
  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodedAddress}`;
  
  // Google Maps Embed URL (No API key needed for simple search)
  const googleMapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=REPLACEME&q=${encodedAddress}`;
  // 하지만 API Key가 필요하므로, Key 없이 가능한 iframe 형식 사용
  const freeGoogleMapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <main>
      <PageHeader title="오시는 길" subtitle="성령교회는 여러분을 항상 환영합니다." />

      <section className="container section">
        <div className="location-grid">
          {/* Map Area */}
          <div className="map-area">
            <div className="map-container" style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src={freeGoogleMapUrl}
              ></iframe>
            </div>
            <div className="map-actions">
              <button 
                className={`btn ${copied ? 'btn-success' : 'btn-outline'}`} 
                onClick={copyToClipboard}
              >
                <Copy size={20} /> {copied ? '주소가 복사되었습니다' : '주소 복사'}
              </button>
              <a href={naverMapUrl} target="_blank" rel="noopener noreferrer" title="네이버 지도로 이동" aria-label="네이버 지도로 이동" className="btn btn-primary"><ExternalLink size={20} /> 네이버 지도</a>
              <a href={kakaoMapUrl} target="_blank" rel="noopener noreferrer" title="카카오 맵으로 이동" aria-label="카카오 맵으로 이동" className="btn btn-primary"><ExternalLink size={20} /> 카카오 맵</a>
            </div>
          </div>

          {/* Info Area */}
          <div className="info-area">
            <div className="info-section">
              <div className="info-title"><MapPin /> 주소</div>
              <p className="info-text">{address}</p>
            </div>

            <div className="info-section">
              <div className="info-title"><Phone /> 전화번호</div>
              <p className="info-text">{phone}</p>
              <a href={`tel:${phone.replace(/-/g, '')}`} className="btn btn-secondary call-btn">전화 문의하기</a>
            </div>

            <div className="info-section">
              <div className="info-title"><Car /> 오시는 길 / 주차</div>
              <p className="info-text">
                퇴촌면 광동로에 위치하고 있습니다. <br/>
                교회 앞 주차장 및 주변 주차 공간을 편리하게 이용하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .location-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 40px;
        }
        .map-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          flex-wrap: wrap;
        }
        .info-section {
          margin-bottom: 30px;
        }
        .info-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: bold;
          font-size: 1.2rem;
          color: var(--primary-color);
          margin-bottom: 10px;
        }
        .info-text {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #444;
        }
        @media (max-width: 768px) {
          .location-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

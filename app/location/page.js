import PageHeader from '@/components/PageHeader';
import { MapPin, Phone, Car, Bus, Copy, ExternalLink } from 'lucide-react';

export default function LocationPage() {
  const address = "서울특별시 OO구 OO동 123-45 (은혜샘교회)";
  
  return (
    <main>
      <PageHeader title="오시는 길" subtitle="은혜샘교회는 여러분을 기다리고 있습니다." />

      <section className="container section">
        <div className="location-grid">
          {/* Map Area */}
          <div className="map-area">
            <div className="map-placeholder">
              <MapPin size={48} color="var(--primary-color)" />
              <p>지도 로딩 중... (실제 구현 시 네이버/카카오 지도 API 연결)</p>
            </div>
            <div className="map-actions">
              <button className="btn btn-outline"><Copy size={20} /> 주소 복사</button>
              <button className="btn btn-primary"><ExternalLink size={20} /> 네이버 지도로 보기</button>
              <button className="btn btn-primary"><ExternalLink size={20} /> 카카오 맵으로 보기</button>
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
              <p className="info-text">02-123-4567</p>
              <a href="tel:02-123-4567" className="btn btn-secondary call-btn">전화 문의하기</a>
            </div>

            <div className="info-section">
              <div className="info-title"><Bus /> 대중교통</div>
              <ul className="info-list">
                <li><strong>지하철:</strong> 2호선 OO역 3번 출구 도보 5분</li>
                <li><strong>버스:</strong> 123, 456, 789번 '은혜샘교회' 정류장 하차</li>
              </ul>
            </div>

            <div className="info-section">
              <div className="info-title"><Car /> 주차 안내</div>
              <p className="info-text">교회 지하 주차장 및 제2주차장 이용 가능 (무료)</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

'use client';
import { useState } from 'react';
import { updateSettings } from '@/lib/actions';
import { Save, Smartphone, Monitor } from 'lucide-react';

export default function SettingsForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPreviewMobile, setIsPreviewMobile] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(settings);
      alert('설정이 저장되었습니다.');
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="settings-container">
      <div className="admin-header">
        <h1>기본 문구 및 정보 관리</h1>
        <div className="header-actions">
          <button 
            className={`btn-preview ${isPreviewMobile ? 'active' : ''}`}
            onClick={() => setIsPreviewMobile(!isPreviewMobile)}
          >
            {isPreviewMobile ? <Monitor size={20} /> : <Smartphone size={20} />}
            {isPreviewMobile ? 'PC 미리보기' : '모바일 미리보기'}
          </button>
          <button className="btn-primary" onClick={handleSubmit}><Save size={20} /> 전체 저장</button>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-form-area">
          <form onSubmit={handleSubmit} className="admin-card">
            <h2 className="card-title">메인 화면 문구</h2>
            <div className="form-section">
              <label>메인 환영 문구 (최대 24자)</label>
              <input 
                name="welcomeTitle" 
                value={settings.welcomeTitle} 
                onChange={handleChange}
                maxLength={24}
              />
              <p className="guide">홈페이지 최상단 큰 글씨로 노출됩니다.</p>
            </div>
            <div className="form-section">
              <label>메인 보조 문구 (최대 60자)</label>
              <textarea 
                name="welcomeSubtitle" 
                value={settings.welcomeSubtitle} 
                onChange={handleChange}
                maxLength={60}
                rows={3}
              />
              <p className="guide">문구가 필요 없으면 비워두세요.</p>
            </div>

            <h2 className="card-title" style={{ marginTop: '30px' }}>교회 기본 정보</h2>
            <div className="form-row">
              <div className="form-section">
                <label>담임목사 성함</label>
                <input name="pastor" value={settings.pastor} onChange={handleChange} placeholder="예: 홍길동 담임목사" />
              </div>
              <div className="form-section">
                <label>대표 전화번호</label>
                <input name="phone" value={settings.phone} onChange={handleChange} />
              </div>
            </div>
            <div className="form-section">
              <label>주소</label>
              <input name="address" value={settings.address} onChange={handleChange} />
            </div>

            <h2 className="card-title" style={{ marginTop: '30px' }}>온라인 사역 및 헌금</h2>
            <div className="form-section">
              <label>유튜브 채널 링크</label>
              <input name="youtubeLink" value={settings.youtubeLink} onChange={handleChange} />
            </div>
            <div className="form-section">
              <label>헌금 계좌 (은행명 계좌번호)</label>
              <input name="offeringAccount" value={settings.offeringAccount} onChange={handleChange} />
            </div>
            <div className="form-section">
              <label>헌금 송금 안내 문구</label>
              <input name="offeringInfo" value={settings.offeringInfo} onChange={handleChange} placeholder='예: 송금자 "이름헌금종류"' />
            </div>
          </form>
        </div>

        <div className="preview-area">
          <div className={`preview-frame ${isPreviewMobile ? 'mobile' : 'pc'}`}>
            <div className="preview-header">
              {isPreviewMobile ? '모바일 미리보기' : 'PC 미리보기'}
            </div>
            <div className="preview-content">
              <div className="mock-site">
                <div className="mock-hero">
                  <h1>{settings.welcomeTitle}</h1>
                  {settings.welcomeSubtitle && <p>{settings.welcomeSubtitle}</p>}
                </div>
                <div className="mock-info">
                  <p style={{ fontWeight: 'bold' }}>{settings.pastor}</p>
                  <p>📞 {settings.phone}</p>
                  <p>📍 {settings.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

'use client';
import { useState, useRef } from 'react';
import { updateSettings } from '@/lib/actions';
import { Save, Smartphone, Monitor, Plus, Trash2, Image as ImageIcon, ExternalLink, Palette, Clock, Bell } from 'lucide-react';

export default function SettingsForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPreviewMobile, setIsPreviewMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // basic, history, popup, theme
  const fileInputRef = useRef({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  // 연혁 관련 함수
  const handleHistoryChange = (index, field, value) => {
    const newHistory = [...settings.history];
    newHistory[index][field] = value;
    setSettings(prev => ({ ...prev, history: newHistory }));
  };

  const addHistory = () => {
    setSettings(prev => ({
      ...prev,
      history: [...prev.history, { year: new Date().getFullYear().toString(), month: '01', content: '' }]
    }));
  };

  const removeHistory = (index) => {
    const newHistory = settings.history.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, history: newHistory }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setSettings(prev => ({ ...prev, [fieldName]: data.url }));
        alert('이미지가 업로드되었습니다.');
      }
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      await updateSettings(settings);
      alert('모든 설정이 성공적으로 저장되었습니다.');
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="settings-container">
      <div className="admin-header">
        <div>
          <h1>사이트 디자인 및 정보 관리</h1>
          <p className="subtitle">교회 정보, 디자인 테마, 팝업 등을 통합 관리합니다.</p>
        </div>
        <div className="header-actions">
          <button 
            className={`btn-preview ${isPreviewMobile ? 'active' : ''}`}
            onClick={() => setIsPreviewMobile(!isPreviewMobile)}
          >
            {isPreviewMobile ? <Monitor size={20} /> : <Smartphone size={20} />}
            {isPreviewMobile ? 'PC 보기' : '모바일 보기'}
          </button>
          <button className="btn-primary" onClick={handleSubmit}><Save size={20} /> 전체 저장</button>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-form-area">
          {/* 탭 메뉴 */}
          <div className="admin-tabs">
            <button className={activeTab === 'basic' ? 'active' : ''} onClick={() => setActiveTab('basic')}>기본 정보 & 사진</button>
            <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>교회 연혁</button>
            <button className={activeTab === 'popup' ? 'active' : ''} onClick={() => setActiveTab('popup')}>팝업 포스터</button>
            <button className={activeTab === 'theme' ? 'active' : ''} onClick={() => setActiveTab('theme')}>디자인 테마</button>
          </div>

          <div className="admin-card">
            {activeTab === 'basic' && (
              <div className="tab-content">
                <h2 className="card-title">교회 프로필 및 사진</h2>
                
                <div className="image-upload-grid">
                  <div className="image-field">
                    <label>교회 로고 (상단 바)</label>
                    <div className="image-preview-sm">
                      {settings.logoImage ? <img src={settings.logoImage} alt="로고" /> : <div className="no-img"><ImageIcon size={24}/></div>}
                    </div>
                    <input type="file" onChange={(e) => handleImageUpload(e, 'logoImage')} style={{display: 'none'}} ref={el => fileInputRef.current.logo = el} />
                    <button className="btn-outline btn-sm" onClick={() => fileInputRef.current.logo.click()}>로고 변경</button>
                  </div>

                  <div className="image-field">
                    <label>목사님 프로필 사진</label>
                    <div className="image-preview-sm">
                      {settings.pastorImage ? <img src={settings.pastorImage} alt="목사님" /> : <div className="no-img"><ImageIcon size={24}/></div>}
                    </div>
                    <input type="file" onChange={(e) => handleImageUpload(e, 'pastorImage')} style={{display: 'none'}} ref={el => fileInputRef.current.pastor = el} />
                    <button className="btn-outline btn-sm" onClick={() => fileInputRef.current.pastor.click()}>사진 변경</button>
                  </div>

                  <div className="image-field">
                    <label>교회 전경 (메인 배경)</label>
                    <div className="image-preview-sm">
                      {settings.churchImage ? <img src={settings.churchImage} alt="전경" /> : <div className="no-img"><ImageIcon size={24}/></div>}
                    </div>
                    <input type="file" onChange={(e) => handleImageUpload(e, 'churchImage')} style={{display: 'none'}} ref={el => fileInputRef.current.church = el} />
                    <button className="btn-outline btn-sm" onClick={() => fileInputRef.current.church.click()}>배경 변경</button>
                  </div>
                </div>

                <hr className="divider" />

                <div className="form-section">
                  <label>메인 환영 문구</label>
                  <input name="welcomeTitle" value={settings.welcomeTitle} onChange={handleChange} />
                </div>
                <div className="form-section">
                  <label>메인 보조 문구</label>
                  <input name="welcomeSubtitle" value={settings.welcomeSubtitle} onChange={handleChange} />
                </div>
                <div className="form-row">
                  <div className="form-section">
                    <label>담임목사 성함</label>
                    <input name="pastor" value={settings.pastor} onChange={handleChange} />
                  </div>
                  <div className="form-section">
                    <label>대표 전화번호</label>
                    <input name="phone" value={settings.phone} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-section">
                  <label>교회 주소</label>
                  <input name="address" value={settings.address} onChange={handleChange} />
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="tab-content">
                <div className="flex-between">
                  <h2 className="card-title">교회 연혁 관리</h2>
                  <button className="btn-outline btn-sm" onClick={addHistory}><Plus size={16}/> 연혁 추가</button>
                </div>
                <p className="guide">교회의 주요 발자취를 시간 순서대로 기록하세요.</p>
                
                <div className="history-editor">
                  {settings.history.map((item, idx) => (
                    <div key={idx} className="history-row">
                      <input className="input-year" placeholder="년" value={item.year} onChange={(e) => handleHistoryChange(idx, 'year', e.target.value)} />
                      <input className="input-month" placeholder="월" value={item.month} onChange={(e) => handleHistoryChange(idx, 'month', e.target.value)} />
                      <input className="input-content" placeholder="내용을 입력하세요" value={item.content} onChange={(e) => handleHistoryChange(idx, 'content', e.target.value)} />
                      <button className="btn-icon danger" onClick={() => removeHistory(idx)}><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'popup' && (
              <div className="tab-content">
                <h2 className="card-title">팝업 포스터 관리</h2>
                <div className="form-section">
                  <label className="checkbox-label">
                    <input type="checkbox" name="popup.enabled" checked={settings.popup.enabled} onChange={handleChange} />
                    팝업 활성화 (체크 시 홈페이지 접속 시 노출)
                  </label>
                </div>
                
                <div className="form-section">
                  <label>포스터 이미지 업로드</label>
                  <div className="poster-upload-area">
                    {settings.popup.imageUrl ? (
                      <div className="poster-preview">
                        <img src={settings.popup.imageUrl} alt="팝업 포스터" />
                        <button className="btn-change-img" onClick={() => fileInputRef.current.popup.click()}>이미지 교체</button>
                      </div>
                    ) : (
                      <div className="upload-placeholder" onClick={() => fileInputRef.current.popup.click()}>
                        <Bell size={40} />
                        <p>팝업 포스터를 업로드하세요</p>
                      </div>
                    )}
                    <input type="file" onChange={(e) => handleImageUpload(e, 'popup.imageUrl')} style={{display: 'none'}} ref={el => fileInputRef.current.popup = el} />
                  </div>
                </div>

                <div className="form-section">
                  <label>클릭 시 이동할 링크 (선택사항)</label>
                  <input name="popup.linkUrl" value={settings.popup.linkUrl} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="tab-content">
                <h2 className="card-title">디자인 테마 설정</h2>
                <div className="form-row">
                  <div className="form-section">
                    <label>메인 브랜드 색상 (Primary)</label>
                    <div className="color-picker-wrap">
                      <input type="color" name="theme.primaryColor" value={settings.theme.primaryColor} onChange={handleChange} />
                      <input type="text" name="theme.primaryColor" value={settings.theme.primaryColor} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-section">
                    <label>강조 색상 (Secondary)</label>
                    <div className="color-picker-wrap">
                      <input type="color" name="theme.secondaryColor" value={settings.theme.secondaryColor} onChange={handleChange} />
                      <input type="text" name="theme.secondaryColor" value={settings.theme.secondaryColor} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <div className="theme-guide">
                  <p>💡 색상을 변경하면 홈페이지의 버튼, 헤더, 배경 등에 즉시 반영됩니다.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 실시간 미리보기 (Wix 스타일) */}
        <div className="preview-area">
          <div className={`preview-frame ${isPreviewMobile ? 'mobile' : 'pc'}`}>
            <div className="preview-header">실시간 디자인 미리보기</div>
            <div className="preview-content">
              <div className="mock-site">
                <header className="mock-nav" style={{backgroundColor: '#fff', borderBottom: `2px solid ${settings.theme.primaryColor}`}}>
                  {settings.logoImage ? <img src={settings.logoImage} className="mock-logo" /> : <span>{settings.welcomeTitle}</span>}
                </header>
                <div className="mock-hero" style={{
                  background: settings.churchImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${settings.churchImage}) center/cover` : settings.theme.primaryColor,
                  color: 'white'
                }}>
                  <h1>{settings.welcomeTitle}</h1>
                  <p>{settings.welcomeSubtitle}</p>
                  <button style={{backgroundColor: settings.theme.secondaryColor, border: 'none', padding: '10px 20px', borderRadius: '5px', color: 'white', fontWeight: 'bold', marginTop: '10px'}}>상세보기</button>
                </div>
                <div className="mock-section">
                  <div className="mock-pastor">
                    <div className="mock-avatar">
                      {settings.pastorImage ? <img src={settings.pastorImage} /> : <div className="no-avatar" />}
                    </div>
                    <div className="mock-msg">
                      <h4 style={{color: settings.theme.primaryColor}}>{settings.pastor}</h4>
                      <p>예수님의 사랑으로 여러분을 환영합니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-container { width: 100%; }
        .admin-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .admin-header h1 { margin: 0; font-size: 28px; color: #1b4d3e; }
        .subtitle { color: #666; margin-top: 5px; }
        .header-actions { display: flex; gap: 12px; }
        
        .admin-tabs { display: flex; gap: 5px; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 0; }
        .admin-tabs button { 
          padding: 12px 20px; background: none; border: none; font-size: 16px; font-weight: 600; color: #666; cursor: pointer;
          border-bottom: 3px solid transparent; transition: all 0.2s;
        }
        .admin-tabs button:hover { color: #1b4d3e; }
        .admin-tabs button.active { color: #1b4d3e; border-bottom-color: #1b4d3e; }

        .settings-layout { display: grid; grid-template-columns: 1fr 420px; gap: 30px; }
        .admin-card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .card-title { font-size: 20px; margin: 0 0 20px 0; color: #2c3e50; font-weight: 800; }
        
        .image-upload-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .image-field { text-align: center; }
        .image-field label { display: block; font-size: 14px; font-weight: 700; margin-bottom: 10px; color: #555; }
        .image-preview-sm { 
          width: 100%; aspect-ratio: 1; background: #f8f9fa; border-radius: 12px; margin-bottom: 10px; 
          border: 1px solid #eee; display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .image-preview-sm img { width: 100%; height: 100%; object-fit: cover; }
        .no-img { color: #ccc; }

        .form-section { margin-bottom: 20px; }
        .form-section label { display: block; font-weight: 700; margin-bottom: 8px; color: #34495e; font-size: 15px; }
        .form-section input, .form-section textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; font-family: inherit; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .divider { border: 0; border-top: 1px solid #f0f2f5; margin: 30px 0; }
        
        .history-editor { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
        .history-row { display: flex; gap: 10px; align-items: center; background: #f8f9fa; padding: 10px; border-radius: 8px; }
        .input-year { width: 80px !important; text-align: center; font-weight: bold; }
        .input-month { width: 60px !important; text-align: center; }
        .input-content { flex: 1 !important; }
        
        .poster-upload-area { margin-top: 10px; }
        .poster-preview { position: relative; border-radius: 12px; overflow: hidden; border: 1px solid #ddd; }
        .poster-preview img { width: 100%; display: block; }
        .btn-change-img { position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 15px; border-radius: 20px; border: none; cursor: pointer; }
        .upload-placeholder { 
          height: 200px; border: 2px dashed #ddd; border-radius: 12px; display: flex; flex-direction: column; 
          align-items: center; justify-content: center; color: #999; cursor: pointer; transition: 0.2s;
        }
        .upload-placeholder:hover { background: #f8f9fa; border-color: #1b4d3e; color: #1b4d3e; }
        
        .color-picker-wrap { display: flex; gap: 10px; align-items: center; }
        .color-picker-wrap input[type="color"] { width: 50px; height: 50px; padding: 0; border: none; cursor: pointer; background: none; }
        
        .preview-area { position: sticky; top: 20px; }
        .preview-frame { background: #333; border-radius: 25px; padding: 15px; border: 8px solid #444; transition: all 0.3s; overflow: hidden; }
        .preview-frame.mobile { width: 375px; height: 667px; margin: 0 auto; }
        .preview-frame.pc { width: 100%; height: 600px; border-radius: 12px; border-width: 4px; }
        .preview-header { color: #888; font-size: 12px; text-align: center; margin-bottom: 10px; font-weight: 700; }
        .preview-content { background: white; height: calc(100% - 25px); border-radius: 15px; overflow-y: auto; position: relative; }
        
        .mock-nav { padding: 10px 15px; display: flex; align-items: center; height: 40px; font-weight: bold; font-size: 14px; }
        .mock-logo { height: 24px; }
        .mock-hero { padding: 40px 20px; text-align: center; }
        .mock-hero h1 { font-size: 22px; margin-bottom: 10px; }
        .mock-hero p { font-size: 14px; opacity: 0.9; }
        .mock-section { padding: 20px; }
        .mock-pastor { display: flex; gap: 15px; align-items: center; background: #f8f9fa; padding: 15px; border-radius: 10px; }
        .mock-avatar { width: 50px; height: 50px; border-radius: 50%; background: #eee; overflow: hidden; }
        .mock-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .mock-msg h4 { margin: 0 0 5px 0; font-size: 15px; }
        .mock-msg p { margin: 0; font-size: 13px; color: #666; }
        
        .checkbox-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .checkbox-label input { width: 20px !important; height: 20px !important; }
        
        @media (max-width: 1200px) {
          .settings-layout { grid-template-columns: 1fr; }
          .preview-area { display: none; }
        }
      `}</style>
    </div>
  );
}

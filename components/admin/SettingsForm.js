'use client';
import { useState, useRef } from 'react';
import { updateSettings } from '@/lib/actions';
import { Save, Smartphone, Monitor, Plus, Trash2, Image as ImageIcon, ExternalLink, Palette, Clock, Bell, MapPin, Phone, User, Users, Layout, Globe, Calendar, Mail } from 'lucide-react';

export default function SettingsForm({ initialSettings }) {
export default function SettingsForm({ initialSettings }) {
  const [settings, setSettings] = useState({
    churchName: initialSettings?.churchName || '성령교회',
    denomination: initialSettings?.denomination || '기독교대한성결교회',
    footerSlogan: initialSettings?.footerSlogan || '',
    email: initialSettings?.email || '',
    phone: initialSettings?.phone || '031-766-8847',
    address: initialSettings?.address || '경기도 광주시 퇴촌면 광동로52번길 27',
    copyrightYear: initialSettings?.copyrightYear || '2026',
    welcomeBadge: initialSettings?.welcomeBadge || '성령교회에 오신 것을 환영합니다',
    pastorTitle: initialSettings?.pastorTitle || '예수님의 사랑으로 여러분을 환영합니다',
    pastorGreeting: initialSettings?.pastorGreeting || '',
    visions: initialSettings?.visions || [
      { title: "말씀 중심", content: "", icon: "BookOpen" },
      { title: "사랑의 교제", content: "", icon: "Heart" },
      { title: "다음 세대", content: "", icon: "Users" },
      { title: "지역 섬김", content: "", icon: "Cross" }
    ],
    offering: {
      bank: initialSettings?.offering?.bank || "농협",
      account: initialSettings?.offering?.account || "351-1188-7505-13",
      holder: initialSettings?.offering?.holder || "성령교회",
      info: initialSettings?.offering?.info || "교회 통장으로 직접 송금하실 수 있습니다.",
      types: initialSettings?.offering?.types || "십일조 / 감사헌금 / 주일헌금 / 선교헌금 / 건축헌금 등"
    },
    location: {
      guide: initialSettings?.location?.guide || "교회 내 주차장이 마련되어 있습니다. 광동 사거리에서 퇴촌면사무소 방면으로 오시면 됩니다."
    },
    theme: {
      primaryColor: initialSettings?.theme?.primaryColor || "#1b4d3e",
      secondaryColor: initialSettings?.theme?.secondaryColor || "#c9a55c"
    },
    churchImage: initialSettings?.churchImage || "",
    logoImage: initialSettings?.logoImage || "",
    history: initialSettings?.history || []
  });
  const [isPreviewMobile, setIsPreviewMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // basic, intro, support, theme
  const fileInputRef = useRef({});

  const handleVisionChange = (index, field, value) => {
    const newVisions = [...settings.visions];
    newVisions[index][field] = value;
    setSettings(prev => ({ ...prev, visions: newVisions }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        const [parent, child] = parts;
        setSettings(prev => ({
          ...prev,
          [parent]: { ...prev[parent], [child]: type === 'checkbox' ? checked : value }
        }));
      }
    } else {
      setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleHistoryChange = (index, field, value) => {
    const newHistory = [...settings.history];
    newHistory[index][field] = value;
    setSettings(prev => ({ ...prev, history: newHistory }));
  };

  const addHistory = () => {
    setSettings(prev => ({
      ...prev,
      history: [{ year: new Date().getFullYear().toString(), month: '01', content: '' }, ...prev.history]
    }));
  };

  const removeHistory = (index) => {
    const newHistory = settings.history.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, history: newHistory }));
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success && data.url) {
        const updatedSettings = await new Promise((resolve) => {
          setSettings(prev => {
            let newSettings;
            if (fieldName.includes('.')) {
              const [parent, child] = fieldName.split('.');
              newSettings = {
                ...prev,
                [parent]: { ...prev[parent], [child]: data.url }
              };
            } else {
              newSettings = { ...prev, [fieldName]: data.url };
            }
            resolve(newSettings);
            return newSettings;
          });
        });
        
        await updateSettings(updatedSettings);
        alert('이미지가 성공적으로 업로드되고 저장되었습니다.');
      } else {
        alert('업로드 실패: ' + (data.message || '알 수 없는 오류'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await updateSettings(settings);
      alert('모든 설정이 성공적으로 저장되었습니다.');
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className="settings-premium">
      {loading && <div className="loading-overlay">저장 중...</div>}
      <div className="admin-header">
        <div className="header-info">
          <h1>사이트 환경 설정</h1>
          <p className="subtitle">교회의 기본 정보와 디자인 테마를 통합 관리합니다.</p>
        </div>
        <div className="header-actions">
          <button 
            className={`btn-preview ${isPreviewMobile ? 'active' : ''}`}
            onClick={() => setIsPreviewMobile(!isPreviewMobile)}
          >
            {isPreviewMobile ? <Monitor size={18} /> : <Smartphone size={18} />}
            {isPreviewMobile ? '데스크탑 모드' : '모바일 모드'}
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            <Save size={20} /> 모든 설정 저장
          </button>
        </div>
      </div>

      <div className="settings-layout">
        <div className="form-column">
          <div className="tab-navigation">
            <button className={activeTab === 'basic' ? 'active' : ''} onClick={() => setActiveTab('basic')}>
              <Layout size={18} /> 기본 정보
            </button>
            <button className={activeTab === 'intro' ? 'active' : ''} onClick={() => setActiveTab('intro')}>
              <Users size={18} /> 교회 소개
            </button>
            <button className={activeTab === 'support' ? 'active' : ''} onClick={() => setActiveTab('support')}>
              <Heart size={18} /> 운영 정보
            </button>
            <button className={activeTab === 'theme' ? 'active' : ''} onClick={() => setActiveTab('theme')}>
              <Palette size={18} /> 테마 & 디자인
            </button>
          </div>

          <div className="admin-card main-form-card">
            {activeTab === 'basic' && (
              <div className="tab-pane">
                <div className="form-section-group">
                  <h2 className="section-title">이미지 자산 관리</h2>
                  <p className="section-desc">로고와 교회 이미지를 업로드하세요. 변경 시 즉시 저장됩니다.</p>
                  <div className="image-field-grid">
                    <div className="image-upload-card">
                      <label>교회 로고 (상단)</label>
                      <div className="preview-box">
                        {settings.logoImage ? <img src={settings.logoImage} /> : <ImageIcon size={32} color="#ddd" />}
                      </div>
                      <button className="btn-upload-sm" onClick={() => fileInputRef.current.logo.click()}>변경하기</button>
                      <input type="file" ref={el => fileInputRef.current.logo = el} onChange={e => handleImageUpload(e, 'logoImage')} hidden />
                    </div>
                    <div className="image-upload-card">
                      <label>담임목사 프로필</label>
                      <div className="preview-box circle">
                        {settings.pastorImage ? <img src={settings.pastorImage} /> : <User size={32} color="#ddd" />}
                      </div>
                      <button className="btn-upload-sm" onClick={() => fileInputRef.current.pastor.click()}>변경하기</button>
                      <input type="file" ref={el => fileInputRef.current.pastor = el} onChange={e => handleImageUpload(e, 'pastorImage')} hidden />
                    </div>
                    <div className="image-upload-card">
                      <label>홈페이지 메인 배경</label>
                      <div className="preview-box">
                        {settings.churchImage ? <img src={settings.churchImage} /> : <ImageIcon size={32} color="#ddd" />}
                      </div>
                      <button className="btn-upload-sm" onClick={() => fileInputRef.current.church.click()}>변경하기</button>
                      <input type="file" ref={el => fileInputRef.current.church = el} onChange={e => handleImageUpload(e, 'churchImage')} hidden />
                    </div>
                  </div>
                </div>

                <div className="form-section-group">
                  <h2 className="section-title">교회 기본 정보</h2>
                  <div className="input-group-row">
                    <div className="input-field">
                      <label>교회 명칭</label>
                      <input name="churchName" value={settings.churchName} onChange={handleChange} placeholder="예: 성령교회" />
                    </div>
                    <div className="input-field">
                      <label>소속 교단명</label>
                      <input name="denomination" value={settings.denomination} onChange={handleChange} placeholder="예: 기독교대한성결교회" />
                    </div>
                  </div>
                  <div className="input-field">
                    <label>홈페이지 상단 배지 (Badge)</label>
                    <input name="welcomeBadge" value={settings.welcomeBadge} onChange={handleChange} placeholder="예: 성령교회에 오신 것을 환영합니다" />
                  </div>
                  <div className="input-field">
                    <label>홈페이지 대제목 (H1)</label>
                    <input name="welcomeTitle" value={settings.welcomeTitle} onChange={handleChange} placeholder="예: 하나님의 사랑이 가득한 성령교회" />
                  </div>
                  <div className="input-field">
                    <label>홈페이지 소제목 (Subtitle)</label>
                    <input name="welcomeSubtitle" value={settings.welcomeSubtitle} onChange={handleChange} placeholder="교회의 슬로건이나 비전을 입력하세요" />
                  </div>
                  <div className="input-field">
                    <label>푸터(하단) 슬로건</label>
                    <textarea 
                      name="footerSlogan" 
                      value={settings.footerSlogan} 
                      onChange={handleChange} 
                      rows={2}
                      placeholder="교회 하단에 표시될 짧은 소개 문구를 입력하세요."
                    />
                  </div>
                </div>

                <div className="form-section-group">
                  <h2 className="section-title">연락처 및 위치</h2>
                  <div className="input-group-row">
                    <div className="input-field">
                      <label><User size={16} /> 담임목사 성함</label>
                      <input name="pastor" value={settings.pastor} onChange={handleChange} />
                    </div>
                    <div className="input-field">
                      <label><Phone size={16} /> 교회 대표번호</label>
                      <input name="phone" value={settings.phone} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="input-field">
                    <label><MapPin size={16} /> 교회 주소</label>
                    <input name="address" value={settings.address} onChange={handleChange} />
                  </div>
                  <div className="input-group-row">
                    <div className="input-field">
                      <label><Mail size={16} /> 교회 이메일</label>
                      <input name="email" value={settings.email} onChange={handleChange} placeholder="예: church@example.com" />
                    </div>
                    <div className="input-field">
                      <label><Calendar size={16} /> 하단 저작권 연도</label>
                      <input name="copyrightYear" value={settings.copyrightYear} onChange={handleChange} placeholder="예: 2026" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'intro' && (
              <div className="tab-pane">
                <div className="form-section-group">
                  <h2 className="section-title">목사님 인사말 설정</h2>
                  <div className="input-field">
                    <label><User size={16} /> 인사말 제목</label>
                    <input 
                      name="pastorTitle" 
                      value={settings.pastorTitle} 
                      onChange={handleChange} 
                      placeholder='예: "예수님의 사랑으로 여러분을 환영합니다"'
                    />
                  </div>
                  <div className="input-field">
                    <label><Mail size={16} /> 인사말 본문</label>
                    <textarea 
                      name="pastorGreeting" 
                      value={settings.pastorGreeting} 
                      onChange={handleChange} 
                      rows={12}
                      style={{ fontSize: '1.1rem', lineHeight: '1.7', padding: '20px' }}
                      placeholder="성도님들께 전할 인사말 내용을 입력하세요. (고령의 성도님들을 위해 문장을 짧고 명확하게 쓰는 것이 좋습니다.)"
                      className="form-textarea"
                    />
                  </div>
                </div>

                <div className="form-section-group" style={{marginTop: '40px'}}>
                  <h2 className="section-title">교회 핵심 가치 (4가지 비전)</h2>
                  <p className="section-desc">교회가 지향하는 핵심 가치들을 수정할 수 있습니다.</p>
                  <div className="vision-edit-grid">
                    {settings.visions.map((vision, idx) => (
                      <div key={idx} className="vision-edit-card" style={{ padding: '25px', borderRadius: '20px' }}>
                        <div className="vision-card-header" style={{ marginBottom: '20px' }}>
                          <span className="vision-number" style={{ background: '#1b4d3e', color: 'white', padding: '5px 12px', borderRadius: '8px', fontSize: '0.9rem' }}>비전 0{idx + 1}</span>
                          <input 
                            value={vision.title} 
                            onChange={e => handleVisionChange(idx, 'title', e.target.value)} 
                            placeholder="가치 제목 (예: 말씀 중심)"
                            style={{ fontWeight: '800', fontSize: '1.2rem', border: 'none', borderBottom: '2px solid #eee', flex: 1, padding: '5px 10px' }}
                          />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px' }}>아이콘 선택</label>
                          <select 
                            value={vision.icon} 
                            onChange={e => handleVisionChange(idx, 'icon', e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                          >
                            <option value="Anchor">닻 (기둥)</option>
                            <option value="Heart">하트 (사랑)</option>
                            <option value="Users">사람들 (공동체)</option>
                            <option value="ShieldCheck">방패 (믿음)</option>
                            <option value="Cross">십자가 (복음)</option>
                            <option value="Star">별 (비전)</option>
                            <option value="Home">집 (쉼터)</option>
                            <option value="Globe">지구 (선교)</option>
                            <option value="Sparkles">반짝임 (은혜)</option>
                            <option value="BookOpen">성경 (말씀)</option>
                          </select>
                        </div>
                        <textarea 
                          value={vision.content} 
                          onChange={e => handleVisionChange(idx, 'content', e.target.value)} 
                          placeholder="가치 설명 (한 줄 내외로 작성하세요)"
                          rows={3}
                          style={{ fontSize: '1.05rem', padding: '12px' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-section-group" style={{marginTop: '40px'}}>
                  <div className="section-header">
                    <h2 className="section-title">교회 연혁 내역</h2>
                    <button className="btn-add-history" onClick={addHistory}><Plus size={18}/> 새 기록 추가</button>
                  </div>
                  <div className="history-list">
                    {settings.history.map((item, idx) => (
                      <div key={idx} className="history-item-row">
                        <div className="date-inputs">
                          <input className="year" value={item.year} onChange={e => handleHistoryChange(idx, 'year', e.target.value)} placeholder="YYYY" />
                          <span className="sep">.</span>
                          <input className="month" value={item.month} onChange={e => handleHistoryChange(idx, 'month', e.target.value)} placeholder="MM" />
                        </div>
                        <input className="content" value={item.content} onChange={e => handleHistoryChange(idx, 'content', e.target.value)} placeholder="내용을 입력하세요" />
                        <button className="btn-del" onClick={() => removeHistory(idx)}><Trash2 size={18}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="tab-pane">
                <div className="form-section-group">
                  <h2 className="section-title">헌금 및 후원 계좌 설정</h2>
                  <p className="section-desc">성도님들께 안내될 헌금 계좌 정보를 관리합니다.</p>
                  <div className="input-group-row">
                    <div className="input-field">
                      <label>은행명</label>
                      <input name="offering.bank" value={settings.offering.bank} onChange={handleChange} placeholder="예: 농협" />
                    </div>
                    <div className="input-field">
                      <label>예금주</label>
                      <input name="offering.holder" value={settings.offering.holder} onChange={handleChange} placeholder="예: 성령교회" />
                    </div>
                  </div>
                  <div className="input-field">
                    <label>계좌번호</label>
                    <input name="offering.account" value={settings.offering.account} onChange={handleChange} placeholder="예: 351-1188-7505-13" />
                  </div>
                  <div className="input-field">
                    <label>송금 안내 문구</label>
                    <input name="offering.info" value={settings.offering.info} onChange={handleChange} placeholder="예: 교회 통장으로 직접 송금하실 수 있습니다." />
                  </div>
                  <div className="input-field">
                    <label>헌금 종류 안내 (상세)</label>
                    <textarea 
                      name="offering.types" 
                      value={settings.offering.types} 
                      onChange={handleChange} 
                      rows={3}
                      placeholder="예: 십일조 / 감사헌금 / 주일헌금 / 선교헌금 / 건축헌금 등"
                    />
                  </div>
                </div>

                <div className="form-section-group" style={{marginTop: '40px'}}>
                  <h2 className="section-title">교통 및 주차 안내</h2>
                  <p className="section-desc">오시는 길 페이지 하단에 표시될 안내 문구입니다.</p>
                  <div className="input-field">
                    <label>주차/교통 상세 안내</label>
                    <textarea 
                      name="location.guide" 
                      value={settings.location.guide} 
                      onChange={handleChange} 
                      rows={4}
                      placeholder="주차장 위치나 대중교통 이용 방법을 상세히 적어주세요."
                    />
                  </div>
                </div>

                <div className="form-section-group" style={{marginTop: '40px'}}>
                  <h2 className="section-title">온라인 채널 링크</h2>
                  <div className="input-field">
                    <label><Globe size={16} /> 유튜브 채널 URL</label>
                    <input name="youtubeLink" value={settings.youtubeLink} onChange={handleChange} placeholder="https://youtube.com/..." />
                  </div>
                  <div className="input-field">
                    <label><Mail size={16} /> 카카오톡 채널 URL</label>
                    <input name="kakaoLink" value={settings.kakaoLink} onChange={handleChange} placeholder="https://pf.kakao.com/..." />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="tab-pane">
                <h2 className="section-title">브랜드 테마 컬러</h2>
                <div className="theme-config-row">
                  <div className="color-config-card">
                    <label>메인 색상 (Primary)</label>
                    <div className="color-control">
                      <input type="color" name="theme.primaryColor" value={settings.theme.primaryColor} onChange={handleChange} />
                      <input type="text" value={settings.theme.primaryColor} onChange={handleChange} name="theme.primaryColor" />
                    </div>
                    <p className="help-text">헤더, 버튼, 강조 텍스트에 사용됩니다.</p>
                  </div>
                  <div className="color-config-card">
                    <label>포인트 색상 (Secondary)</label>
                    <div className="color-control">
                      <input type="color" name="theme.secondaryColor" value={settings.theme.secondaryColor} onChange={handleChange} />
                      <input type="text" value={settings.theme.secondaryColor} onChange={handleChange} name="theme.secondaryColor" />
                    </div>
                    <p className="help-text">알림, 배지, 특수 버튼에 사용됩니다.</p>
                  </div>
                </div>
                
                <div className="theme-tip">
                  <Globe size={20} />
                  <p>색상을 변경하면 홈페이지 전체에 즉시 반영됩니다. 교회의 상징색을 선택해 보세요.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="preview-column">
          <div className={`mockup-container ${isPreviewMobile ? 'mobile' : 'desktop'}`}>
            <div className="mockup-header">
              <div className="dots"><span></span><span></span><span></span></div>
              <div className="address-bar">https://sh-church.org</div>
            </div>
            <div className="mockup-viewport">
              <div className="live-site-preview">
                <nav className="nav-mock" style={{ borderBottom: `3px solid ${settings.theme.primaryColor}` }}>
                  {settings.logoImage ? <img src={settings.logoImage} height="20" /> : <span style={{fontWeight:900, color: settings.theme.primaryColor}}>{settings.welcomeTitle?.substring(0,6)}</span>}
                  <div className="menu-dots"><span></span><span></span><span></span></div>
                </nav>
                <div className="hero-mock" style={{ 
                  background: settings.churchImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${settings.churchImage}) center/cover` : settings.theme.primaryColor,
                  color: 'white'
                }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '50px',
                    background: 'rgba(255,255,255,0.15)',
                    fontSize: '0.65rem',
                    marginBottom: '10px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    {settings.welcomeBadge || '성령교회에 오신 것을 환영합니다'}
                  </div>
                  <h1 style={{fontSize: isPreviewMobile ? '1.2rem' : '1.8rem'}}>{settings.welcomeTitle || '성령교회에 오신 것을 환영합니다'}</h1>
                  <p style={{fontSize: isPreviewMobile ? '0.8rem' : '1rem', opacity: 0.8}}>{settings.welcomeSubtitle}</p>
                  <button style={{ background: settings.theme.secondaryColor, border:'none', color:'white', padding: '8px 16px', borderRadius: '4px', marginTop:'10px', fontWeight:700 }}>자세히 보기</button>
                </div>
                <div className="content-mock">
                  <div className="pastor-card-mock">
                    <div className="avatar-mock" style={{ background: '#eee', borderRadius: '50%', overflow:'hidden' }}>
                      {settings.pastorImage && <img src={settings.pastorImage} style={{width:'100%', height:'100%', objectFit:'cover'}} />}
                    </div>
                    <div className="msg-mock">
                      <div className="name" style={{ color: settings.theme.primaryColor, fontWeight: 800 }}>{settings.pastor} 목사</div>
                      <div className="text" style={{ fontSize: '0.8rem', color: '#666' }}>예수님의 사랑으로 축복합니다.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="preview-label">실시간 웹사이트 미리보기</div>
        </div>
      </div>

      <style jsx>{`
        .settings-premium { max-width: 1300px; margin: 0 auto; }
        .admin-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 35px; }
        .header-info h1 { margin: 0; font-size: 2.2rem; fontWeight: 900; color: #1b4d3e; letter-spacing: -0.02em; }
        .subtitle { color: #64748b; margin-top: 8px; font-size: 1.1rem; }
        
        .header-actions { display: flex; gap: 15px; }
        .btn-preview { 
          display: flex; align-items: center; gap: 8px; background: white; border: 1px solid #e2e8f0; 
          padding: 12px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; color: #64748b;
          transition: all 0.2s;
        }
        .btn-preview.active { background: #f1f5f9; color: #1b4d3e; border-color: #1b4d3e; }
        .btn-primary { 
          background: #1b4d3e; color: white; padding: 12px 28px; border-radius: 12px; 
          font-weight: 800; border: none; cursor: pointer; display: flex; align-items: center; gap: 10px;
          box-shadow: 0 10px 20px rgba(27,77,62,0.15); transition: all 0.2s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(27,77,62,0.25); }

        .settings-layout { display: grid; grid-template-columns: 1fr 450px; gap: 40px; align-items: start; }
        
        .tab-navigation { display: flex; gap: 8px; margin-bottom: 15px; }
        .tab-navigation button { 
          padding: 12px 24px; background: white; border: 1px solid #e2e8f0; border-radius: 12px;
          font-weight: 700; cursor: pointer; color: #94a3b8; display: flex; align-items: center; gap: 8px;
          transition: all 0.2s;
        }
        .tab-navigation button.active { background: #1b4d3e; color: white; border-color: #1b4d3e; }
        
        .main-form-card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; }
        .section-title { font-size: 1.4rem; font-weight: 800; color: #1e293b; margin-bottom: 30px; border-left: 5px solid #1b4d3e; padding-left: 15px; }
        
        .image-field-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
        .image-upload-card { text-align: center; background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #f1f5f9; }
        .image-upload-card label { display: block; font-weight: 800; color: #475569; margin-bottom: 15px; font-size: 0.95rem; }
        .preview-box { width: 100%; aspect-ratio: 1; background: white; border-radius: 12px; border: 1px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 15px; }
        .preview-box.circle { border-radius: 50%; }
        .preview-box img { width: 100%; height: 100%; object-fit: cover; }
        .btn-upload-sm { background: white; border: 1px solid #e2e8f0; padding: 6px 12px; borderRadius: 8px; font-weight: 700; cursor: pointer; font-size: 0.85rem; color: #64748b; }
        .btn-upload-sm:hover { color: #1b4d3e; border-color: #1b4d3e; }

        .input-field { margin-bottom: 24px; }
        .input-field label { display: flex; align-items: center; gap: 6px; font-weight: 700; color: #475569; margin-bottom: 10px; font-size: 1rem; }
        .input-field input { width: 100%; padding: 14px 18px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 1.05rem; transition: all 0.2s; }
        .input-field input:focus { border-color: #1b4d3e; outline: none; box-shadow: 0 0 0 4px rgba(27,77,62,0.05); }
        .input-group-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        .history-item-row { display: flex; gap: 15px; align-items: center; background: #f8fafc; padding: 15px; border-radius: 16px; margin-bottom: 12px; border: 1px solid #f1f5f9; }
        .date-inputs { display: flex; align-items: center; background: white; padding: 8px 12px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .date-inputs input { border: none; font-weight: 800; text-align: center; width: 50px; font-size: 1rem; }
        .date-inputs input:focus { outline: none; color: #1b4d3e; }
        .date-inputs .month { width: 30px; }
        .date-inputs .sep { color: #cbd5e1; margin: 0 4px; }
        .history-item-row .content { flex: 1; border: none; background: transparent; font-size: 1.05rem; font-weight: 500; }
        .btn-del { color: #94a3b8; background: none; border: none; cursor: pointer; }
        .btn-del:hover { color: #ef4444; }
        .btn-add-history { background: #f1f5f9; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; color: #475569; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .btn-add-history:hover { background: #e2e8f0; color: #1b4d3e; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }

        .theme-config-row { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        .color-config-card { background: #f8fafc; padding: 25px; border-radius: 20px; border: 1px solid #f1f5f9; }
        .color-config-card label { display: block; font-weight: 800; color: #1e293b; margin-bottom: 15px; }
        .color-control { display: flex; gap: 12px; align-items: center; }
        .color-control input[type="color"] { width: 60px; height: 60px; border-radius: 12px; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer; background: none; padding: 0; }
        .color-control input[type="text"] { flex: 1; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; font-family: monospace; font-weight: 700; text-transform: uppercase; }
        .help-text { font-size: 0.85rem; color: #94a3b8; margin-top: 12px; }
        .theme-tip { margin-top: 30px; padding: 20px; background: #f0f7f4; border-radius: 16px; display: flex; gap: 15px; align-items: center; color: #1b4d3e; font-weight: 600; }

        .mockup-container { background: #1e293b; padding: 12px; border-radius: 30px; box-shadow: 0 30px 60px rgba(0,0,0,0.2); position: sticky; top: 30px; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .mockup-container.mobile { width: 320px; height: 640px; margin: 0 auto; }
        .mockup-container.desktop { width: 100%; height: 500px; }
        .mockup-header { padding: 10px 15px; display: flex; align-items: center; gap: 15px; }
        .dots { display: flex; gap: 5px; }
        .dots span { width: 8px; height: 8px; background: #334155; borderRadius: 50%; }
        .address-bar { flex: 1; background: #334155; padding: 6px 15px; border-radius: 8px; color: #94a3b8; font-size: 0.75rem; text-align: center; font-family: monospace; }
        .mockup-viewport { background: white; border-radius: 18px; height: calc(100% - 45px); overflow-y: auto; overflow-x: hidden; }
        .preview-label { text-align: center; color: #94a3b8; font-weight: 700; margin-top: 20px; font-size: 0.9rem; }
        
        .nav-mock { padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; }
        .menu-dots { display: flex; gap: 3px; }
        .menu-dots span { width: 4px; height: 4px; background: #ddd; border-radius: 50%; }
        .hero-mock { padding: 40px 20px; text-align: center; }
        .content-mock { padding: 20px; }
        .pastor-card-mock { display: flex; gap: 12px; align-items: center; background: #f8fafc; padding: 12px; border-radius: 12px; }
        .avatar-mock { width: 45px; height: 45px; flex-shrink: 0; }
        
        .loading-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(255,255,255,0.7); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; font-size: 1.5rem; font-weight: 900; color: #1b4d3e;
        }
        .form-section-group { margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #f1f5f9; }
        .form-section-group:last-child { border-bottom: none; }
        .section-desc { color: #64748b; margin-top: -20px; margin-bottom: 25px; font-size: 0.95rem; }

        @media (max-width: 1200px) {
          .settings-layout { grid-template-columns: 1fr; }
          .preview-column { display: none; }
        }
      `}</style>
    </div>
  );
}

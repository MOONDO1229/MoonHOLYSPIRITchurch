'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNotice } from '@/lib/actions';
import { Save, Eye, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewNoticePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    category: '공지',
    content: '',
    image: '',
    showOnMain: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNotice(formData);
      alert('공지사항이 등록되었습니다.');
      router.push('/admin/notices');
    } catch (err) {
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="admin-form-page">
      <div className="form-header">
        <div className="header-left">
          <Link href="/admin/notices" className="btn-back"><ChevronLeft /> 목록으로</Link>
          <h1>공지사항 등록</h1>
        </div>
        <div className="form-actions">
          <button type="button" className="btn-preview"><Eye /> 미리보기</button>
          <button type="submit" form="notice-form" className="btn-save"><Save /> 저장하기</button>
        </div>
      </div>

      <form id="notice-form" onSubmit={handleSubmit} className="form-content">
        <div className="form-section">
          <label className="field-label">제목 <span className="required">*</span></label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="공지사항 제목을 입력하세요 (최대 40자)" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            required
          />
          <p className="field-guide">어르신들이 읽기 쉽게 명확한 단어를 사용하세요.</p>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label className="field-label">카테고리</label>
            <select 
              className="form-select"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option>공지</option>
              <option>행사</option>
              <option>모집</option>
              <option>교우소식</option>
            </select>
          </div>
          <div className="form-section">
            <label className="field-label">메인 노출 여부</label>
            <div className="toggle-wrap">
              <input 
                type="checkbox" 
                id="showOnMain" 
                checked={formData.showOnMain}
                onChange={e => setFormData({...formData, showOnMain: e.target.checked})}
              />
              <label htmlFor="showOnMain">홈페이지 메인에 노출함</label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <label className="field-label">본문 내용</label>
          <textarea 
            className="form-textarea" 
            rows="10" 
            placeholder="공지할 내용을 자세히 입력하세요."
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
          ></textarea>
        </div>

        <div className="form-section">
          <label className="field-label">이미지 URL</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="이미지 주소를 입력하세요" 
            value={formData.image}
            onChange={e => setFormData({...formData, image: e.target.value})}
          />
        </div>
      </form>

      <style jsx>{`
        .admin-form-page { max-width: 900px; margin: 0 auto; }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .header-left { display: flex; align-items: center; gap: 20px; }
        .btn-back { display: flex; align-items: center; gap: 4px; color: #7f8c8d; font-weight: 600; text-decoration: none; }
        .form-actions { display: flex; gap: 12px; }
        .form-actions button { display: flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .btn-preview { background: white; border: 1px solid #ddd; }
        .btn-save { background: #1b4d3e; color: white; border: none; }

        .form-content { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .form-section { margin-bottom: 24px; }
        .field-label { display: block; font-weight: 700; margin-bottom: 8px; font-size: 18px; color: #2c3e50; }
        .required { color: #e74c3c; }
        .form-input, .form-select, .form-textarea { 
          width: 100%; padding: 14px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; font-family: inherit;
        }
        .field-guide { font-size: 14px; color: #7f8c8d; margin-top: 6px; }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .toggle-wrap { display: flex; align-items: center; gap: 10px; font-weight: 600; padding: 12px 0; }
        .toggle-wrap input { width: 24px; height: 24px; }
      `}</style>
    </div>
  );
}

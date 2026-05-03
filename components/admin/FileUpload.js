'use client';
import { useState } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function FileUpload({ onUploadComplete, label, accept = "image/*", maxSize = 5 }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validation
    const sizeInMB = selectedFile.size / (1024 * 1024);
    if (sizeInMB > maxSize) {
      setError(`파일 크기가 너무 큽니다 (최대 ${maxSize}MB)`);
      return;
    }

    setFile(selectedFile);
    setError('');
    setSuccess(false);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        onUploadComplete(data.url);
      } else {
        setError(data.message || '업로드 실패');
      }
    } catch (err) {
      setError('업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setSuccess(false);
    setError('');
    onUploadComplete('');
  };

  return (
    <div className="file-upload-container">
      {label && <label className="upload-label">{label}</label>}
      
      {!file ? (
        <div className="upload-dropzone">
          <input 
            type="file" 
            accept={accept} 
            onChange={handleFileChange} 
            id={`file-input-${label?.replace(/\s/g, '')}`}
          />
          <label htmlFor={`file-input-${label?.replace(/\s/g, '')}`} className="dropzone-inner">
            <Upload size={32} />
            <span>{loading ? '업로드 중...' : '클릭하거나 파일을 드래그하세요'}</span>
            <span className="small-text">{accept.includes('pdf') ? 'PDF 파일' : '이미지 파일'} (최대 {maxSize}MB)</span>
          </label>
        </div>
      ) : (
        <div className={`upload-status ${success ? 'success' : error ? 'error' : ''}`}>
          <div className="status-info">
            {success ? <CheckCircle className="icon-success" /> : error ? <AlertCircle className="icon-error" /> : <File />}
            <span className="filename">{file.name}</span>
          </div>
          <button type="button" onClick={removeFile} className="btn-remove">
            <X size={20} />
          </button>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      <style jsx>{`
        .file-upload-container { margin-bottom: 20px; }
        .upload-label { display: block; font-weight: 700; margin-bottom: 8px; color: #34495e; font-size: 16px; }
        
        .upload-dropzone {
          border: 2px dashed #ddd;
          border-radius: 12px;
          transition: all 0.3s;
          background: #f8f9fa;
        }
        .upload-dropzone:hover { border-color: #1b4d3e; background: #f0f7f4; }
        .upload-dropzone input { display: none; }
        
        .dropzone-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px;
          cursor: pointer;
          color: #7f8c8d;
        }
        .dropzone-inner span { font-weight: 700; margin-top: 10px; font-size: 16px; }
        .small-text { font-size: 13px !important; font-weight: 400 !important; margin-top: 4px !important; }

        .upload-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          background: #fff;
          border: 2px solid #eee;
          border-radius: 12px;
        }
        .upload-status.success { border-color: #27ae60; background: #f1f9f5; }
        .upload-status.error { border-color: #e74c3c; background: #fdf2f2; }
        
        .status-info { display: flex; align-items: center; gap: 12px; font-weight: 700; color: #2c3e50; }
        .filename { max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .icon-success { color: #27ae60; }
        .icon-error { color: #e74c3c; }

        .btn-remove { background: none; border: none; cursor: pointer; color: #95a5a6; }
        .btn-remove:hover { color: #e74c3c; }
        
        .error-text { color: #e74c3c; font-size: 14px; font-weight: 700; margin-top: 8px; }
      `}</style>
    </div>
  );
}

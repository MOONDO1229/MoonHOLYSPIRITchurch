'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Camera,
  CheckCircle,
  Edit2,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import {
  createAlbumPost,
  deleteAlbumPost,
  deleteAlbumStorageFiles,
  updateAlbumPost,
} from '@/lib/actions';
import { createAlbumImageVariants, formatBytes, isSupportedImage } from '@/lib/imageCompression';

const CATEGORIES = ['예배', '행사', '다음세대', '교제', '기타'];
const MAX_IMAGES = 20;

function today() {
  return new Date().toISOString().split('T')[0];
}

function imageKey(image) {
  return image.localId || (image.id ? `db-${image.id}` : image.image_url);
}

function normalizePost(post = {}) {
  return {
    id: post.id,
    title: post.title || '',
    content: post.content || '',
    event_date: post.event_date || today(),
    category: post.category || '행사',
    is_published: post.is_published ?? true,
    cover_image_url: post.cover_image_url || '',
  };
}

function normalizeExistingImages(post) {
  return [...(post.album_images || [])]
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((image) => ({
      ...image,
      localId: `db-${image.id}`,
      previewUrl: image.thumbnail_url || image.image_url,
      uploadStatus: 'uploaded',
      originalSizeBytes: image.size_bytes || 0,
    }));
}

async function uploadVariant(postId, image, variant) {
  const file = variant === 'thumb' ? image.thumbnailFile : image.mainFile;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('albumPostId', String(postId));
  formData.append('variant', variant);

  const response = await fetch('/api/album/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || '이미지 업로드에 실패했습니다.');
  }

  return data;
}

export default function AlbumManager({ initialAlbums = [] }) {
  const [albums] = useState(initialAlbums);
  const [current, setCurrent] = useState(null);
  const [images, setImages] = useState([]);
  const [coverKey, setCoverKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const filteredAlbums = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return albums.filter((album) => {
      const text = `${album.title || ''} ${album.content || ''}`.toLowerCase();
      return !keyword || text.includes(keyword);
    });
  }, [albums, searchTerm]);

  const startCreate = () => {
    setCurrent(normalizePost());
    setImages([]);
    setCoverKey('');
    setMessage('');
  };

  const startEdit = (album) => {
    const normalized = normalizePost(album);
    const albumImages = normalizeExistingImages(album);
    const matchedCover = albumImages.find((image) => (
      image.thumbnail_url === normalized.cover_image_url || image.image_url === normalized.cover_image_url
    ));

    setCurrent(normalized);
    setImages(albumImages);
    setCoverKey(matchedCover ? imageKey(matchedCover) : imageKey(albumImages[0] || {}));
    setMessage('');
  };

  const closeEditor = () => {
    images.forEach((image) => {
      if (image.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(image.previewUrl);
    });
    setCurrent(null);
    setImages([]);
    setCoverKey('');
    setMessage('');
  };

  const appendFiles = async (fileList) => {
    const files = [...fileList];
    if (images.length + files.length > MAX_IMAGES) {
      setMessage(`이미지는 게시글당 최대 ${MAX_IMAGES}장까지 등록할 수 있습니다.`);
      return;
    }

    for (const file of files) {
      if (!isSupportedImage(file)) {
        setMessage('JPG, PNG, WebP 이미지만 업로드할 수 있습니다.');
        continue;
      }

      const localId = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const pendingImage = {
        localId,
        original_filename: file.name,
        alt_text: current?.title || '',
        uploadStatus: 'compressing',
        originalSizeBytes: file.size,
      };

      setImages((prev) => [...prev, pendingImage]);
      setMessage(`${file.name} 압축 중입니다.`);

      try {
        const variants = await createAlbumImageVariants(file);
        const previewUrl = URL.createObjectURL(variants.thumbnail.file);
        const readyImage = {
          ...pendingImage,
          mainFile: variants.main.file,
          thumbnailFile: variants.thumbnail.file,
          previewUrl,
          width: variants.main.width,
          height: variants.main.height,
          size_bytes: variants.main.sizeBytes,
          thumbnailSizeBytes: variants.thumbnail.sizeBytes,
          uploadStatus: 'ready',
        };

        setImages((prev) => prev.map((image) => image.localId === localId ? readyImage : image));
        setCoverKey((prev) => prev || localId);
        setMessage(`${file.name} 압축이 완료되었습니다.`);
      } catch (error) {
        setImages((prev) => prev.map((image) => (
          image.localId === localId ? { ...image, uploadStatus: 'error', error: error.message } : image
        )));
        setMessage(error.message);
      }
    }
  };

  const removeImage = (key) => {
    setImages((prev) => {
      const target = prev.find((image) => imageKey(image) === key);
      if (target?.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(target.previewUrl);
      const next = prev.filter((image) => imageKey(image) !== key);
      if (coverKey === key) setCoverKey(imageKey(next[0] || {}));
      return next;
    });
  };

  const moveImage = (key, direction) => {
    setImages((prev) => {
      const index = prev.findIndex((image) => imageKey(image) === key);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const updateImageAlt = (key, altText) => {
    setImages((prev) => prev.map((image) => (
      imageKey(image) === key ? { ...image, alt_text: altText } : image
    )));
  };

  const uploadImages = async (postId) => {
    const uploadedPaths = [];
    const finalImages = [];

    for (const [index, image] of images.entries()) {
      const key = imageKey(image);

      if (image.uploadStatus === 'uploaded') {
        finalImages.push({
          ...image,
          sort_order: index,
          alt_text: image.alt_text || current.title,
        });
        continue;
      }

      if (image.uploadStatus === 'error') {
        throw new Error(`${image.original_filename} 압축을 다시 확인해 주세요.`);
      }

      setImages((prev) => prev.map((item) => imageKey(item) === key ? { ...item, uploadStatus: 'uploading' } : item));
      setMessage(`${image.original_filename} 업로드 중입니다.`);

      const main = await uploadVariant(postId, image, 'main');
      uploadedPaths.push(main.path);
      const thumbnail = await uploadVariant(postId, image, 'thumb');
      uploadedPaths.push(thumbnail.path);

      finalImages.push({
        image_url: main.url,
        thumbnail_url: thumbnail.url,
        storage_path: main.path,
        thumbnail_storage_path: thumbnail.path,
        original_filename: image.original_filename,
        alt_text: image.alt_text || current.title,
        sort_order: index,
        width: image.width,
        height: image.height,
        size_bytes: main.size || image.size_bytes,
        localId: key,
      });
    }

    return { finalImages, uploadedPaths };
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!current.title.trim()) {
      setMessage('앨범 제목을 입력해 주세요.');
      return;
    }

    setIsSaving(true);
    setMessage('앨범을 저장하는 중입니다.');
    let createdId = null;
    let uploadedPaths = [];

    try {
      const basePost = {
        title: current.title,
        content: current.content,
        event_date: current.event_date || null,
        category: current.category,
        is_published: current.is_published,
      };

      const post = current.id
        ? current
        : await createAlbumPost({ ...basePost, is_published: false });

      createdId = current.id ? null : post.id;
      const uploadResult = await uploadImages(post.id);
      uploadedPaths = uploadResult.uploadedPaths;

      const coverIndex = images.findIndex((image) => imageKey(image) === coverKey);
      const coverImage = uploadResult.finalImages[coverIndex] || uploadResult.finalImages[0];
      const coverUrl = coverImage?.thumbnail_url || coverImage?.image_url || '';

      await updateAlbumPost(post.id, {
        ...basePost,
        cover_image_url: coverUrl,
      }, uploadResult.finalImages);

      alert('앨범이 저장되었습니다.');
      window.location.reload();
    } catch (error) {
      if (uploadedPaths.length > 0) {
        try {
          await deleteAlbumStorageFiles(uploadedPaths);
        } catch (cleanupError) {
          console.error('Album upload cleanup failed:', cleanupError);
        }
      }

      if (createdId) {
        try {
          await deleteAlbumPost(createdId);
        } catch (deleteError) {
          console.error('Album draft cleanup failed:', deleteError);
        }
      }

      setMessage(error.message || '앨범 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!confirm('앨범 게시글과 연결된 이미지가 함께 삭제됩니다. 정말 삭제하시겠습니까?')) return;

    try {
      await deleteAlbumPost(id);
      alert('앨범이 삭제되었습니다.');
      window.location.reload();
    } catch (error) {
      alert(error.message || '삭제 중 오류가 발생했습니다.');
    }
  };

  if (current) {
    return (
      <div className="album-admin-manager">
        <form className="album-editor admin-card" onSubmit={handleSave}>
          <div className="form-header">
            <div>
              <h1>{current.id ? '교회 앨범 수정' : '새 교회 앨범 등록'}</h1>
              <p>사진은 저장 전에 브라우저에서 자동으로 리사이즈/압축됩니다.</p>
            </div>
            <button type="button" className="btn-close" onClick={closeEditor} aria-label="편집 닫기">
              <X size={24} />
            </button>
          </div>

          <div className="album-editor-grid">
            <div className="album-editor-main">
              <div className="form-row">
                <div className="form-section">
                  <label htmlFor="album-title">제목</label>
                  <input
                    id="album-title"
                    value={current.title}
                    onChange={(event) => setCurrent({ ...current, title: event.target.value })}
                    required
                    placeholder="예: 2026 부활절 감사예배"
                  />
                </div>
                <div className="form-section">
                  <label htmlFor="album-date">행사일</label>
                  <input
                    id="album-date"
                    type="date"
                    value={current.event_date || ''}
                    onChange={(event) => setCurrent({ ...current, event_date: event.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <label htmlFor="album-category">카테고리</label>
                  <select
                    id="album-category"
                    value={current.category}
                    onChange={(event) => setCurrent({ ...current, category: event.target.value })}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-section publish-field">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={current.is_published}
                      onChange={(event) => setCurrent({ ...current, is_published: event.target.checked })}
                    />
                    공개 상태로 게시
                  </label>
                </div>
              </div>

              <div className="form-section">
                <label htmlFor="album-content">설명</label>
                <textarea
                  id="album-content"
                  rows="7"
                  value={current.content}
                  onChange={(event) => setCurrent({ ...current, content: event.target.value })}
                  placeholder="앨범에 대한 간단한 설명을 입력해 주세요."
                />
              </div>

              <div
                className="album-upload-zone"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  appendFiles(event.dataTransfer.files);
                }}
              >
                <input
                  id="album-image-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(event) => appendFiles(event.target.files)}
                />
                <label htmlFor="album-image-input">
                  <ImagePlus size={34} />
                  <strong>사진 선택 또는 드래그 앤 드롭</strong>
                  <span>JPG, PNG, WebP / 원본 20MB 이하 / 최대 {MAX_IMAGES}장</span>
                </label>
              </div>

              {message && <div className="album-admin-message">{message}</div>}
            </div>

            <aside className="album-editor-side">
              <div className="side-card">
                <h2>사진 목록</h2>
                <p>{images.length} / {MAX_IMAGES}장</p>
              </div>
              <button type="submit" className="btn-primary save-button" disabled={isSaving}>
                {isSaving ? <Loader2 size={20} className="spin" /> : <Save size={20} />}
                저장하기
              </button>
              <button type="button" className="btn-secondary" onClick={closeEditor} disabled={isSaving}>
                취소
              </button>
            </aside>
          </div>

          <div className="album-image-list">
            {images.map((image, index) => {
              const key = imageKey(image);
              return (
                <div key={key} className={`album-image-row ${coverKey === key ? 'cover' : ''}`}>
                  <div className="album-image-thumb">
                    {image.previewUrl ? <img src={image.previewUrl} alt="" /> : <Camera size={28} />}
                  </div>

                  <div className="album-image-info">
                    <div className="image-title-line">
                      <strong>{image.original_filename || `사진 ${index + 1}`}</strong>
                      <span className={`upload-state ${image.uploadStatus}`}>{image.uploadStatus}</span>
                    </div>
                    <div className="image-size-line">
                      원본 {formatBytes(image.originalSizeBytes)} → 메인 {formatBytes(image.size_bytes)} / 썸네일 {formatBytes(image.thumbnailSizeBytes)}
                    </div>
                    {image.error && <div className="image-error">{image.error}</div>}
                    <input
                      value={image.alt_text || ''}
                      onChange={(event) => updateImageAlt(key, event.target.value)}
                      placeholder="이미지 설명 alt 텍스트"
                      aria-label="이미지 alt 텍스트"
                    />
                  </div>

                  <div className="album-image-actions">
                    <button type="button" onClick={() => setCoverKey(key)} className={coverKey === key ? 'active' : ''} aria-label="대표 이미지 지정">
                      <Star size={17} />
                    </button>
                    <button type="button" onClick={() => moveImage(key, -1)} disabled={index === 0} aria-label="이미지 순서 올리기">
                      <ArrowUp size={17} />
                    </button>
                    <button type="button" onClick={() => moveImage(key, 1)} disabled={index === images.length - 1} aria-label="이미지 순서 내리기">
                      <ArrowDown size={17} />
                    </button>
                    <button type="button" onClick={() => removeImage(key)} className="danger" aria-label="이미지 삭제">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })}

            {images.length === 0 && (
              <div className="album-image-empty-admin">
                <Camera size={40} />
                <p>아직 선택한 사진이 없습니다.</p>
              </div>
            )}
          </div>
        </form>

        <style jsx>{adminStyles}</style>
      </div>
    );
  }

  return (
    <div className="album-admin-manager">
      <div className="admin-header">
        <div>
          <h1>교회 앨범 관리</h1>
          <p className="subtitle">앨범 게시글과 여러 장의 사진을 등록하고 관리합니다.</p>
        </div>
        <button className="btn-primary" onClick={startCreate}>
          <Plus size={20} /> 새 앨범 등록
        </button>
      </div>

      <div className="admin-card search-bar">
        <div className="search-input-wrap">
          <Search size={20} />
          <input
            type="text"
            placeholder="앨범 제목 또는 설명 검색"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="admin-card table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>대표</th>
              <th>제목</th>
              <th>카테고리</th>
              <th>행사일</th>
              <th>사진</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlbums.map((album) => (
              <tr key={album.id}>
                <td>
                  <div className="table-thumb">
                    {album.cover_image_url ? <img src={album.cover_image_url} alt="" /> : <Camera size={20} />}
                  </div>
                </td>
                <td className="title-td">{album.title}</td>
                <td><span className="cat-tag">{album.category || '기타'}</span></td>
                <td>{album.event_date || '-'}</td>
                <td>{album.album_images?.length || 0}장</td>
                <td>
                  <span className={`status-tag ${album.is_published ? 'active' : ''}`}>
                    {album.is_published ? '공개' : '비공개'}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon" onClick={() => startEdit(album)} aria-label="앨범 수정">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDeletePost(album.id)} aria-label="앨범 삭제">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredAlbums.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-table">
                  등록된 교회 앨범이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{adminStyles}</style>
    </div>
  );
}

const adminStyles = `
  .album-admin-manager { width: 100%; }
  .admin-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-bottom: 24px; }
  .admin-header h1, .form-header h1 { margin: 0; color: #1b4d3e; font-size: 2rem; font-weight: 900; }
  .subtitle, .form-header p { margin-top: 8px; color: #64748b; font-weight: 600; }
  .btn-primary, .btn-secondary { min-height: 46px; padding: 12px 22px; border-radius: 10px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; border: none; }
  .btn-primary { background: #1b4d3e; color: white; }
  .btn-primary:disabled, .btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-secondary { background: white; color: #475569; border: 1px solid #dbe3ea; }
  .admin-card { background: white; border: 1px solid #eef2f6; border-radius: 18px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04); }
  .search-bar { padding: 20px; margin-bottom: 22px; }
  .search-input-wrap { display: flex; align-items: center; gap: 10px; background: #f4f7f6; border-radius: 12px; padding: 12px 16px; color: #64748b; }
  .search-input-wrap input { width: 100%; border: none; outline: none; background: transparent; font-size: 1rem; }
  .table-card { overflow: hidden; }
  .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
  .admin-table th { background: #f8fafc; padding: 16px 20px; color: #475569; font-size: 0.9rem; font-weight: 900; }
  .admin-table td { padding: 16px 20px; border-top: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; }
  .table-thumb { width: 72px; height: 54px; border-radius: 10px; background: #eef2f6; overflow: hidden; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
  .table-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .title-td { font-weight: 900; color: #1f2937; }
  .cat-tag { display: inline-flex; padding: 5px 11px; border-radius: 999px; background: #edf7f2; color: #1b4d3e; font-size: 0.85rem; font-weight: 900; }
  .status-tag { display: inline-flex; padding: 5px 11px; border-radius: 999px; background: #f1f5f9; color: #64748b; font-weight: 900; font-size: 0.85rem; }
  .status-tag.active { background: #e9f8ef; color: #17884a; }
  .action-btns { display: flex; gap: 8px; }
  .btn-icon { width: 34px; height: 34px; border-radius: 9px; border: 1px solid #dbe3ea; background: white; color: #64748b; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
  .btn-icon:hover { color: #1b4d3e; border-color: #1b4d3e; }
  .btn-icon.danger:hover { color: #dc2626; border-color: #fecaca; background: #fff1f2; }
  .empty-table { text-align: center; padding: 64px 20px !important; color: #94a3b8 !important; font-weight: 800; }
  .album-editor { padding: 32px; }
  .form-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid #eef2f6; }
  .btn-close { width: 42px; height: 42px; border-radius: 999px; border: 1px solid #e2e8f0; background: white; color: #64748b; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
  .album-editor-grid { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 28px; align-items: start; }
  .form-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
  .form-section { margin-bottom: 20px; }
  .form-section label { display: block; margin-bottom: 8px; color: #334155; font-weight: 900; }
  .form-section input, .form-section textarea, .form-section select, .album-image-info input { width: 100%; border: 1px solid #dbe3ea; border-radius: 10px; padding: 13px 14px; font: inherit; outline: none; }
  .form-section input:focus, .form-section textarea:focus, .form-section select:focus, .album-image-info input:focus { border-color: #1b4d3e; box-shadow: 0 0 0 4px rgba(27, 77, 62, 0.08); }
  .publish-field { display: flex; align-items: flex-end; padding-bottom: 12px; }
  .checkbox-label { display: flex !important; align-items: center; gap: 10px; margin-bottom: 0 !important; }
  .checkbox-label input { width: 20px !important; height: 20px; }
  .album-upload-zone { border: 2px dashed #cbd5e1; border-radius: 18px; background: #f8fafc; transition: all 0.2s; }
  .album-upload-zone:hover { border-color: #1b4d3e; background: #f2f8f5; }
  .album-upload-zone input { display: none; }
  .album-upload-zone label { min-height: 170px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #64748b; cursor: pointer; text-align: center; padding: 28px; }
  .album-upload-zone strong { color: #1b4d3e; font-size: 1.1rem; }
  .album-upload-zone span { font-size: 0.9rem; }
  .album-admin-message { margin-top: 14px; padding: 14px 16px; border-radius: 12px; background: #fff8e8; color: #8a5a10; font-weight: 800; }
  .album-editor-side { position: sticky; top: 24px; display: flex; flex-direction: column; gap: 12px; }
  .side-card { padding: 20px; border-radius: 16px; background: #f8fafc; border: 1px solid #eef2f6; }
  .side-card h2 { margin: 0 0 6px; color: #1e293b; font-size: 1.1rem; }
  .side-card p { margin: 0; color: #64748b; font-weight: 800; }
  .save-button { width: 100%; }
  .album-image-list { margin-top: 28px; display: flex; flex-direction: column; gap: 14px; }
  .album-image-row { display: grid; grid-template-columns: 120px minmax(0, 1fr) auto; gap: 18px; align-items: center; padding: 16px; border: 1px solid #e2e8f0; border-radius: 16px; background: #fff; }
  .album-image-row.cover { border-color: #c99b5a; box-shadow: 0 8px 22px rgba(201, 155, 90, 0.12); }
  .album-image-thumb { width: 120px; aspect-ratio: 4 / 3; border-radius: 12px; background: #edf2f7; overflow: hidden; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
  .album-image-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .album-image-info { min-width: 0; display: flex; flex-direction: column; gap: 9px; }
  .image-title-line { display: flex; align-items: center; gap: 10px; min-width: 0; }
  .image-title-line strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .upload-state { padding: 3px 8px; border-radius: 999px; background: #f1f5f9; color: #64748b; font-size: 0.75rem; font-weight: 900; }
  .upload-state.uploaded, .upload-state.ready { background: #e9f8ef; color: #17884a; }
  .upload-state.error { background: #fff1f2; color: #dc2626; }
  .upload-state.uploading, .upload-state.compressing { background: #eff6ff; color: #2563eb; }
  .image-size-line { color: #64748b; font-size: 0.9rem; font-weight: 700; }
  .image-error { color: #dc2626; font-size: 0.9rem; font-weight: 800; }
  .album-image-actions { display: grid; grid-template-columns: repeat(2, 38px); gap: 8px; }
  .album-image-actions button { width: 38px; height: 38px; border-radius: 10px; border: 1px solid #dbe3ea; background: white; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .album-image-actions button.active { background: #fff7e8; color: #c99b5a; border-color: #f1d7ad; }
  .album-image-actions button.danger:hover { color: #dc2626; border-color: #fecaca; background: #fff1f2; }
  .album-image-actions button:disabled { opacity: 0.35; cursor: not-allowed; }
  .album-image-empty-admin { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 54px 20px; color: #94a3b8; border: 1px dashed #cbd5e1; border-radius: 16px; font-weight: 800; }
  .spin { animation: spin 0.9s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 1024px) {
    .album-editor-grid { grid-template-columns: 1fr; }
    .album-editor-side { position: static; }
    .admin-table { min-width: 860px; }
    .table-card { overflow-x: auto; }
  }
  @media (max-width: 768px) {
    .admin-header, .form-header { flex-direction: column; align-items: stretch; }
    .form-row { grid-template-columns: 1fr; }
    .album-editor { padding: 22px; }
    .album-image-row { grid-template-columns: 88px minmax(0, 1fr); }
    .album-image-thumb { width: 88px; }
    .album-image-actions { grid-column: 1 / -1; grid-template-columns: repeat(4, 1fr); }
    .album-image-actions button { width: 100%; }
  }
`;

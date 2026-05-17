'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from './supabase';

// ============================================
// Supabase 기반 서버 액션
// ============================================

// --- 감사 로그 기록 ---
async function logAction(action, contentType, contentId, before = null, after = null) {
  if (!supabase) return;
  try {
    await supabase.from('audit_logs').insert({
      target: `${contentType}:${contentId}`,
      action: action,
      details: { before, after },
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error('Failed to log action:', err);
  }
}

// --- 도구: camelCase -> snake_case 변환 ---
function toSnakeCase(obj) {
  const newObj = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    newObj[snakeKey] = obj[key];
  }
  return newObj;
}

// --- 범용 생성 ---
export async function createItem(tableName, item) {
  if (!supabase) throw new Error('DB 연결 실패');
  
  const insertData = toSnakeCase(item);
  delete insertData.id; // id는 auto-increment
  insertData.created_at = new Date().toISOString();
  insertData.updated_at = new Date().toISOString();
  if (!insertData.status) insertData.status = '게시';

  const { data, error } = await supabase
    .from(tableName)
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error(`Create Error in ${tableName}:`, error);
    throw new Error(error.message);
  }

  await logAction('create', tableName, data.id, null, data);
  revalidatePath('/');
  revalidatePath('/admin');
  return data;
}

// --- 범용 수정 ---
export async function updateItem(tableName, id, updates) {
  if (!supabase) throw new Error('DB 연결 실패');

  // 변경 전 데이터
  const { data: before } = await supabase.from(tableName).select('*').eq('id', id).single();

  const updateData = toSnakeCase(updates);
  const { data, error } = await supabase
    .from(tableName)
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Update Error in ${tableName}:`, error);
    throw new Error(error.message);
  }

  await logAction('update', tableName, id, before, data);
  revalidatePath('/');
  revalidatePath('/admin');
  return data;
}

// --- 범용 삭제 ---
export async function deleteItem(tableName, id) {
  if (!supabase) throw new Error('DB 연결 실패');

  const { data: before } = await supabase.from(tableName).select('*').eq('id', id).single();

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  if (before) await logAction('delete', tableName, id, before, null);
  revalidatePath('/');
  revalidatePath('/admin');
}

// --- 설정 업데이트 (JSONB 컬럼) ---
export async function updateSettings(settings) {
  if (!supabase) throw new Error('DB 연결 실패');

  const { data: current } = await supabase.from('settings').select('data').eq('id', 1).single();
  const before = current?.data;

  const { error } = await supabase
    .from('settings')
    .upsert({ id: 1, data: settings, updated_at: new Date().toISOString() }, { onConflict: 'id' });

  if (error) throw new Error(error.message);

  await logAction('update', 'settings', 1, before, settings);
  revalidatePath('/');
  revalidatePath('/admin');
}

// --- 편의 함수들 ---
export async function createPopup(popup) { return createItem('popups', popup); }
export async function updatePopup(id, updates) { return updateItem('popups', id, updates); }
export async function createNotice(notice) { return createItem('notices', notice); }
export async function updateNotice(id, updates) { return updateItem('notices', id, updates); }

function sanitizeAlbumPost(post = {}) {
  return {
    title: String(post.title || '').trim(),
    content: String(post.content || '').trim(),
    event_date: post.event_date || post.eventDate || null,
    category: String(post.category || '기타').trim() || '기타',
    cover_image_url: post.cover_image_url || post.coverImageUrl || '',
    is_published: Boolean(post.is_published ?? post.isPublished ?? true),
  };
}

function sanitizeAlbumImage(image = {}, index = 0) {
  return {
    album_post_id: image.album_post_id || image.albumPostId,
    image_url: image.image_url || image.imageUrl || '',
    thumbnail_url: image.thumbnail_url || image.thumbnailUrl || '',
    storage_path: image.storage_path || image.storagePath || '',
    thumbnail_storage_path: image.thumbnail_storage_path || image.thumbnailStoragePath || '',
    original_filename: image.original_filename || image.originalFilename || '',
    alt_text: image.alt_text || image.altText || '',
    sort_order: Number.isFinite(image.sort_order) ? image.sort_order : index,
    width: Number.isFinite(image.width) ? image.width : null,
    height: Number.isFinite(image.height) ? image.height : null,
    size_bytes: Number.isFinite(image.size_bytes) ? image.size_bytes : null,
  };
}

function imageStoragePaths(image) {
  return [
    image?.storage_path,
    image?.thumbnail_storage_path,
    image?.storagePath,
    image?.thumbnailStoragePath,
  ].filter(Boolean);
}

export async function deleteAlbumStorageFiles(paths = []) {
  if (!supabase) throw new Error('DB 연결에 실패했습니다.');

  const uniquePaths = [...new Set(paths.filter(Boolean))];
  if (uniquePaths.length === 0) return { success: true };

  const { error } = await supabase.storage
    .from('album-images')
    .remove(uniquePaths);

  if (error) {
    console.error('deleteAlbumStorageFiles error:', error);
    throw new Error(error.message);
  }

  return { success: true };
}

export async function createAlbumPost(post) {
  if (!supabase) throw new Error('DB 연결에 실패했습니다.');

  const insertData = sanitizeAlbumPost(post);
  if (!insertData.title) throw new Error('앨범 제목을 입력해 주세요.');

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('album_posts')
    .insert({
      ...insertData,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) {
    console.error('createAlbumPost error:', error);
    throw new Error(error.message);
  }

  await logAction('create', 'album_posts', data.id, null, data);
  revalidatePath('/');
  revalidatePath('/album');
  revalidatePath('/admin/albums');
  return data;
}

export async function updateAlbumPost(id, post, images = []) {
  if (!supabase) throw new Error('DB 연결에 실패했습니다.');

  const postId = Number(id);
  if (!Number.isFinite(postId)) throw new Error('앨범 ID가 올바르지 않습니다.');

  const updateData = sanitizeAlbumPost(post);
  if (!updateData.title) throw new Error('앨범 제목을 입력해 주세요.');

  const { data: before } = await supabase
    .from('album_posts')
    .select('*, album_images(*)')
    .eq('id', postId)
    .single();

  const { data: updatedPost, error: postError } = await supabase
    .from('album_posts')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId)
    .select()
    .single();

  if (postError) {
    console.error('updateAlbumPost error:', postError);
    throw new Error(postError.message);
  }

  const currentImages = before?.album_images || [];
  const incomingIds = new Set(images.map((image) => image.id).filter(Boolean));
  const incomingPaths = new Set(images.flatMap(imageStoragePaths));
  const removedImages = currentImages.filter((image) => {
    if (incomingIds.has(image.id)) return false;
    return !imageStoragePaths(image).some((path) => incomingPaths.has(path));
  });

  if (removedImages.length > 0) {
    const removedIds = removedImages.map((image) => image.id);
    const { error: deleteRowsError } = await supabase
      .from('album_images')
      .delete()
      .in('id', removedIds);

    if (deleteRowsError) {
      console.error('delete removed album images error:', deleteRowsError);
      throw new Error(deleteRowsError.message);
    }

    await deleteAlbumStorageFiles(removedImages.flatMap(imageStoragePaths));
  }

  for (const [index, image] of images.entries()) {
    const row = sanitizeAlbumImage({ ...image, album_post_id: postId, sort_order: index }, index);
    if (!row.image_url || !row.thumbnail_url) continue;

    if (image.id) {
      const { error } = await supabase
        .from('album_images')
        .update(row)
        .eq('id', image.id)
        .eq('album_post_id', postId);

      if (error) {
        console.error('update album image error:', error);
        throw new Error(error.message);
      }
    } else {
      const { error } = await supabase
        .from('album_images')
        .insert(row);

      if (error) {
        console.error('insert album image error:', error);
        throw new Error(error.message);
      }
    }
  }

  await logAction('update', 'album_posts', postId, before, { ...updatedPost, images });
  revalidatePath('/');
  revalidatePath('/album');
  revalidatePath(`/album/${postId}`);
  revalidatePath('/admin/albums');
  return updatedPost;
}

export async function deleteAlbumPost(id) {
  if (!supabase) throw new Error('DB 연결에 실패했습니다.');

  const postId = Number(id);
  if (!Number.isFinite(postId)) throw new Error('앨범 ID가 올바르지 않습니다.');

  const { data: before } = await supabase
    .from('album_posts')
    .select('*, album_images(*)')
    .eq('id', postId)
    .single();

  const { error } = await supabase
    .from('album_posts')
    .delete()
    .eq('id', postId);

  if (error) {
    console.error('deleteAlbumPost error:', error);
    throw new Error(error.message);
  }

  await deleteAlbumStorageFiles((before?.album_images || []).flatMap(imageStoragePaths));
  await logAction('delete', 'album_posts', postId, before, null);
  revalidatePath('/');
  revalidatePath('/album');
  revalidatePath('/admin/albums');
}

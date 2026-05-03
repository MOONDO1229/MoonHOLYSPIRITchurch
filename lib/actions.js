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

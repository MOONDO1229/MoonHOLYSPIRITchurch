'use server';

import { revalidatePath } from 'next/cache';
import { getData, saveData } from './db';

// Generic CRUD Actions
async function logAction(action, filename, id, before = null, after = null) {
  const logs = getData('audit_logs');
  const newLog = {
    id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
    contentType: filename,
    contentId: id,
    action,
    before,
    after,
    changedAt: new Date().toISOString(),
    changedBy: 'admin' // TODO: Replace with actual user from session
  };
  logs.push(newLog);
  saveData('audit_logs', logs.slice(-500)); // Keep last 500 logs
}

export async function createItem(filename, item) {
  const data = getData(filename);
  const newItem = {
    ...item,
    id: data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: item.status || '게시'
  };
  data.push(newItem);
  saveData(filename, data);
  
  await logAction('create', filename, newItem.id, null, newItem);
  
  revalidatePath('/');
  revalidatePath('/admin');
  return newItem;
}

export async function updateItem(filename, id, updates) {
  const data = getData(filename);
  const index = data.findIndex(i => i.id === id);
  if (index === -1) throw new Error('Item not found');
  
  const before = { ...data[index] };
  data[index] = {
    ...data[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveData(filename, data);
  
  await logAction('update', filename, id, before, data[index]);
  
  revalidatePath('/');
  revalidatePath('/admin');
  return data[index];
}

export async function deleteItem(filename, id) {
  const data = getData(filename);
  const itemToDelete = data.find(i => i.id === id);
  const filteredData = data.filter(i => i.id !== id);
  saveData(filename, filteredData);
  
  if (itemToDelete) {
    await logAction('delete', filename, id, itemToDelete, null);
  }
  
  revalidatePath('/');
  revalidatePath('/admin');
}

// Settings Action
export async function updateSettings(settings) {
  const before = getData('settings')[0];
  saveData('settings', [settings]); // Always wrap in array for consistency
  
  await logAction('update', 'settings', 1, before, settings);
  
  revalidatePath('/');
  revalidatePath('/admin');
}

// Popup Actions
export async function createPopup(popup) {
  return createItem('popups', popup);
}

export async function updatePopup(id, updates) {
  return updateItem('popups', id, updates);
}

// Notice Actions
export async function createNotice(notice) {
  return createItem('notices', notice);
}

export async function updateNotice(id, updates) {
  return updateItem('notices', id, updates);
}

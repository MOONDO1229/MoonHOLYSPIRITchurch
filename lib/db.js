import { supabase } from './supabase';

// ============================================
// Supabase 기반 데이터 접근 레이어
// 기존 fs(파일시스템) 방식에서 Supabase DB로 전환
// ============================================

const DEFAULT_SETTINGS = {
  welcomeTitle: "퇴촌성령교회에 오신 것을 환영합니다",
  welcomeSubtitle: "성령의 능력으로 세상을 변화시키는 교회입니다.",
  phone: "031-766-8847",
  email: "tc-spirit@church.com",
  address: "경기도 광주시 퇴촌면 광동로52번길 27",
  youtubeLink: "",
  pastor: "이우림 목사",
  pastorImage: "",
  churchImage: "",
  logoImage: "",
  history: [],
  copyrightYear: "2026",
  theme: { primaryColor: "#1b4d3e", secondaryColor: "#c9a55c" }
};

// --- 범용 테이블 조회 ---
export async function getData(tableName) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(tableName)
    .select('*');
  if (error) {
    console.error(`getData(${tableName}) error:`, error.message);
    return [];
  }
  return data || [];
}

// --- 범용 데이터 저장 (upsert) ---
export async function saveData(tableName, rows) {
  if (!supabase) return false;
  // rows가 배열이 아니면 배열로 감싸기
  const dataArray = Array.isArray(rows) ? rows : [rows];
  const { error } = await supabase
    .from(tableName)
    .upsert(dataArray, { onConflict: 'id' });
  if (error) {
    console.error(`saveData(${tableName}) error:`, error.message);
    return false;
  }
  return true;
}

// --- 예배시간 ---
export async function getWorshipTimes() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('worship_times')
    .select('*')
    .eq('is_visible', true)
    .order('order', { ascending: true });
  if (error) { console.error(error.message); return []; }
  return data || [];
}

// --- 공지사항 (공개용) ---
export async function getNotices() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('status', '게시')
    .order('is_pinned', { ascending: false })
    .order('date', { ascending: false });
  if (error) { console.error(error.message); return []; }
  return data || [];
}

// --- 공지사항 (관리자용 - 전체) ---
export async function getAllNotices() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .order('date', { ascending: false });
  if (error) { console.error(error.message); return []; }
  return data || [];
}

// --- 설교 ---
export async function getSermons() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('sermons')
    .select('*')
    .eq('status', '게시')
    .order('date', { ascending: false });
  if (error) { console.error(error.message); return []; }
  return data || [];
}

export async function getLatestSermon() {
  const sermons = await getSermons();
  return sermons.length > 0 ? sermons[0] : null;
}

// --- 주보 ---
export async function getLatestBulletin() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('bulletins')
    .select('*')
    .eq('status', '게시')
    .order('date', { ascending: false })
    .limit(1);
  if (error) { console.error(error.message); return null; }
  return data && data.length > 0 ? data[0] : null;
}

// --- 사이트 설정 ---
export async function getSettings() {
  if (!supabase) return DEFAULT_SETTINGS;
  const { data, error } = await supabase
    .from('settings')
    .select('data')
    .eq('id', 1)
    .single();
  if (error || !data) return DEFAULT_SETTINGS;
  return data.data || DEFAULT_SETTINGS;
}

// --- 활성 팝업 ---
export async function getActivePopups() {
  if (!supabase) return [];
  
  // 한국 시간 기준으로 오늘 날짜 구하기 (YYYY-MM-DD)
  const kstOffset = 9 * 60 * 60 * 1000; // 9 hours
  const now = new Date(Date.now() + kstOffset).toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('popups')
    .select('*')
    .eq('status', '게시')
    .lte('start_date', now)
    .gte('end_date', now);
    
  if (error) { console.error(error.message); return []; }
  return data || [];
}

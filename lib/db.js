import { supabase } from './supabase';

// ============================================
// Supabase 기반 데이터 접근 레이어
// 기존 fs(파일시스템) 방식에서 Supabase DB로 전환
// ============================================

const DEFAULT_SETTINGS = {
  churchName: "성령교회",
  denomination: "기독교대한성결교회",
  footerSlogan: "성령의 능력으로 세상을 변화시키고\n예수 그리스도의 사랑을 실천하는 믿음의 공동체",
  welcomeBadge: "성령교회에 오신 것을 환영합니다",
  welcomeTitle: "성령교회에 오신 것을 환영합니다",
  welcomeSubtitle: "성령의 능력으로 세상을 변화시키는 교회입니다.",
  phone: "031-766-8847",
  email: "spirit-church@church.com",
  address: "경기도 광주시 퇴촌면 광동로52번길 27",
  youtubeLink: "",
  kakaoLink: "",
  pastor: "이우림 목사",
  pastorImage: "",
  pastorTitle: "예수님의 사랑으로 여러분을 환영합니다",
  pastorGreeting: "안녕하십니까? 성령교회 홈페이지를 방문해주신 여러분을 진심으로 환영합니다.\n\n우리 교회는 하나님의 말씀 위에 든든히 서서 성령의 능력으로 세상을 변화시키고자 노력하는 교회입니다.\n\n지친 영혼이 쉼을 얻고, 주님의 사랑 안에서 새로운 소망을 발견하는 복된 자리가 되기를 기도합니다.\n\n함께 예배하며 주님의 은혜를 나누는 귀한 만남이 있기를 기대합니다.",
  visions: [
    { title: "말씀 중심", content: "변치 않는 하나님의 말씀을 삶의 유일한 기준으로 삼습니다.", icon: "BookOpen" },
    { title: "사랑의 교제", content: "예수님의 사랑으로 서로를 아끼고 돌보는 가족 같은 공동체입니다.", icon: "Heart" },
    { title: "다음 세대", content: "미래의 주역인 아이들을 신앙 안에서 바르게 양육합니다.", icon: "Users" },
    { title: "지역 섬김", content: "지역 사회에 빛과 소금이 되어 이웃을 섬깁니다.", icon: "Cross" }
  ],
  offering: {
    bank: "농협",
    account: "351-1188-7505-13",
    holder: "성령교회",
    info: "교회 통장으로 직접 송금하실 수 있습니다.",
    types: "십일조 / 감사헌금 / 주일헌금 / 선교헌금 / 건축헌금 등"
  },
  location: {
    guide: "교회 내 주차장이 마련되어 있습니다. 광동 사거리에서 퇴촌면사무소 방면으로 오시면 됩니다."
  },
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

export async function getNoticeById(id) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .single();
  if (error) { console.error(error.message); return null; }
  return data;
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

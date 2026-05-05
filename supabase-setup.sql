-- ============================================
-- 성령교회 CMS Supabase 테이블 초기화 SQL
-- Supabase Dashboard > SQL Editor 에서 실행
-- ============================================

-- 1. 설정 테이블
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 공지사항
CREATE TABLE IF NOT EXISTS notices (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT '일반',
  content TEXT DEFAULT '',
  image TEXT DEFAULT '',
  file TEXT DEFAULT '',
  date TEXT DEFAULT '',
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  is_pinned BOOLEAN DEFAULT FALSE,
  show_on_main BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT '게시',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 설교
CREATE TABLE IF NOT EXISTS sermons (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  date TEXT DEFAULT '',
  preacher TEXT DEFAULT '',
  passage TEXT DEFAULT '',
  category TEXT DEFAULT '주일예배',
  youtube_url TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  thumbnail TEXT DEFAULT '',
  show_on_main BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT '게시',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 주보
CREATE TABLE IF NOT EXISTS bulletins (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  date TEXT DEFAULT '',
  pdf_url TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  summary JSONB DEFAULT '{}'::jsonb,
  show_on_main BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT '게시',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 예배시간
CREATE TABLE IF NOT EXISTS worship_times (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  time TEXT DEFAULT '',
  place TEXT DEFAULT '',
  "order" INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 팝업
CREATE TABLE IF NOT EXISTS popups (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  pc_image TEXT DEFAULT '',
  mobile_image TEXT DEFAULT '',
  link TEXT DEFAULT '',
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  show_on_pc BOOLEAN DEFAULT TRUE,
  show_on_mobile BOOLEAN DEFAULT TRUE,
  use_today_hide BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT '게시',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 감사 로그
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  content_type TEXT DEFAULT '',
  content_id INTEGER DEFAULT 0,
  action TEXT DEFAULT '',
  before JSONB,
  after JSONB,
  changed_by TEXT DEFAULT 'admin',
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 초기 데이터 삽입
-- ============================================

-- 설정 초기 데이터
INSERT INTO settings (id, data) VALUES (1, '{
  "welcomeTitle": "성령교회",
  "welcomeSubtitle": "성령의 능력으로 세상을 변화시키는 교회",
  "phone": "031-766-8847",
  "address": "경기도 광주시 퇴촌면 광동로52번길 27",
  "pastor": "문학균 담임목사",
  "pastorImage": "",
  "churchImage": "",
  "logoImage": "",
  "youtubeLink": "https://www.youtube.com/@moonhk-sermon/featured",
  "kakaoLink": "",
  "mapLink": "https://map.naver.com/v5/search/경기도 광주시 퇴촌면 광동로52번길 27",
  "offeringAccount": "농협 351-1075-3818-33 (예금주: 성령교회)",
  "offeringInfo": "송금자: 이름헌금종류 (예: 홍길동십일조)",
  "parkingInfo": "교회 주차장 이용 가능",
  "history": [{"year": "1994", "month": "12", "content": "성령교회 설립"}],
  "popup": {"enabled": false, "imageUrl": "", "linkUrl": "", "hideForToday": true},
  "theme": {"primaryColor": "#1b4d3e", "secondaryColor": "#c9a55c"}
}'::jsonb) ON CONFLICT (id) DO NOTHING;

-- 예배시간 초기 데이터
INSERT INTO worship_times (name, time, place, "order", is_visible) VALUES
  ('주일 1부 오전예배', '오전 9시', '본당', 1, true),
  ('주일 2부 오전예배', '오전 11시', '본당', 2, true),
  ('주일 오후 예배', '오후 1시 50분', '본당', 3, true),
  ('주일 어린이 예배', '오전 11시', '교회 1층', 4, true),
  ('새벽기도회 (월~금)', '오전 5시', '본당', 5, true),
  ('수요예배', '오후 7시 30분', '본당', 6, true),
  ('금요기도회', '오후 8시', '본당', 7, true);

-- 공지사항 샘플
INSERT INTO notices (title, category, content, date, is_pinned, show_on_main, status) VALUES
  ('2024년 상반기 새가족 등록 안내', '모집', '우리 교회에 처음 오신 분들을 진심으로 환영합니다.', '2024-05-01', true, true, '게시');

-- Supabase Storage 버킷 생성 (SQL Editor에서는 불가, Dashboard에서 수동 생성 필요)
-- Storage > New bucket > 이름: "uploads" > Public bucket: ON

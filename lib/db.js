import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export function getData(filename) {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
}

export function saveData(filename, data) {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export function getWorshipTimes() {
  return getData('worship_times').filter(t => t.is_visible).sort((a, b) => a.order - b.order);
}

export function getNotices() {
  return getData('notices').filter(n => n.status === '게시').sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return b.is_pinned - a.is_pinned;
    return new Date(b.date) - new Date(a.date);
  });
}

export function getAllNotices() {
  return getData('notices').sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getSermons() {
  return getData('sermons').filter(s => s.status === '게시').sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getLatestSermon() {
  const sermons = getSermons();
  return sermons.length > 0 ? sermons[0] : null;
}

export function getLatestBulletin() {
  const bulletins = getData('bulletins').filter(b => b.status === '게시').sort((a, b) => new Date(b.date) - new Date(a.date));
  return bulletins[0];
}

export function getSettings() {
  const settings = getData('settings');
  // Return default if empty
  if (Array.isArray(settings) && settings.length === 0) {
    return {
      welcomeTitle: "퇴촌성령교회에 오신 것을 환영합니다",
      welcomeSubtitle: "성령의 능력으로 세상을 변화시키는 교회입니다.",
      phone: "031-123-4567",
      address: "경기도 광주시 퇴촌면...",
      youtubeLink: "",
      pastor: "홍길동 목사",
      history: [],
      popup: { enabled: false, imageUrl: "" },
      theme: { primaryColor: "#1b4d3e", secondaryColor: "#c9a55c" }
    };
  }
  return Array.isArray(settings) ? settings[0] : settings;
}

export function getActivePopups() {
  const now = new Date();
  return getData('popups').filter(p => {
    const start = new Date(p.start_date);
    const end = new Date(p.end_date);
    return p.status === '게시' && now >= start && now <= end;
  });
}

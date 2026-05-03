const fs = require('fs');
const path = require('path');

async function backup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups', timestamp);
  
  const targets = [
    { src: 'data', dest: 'data' },
    { src: 'public/uploads', dest: 'uploads' },
    { src: 'audit_logs.json', dest: 'audit_logs.json' }
  ];

  console.log(`🚀 백업 시작: ${timestamp}`);

  if (!fs.existsSync(path.join(process.cwd(), 'backups'))) {
    fs.mkdirSync(path.join(process.cwd(), 'backups'));
  }
  
  fs.mkdirSync(backupDir);

  for (const target of targets) {
    const srcPath = path.join(process.cwd(), target.src);
    const destPath = path.join(backupDir, target.dest);

    if (fs.existsSync(srcPath)) {
      if (fs.lstatSync(srcPath).isDirectory()) {
        copyDir(srcPath, destPath);
        console.log(`✅ 폴더 백업 완료: ${target.src}`);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ 파일 백업 완료: ${target.src}`);
      }
    } else {
      console.warn(`⚠️ 대상을 찾을 수 없음: ${target.src}`);
    }
  }

  console.log(`\n🎉 모든 백업이 완료되었습니다!`);
  console.log(`📂 저장 위치: ${backupDir}`);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

backup().catch(console.error);

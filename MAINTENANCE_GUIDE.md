# 🛠️ 성령교회 홈페이지 유지보수 가이드 (MAINTENANCE GUIDE)

이 문서는 개발자 또는 유지보수 담당자를 위해 기술적인 구조와 관리 방법을 설명합니다.

---

## 🏗️ 1. 기술 스택 및 아키텍처
- **Framework**: Next.js (App Router)
- **Language**: JavaScript (ES6+)
- **Styling**: Vanilla CSS (중앙 집중형 관리: `app/church.css`)
- **Icons**: Lucide-React
- **Database**: Local JSON Files (`data/*.json`)
- **Storage**: Local File System (`public/uploads/`)

---

## 📂 2. 주요 디렉토리 구조
- `/app`: 페이지 라우팅 및 서버 컴포넌트
  - `/admin`: 관리자 페이지 (주보, 설교, 팝업 관리 등)
  - `/worship`, `/notices`: 사용자 페이지
  - `church.css`: 프로젝트 전체 스타일 시트
- `/components`: 재사용 가능한 UI 컴포넌트
- `/data`: 서비스 데이터 (JSON) - **수정 시 백업 필수**
- `/public/uploads`: 사용자가 업로드한 이미지 및 PDF 파일
- `/lib`: 공통 유틸리티 함수 (파일 읽기/쓰기 등)

---

## 💾 3. 데이터 관리 (JSON DB)
본 프로젝트는 별도의 데이터베이스 서버 없이 서버 로컬의 JSON 파일을 데이터 저장소로 사용합니다.
- **파일 위치**: `data/` 디렉토리 내의 각 `.json` 파일
- **주의사항**: 
  - 서버 배포 시 해당 디렉토리에 **쓰기 권한(Write Permission)**이 있어야 합니다.
  - 새 버전 배포 시 `data/` 폴더가 덮어씌워져 데이터가 유실되지 않도록 주의하십시오. (운영 서버의 데이터를 우선적으로 보존해야 함)

---

## 📁 4. 파일 업로드 시스템
- **저장 경로**: `public/uploads/`
- **구현 방식**: `app/api/upload/route.js` (또는 관련 API)를 통해 서버 로컬에 직접 저장합니다.
- **백업**: 주기적으로 `public/uploads/` 폴더를 백업받아야 합니다.

---

## 🎨 5. 스타일 수정 가이드
모든 스타일은 `app/church.css` 파일에 통합되어 있습니다. 
- 스타일 수정을 원할 경우 해당 파일의 CSS 변수나 클래스를 수정하십시오.
- 인라인 스타일이나 컴포넌트 내부 `styled-jsx` 사용은 빌드 시 서버 컴포넌트 호환성 문제를 일으킬 수 있으므로 지양합니다.

---

## 🚀 6. 실행 및 빌드 명령
- **개발 모드**: `npm run dev`
- **프로덕션 빌드**: `npm run build`
- **실행**: `npm run start`
- **데이터 백업**: `npm run backup` (로컬 백업 스크립트 실행)

---

## 🔐 7. 환경 변수 및 보안
`.env.local` 파일에 관리자 인증 정보 등이 포함될 수 있습니다.
- 인수인계 시 이 파일의 내용을 안전한 방법으로 전달하십시오.
- 운영 서버에서는 실제 환경 변수(Environment Variables) 설정 메뉴를 통해 관리하는 것이 안전합니다.

---

## 🛠️ 8. 트러블슈팅
1. **스타일이 깨질 때**: `app/church.css` 로드가 정상적인지 확인하고, 클래스명이 중복되지 않았는지 확인하십시오.
2. **파일 업로드 실패**: 서버의 `public/uploads` 권한을 확인하십시오 (`chmod 755` 또는 `777`).
3. **데이터 유실**: `npm run backup`을 통해 생성된 최신 백업 파일을 확인하십시오.

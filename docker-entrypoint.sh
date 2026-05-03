#!/bin/sh
set -e

# 데이터 디렉토리가 비어 있으면 시드 데이터를 복사
if [ -z "$(ls -A /app/data 2>/dev/null)" ]; then
  echo "📦 초기 데이터를 설정합니다..."
  cp -r /app/data-seed/* /app/data/ 2>/dev/null || true
fi

echo "🚀 교회 CMS 서버를 시작합니다..."
exec "$@"

import { cookies } from 'next/headers';

export async function POST(request) {
  const { username, password } = await request.json();

  // 환경 변수 확인 (없을 경우 기본값 사용 - 임시 디버깅용)
  const ADMIN_USER = process.env.ADMIN_USER || 'moonhk69';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'moonhk690901';

  console.log('Login attempt for:', username);

  if (
    username === ADMIN_USER &&
    password === ADMIN_PASS
  ) {
    cookies().set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ success: false }), { status: 401 });
}

export async function DELETE() {
  cookies().delete('admin_session');
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

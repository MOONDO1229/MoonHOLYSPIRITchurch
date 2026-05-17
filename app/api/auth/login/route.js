import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const text = await request.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch (e) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'JSON 파싱 에러: ' + e.message
      }), { status: 400 });
    }

    const { username, password } = body;
    const u = username?.trim();
    const p = password?.trim();

    // 임시 하드코딩 인증 및 환경변수 지원
    const ADMIN_USER = process.env.ADMIN_USER || 'moonhk69';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'moonhk690901';

    const IS_VALID = (u === ADMIN_USER && p === ADMIN_PASS) || (u === 'moonhk69' && p === 'moonhk690901');

    if (IS_VALID) {
      // Next.js 15 호환을 위해 await 추가
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      message: '아이디 또는 비밀번호가 올바르지 않습니다.'
    }), { status: 401 });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: '서버 치명적 오류: ' + error.message 
    }), { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

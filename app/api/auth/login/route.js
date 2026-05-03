import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const ADMIN_USER = process.env.ADMIN_USER || 'moonhk69';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'moonhk690901';

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // 쿠키 설정
      cookies().set('admin_session', 'authenticated', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1주일
        sameSite: 'lax',
        secure: true, // Vercel HTTPS 필수
      });
      
      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: false, message: '인증 실패' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: '서버 오류' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE() {
  cookies().delete('admin_session');
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

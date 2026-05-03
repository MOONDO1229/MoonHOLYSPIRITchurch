import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const ADMIN_USER = process.env.ADMIN_USER || 'moonhk69';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'moonhk690901';

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // 쿠키 설정 (옵션 최적화)
      cookies().set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: true, // Vercel은 항상 https이므로 true
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1주
        path: '/',
      });
      
      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: false, message: 'Invalid credentials' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE() {
  cookies().delete('admin_session');
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

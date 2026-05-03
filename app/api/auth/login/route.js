import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const text = await request.text();
    console.log('Raw body:', text);
    
    let body;
    try {
      body = JSON.parse(text);
    } catch (e) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'JSON 파싱 에러: ' + e.message,
        received: text 
      }), { status: 400 });
    }

    const { username, password } = body;
    const u = username?.trim();
    const p = password?.trim();

    // 하드코딩 인증
    if (u === 'moonhk69' && p === 'moonhk690901') {
      cookies().set('admin_session', 'authenticated', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: true,
      });
      
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      message: '인증 정보 불일치',
      debug: { sent_u: u, sent_p: p } 
    }), { status: 401 });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: '서버 치명적 오류: ' + error.message 
    }), { status: 500 });
  }
}

export async function DELETE() {
  cookies().delete('admin_session');
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

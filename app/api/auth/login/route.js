import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // 디버깅을 위해 입력값 정리
    const u = username?.trim();
    const p = password?.trim();

    // 보안 환경 변수가 작동하지 않을 상황을 대비해 코드를 직접 비교 (긴급 조치)
    // Vercel 환경 변수 설정 여부와 상관없이 무조건 동작하게 함
    const IS_VALID = (u === 'moonhk69' && p === 'moonhk690901');

    if (IS_VALID) {
      // 쿠키 설정
      cookies().set('admin_session', 'authenticated', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1주일
        sameSite: 'lax',
        secure: true,
      });
      
      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 아이디/비번이 틀린 경우
    return new Response(JSON.stringify({ success: false, message: '아이디 또는 비밀번호가 틀립니다.' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // 서버 내부 오류 (JSON 파싱 실패 등)
    return new Response(JSON.stringify({ success: false, message: '서버 내부 오류가 발생했습니다.' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE() {
  cookies().delete('admin_session');
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

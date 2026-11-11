import { cookies } from 'next/headers';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
} from '@/lib/auth-session';

function getRequiredAdminCredentials() {
  const username = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASS;

  if (!username || !password) {
    throw new Error('ADMIN_USER and ADMIN_PASS must be set.');
  }

  return { username, password };
}

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

    const admin = getRequiredAdminCredentials();
    const IS_VALID = u === admin.username && p === admin.password;

    if (IS_VALID) {
      // Next.js 15 호환을 위해 await 추가
      const cookieStore = await cookies();
      const token = await createAdminSessionToken(admin.username);
      cookieStore.set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        path: '/',
        maxAge: ADMIN_SESSION_MAX_AGE,
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
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

import { cookies } from 'next/headers';

export async function POST(request) {
  const { username, password } = await request.json();

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    // Simple cookie-based auth (for production use a more secure JWT)
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

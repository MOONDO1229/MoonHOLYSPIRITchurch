import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // admin_session 쿠키 확인
  const session = request.cookies.get('admin_session');
  const isAuthenticated = session?.value === 'authenticated';

  // 관리자 페이지 보호
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      // 인증되지 않은 경우 로그인 페이지로 이동
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      // 무한 루프 방지: 이미 로그인 페이지로 이동 중인 경우 제외
      return NextResponse.redirect(url);
    }
  }

  // 이미 로그인한 사용자가 로그인 페이지에 접근할 경우 관리자 페이지로 이동
  if (pathname === '/login' && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};

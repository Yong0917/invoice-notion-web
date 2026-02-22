/**
 * NextAuth.js v5 미들웨어
 *
 * /admin 및 /admin/** 경로를 인증으로 보호합니다.
 * 미인증 접근 시 /login 페이지로 리다이렉트합니다.
 */

import { auth } from '@/auth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export default auth(function middleware(req: NextRequest & { auth: unknown }) {
  if (!req.auth) {
    const loginUrl = new URL('/login', req.url)
    // 로그인 후 원래 페이지로 돌아올 수 있도록 callbackUrl 저장
    loginUrl.searchParams.set('callbackUrl', req.url)
    return NextResponse.redirect(loginUrl)
  }
})

export const config = {
  // /admin 루트와 /admin/* 하위 경로 모두 보호
  matcher: ['/admin', '/admin/(.*)'],
}

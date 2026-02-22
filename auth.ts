/**
 * NextAuth.js v5 설정
 *
 * 관리자 단일 계정을 환경 변수로 관리하는 Credentials Provider 방식
 * - ADMIN_EMAIL: 관리자 이메일
 * - ADMIN_PASSWORD_HASH: bcrypt 해시값 (평문 저장 절대 금지)
 * - AUTH_SECRET: 세션 암호화 키 (32자 이상)
 */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) return null

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

        if (!adminEmail || !adminPasswordHash) {
          console.error('[Auth] ADMIN_EMAIL 또는 ADMIN_PASSWORD_HASH 환경 변수가 설정되지 않았습니다.')
          return null
        }

        // 이메일 일치 확인
        if (email !== adminEmail) return null

        // bcrypt 해시 비교
        const isValid = await bcrypt.compare(password, adminPasswordHash)
        if (!isValid) return null

        return {
          id: 'admin',
          email: adminEmail,
          name: '관리자',
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  // 개발 환경에서 HTTP 허용 (프로덕션에서는 자동으로 HTTPS 강제)
  trustHost: true,
})

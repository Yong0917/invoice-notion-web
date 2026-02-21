import type { SiteConfig, NavItem } from '@/types'

// ─── 사이트 메타 정보 ─────────────────────────────────────────────────
export const SITE_CONFIG: SiteConfig = {
  name: '견적서 조회 서비스',
  description: '노션 기반 견적서를 웹에서 조회하고 PDF로 다운로드할 수 있는 서비스',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  links: {},
}

// ─── 헤더 네비게이션 링크 ─────────────────────────────────────────────
// 견적서 서비스는 별도 공개 페이지가 없으므로 홈만 노출
export const NAV_ITEMS: NavItem[] = [
  { title: '홈', href: '/' },
]

// ─── 환경 변수 ────────────────────────────────────────────────────────
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

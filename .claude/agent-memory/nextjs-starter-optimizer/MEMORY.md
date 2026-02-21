# invoice-web 프로젝트 메모리

## 프로젝트 구조 (실제)
- 라우트 루트: `src/app/` (CLAUDE.md의 `app/` 설명과 다름 - 실제로는 src/ 사용 중)
- 공통 모듈: `components/`, `hooks/`, `lib/`, `types/` (프로젝트 루트)
- 경로 별칭: `@/*` → `./` (루트 기준, tsconfig.json 확인)

## 핵심 파일 위치
- 라우트: `src/app/invoice/[id]/page.tsx`
- API: `src/app/api/invoice/[id]/route.ts`
- 노션 클라이언트: `lib/notion.ts` (미구현, 스켈레톤 상태)
- 타입: `types/invoice.ts`, `types/index.ts`
- 상수: `lib/constants.ts` (SITE_CONFIG, NAV_ITEMS)
- 환경변수 템플릿: `.env.local.example`, `.env.example`

## 알려진 Lint 규칙 이슈
- `react-hooks/set-state-in-effect`: hooks 파일에서 외부 시스템 동기화 패턴에 eslint-disable 처리됨
  - `hooks/use-mounted.ts`, `hooks/use-media-query.ts`, `hooks/use-local-storage.ts`

## 미구현 항목 (TODO)
- `@notionhq/client` 패키지 미설치 (npm install 필요)
- `lib/notion.ts`: 실제 노션 API 연동 구현 필요
- `src/app/invoice/[id]/page.tsx`: 견적서 뷰 컴포넌트 구현 필요
- `src/app/api/invoice/[id]/route.ts`: 실제 데이터 조회 구현 필요

## 환경 변수
- `NOTION_API_KEY`: 노션 Integration 시크릿 키
- `NOTION_DATABASE_ID`: 견적서 메인 DB ID
- `NEXT_PUBLIC_APP_URL`: 앱 기본 URL

## 기술 스택 확인
- Next.js 16.1.6 (Turbopack, `package.json`에 16.1.6으로 명시)
- React 19.2.3
- TailwindCSS v4 (CSS-first, globals.css만 사용)
- shadcn/ui New York 스타일, Neutral 컬러

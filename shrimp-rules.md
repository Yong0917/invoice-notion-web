# 개발 가이드라인 (AI Agent용)

## 프로젝트 개요

- **목적**: 노션 데이터베이스 기반 견적서 웹뷰어 MVP
- **스택**: Next.js 16 (App Router), TypeScript 5, React 19, TailwindCSS v4, shadcn/ui, Notion API
- **배포**: Vercel

---

## 디렉토리 구조

```
src/app/               # Next.js App Router (실제 앱 라우트)
  layout.tsx           # 루트 레이아웃
  page.tsx             # 홈페이지
  providers.tsx        # ThemeProvider + TooltipProvider
  globals.css          # 전역 CSS
  api/invoice/[id]/
    route.ts           # GET /api/invoice/[id] - 견적서 API
  invoice/[id]/
    page.tsx           # 견적서 조회 페이지 (/invoice/:id)
components/
  ui/                  # shadcn/ui 컴포넌트
  layout/              # Header, Footer, MobileNav, ThemeToggle
  common/              # PageHeader, LoadingSpinner
hooks/                 # useMediaQuery, useLocalStorage, useDebounce, useMounted
lib/
  utils.ts             # cn() 유틸리티
  helpers.ts           # 문자열/날짜/숫자 유틸리티
  constants.ts         # SITE_CONFIG, NAV_ITEMS
  notion.ts            # 노션 API 클라이언트 (구현 예정)
types/
  index.ts             # 공통 타입 (NavItem, ApiResponse, Theme 등)
  invoice.ts           # 견적서 도메인 타입
```

---

## 경로 별칭 규칙

- `@/*` → 프로젝트 루트 (`./`)
- **올바른 예**: `@/components/ui/button`, `@/lib/notion`, `@/types/invoice`
- **잘못된 예**: `../../../components/ui/button` (상대경로 사용 금지)

---

## 파일 위치 결정 규칙

| 추가할 것 | 위치 |
|-----------|------|
| 새 페이지 라우트 | `src/app/[경로]/page.tsx` |
| 새 API 라우트 | `src/app/api/[경로]/route.ts` |
| 재사용 컴포넌트 | `components/[도메인]/` |
| 도메인 전용 컴포넌트 | `components/invoice/` (없으면 생성) |
| 새 커스텀 훅 | `hooks/use-[이름].ts` |
| 비즈니스 로직/유틸 | `lib/[이름].ts` |
| 새 타입 정의 | `types/invoice.ts` (견적서) 또는 `types/index.ts` (공통) |

---

## Next.js 15+ 필수 패턴

### params는 반드시 Promise로 받는다

```typescript
// 올바른 예
interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const { id } = await params
}

// 잘못된 예 (Next.js 14 이하 방식 - 사용 금지)
interface PageProps {
  params: { id: string }
}
```

### API 라우트 동적 캐시 설정

- 노션 API처럼 실시간 데이터는 `export const dynamic = 'force-dynamic'` 추가

### API 응답은 반드시 `ApiResponse<T>` 타입 사용

```typescript
// types/index.ts에 정의된 타입
type ApiResponse<T> =
  | { data: T; success: true }
  | { error: string; success: false }

// API 라우트 반환 예
return NextResponse.json<ApiResponse<Invoice>>({ success: true, data: invoice })
return NextResponse.json<ApiResponse<Invoice>>({ success: false, error: '...' }, { status: 404 })
```

---

## 노션 API 연동 규칙

### 현재 상태

- `@notionhq/client` 미설치
- `lib/notion.ts`의 모든 함수가 TODO 주석 처리 상태
- `src/app/api/invoice/[id]/route.ts`가 501 상태 반환 중

### 노션 연동 구현 순서

1. `npm install @notionhq/client` 설치
2. `lib/notion.ts`의 주석 해제 및 실제 구현
3. `src/app/api/invoice/[id]/route.ts`에서 `getInvoiceById()` 호출
4. `src/app/invoice/[id]/page.tsx`에서 API 연동

### 환경 변수 (`.env.local`에 설정)

| 변수명 | 설명 |
|--------|------|
| `NOTION_API_KEY` | 노션 Integration 시크릿 키 |
| `NOTION_QUOTE_DB_ID` | 견적서 메인 DB ID |
| `NOTION_QUOTE_ITEM_DB_ID` | 견적 항목 DB ID |
| `NOTION_SENDER_DB_ID` | 발행자 정보 DB ID |
| `NEXT_PUBLIC_APP_URL` | 앱 기본 URL |
| `QUOTES_ADMIN_PATH` | 관리자 경로 (기본값: quotes) |

- 환경 변수는 서버 사이드 전용 (`NEXT_PUBLIC_` 접두사 없음)
- `lib/notion.ts`에서 `NOTION_DATABASE_ID` 변수 사용 중 → 실제 구현 시 `NOTION_QUOTE_DB_ID`로 변경

---

## 타입 사용 규칙

### 견적서 관련 타입은 `types/invoice.ts` 사용

```typescript
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/types/invoice'
```

### 공통 타입은 `types/index.ts` 사용

```typescript
import type { ApiResponse, NavItem, SiteConfig } from '@/types'
```

### 타입 확장 규칙

- 견적서 도메인 타입 추가 → `types/invoice.ts`
- 공통/인프라 타입 추가 → `types/index.ts`
- 새 도메인 생성 시 → `types/[도메인].ts` 새 파일 생성

---

## PDF 생성 구현 규칙

- PRD 기준 `@react-pdf/renderer` 또는 Puppeteer 사용 예정
- PDF API 라우트 위치: `src/app/api/generate-pdf/route.ts`
- PDF 생성 컴포넌트 위치: `components/invoice/invoice-pdf.tsx`

---

## 스타일링 규칙

- TailwindCSS v4 CSS-first 방식 사용 (`tailwind.config.js` 없음)
- 테마 변수는 `src/app/globals.css`의 `@theme inline {}` 블록에서 관리
- 다크모드: `next-themes` 사용, `.dark` 클래스가 `<html>`에 토글됨
- shadcn/ui 추가: `npx shadcn@latest add [컴포넌트명]`
- 컴포넌트 설치 경로: `components/ui/`

---

## 다중 파일 동시 수정 규칙

| 수정 작업 | 함께 수정해야 할 파일 |
|-----------|----------------------|
| 네비게이션 항목 변경 | `lib/constants.ts`의 `NAV_ITEMS` (자동으로 Header, MobileNav 반영) |
| 사이트 메타 정보 변경 | `lib/constants.ts`의 `SITE_CONFIG` |
| 새 견적서 타입 필드 추가 | `types/invoice.ts` → `lib/notion.ts`의 매핑 함수도 수정 |
| 새 API 엔드포인트 추가 | `src/app/api/[경로]/route.ts` 생성 → 필요 시 `lib/`에 헬퍼 추가 |

---

## 금지 사항

- **`src/` 디렉토리에 `components/`, `hooks/`, `lib/`, `types/` 생성 금지** → 루트에 위치
- **상대 경로 import 금지** (`../../components/...`) → `@/` 별칭 사용
- **`tailwind.config.js` 생성 금지** → `globals.css`에서 테마 관리
- **클라이언트 컴포넌트에서 노션 API 직접 호출 금지** → Server Component 또는 API Route 통해서만
- **`NOTION_API_KEY`에 `NEXT_PUBLIC_` 접두사 추가 금지** → 서버 사이드 전용
- **`params`를 동기적으로 접근 금지** → `await params` 반드시 사용 (Next.js 15)
- **`components/ui/` 직접 수정 후 `npx shadcn add` 재실행 금지** → shadcn 덮어씀

---

## AI 판단 기준

### 새 기능 구현 위치 결정

```
데이터 조회/변환 로직 → lib/ 또는 lib/notion.ts
UI 렌더링 → components/
페이지 라우트 → src/app/[경로]/page.tsx
외부 API 연동 → src/app/api/[경로]/route.ts 또는 lib/
```

### 노션 TODO 코드 활성화 판단

- `@notionhq/client` 설치 여부 확인 후 주석 해제
- 함수 시그니처 변경 시 `types/invoice.ts` 먼저 업데이트
- 모든 노션 API 호출은 서버 사이드에서만

### 컴포넌트 신규 생성 판단

- 2개 이상의 페이지에서 재사용 → `components/[도메인]/`
- 단일 페이지 전용 → 해당 페이지 파일 내 정의 또는 `components/invoice/`

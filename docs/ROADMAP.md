# 노션 기반 견적서 관리 시스템 — UI 개선 로드맵

> 마지막 업데이트: 2026-02-23
> 버전: v1.2
> 참고 문서: docs/roadmaps/ROADMAP_v2.md (Phase 5~6 완료 기준)

---

## 프로젝트 개요

Phase 0~6 구현이 완료된 견적서 웹 앱에서 실사용 중 발견된 UX 문제점 4가지를 수정한다.
홈페이지에서 관리자 화면으로 이동할 경로가 없고, 관리자 대시보드 테이블의 액션 컬럼 정렬이 어긋나 있으며,
데이터 갱신을 위해 브라우저 새로고침이 필요하고, 견적서가 증가함에 따라 페이징이 없어 목록 전체가 노출되는 문제를 해결한다.

---

## 현재 라우트 구조

```
src/app/
├── (public)/
│   ├── page.tsx                      # 홈 페이지 (관리자 이동 버튼 추가 대상)
│   └── ...
└── (admin)/
    └── admin/
        └── page.tsx                  # 관리자 대시보드 (새로고침 버튼, 페이징 추가 대상)

components/
└── admin/
    ├── AdminHeader.tsx
    ├── InvoiceFilters.tsx
    ├── InvoiceListTable.tsx          # 정렬 수정, 페이징 추가 대상
    ├── SendEmailButton.tsx
    └── StatusChangeButton.tsx
```

---

## 성공 지표 (KPI)

- [x] 홈 페이지에서 관리자 대시보드로 직접 이동할 수 있다
- [x] 관리자 대시보드 테이블의 액션 컬럼 내 모든 요소가 수직 중앙 정렬된다
- [x] 새로고침 버튼 클릭으로 전체 페이지 리로드 없이 견적서 목록을 갱신할 수 있다
- [x] 견적서 목록이 10개 단위로 페이지네이션되어 표시된다

---

## 기술 스택

| 영역 | 기술 | 비고 |
|------|------|------|
| 프레임워크 | Next.js 16.1.6 (App Router) | `src/app/` 구조 |
| UI 컴포넌트 | shadcn/ui (New York 스타일) | `components/ui/` |
| 스타일링 | TailwindCSS v4 | CSS-first 방식, `globals.css` |
| 아이콘 | lucide-react | 기존 프로젝트와 동일 |
| 상태 관리 | React `useState`, `useMemo` | 클라이언트 컴포넌트 |

신규 패키지 설치 불필요. 기존 shadcn/ui 컴포넌트(`Button`, `Table`, `Pagination` 등) 내에서 해결한다.

---

## 개발 로드맵

---

### Phase A: 홈 페이지 관리자 이동 버튼 추가

**목표**: 홈 페이지(`src/app/(public)/page.tsx`)에 관리자 대시보드로 이동하는 버튼을 추가하여,
URL을 직접 입력하지 않고도 로그인 페이지 또는 대시보드에 접근할 수 있게 한다.

**완료 기준**:
- [x] 홈 페이지 하단 또는 히어로 섹션에 관리자 이동 버튼이 표시된다
- [x] 버튼 클릭 시 `/login` 또는 `/admin`으로 이동한다 (미인증 상태면 미들웨어가 자동으로 `/login`으로 리다이렉트)
- [x] 버튼은 기존 카드 섹션과 시각적으로 구분된다 (작고 덜 강조된 스타일 권장)

#### 영향 파일

| 파일 | 변경 유형 | 설명 |
|------|---------|------|
| `src/app/(public)/page.tsx` | TO_MODIFY | 관리자 이동 버튼 추가 |

#### 태스크

- [x] **A-1. 홈 페이지에 관리자 이동 버튼 추가** | 담당: 프론트엔드 | 예상: 0.5d | 우선순위: 높음 | **완료**

  구현 방법:
  - `src/app/(public)/page.tsx`의 기능 안내 카드 섹션 하단에 관리자 이동 버튼을 추가한다
  - 버튼은 `<a>` 태그 또는 Next.js `<Link>` 컴포넌트 사용, `href="/admin"` 설정
  - 미들웨어(`src/middleware.ts`)가 인증 여부를 검사하므로, 버튼 목적지를 `/admin`으로 단일화해도 무방하다
  - 스타일: `variant="outline"` 또는 `variant="ghost"` Button 컴포넌트 사용, `size="sm"`
  - 과도한 강조를 피하기 위해 `Lock` 또는 `Settings` 아이콘(lucide-react)을 텍스트 앞에 배치
  - 배치 위치: 기능 카드 섹션 하단, 별도 `<section>` 태그 또는 기존 섹션 내 우측 정렬

  예시 코드 구조 (pseudocode):
  ```
  import Link from 'next/link'
  import { Lock } from 'lucide-react'
  import { Button } from '@/components/ui/button'

  // 기능 카드 섹션 아래
  <section className="py-8 px-4 text-center">
    <Button asChild variant="outline" size="sm">
      <Link href="/admin">
        <Lock className="mr-1.5 h-3.5 w-3.5" />
        관리자 대시보드
      </Link>
    </Button>
  </section>
  ```

---

### Phase B: 관리자 대시보드 액션 컬럼 정렬 수정

**목표**: `components/admin/InvoiceListTable.tsx`의 액션 컬럼에서
`StatusChangeButton`(상태 배지 + 드롭다운)과 `SendEmailButton`(봉투 아이콘)의 수직 정렬을 일치시킨다.

**원인 분석**:
- `StatusChangeButton`은 `h-auto p-0`을 사용하는 ghost 버튼으로 높이가 배지 크기에 맞춰져 있다
- `SendEmailButton`은 `h-8 w-8`의 고정 크기 icon 버튼이다
- 두 버튼이 `flex items-center gap-1` 컨테이너 안에 있으나, 버튼의 내부 패딩 차이로 시각적 정렬이 어긋난다

**완료 기준**:
- [x] 같은 행(row)에서 상태 드롭다운과 이메일 버튼의 수직 중앙이 일치한다
- [x] 변경 후 `StatusChangeButton`의 클릭 영역과 `SendEmailButton`의 클릭 영역이 모두 정상 동작한다

#### 영향 파일

| 파일 | 변경 유형 | 설명 |
|------|---------|------|
| `components/admin/InvoiceListTable.tsx` | TO_MODIFY | 액션 컬럼 컨테이너 정렬 조정 |
| `components/admin/StatusChangeButton.tsx` | TO_MODIFY (선택) | 버튼 높이 통일을 위한 클래스 조정 |

#### 태스크

- [x] **B-1. 액션 컬럼 컨테이너 정렬 수정** | 담당: 프론트엔드 | 예상: 0.5d | 우선순위: 높음 | **완료** — `StatusChangeButton` 트리거에 `h-8 gap-1 px-1` 적용. 이메일 컬럼 `xl→2xl` 변경으로 1280px 오버플로우 해결

  구현 방법:
  - `InvoiceListTable.tsx`의 액션 `TableCell` 컨테이너를 확인한다
    ```tsx
    // 현재 코드 (Line 141)
    <div className="flex items-center gap-1">
      <StatusChangeButton ... />
      <SendEmailButton ... />
    </div>
    ```
  - 현재 `flex items-center`가 이미 적용되어 있으나, `StatusChangeButton`의 트리거 버튼이 `h-auto p-0`으로 설정되어 있어 정렬이 어긋날 수 있다
  - `StatusChangeButton.tsx`의 트리거 버튼 클래스를 점검한다:
    ```
    // StatusChangeButton.tsx Line 65-69
    className="h-auto gap-1 p-0 hover:bg-transparent"
    ```
  - 해결 방법 (두 가지 중 선택):
    1. **방법 1 (권장)**: `StatusChangeButton` 트리거의 높이를 `SendEmailButton`과 맞춘다
       - `StatusChangeButton` 트리거 버튼에 `h-8`을 명시적으로 추가
       - `className="h-8 gap-1 px-1 hover:bg-transparent"`
    2. **방법 2**: 컨테이너에 `items-center`를 `items-stretch`로 변경 후 내부 버튼에 `flex items-center` 추가
  - 수정 후 브라우저에서 여러 행을 확인하여 모든 상태(대기중/승인/거절)에서 정렬이 올바른지 검증

---

### Phase C: 관리자 대시보드 새로고침 버튼 추가

**목표**: 관리자 대시보드(`src/app/(admin)/admin/page.tsx`)에 새로고침 버튼을 추가하여,
브라우저 전체 새로고침 없이 견적서 목록 데이터를 갱신할 수 있게 한다.

**구현 방식 선택**:
- 현재 `admin/page.tsx`는 서버 컴포넌트로, `getInvoiceList()`를 서버에서 직접 호출한다
- Next.js App Router에서 서버 컴포넌트를 클라이언트에서 재실행하려면 `router.refresh()`를 사용한다
- `router.refresh()`는 현재 URL의 서버 컴포넌트를 재렌더링하며, 클라이언트 상태(React state)는 유지된다

**완료 기준**:
- [x] 대시보드 상단 헤더 영역에 새로고침 버튼이 표시된다
- [x] 버튼 클릭 시 `router.refresh()`가 호출되어 Notion에서 최신 데이터를 다시 불러온다
- [x] 로딩 중 버튼에 스피너가 표시된다
- [x] 새로고침 완료 후 스피너가 사라진다

#### 영향 파일

| 파일 | 변경 유형 | 설명 |
|------|---------|------|
| `src/app/(admin)/admin/page.tsx` | TO_MODIFY | 새로고침 버튼 컴포넌트 배치 |
| `components/admin/RefreshButton.tsx` | CREATE | 새로고침 버튼 클라이언트 컴포넌트 |

#### 태스크

- [x] **C-1. RefreshButton 클라이언트 컴포넌트 생성** | 담당: 프론트엔드 | 예상: 0.5d | 우선순위: 높음 | **완료**

  구현 파일: `components/admin/RefreshButton.tsx`

  구현 방법:
  - `'use client'` 지시어 필수
  - `useRouter` (from `next/navigation`)와 `useTransition` (from `react`) 사용
  - `router.refresh()` 호출 시 `startTransition` 내부에서 실행하여 `isPending` 상태로 로딩 감지
  - 버튼 구성: `variant="outline"`, `size="sm"`, `RefreshCw` 아이콘 (lucide-react)
  - `isPending` 이면 아이콘에 `animate-spin` 클래스 추가 및 버튼 비활성화

  예시 코드 구조 (pseudocode):
  ```
  'use client'
  import { useRouter } from 'next/navigation'
  import { useTransition } from 'react'
  import { RefreshCw } from 'lucide-react'
  import { Button } from '@/components/ui/button'

  export function RefreshButton() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    function handleRefresh() {
      startTransition(() => {
        router.refresh()
      })
    }

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isPending}
      >
        <RefreshCw className={cn('mr-1.5 h-4 w-4', isPending && 'animate-spin')} />
        새로고침
      </Button>
    )
  }
  ```

- [x] **C-2. 관리자 대시보드 헤더에 RefreshButton 배치** | 담당: 프론트엔드 | 예상: 0.5d | 우선순위: 높음 | **완료**

  구현 파일: `src/app/(admin)/admin/page.tsx`

  구현 방법:
  - 페이지 상단 제목(`견적서 관리`) 영역을 `flex justify-between items-center` 레이아웃으로 변경
  - 우측에 `<RefreshButton />` 배치
  - 현재 코드 (`admin/page.tsx` Line 43-49):
    ```tsx
    // 현재
    <div>
      <h1 className="text-2xl font-bold tracking-tight">견적서 관리</h1>
      <p className="text-sm text-muted-foreground">
        총 {counts.total}건의 견적서가 있습니다.
      </p>
    </div>

    // 수정 후
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">견적서 관리</h1>
        <p className="text-sm text-muted-foreground">
          총 {counts.total}건의 견적서가 있습니다.
        </p>
      </div>
      <RefreshButton />
    </div>
    ```

---

### Phase D: 견적서 목록 페이지네이션 구현 (10개 단위)

**목표**: `components/admin/InvoiceListTable.tsx`에 페이지네이션을 추가하여
전체 견적서 목록을 10개 단위로 분할 표시한다.

**구현 방식 선택**:
- 현재 목록은 클라이언트 사이드에서 `useMemo`로 필터링된다
- Notion API가 텍스트 검색을 지원하지 않으므로, 서버 사이드 페이징보다 클라이언트 사이드 페이징이 적합하다
- `filtered` 배열을 페이지 번호에 따라 슬라이싱하는 방식으로 구현한다
- URL 쿼리 파라미터(`?page=2`)로 페이지 상태를 관리하면 새로고침 후에도 현재 페이지가 유지된다

**완료 기준**:
- [x] 필터링된 결과가 10개를 초과할 때 페이지네이션 UI가 표시된다
- [x] 이전/다음 버튼과 페이지 번호 버튼이 표시된다
- [x] 현재 페이지 번호가 강조 표시된다
- [x] 검색어 또는 상태 필터 변경 시 자동으로 1페이지로 초기화된다
- [x] 총 페이지 수와 현재 표시 범위(예: "11-20 / 35건")가 표시된다

#### 영향 파일

| 파일 | 변경 유형 | 설명 |
|------|---------|------|
| `components/admin/InvoiceListTable.tsx` | TO_MODIFY | 페이지네이션 상태 및 슬라이싱 로직 추가, 페이징 UI 추가 |
| `components/admin/InvoiceFilters.tsx` | TO_MODIFY (선택) | 필터 변경 시 페이지 리셋을 위한 URL 파라미터 처리 |

#### 태스크

- [ ] **D-1. InvoiceListTable에 페이지네이션 상태 추가** | 담당: 프론트엔드 | 예상: 1d | 우선순위: 높음 | **미완료** — `useSearchParams`, `PAGE_SIZE`, `paginated` 슬라이싱 로직 없음

  구현 파일: `components/admin/InvoiceListTable.tsx`

  구현 방법:
  - `PAGE_SIZE` 상수를 파일 상단에 선언: `const PAGE_SIZE = 10`
  - `useSearchParams` (from `next/navigation`)로 URL 쿼리 파라미터에서 현재 페이지 번호 읽기
    ```
    const searchParamsHook = useSearchParams()
    const currentPage = Number(searchParamsHook.get('page') ?? '1')
    ```
  - `filtered` 배열 계산 후 페이지별 슬라이싱 처리:
    ```
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    )
    ```
  - 테이블 바디에서 `filtered.map(...)` 을 `paginated.map(...)`으로 교체
  - 필터(`searchParams.q`, `searchParams.status`) 변경 감지 시 페이지를 1로 리셋:
    - `useEffect`로 `searchParams.q` 또는 `searchParams.status` 변경을 감지
    - 변경 시 `router.push`로 `?page=1` (다른 쿼리 파라미터는 유지)

- [ ] **D-2. 페이지네이션 UI 컴포넌트 추가** | 담당: 프론트엔드 | 예상: 1d | 우선순위: 높음 | **미완료** — 테이블 하단 페이지네이션 UI 없음

  구현 파일: `components/admin/InvoiceListTable.tsx` (테이블 하단에 인라인 추가)

  UI 구성 요소:
  1. **표시 범위 텍스트** (좌측): `"11-20 / 35건"` 형태의 작은 텍스트
  2. **페이지 버튼** (우측): 이전(`ChevronLeft`), 숫자 버튼, 다음(`ChevronRight`)

  shadcn/ui Pagination 컴포넌트 활용 방법:
  ```bash
  # shadcn/ui Pagination 컴포넌트가 설치되어 있지 않은 경우
  npx shadcn@latest add pagination
  ```

  구현 방법 (shadcn/ui Pagination 컴포넌트 사용):
  ```
  import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
  } from '@/components/ui/pagination'

  // 테이블 하단 (div.rounded-md.border 안, Table 이후)
  {totalPages > 1 && (
    <div className="flex items-center justify-between border-t px-4 py-3">
      {/* 표시 범위 */}
      <p className="text-sm text-muted-foreground">
        {(currentPage - 1) * PAGE_SIZE + 1}-
        {Math.min(currentPage * PAGE_SIZE, filtered.length)} /
        {filtered.length}건
      </p>
      {/* 페이지 버튼 */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={buildPageUrl(currentPage - 1)} />
          </PaginationItem>
          {/* 페이지 번호 버튼 — 최대 5개 표시, 초과 시 Ellipsis */}
          {pageNumbers.map((num) => (
            <PaginationItem key={num}>
              <PaginationLink
                href={buildPageUrl(num)}
                isActive={num === currentPage}
              >
                {num}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href={buildPageUrl(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )}
  ```

  페이지 URL 생성 헬퍼 함수 (`buildPageUrl`):
  ```
  // 현재 쿼리 파라미터를 유지하면서 page만 변경
  function buildPageUrl(page: number): string {
    const params = new URLSearchParams(searchParamsHook.toString())
    params.set('page', String(Math.max(1, Math.min(page, totalPages))))
    return `?${params.toString()}`
  }
  ```

  페이지 번호 배열 생성 (최대 5개, 양 끝 + 현재 페이지 기준):
  ```
  // 예: 총 10페이지, 현재 5페이지 → [1, '...', 4, 5, 6, '...', 10]
  function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    // 시작, 끝 고정 + 현재 페이지 기준 ±1
    ...
  }
  ```

- [ ] **D-3. 필터 변경 시 1페이지 리셋 처리** | 담당: 프론트엔드 | 예상: 0.5d | 우선순위: 중간 | **미완료** — `InvoiceFilters.tsx`의 `router.push`에 `page` 파라미터 리셋 없음

  구현 파일: `components/admin/InvoiceFilters.tsx`

  구현 방법:
  - 현재 `InvoiceFilters.tsx`는 URL 쿼리 파라미터(`?q=`, `?status=`)를 변경하는 방식으로 동작한다
  - 검색어 또는 상태 변경 시 URL에서 `page` 파라미터를 제거(또는 `1`로 설정)한다
  - `router.push(url)` 호출 시 `?q=검색어&status=pending` 형태에서 `&page=1`을 명시적으로 포함시키거나, `page` 파라미터를 제거한다

  ```
  // InvoiceFilters.tsx의 URL 업데이트 함수에서
  params.delete('page')   // 페이지 리셋 (1페이지로 돌아감)
  // 또는
  params.set('page', '1')
  router.push(`?${params.toString()}`)
  ```

---

## 태스크 요약 (전체)

| 태스크 | 파일 | 예상 | 우선순위 |
|--------|------|------|---------|
| A-1. 홈 페이지 관리자 이동 버튼 추가 | `src/app/(public)/page.tsx` | 0.5d | 높음 |
| B-1. 액션 컬럼 정렬 수정 | `components/admin/InvoiceListTable.tsx`, `StatusChangeButton.tsx` | 0.5d | 높음 |
| C-1. RefreshButton 컴포넌트 생성 | `components/admin/RefreshButton.tsx` (신규) | 0.5d | 높음 |
| C-2. 대시보드 헤더에 RefreshButton 배치 | `src/app/(admin)/admin/page.tsx` | 0.5d | 높음 |
| D-1. InvoiceListTable 페이지네이션 상태 추가 | `components/admin/InvoiceListTable.tsx` | 1d | 높음 |
| D-2. 페이지네이션 UI 추가 | `components/admin/InvoiceListTable.tsx` | 1d | 높음 |
| D-3. 필터 변경 시 1페이지 리셋 | `components/admin/InvoiceFilters.tsx` | 0.5d | 중간 |

**전체 예상 소요 시간**: 4.5일 (1인 기준)

---

## 의존성 순서

```
A-1 (홈 버튼) — 독립 태스크, 즉시 착수 가능

B-1 (정렬 수정) — 독립 태스크, 즉시 착수 가능

C-1 (RefreshButton 생성)
  └─ C-2 (대시보드 배치) — C-1 완료 후 착수

D-1 (페이지네이션 상태)
  └─ D-2 (페이지네이션 UI) — D-1 완료 후 착수
      └─ D-3 (필터 리셋 연동) — D-1/D-2 완료 후 착수
```

A, B, C, D 네 가지 Phase는 서로 독립적이므로 병렬 진행 가능하다.

---

## 리스크 및 완화 전략

| 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|--------|--------|------------|----------|
| `useSearchParams()`는 클라이언트 컴포넌트에서만 사용 가능 | 중간 | 확실 | `InvoiceListTable`이 이미 `'use client'` 컴포넌트이므로 문제 없음. `Suspense` 경계 없이 사용 시 Next.js 빌드 경고 발생 가능 — `Suspense`로 감싸거나 `props`로 searchParams 전달 방식 유지 |
| Pagination shadcn/ui 컴포넌트 미설치 | 낮음 | 중간 | `npx shadcn@latest add pagination`으로 즉시 설치 가능. 대안으로 `ChevronLeft`/`ChevronRight` 아이콘 + 직접 구현도 가능 |
| 필터 변경 + 페이지 상태 동기화 누락 | 중간 | 중간 | D-3 태스크에서 `InvoiceFilters.tsx`의 URL 업데이트 로직에 `page` 파라미터 제거를 명시적으로 추가하여 해결 |
| `router.refresh()` 실행 중 로딩 상태 감지 어려움 | 낮음 | 중간 | `useTransition`의 `isPending`으로 `startTransition(() => router.refresh())` 감싸면 로딩 상태 추적 가능. Next.js 공식 권장 방식 |
| 정렬 수정 후 특정 상태(대기중/승인/거절)에서 배지 크기 차이로 재발 | 낮음 | 낮음 | 수정 후 3가지 상태 모두 수동 확인 필요. 픽스 방식을 명시적 높이(`h-8`) 지정으로 통일하면 배지 크기와 무관하게 안정적 |

---

## 보류 사항 및 미결 질문

| 번호 | 항목 | 현재 상태 |
|------|------|----------|
| Q1 | 관리자 이동 버튼을 홈 하단에 배치할지, 또는 Header 컴포넌트에 추가할지 | 미결: 홈 하단 배치를 기본으로 하되, Header에 추가하는 방식도 검토 필요 |
| Q2 | 페이지네이션을 URL 기반(`?page=N`)으로 할지, 클라이언트 `useState`로 할지 | URL 기반 권장 (새로고침 후 유지, 링크 공유 가능). 단, `useSearchParams()` Suspense 경계 처리 필요 |
| Q3 | `shadcn/ui` Pagination 컴포넌트가 현재 프로젝트에 설치되어 있는지 확인 필요 | 설치 여부에 따라 `npx shadcn@latest add pagination` 실행 필요 |

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| v1.0 | 2026-02-23 | 최초 작성: 홈 관리자 버튼, 액션 정렬, 새로고침 버튼, 페이지네이션 4가지 UI 개선 로드맵 |
| v1.1 | 2026-02-23 | 진행 상태 동기화: Phase A(A-1) 완료 확인, Phase B/C/D 미완료 상태 명시 |

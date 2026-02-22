# 노션 기반 견적서 관리 시스템 고도화 로드맵

> 마지막 업데이트: 2026-02-22
> 버전: v2.1
> 기준 문서: docs/roadmaps/ROADMAP_v1.md (MVP 완료 기준)

---

## 프로젝트 개요

노션 데이터베이스를 백엔드로 활용하여 프리랜서/소규모 기업이 견적서를 관리하고, 클라이언트가 고유 URL로 접속하여 견적서를 웹에서 조회하고 PDF로 다운로드할 수 있는 경량 시스템이다.

MVP(Phase 0~4) 완료를 기준으로, 본 문서는 관리 기능, 자동화, 고급 기능 순으로 단계적 고도화 계획을 정의한다.

---

## 완료 현황 (Phase 0~5)

| Phase | 내용 | 완료일 | 주요 산출물 |
|-------|------|--------|-------------|
| Phase 0 | 환경 설정 및 Notion 연동 기반 구축 | 2026-02-22 | `lib/notion.ts`, `@notionhq/client@2` 설치, 환경 변수 확정 |
| Phase 1 | 견적서 조회 페이지 구현 | 2026-02-22 | `InvoiceView`, `InvoiceHeader`, `InvoiceItemsTable`, `InvoiceSummary` |
| Phase 2 | PDF 다운로드 구현 | 2026-02-22 | `InvoicePDF`, `PDFDownloadButton`, `/api/invoice/[id]/pdf` |
| Phase 3 | 반응형 레이아웃 및 UX 완성 | 2026-02-22 | `loading.tsx`, `error.tsx`, OG 메타태그, 375/768/1280px 검증 |
| Phase 4 | 배포 및 운영 준비 | 2026-02-22 | `next.config.ts` 최적화, 프로덕션 빌드, E2E 테스트 통과 |
| Phase 5 | 관리 기능 | 2026-02-22 | `auth.ts`, `AdminHeader`, `InvoiceListTable`, `StatusChangeButton`, `/api/admin/invoice/[id]/status` |

### 현재 라우트 구조

```
src/app/
├── layout.tsx                        # 루트 레이아웃 (HTML, body, Providers만)
├── (public)/                         # Header/Footer 포함 레이아웃
│   ├── layout.tsx
│   ├── page.tsx                      # 홈 (서비스 소개)
│   ├── login/
│   │   └── page.tsx                  # 관리자 로그인 페이지
│   └── invoice/
│       └── [id]/
│           ├── page.tsx              # 견적서 조회 페이지
│           ├── loading.tsx           # 스켈레톤 UI
│           ├── error.tsx             # 에러 경계
│           └── not-found.tsx         # 커스텀 404
├── (admin)/                          # AdminHeader만 포함 레이아웃
│   ├── layout.tsx
│   └── admin/
│       └── page.tsx                  # 관리자 대시보드
└── api/
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts              # NextAuth 핸들러
    ├── invoice/
    │   └── [id]/
    │       ├── route.ts              # GET /api/invoice/[id]
    │       └── pdf/
    │           └── route.tsx         # GET /api/invoice/[id]/pdf
    └── admin/
        └── invoice/
            └── [id]/
                └── status/
                    └── route.ts      # PATCH /api/admin/invoice/[id]/status
```

### 현재 환경 변수

```env
NOTION_API_KEY=...
NOTION_QUOTE_DB_ID=...
NOTION_QUOTE_ITEM_DB_ID=...
NOTION_SENDER_DB_ID=...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
QUOTES_ADMIN_PATH=quotes

# Phase 5 추가
AUTH_SECRET=...
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=\$2b\$12\$...   # bcrypt 해시 ($는 \$로 이스케이프)
```

---

## 성공 지표 (고도화 목표)

- [x] 관리자가 웹 UI에서 견적서 목록 조회, 상태 변경, 검색이 가능하다
- [ ] 견적서 발행 시 클라이언트에게 이메일이 자동으로 발송된다
- [ ] 유효기간 만료 D-3, D-1 시점에 알림 이메일이 자동 발송된다
- [ ] 클라이언트가 견적서를 열람했는지 관리자가 확인할 수 있다
- [ ] 관리자가 여러 PDF 레이아웃 중 하나를 선택할 수 있다

---

## 기술 스택 (현재 + 예정)

| 영역 | 현재 기술 | 추가 예정 기술 | 추가 Phase |
|------|-----------|---------------|------------|
| 프레임워크 | Next.js 16.1.6 (App Router) | — | — |
| 인증 | 없음 | NextAuth.js v5 | Phase 5 |
| 이메일 | 없음 | Resend | Phase 6 |
| 스케줄러 | 없음 | Vercel Cron Jobs | Phase 6 |
| 전자 서명 | 없음 | 미결 (DocuSign / 자체 구현) | Phase 7 |
| 다국어 | 없음 | next-intl | Phase 7 |
| 패키지 관리 | npm | — | — |

---

## 고도화 로드맵

---

### Phase 5: 관리 기능 ✅ 완료 (2026-02-22)

**목표**: 관리자가 웹 UI에서 견적서를 관리할 수 있다. Notion 앱에 들어가지 않고도 상태 변경, 검색, 목록 조회가 가능하다.

**완료 기준**:
- [x] 관리자 로그인 성공 시 `/admin` 대시보드 접근 가능
- [x] 비로그인 상태에서 `/admin` 접근 시 로그인 페이지로 리다이렉트
- [x] 견적서 목록에서 상태 필터(전체/대기중/승인/거절) 동작
- [ ] 날짜 범위 필터 동작 — **미구현** (클라이언트 사이드 필터링 범위에서 제외됨)
- [x] 견적서 상태 변경(승인/거절) 후 Notion DB에 반영 확인
- [x] 견적서 번호 또는 고객명으로 검색 동작

#### 신규 환경 변수

```env
# 관리자 계정 (NextAuth Credentials Provider)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=...        # bcrypt 해시값

# NextAuth 세션 암호화 키 (32자 이상 랜덤 문자열)
AUTH_SECRET=...
```

#### 신규 패키지 의존성

```bash
npm install next-auth@beta      # NextAuth.js v5 (App Router 지원)
npm install bcryptjs            # 패스워드 해시 비교
npm install @types/bcryptjs -D
```

> 주의: NextAuth.js v5는 App Router 전용 API를 사용한다. `auth.ts` 파일을 프로젝트 루트에 생성한다.

#### 데이터 모델 변경사항

- Notion DB 변경 없음. 상태 변경은 기존 `status` select 프로퍼티를 PATCH API로 업데이트한다.
- `lib/notion.ts`에 `updateInvoiceStatus(pageId, status)` 함수 추가.
- `lib/notion.ts`에 `searchInvoices(query, dateRange)` 함수 추가.

#### 태스크

**5-1. NextAuth.js 인증 기반 구축**

- [x] `npm install next-auth@beta bcryptjs @types/bcryptjs` 패키지 설치 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 빨강
- [x] `auth.ts` (프로젝트 루트) — NextAuth 설정 파일 생성 | 담당: 풀스택 | 예상: 1d | 우선순위: 빨강
  - Credentials Provider 설정 (이메일 + 비밀번호)
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` 환경 변수로 단일 관리자 계정 검증
  - `bcryptjs.compare()` 로 패스워드 해시 비교
  - JWT 세션 전략 사용 (`strategy: 'jwt'`)
- [x] `src/app/api/auth/[...nextauth]/route.ts` — NextAuth App Router 핸들러 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 빨강
- [x] `src/middleware.ts` — `/admin/**` 경로 인증 미들웨어 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 빨강
  - 미인증 시 `/login`으로 리다이렉트 (callbackUrl 저장)
  - `/login` 페이지는 보호 대상에서 제외
  - **주의**: `src` 디렉토리 사용 시 반드시 `src/middleware.ts`에 위치 (루트는 무시됨)
- [x] `src/app/(public)/login/page.tsx` — 로그인 페이지 | 담당: 프론트엔드 | 예상: 1d | 우선순위: 빨강
  - 이메일 + 비밀번호 폼 (shadcn/ui `Input`, `Button`)
  - 로그인 실패 시 에러 메시지 표시
  - 로그인 성공 시 `/admin`으로 리다이렉트
- [x] `.env.local` 및 `.env.example`에 `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` 추가 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 빨강
  - **주의**: `.env.local`에서 bcrypt 해시의 `$`는 `\$`로 이스케이프 필요

**5-2. 관리자 레이아웃 및 대시보드**

- [x] `src/app/(admin)/layout.tsx` — 관리자 레이아웃 (탑바) | 담당: 프론트엔드 | 예상: 1d | 우선순위: 빨강
  - `AdminHeader` 컴포넌트 (`components/admin/AdminHeader.tsx`)
  - 로그아웃 버튼 (`signOut()` 호출, callbackUrl: '/login')
  - 현재 관리자 이메일 표시
- [x] `src/app/(admin)/admin/page.tsx` — 견적서 목록 대시보드 | 담당: 풀스택 | 예상: 2d | 우선순위: 빨강
  - `getInvoiceList()` 서버 컴포넌트 호출
  - 상태 요약 카드 (전체/대기중/승인/거절 건수)
  - `InvoiceFilters` + `InvoiceListTable` 통합

**5-3. 견적서 목록 및 필터링**

- [x] `components/admin/InvoiceListTable.tsx` — 견적서 목록 테이블 | 담당: 프론트엔드 | 예상: 2d | 우선순위: 빨강
  - 컬럼: 견적번호, 고객명, 발행일, 유효기간, 합계금액, 상태, 액션(상태변경)
  - shadcn/ui `Table` 컴포넌트 활용
  - 견적서 번호 클릭 시 `/invoice/[id]` 새 탭으로 이동
  - 클라이언트 사이드 필터링 (searchParams.q, searchParams.status 기반)
- [x] `components/admin/InvoiceFilters.tsx` — 검색 및 필터 UI | 담당: 프론트엔드 | 예상: 1d | 우선순위: 노랑
  - 고객명/견적번호 텍스트 검색 인풋 (300ms 디바운스)
  - 상태 필터 탭 (전체 / 대기중 / 승인 / 거절)
  - URL 쿼리 파라미터(`?status=&q=`)로 필터 상태 동기화
- [ ] 발행일 날짜 범위 피커 (shadcn/ui `Calendar` + `Popover`) — **미구현** (Phase 6 이전에 추가 가능)
- [ ] `lib/notion.ts` — `searchInvoices(params)` 함수 — **불필요**: 클라이언트 사이드 필터링으로 대체 (Notion API 텍스트 검색 미지원)

**5-4. 견적서 상태 변경**

- [x] `lib/notion.ts` — `updateInvoiceStatus(pageId, status)` 함수 추가 | 담당: 백엔드 | 예상: 1d | 우선순위: 빨강
  - `pages.update()` PATCH 호출로 `status` select 프로퍼티 변경
  - 유효한 상태값(`pending` / `approved` / `rejected`) 검증
- [x] `src/app/api/admin/invoice/[id]/status/route.ts` — 상태 변경 API | 담당: 백엔드 | 예상: 1d | 우선순위: 빨강
  - PATCH 핸들러 구현
  - 세션 인증 검증 (`auth()` 호출, 미인증 시 401 반환)
  - 요청 body에서 `status` 값 추출 및 `updateInvoiceStatus()` 호출
- [x] `components/admin/StatusChangeButton.tsx` — 상태 변경 버튼 | 담당: 프론트엔드 | 예상: 1d | 우선순위: 빨강
  - 현재 상태 표시 (배지)
  - 드롭다운으로 상태 선택 (shadcn/ui `DropdownMenu`)
  - 변경 중 로딩 상태, 성공/실패 토스트 (sonner)
  - 낙관적 UI 업데이트 (로컬 state + 실패 시 롤백)

---

### Phase 6: 자동화 (예상 3주)

**목표**: 반복적인 수동 작업(이메일 발송, 만료 알림)을 자동화하여 운영 부담을 줄인다.

**완료 기준**:
- 관리자가 견적서 URL을 포함한 이메일을 버튼 클릭 한 번으로 클라이언트에게 발송
- Vercel Cron Job이 매일 자정에 실행되어 만료 D-3, D-1 견적서 대상 알림 이메일 발송
- 클라이언트가 견적서 페이지 접근 시 열람 기록(최초 열람 시간)이 Notion에 저장

#### 신규 환경 변수

```env
# Resend 이메일 API
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com   # Resend에서 인증된 발신자 도메인

# Vercel Cron 보안 토큰 (임의의 긴 문자열)
CRON_SECRET=...
```

#### 신규 패키지 의존성

```bash
npm install resend                  # 이메일 발송 SDK
```

#### 데이터 모델 변경사항 (Notion DB)

견적서 DB(`NOTION_QUOTE_DB_ID`)에 다음 컬럼 추가:

| 속성명 | 타입 | 매핑 필드 | 설명 |
|--------|------|-----------|------|
| 클라이언트 이메일 | email | `client_email` | 이메일 발송 대상 |
| 열람일시 | date | `viewed_at` | 최초 열람 시간 (ISO 8601) |

`types/invoice.ts`의 `Invoice` 인터페이스에 `client_email`, `viewed_at` 필드 추가.
`lib/notion.ts`의 `mapToInvoice()` 함수에 신규 필드 매핑 추가.

#### 태스크

**6-1. 이메일 발송 기반 구축**

- [ ] `npm install resend` 패키지 설치 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 빨강
- [ ] Resend 계정 생성 및 발신 도메인 인증 (DNS 설정) | 담당: DevOps | 예상: 1d | 우선순위: 빨강
  - SPF, DKIM 레코드 등록
  - `RESEND_API_KEY`, `EMAIL_FROM` 환경 변수 설정
- [ ] `lib/email.ts` — Resend 클라이언트 초기화 및 이메일 발송 헬퍼 | 담당: 백엔드 | 예상: 1d | 우선순위: 빨강
  - `sendInvoiceEmail(invoice, recipientEmail)` 함수 구현
  - `sendExpiryReminderEmail(invoice, recipientEmail, daysLeft)` 함수 구현

**6-2. 견적서 발송 이메일 템플릿**

- [ ] `components/email/InvoiceEmailTemplate.tsx` — 이메일 HTML 템플릿 | 담당: 프론트엔드 | 예상: 2d | 우선순위: 빨강
  - React 컴포넌트 기반 HTML 이메일 (Resend의 `render()` 함수 활용)
  - 견적서 번호, 고객명, 합계금액, 유효기간, 열람 URL 포함
  - 반응형 이메일 레이아웃 (인라인 스타일 필수)
- [ ] `components/email/ExpiryReminderEmailTemplate.tsx` — 만료 알림 이메일 템플릿 | 담당: 프론트엔드 | 예상: 1d | 우선순위: 노랑
  - 만료 D-3 / D-1 텍스트 분기 처리
- [ ] `src/app/api/admin/invoice/[id]/send-email/route.ts` — 이메일 발송 API | 담당: 백엔드 | 예상: 1d | 우선순위: 빨강
  - POST 핸들러, 세션 인증 검증
  - `getInvoiceById()` 호출로 견적서 데이터 조회
  - `sendInvoiceEmail()` 호출
  - 발송 성공 시 Notion DB의 `발송일시` 프로퍼티 업데이트 (선택)

**6-3. 관리자 UI에 이메일 발송 버튼 추가**

- [ ] `components/admin/SendEmailButton.tsx` — 이메일 발송 버튼 | 담당: 프론트엔드 | 예상: 1d | 우선순위: 노랑
  - 클라이언트 이메일 미설정 시 버튼 비활성화 + 툴팁 안내
  - 발송 중 로딩, 성공/실패 토스트
  - 중복 발송 방지 (확인 다이얼로그, shadcn/ui `AlertDialog`)
- [ ] `src/app/admin/page.tsx` — `SendEmailButton` 목록 테이블에 통합 | 담당: 프론트엔드 | 예상: 0.5d | 우선순위: 노랑

**6-4. 유효기간 만료 알림 Cron Job**

- [ ] `src/app/api/cron/expiry-reminder/route.ts` — Cron Job 핸들러 | 담당: 백엔드 | 예상: 2d | 우선순위: 노랑
  - `Authorization: Bearer ${CRON_SECRET}` 헤더 검증
  - `getInvoiceList()` 호출 후 `valid_until` 기준 D-3, D-1 필터링
  - 해당 견적서 클라이언트에게 `sendExpiryReminderEmail()` 호출
  - 오류 발생 시 개별 건 스킵, 전체 결과 로그 반환
- [ ] `vercel.json` — Cron Job 설정 | 담당: DevOps | 예상: 0.5d | 우선순위: 노랑
  ```json
  {
    "crons": [
      {
        "path": "/api/cron/expiry-reminder",
        "schedule": "0 0 * * *"
      }
    ]
  }
  ```
- [ ] Vercel 대시보드에서 `CRON_SECRET` 환경 변수 설정 | 담당: DevOps | 예상: 0.5d | 우선순위: 노랑

**6-5. 클라이언트 열람 여부 트래킹**

- [ ] `src/app/api/invoice/[id]/view/route.ts` — 열람 기록 API | 담당: 백엔드 | 예상: 1d | 우선순위: 초록
  - POST 핸들러 (인증 불필요)
  - Notion DB의 해당 견적서 페이지에 `viewed_at` 날짜 프로퍼티 업데이트
  - 이미 `viewed_at`이 설정된 경우 무시 (최초 열람만 기록)
- [ ] `lib/notion.ts` — `markInvoiceViewed(pageId)` 함수 추가 | 담당: 백엔드 | 예상: 0.5d | 우선순위: 초록
  - `pages.update()` PATCH 호출로 `viewed_at` 날짜 설정
- [ ] `src/app/invoice/[id]/page.tsx` — 페이지 조회 시 열람 기록 API 호출 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 초록
  - 서버 컴포넌트에서 `fetch('/api/invoice/[id]/view', { method: 'POST' })` 호출
  - 비동기로 처리, 실패해도 페이지 렌더링에 영향 없도록 처리
- [ ] `components/admin/InvoiceListTable.tsx` — 열람 여부 컬럼 추가 | 담당: 프론트엔드 | 예상: 0.5d | 우선순위: 초록
  - 열람일시 표시 (미열람 시 "미열람" 배지)

---

### Phase 7: 고급 기능 (예상 5~7주)

**목표**: 다중 PDF 템플릿, 전자 서명, 견적서 버전 관리, 다국어 지원으로 제품 완성도를 높인다.

**완료 기준**:
- 관리자가 PDF 레이아웃 스타일을 최소 2가지 중 선택 가능
- 클라이언트가 웹에서 서명 후 Notion에 서명 완료 상태 저장
- 견적서 수정 시 이전 버전이 이력으로 남아 조회 가능
- 한국어/영어 전환 버튼이 견적서 조회 페이지에 표시

> 주의: Phase 7의 각 기능은 규모가 크므로, 착수 전 세부 설계 문서를 별도로 작성할 것을 권장한다.

#### 신규 환경 변수 (예상)

```env
# 다국어 (next-intl)
NEXT_PUBLIC_DEFAULT_LOCALE=ko

# 전자 서명 — 자체 구현 방식 선택 시 추가 변수 없음
# 외부 API 방식(DocuSign 등) 선택 시 해당 서비스의 API 키 추가 필요
```

#### 신규 패키지 의존성 (예상)

```bash
npm install next-intl               # 다국어 지원
npm install react-signature-canvas  # 자체 전자 서명 캔버스 (자체 구현 방식)
```

#### 데이터 모델 변경사항

**견적서 DB에 추가 필요한 컬럼**:

| 속성명 | 타입 | 설명 |
|--------|------|------|
| PDF 템플릿 | select | `standard` / `minimal` / `premium` |
| 서명 이미지 URL | url | 클라이언트 서명 이미지 (외부 스토리지 또는 Notion 파일) |
| 서명일시 | date | 전자 서명 완료 시간 |
| 버전 | number | 현재 견적서 버전 번호 |
| 원본 견적서 | relation | 견적서 수정 시 이전 버전 페이지 연결 |

#### 태스크

**7-1. 다중 PDF 템플릿 지원**

- [ ] `components/invoice/InvoicePDFMinimal.tsx` — 미니멀 PDF 템플릿 | 담당: 프론트엔드 | 예상: 2d | 우선순위: 노랑
  - 현재 `InvoicePDF.tsx`를 기반으로 간소화된 레이아웃 구현
  - 로고 영역 제거, 단색 배경, 컴팩트한 폰트 크기
- [ ] `components/invoice/InvoicePDFPremium.tsx` — 프리미엄 PDF 템플릿 | 담당: 프론트엔드 | 예상: 3d | 우선순위: 노랑
  - 컬러 헤더 배너, 회사 로고 이미지 지원, 정교한 레이아웃
  - 로고 이미지는 `SENDER_LOGO_URL` 환경 변수로 관리
- [ ] `components/invoice/InvoicePDFFactory.ts` — PDF 템플릿 선택 팩토리 | 담당: 프론트엔드 | 예상: 0.5d | 우선순위: 노랑
  - `getInvoicePDFComponent(template: string)` 함수 구현
  - 알 수 없는 템플릿 값은 `standard`로 fallback
- [ ] `src/app/api/invoice/[id]/pdf/route.tsx` — 템플릿 파라미터 지원 | 담당: 백엔드 | 예상: 1d | 우선순위: 노랑
  - URL 쿼리 파라미터 `?template=standard|minimal|premium` 처리
  - Notion DB에서 `PDF 템플릿` 속성 읽어 기본값으로 사용
- [ ] `components/admin/TemplateSelector.tsx` — 템플릿 선택 UI | 담당: 프론트엔드 | 예상: 1d | 우선순위: 초록
  - 관리자 대시보드에서 견적서별 PDF 템플릿 변경
  - shadcn/ui `RadioGroup` 또는 `Select` 활용

**7-2. 전자 서명 기능**

> 설계 결정 필요: 자체 캔버스 구현 vs 외부 서비스(DocuSign/Adobe Sign) API 연동. 비용과 법적 효력 기준으로 결정할 것.

- [ ] 전자 서명 방식 결정 및 설계 문서 작성 | 담당: 전체 | 예상: 2d | 우선순위: 노랑
- [ ] `components/invoice/SignatureCanvas.tsx` — 서명 캔버스 컴포넌트 (자체 구현 방식 선택 시) | 담당: 프론트엔드 | 예상: 2d | 우선순위: 노랑
  - `react-signature-canvas` 라이브러리 활용
  - 서명 완료 후 PNG 데이터 URL 생성
  - 서명 초기화 버튼
- [ ] `src/app/api/invoice/[id]/sign/route.ts` — 서명 저장 API | 담당: 백엔드 | 예상: 3d | 우선순위: 노랑
  - POST 핸들러 (인증 불필요, 클라이언트가 호출)
  - 서명 이미지를 외부 스토리지(Vercel Blob 또는 Cloudinary) 업로드
  - 업로드된 URL을 Notion DB `서명 이미지 URL`에 저장
  - `서명일시`, `status: approved` 업데이트
- [ ] `src/app/invoice/[id]/page.tsx` — 서명 가능 상태(pending)에서 서명 UI 표시 | 담당: 풀스택 | 예상: 1d | 우선순위: 노랑

**7-3. 견적서 버전 관리**

> 설계 방향: 견적서 수정 시 기존 Notion 페이지를 복사하여 새 페이지로 생성, 원본 페이지에 Relation으로 연결한다.

- [ ] `lib/notion.ts` — `duplicateInvoice(pageId)` 함수 추가 | 담당: 백엔드 | 예상: 2d | 우선순위: 초록
  - 기존 페이지를 기반으로 신규 페이지 생성 (`pages.create()`)
  - 신규 페이지의 `원본 견적서` relation에 이전 페이지 ID 연결
  - `버전` 넘버 증가
- [ ] `src/app/admin/invoice/[id]/history/page.tsx` — 버전 히스토리 페이지 | 담당: 풀스택 | 예상: 3d | 우선순위: 초록
  - 해당 견적서의 모든 버전 목록 표시
  - 버전별 합계금액, 발행일, 상태 비교 뷰

**7-4. 다국어 지원 (next-intl)**

- [ ] `npm install next-intl` 설치 및 기본 설정 | 담당: 풀스택 | 예상: 1d | 우선순위: 초록
  - `src/i18n/` 디렉토리 구성: `routing.ts`, `request.ts`
  - `middleware.ts` 업데이트 — locale prefix 처리 (`/ko`, `/en`)
- [ ] 번역 파일 작성 | 담당: 프론트엔드 | 예상: 2d | 우선순위: 초록
  - `messages/ko.json` — 한국어 번역 (견적서 UI 전체)
  - `messages/en.json` — 영어 번역
  - 번역 키: 섹션별로 네임스페이스 분리 (`invoice.header`, `invoice.items` 등)
- [ ] `components/invoice/` 전체 컴포넌트에 `useTranslations()` 적용 | 담당: 프론트엔드 | 예상: 2d | 우선순위: 초록
- [ ] `components/LanguageToggle.tsx` — 언어 전환 버튼 | 담당: 프론트엔드 | 예상: 1d | 우선순위: 초록
  - 견적서 페이지 헤더에 KO / EN 토글 버튼 추가
  - URL 경로의 locale prefix 전환

---

## 리스크 및 완화 전략

### Phase 5 리스크

| 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|--------|--------|------------|----------|
| NextAuth.js v5 App Router 호환성 이슈 | 높음 | 중간 | v5 안정화 버전 사용, `@auth/core` 버전 고정. 대안: Iron Session 또는 자체 JWT 구현 |
| Notion PATCH API 응답 지연 | 중간 | 낮음 | 낙관적 UI 업데이트 + 실패 시 롤백. `revalidatePath('/admin')` 호출 |
| 관리자 비밀번호 평문 저장 위험 | 높음 | 높음 | `bcryptjs.hashSync(password, 12)` 해시값만 환경 변수에 저장. 평문 절대 금지 |
| Notion 텍스트 검색 미지원 | 중간 | 확실 | 전체 목록을 메모리에서 필터링. 건수 1,000건 이상 시 Vercel KV 캐시 도입 검토 |

### Phase 6 리스크

| 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|--------|--------|------------|----------|
| Resend 발신 도메인 인증 실패 | 높음 | 중간 | DNS 설정 후 24~48시간 전파 대기 시간 계획에 반영. 대안: Resend 테스트 도메인 사용 |
| Vercel Cron Job Hobby 플랜 제한 (1일 1회) | 낮음 | 확실 | Hobby 플랜은 하루 1개 Cron만 허용. D-3, D-1 알림을 단일 Cron 핸들러에서 모두 처리 |
| 열람 트래킹 시 Notion API Rate Limit | 중간 | 중간 | `markInvoiceViewed()` 실패를 조용히 처리. 향후 큐(Vercel Queue) 도입 검토 |
| 클라이언트 이메일 누락으로 발송 불가 | 중간 | 중간 | Notion DB에 `클라이언트 이메일` 컬럼 미입력 시 관리자 UI에서 명확한 안내 |

### Phase 7 리스크

| 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|--------|--------|------------|----------|
| 전자 서명의 법적 효력 불명확 | 높음 | 높음 | 자체 캔버스 서명은 법적 구속력 없음을 고지. 법적 효력 필요 시 DocuSign 등 공인 전자 서명 서비스 사용 |
| 서명 이미지 외부 스토리지 비용 | 낮음 | 중간 | Vercel Blob 무료 티어(1GB) 우선 활용. 초과 시 Cloudflare R2 전환 |
| next-intl 라우팅과 NextAuth 미들웨어 충돌 | 높음 | 높음 | 미들웨어 체이닝 패턴 (`createMiddleware`) 적용. 착수 전 Next.js 공식 예제 검토 필수 |
| Notion 페이지 복사 API 미지원 | 높음 | 확실 | `pages.create()`로 프로퍼티를 수동 복사하는 방식으로 구현. 항목 복사는 별도 `databases.query()` 후 재생성 |
| PDF 템플릿 증가로 번들 사이즈 증가 | 중간 | 중간 | PDF 컴포넌트를 `serverExternalPackages`에 포함되어 있으므로 번들에 미포함. 영향 없음 |

---

## 기술적 의존성

```
Phase 5 (관리 기능)
  └─ NextAuth.js 설치 및 auth.ts 설정
      └─ middleware.ts 인증 가드
          ├─ 로그인 페이지 (login/page.tsx)
          ├─ 관리자 레이아웃 (admin/layout.tsx)
          │   └─ 견적서 목록 대시보드 (admin/page.tsx)
          │       ├─ InvoiceListTable (목록 UI)
          │       ├─ InvoiceFilters (검색/필터 UI)
          │       └─ StatusChangeButton (상태 변경)
          └─ 상태 변경 API (api/admin/invoice/[id]/status)
              └─ updateInvoiceStatus() in lib/notion.ts

Phase 6 (자동화) — Phase 5 완료 후 시작
  └─ Resend 도메인 인증 (DevOps 선행)
      ├─ lib/email.ts + 이메일 템플릿 컴포넌트
      │   └─ 이메일 발송 API + SendEmailButton
      └─ Cron Job (vercel.json + /api/cron/expiry-reminder)
          (Phase 5의 getInvoiceList() 재사용)
  └─ 열람 트래킹 API (Phase 5의 admin UI와 독립적)

Phase 7 (고급 기능) — 각 세부 기능은 독립적으로 착수 가능
  ├─ 다중 PDF 템플릿 — Phase 0의 InvoicePDF.tsx 기반 확장
  ├─ 전자 서명 — Phase 5의 인증 구조 재사용 (서명 저장 API는 인증 불필요)
  ├─ 버전 관리 — Phase 5의 admin 대시보드에 히스토리 탭 추가
  └─ 다국어 — middleware.ts 수정 필요 (Phase 5와 충돌 가능, 마지막 착수 권장)
```

---

## 전체 일정 요약

| Phase | 내용 | 예상 기간 | 선행 조건 | 주요 기술 도입 |
|-------|------|-----------|-----------|----------------|
| Phase 0~4 | MVP 완료 | 2026-02-22 완료 | — | Next.js, Notion SDK, @react-pdf/renderer |
| Phase 5 | 관리 기능 | **2026-02-22 완료** | MVP 완료 | NextAuth.js v5, Notion PATCH API |
| Phase 6 | 자동화 | 3주 | Phase 5 완료 | Resend, Vercel Cron Jobs |
| Phase 7-a | 다중 PDF 템플릿 | 1~2주 | MVP 완료 | — |
| Phase 7-b | 전자 서명 | 2~3주 | Phase 5 완료 | react-signature-canvas 또는 외부 API |
| Phase 7-c | 버전 관리 | 2주 | Phase 5 완료 | Notion pages.create() |
| Phase 7-d | 다국어 지원 | 2주 | Phase 5 완료, 전체 UI 안정화 | next-intl |

> 1인 개발 기준 총 예상 기간: Phase 6~7 전체 완료 시 약 8~11주 추가 소요

---

## 보류 사항 및 미결 질문

| 번호 | 항목 | 현재 상태 | 결정 필요자 |
|------|------|----------|------------|
| Q7 | 전자 서명 법적 구속력 요건 | 미결: 자체 캔버스 vs 공인 전자 서명 서비스 선택 | 기획자/법무 |
| Q8 | 서명 이미지 저장소 | 미결: Vercel Blob vs Cloudflare R2 vs Notion 파일 첨부 | 개발자 |
| Q9 | 다국어 지원 언어 범위 | 미결: 한국어/영어 2개 언어인지, 추가 언어 계획 있는지 | 기획자 |
| Q10 | 견적서 생성 기능 포함 여부 | 미결: 현재는 Notion에서 직접 작성. 웹 UI에서 견적서 신규 생성 기능 필요 여부 | 기획자 |
| Q11 | Vercel 플랜 | 미결: Cron Job 다중 설정 및 Vercel Blob 사용을 위해 Pro 플랜 필요 여부 | 기획자 |
| Q12 | `status = rejected` 견적서 접근 정책 | 미결 (MVP에서 이월): 거절된 견적서 클라이언트 열람 허용 여부 | 기획자 |

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| v2.0 | 2026-02-22 | 최초 작성 (MVP Phase 0~4 완료 기준, Phase 5~7 고도화 로드맵 정의) |
| v2.1 | 2026-02-22 | Phase 5 완료 반영: 라우트 구조 업데이트 (route group 도입), 환경변수 이스케이프 주의사항 추가, 태스크 완료 체크 |

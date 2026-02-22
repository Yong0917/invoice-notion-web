# 노션 기반 견적서 관리 시스템 개발 로드맵

> 마지막 업데이트: 2026-02-22
> 버전: v1.2

---

## 프로젝트 개요

노션 데이터베이스를 백엔드로 활용하여 프리랜서/소규모 기업이 견적서를 관리하고, 클라이언트가 고유 URL로 접속하여 견적서를 웹에서 조회하고 PDF로 다운로드할 수 있는 경량 시스템이다. 별도의 데이터베이스나 관리자 시스템 없이 노션을 그대로 CMS로 활용하는 것이 핵심이다.

---

## 성공 지표 (MVP 기준)

- [x] 잘못된 `notionPageId` 접근 시 커스텀 404 페이지 표시
- [~] 노션 데이터베이스에서 견적서 데이터 정상 조회 (구현 완료 / 실 브라우저 테스트 필요)
- [~] `/invoice/[notionPageId]` 경로로 접근 시 견적서 웹 렌더링 정상 동작 (구현 완료 / 실 브라우저 테스트 필요)
- [ ] PDF 다운로드 버튼 클릭 시 10초 이내 PDF 파일 생성 및 다운로드
- [ ] 모바일(375px), 태블릿(768px), 데스크톱(1280px) 3가지 뷰포트에서 레이아웃 정상 표시

---

## 기술 스택

| 영역 | 기술 | 버전 | 선택 이유 |
|------|------|------|-----------|
| 프레임워크 | Next.js (App Router) | 16.1.6 | 서버 컴포넌트로 Notion API 직접 호출 가능, Vercel 최적화 |
| 언어 | TypeScript | 5.x | 타입 안전성, Notion API 응답 타입 매핑에 필수 |
| UI 라이브러리 | React | 19.2.3 | Next.js 의존성 |
| 스타일링 | TailwindCSS | v4 | CSS-first 방식, `app/globals.css` 단일 파일 관리 |
| 컴포넌트 | shadcn/ui | latest | 이미 프로젝트에 설치됨, 직접 수정 가능 |
| 아이콘 | Lucide React | 0.575.0 | 이미 프로젝트에 설치됨 |
| Notion SDK | @notionhq/client | **v2** (v5 사용 불가 — 아래 주의사항 참고) | 공식 SDK, 타입 지원 |
| PDF 생성 | @react-pdf/renderer | latest | React 컴포넌트 기반 PDF 생성, 서버/클라이언트 모두 지원 |
| 배포 | Vercel | - | Next.js 최적화, 환경 변수 관리 용이 |
| 패키지 관리 | npm | - | 프로젝트 기본 설정 |

> **⚠️ @notionhq/client 버전 주의**: v5에서 `databases.query()` 메서드가 제거됨.
> 반드시 v2를 유지해야 한다. (`npm install @notionhq/client@2`)

---

## 노션 데이터베이스 설정 (완료)

### 발행자 DB (`NOTION_SENDER_DB_ID`)

| 속성명 | 타입 | 매핑 필드 |
|--------|------|-----------|
| 이름 | title | 식별용 레이블 |
| 회사명 | rich_text | `company_name` |
| 대표자명 | rich_text | `representative` |
| 사업자등록번호 | rich_text | `business_number` |
| 주소 | rich_text | `address` |
| 전화번호 | rich_text | `phone` |
| 이메일 | email | `email` |
| 은행명 | rich_text | `bank_name` |
| 계좌번호 | rich_text | `account_number` |
| 예금주 | rich_text | `account_holder` |

> DB 첫 번째 행을 항상 발행자로 사용 (단일 발행자 고정 방식)
> 테스트 데이터 페이지 ID: `30ff71b03408810daacec8fdddbcacf8`

### 견적서 DB (`NOTION_QUOTE_DB_ID`)

| 속성명 | 타입 | 매핑 필드 |
|--------|------|-----------|
| 이름 | title | `invoice_number` |
| 고객명 | rich_text | `client_name` |
| 발행일 | date | `issue_date` |
| 유효기간 | date | `valid_until` |
| 합계금액 | number (원) | `total_amount` |
| 상태 | select (pending/approved/rejected) | `status` |
| 항목 | relation → 견적 항목 DB | — |

### 견적 항목 DB (`NOTION_QUOTE_ITEM_DB_ID`)

| 속성명 | 타입 | 매핑 필드 |
|--------|------|-----------|
| 이름 | title | `description` |
| 수량 | number | `quantity` |
| 단가 | number (원) | `unit_price` |
| 공급가액 | formula (`수량 * 단가`) | `amount` |
| 견적서 | relation → 견적서 DB | — |

---

## 환경 변수

```env
NOTION_API_KEY=...
NOTION_QUOTE_DB_ID=30ff71b0340880fe9b5bf8d7a8a7f375
NOTION_QUOTE_ITEM_DB_ID=30ff71b034088056967cfc65b402f2c1
NOTION_SENDER_DB_ID=30ff71b03408800aa7b6e145c1793419
NEXT_PUBLIC_APP_URL=http://localhost:3000
QUOTES_ADMIN_PATH=quotes
```

---

## 개발 로드맵

### Phase 0: 환경 설정 및 Notion 연동 기반 구축 ✅ 완료

**완료일**: 2026-02-22

#### 태스크

- [x] `@notionhq/client@2` 패키지 설치
- [x] `.env.local` 파일 생성 및 환경 변수 설정
  - `NOTION_QUOTE_DB_ID`, `NOTION_QUOTE_ITEM_DB_ID` 변수명 확정 (기존 `NOTION_DATABASE_ID`에서 변경)
- [x] Notion Integration 생성 및 두 DB에 권한 연결
- [x] `lib/notion.ts` — Notion 클라이언트 싱글톤 초기화
- [x] `lib/notion.ts` — `getInvoiceById()` 구현
  - `pages.retrieve()` + `databases.query()` (relation 필터링) 조합
  - `object_not_found` 에러 → `null` 반환 처리
- [x] `lib/notion.ts` — `getInvoiceList()` 구현 (발행일 내림차순)
- [x] `types/invoice.ts` — `PageObjectResponse` 기반 타입 추출 헬퍼 구현
- [x] TypeScript 타입 오류 없이 빌드 성공 (`npm run build` 통과)
- [x] 노션에 테스트 데이터 2건 삽입 (Q-2025-001, Q-2025-002)

---

### Phase 1: 견적서 조회 페이지 구현 ✅ 완료

**완료일**: 2026-02-22 (MVP 선구현 포함)

#### 태스크

- [x] `src/app/api/invoice/[id]/route.ts` — GET 핸들러 (404/500 처리 포함)
- [x] `components/invoice/InvoiceHeader.tsx` — 견적서 번호, 상태 배지, 수신/발행일/유효기간
- [x] `components/invoice/InvoiceItemsTable.tsx` — 항목 테이블, 모바일 가로 스크롤
- [x] `components/invoice/InvoiceSummary.tsx` — 공급가액 / 부가세(10%) / 합계금액
- [x] `components/invoice/InvoiceView.tsx` — 위 컴포넌트 통합
- [x] `src/app/invoice/[id]/page.tsx` — `getInvoiceById()` 연결, `generateMetadata` 적용
- [x] `src/app/invoice/[id]/not-found.tsx` — 커스텀 404 페이지
- [x] `lib/helpers.ts` — `formatKRW()`, `formatDate()` 구현

**테스트 URL**:
```
/invoice/30ff71b03408816c9975ca05fa14818c   # Q-2025-001 (pending)
/invoice/30ff71b03408812b8f05f938f82a451b   # Q-2025-002 (approved)
```

---

### Phase 2: PDF 다운로드 구현 (1주)

**목표**: PDF 다운로드 버튼 클릭 시 견적서가 PDF 파일로 즉시 다운로드된다.

**완료 기준**:
- PDF 다운로드 버튼 클릭 시 10초 이내 PDF 생성 완료
- 생성된 PDF에 견적서 번호, 항목, 금액이 정확하게 표시됨
- PDF 파일명: `견적서_[invoice_number].pdf`
- 다운로드 중 로딩 상태 표시

#### 태스크

- [ ] `@react-pdf/renderer` 패키지 설치
  - `npm install @react-pdf/renderer`
  - TypeScript 타입 패키지 확인

- [ ] PDF 폰트 설정 및 한국어 깨짐 방지 (**Phase 2 최우선 선행 작업**)
  - `public/fonts/` 디렉토리에 한국어 폰트 저장 (Noto Sans KR 권장)
  - `Font.register()` 로 폰트 등록 후 렌더링 테스트

- [ ] `components/invoice/InvoicePDF.tsx` — PDF 템플릿 컴포넌트
  - `Document`, `Page`, `View`, `Text`, `StyleSheet` 활용
  - 견적서 헤더 (발행자 정보, 클라이언트 정보)
  - 항목 테이블, 합계 섹션
  - A4 사이즈 레이아웃

- [ ] `src/app/api/invoice/[id]/pdf/route.ts` — PDF 생성 API
  - `export const runtime = 'nodejs'` 필수 (Edge Runtime 미지원)
  - `renderToBuffer()` 로 PDF 바이너리 생성
  - `Content-Type: application/pdf` + `Content-Disposition: attachment` 헤더

- [ ] `components/invoice/PDFDownloadButton.tsx` — 다운로드 버튼
  - `'use client'` 지시어
  - 클릭 → `/api/invoice/[id]/pdf` fetch → Blob → `<a>` 다운로드
  - 로딩 스피너 표시

- [ ] `InvoiceView.tsx` 에 `PDFDownloadButton` 통합

---

### Phase 3: 반응형 레이아웃 및 UX 완성 (0.5주)

**목표**: 모든 디바이스에서 견적서가 올바르게 표시되고, 사용자 경험이 완성된다.

**완료 기준**:
- 375px, 768px, 1280px 뷰포트에서 레이아웃 깨짐 없음
- 로딩/에러 상태 UI 완성
- 페이지 메타데이터(OG 태그) 설정 완료

#### 태스크

- [ ] `src/app/invoice/[id]/loading.tsx` — 스켈레톤 로딩 UI
  - 견적서 레이아웃 형태의 Skeleton
  - shadcn/ui `Skeleton` 컴포넌트 활용

- [ ] `src/app/invoice/[id]/error.tsx` — 에러 경계
  - Notion API 장애 시 사용자 친화적 메시지
  - 새로고침 버튼

- [ ] `src/app/invoice/[id]/page.tsx` — OG 메타태그 추가
  - `generateMetadata()` 에 `openGraph` 속성 추가
  - 견적서 번호, 클라이언트명 반영

- [ ] 전 뷰포트 레이아웃 검증
  - 모바일 375px, 태블릿 768px, 데스크톱 1280px

---

### Phase 4: 배포 및 운영 준비 (0.5주)

**목표**: Vercel에 배포하고 실제 운영 가능한 상태로 마무리한다.

**완료 기준**:
- Vercel 환경 변수 설정 완료
- 프로덕션 빌드 오류 없음
- 실제 Notion 데이터로 End-to-End 테스트 통과

#### 태스크

- [ ] Vercel 프로젝트 환경 변수 설정
  - `NOTION_API_KEY`
  - `NOTION_QUOTE_DB_ID`
  - `NOTION_QUOTE_ITEM_DB_ID`
  - `NEXT_PUBLIC_APP_URL` (배포 도메인)

- [ ] `next.config.ts` — 프로덕션 설정 검토
  - `@react-pdf/renderer` Node.js Runtime 호환성 확인

- [ ] 프로덕션 빌드 테스트 (`npm run build`)

- [ ] End-to-End 수동 테스트
  - 견적서 조회 URL → 데이터 표시 확인
  - PDF 다운로드 → 파일 내용 확인
  - 잘못된 ID → 404 페이지 확인
  - 모바일 Chrome/Safari 레이아웃 확인

- [ ] `.env.example` 최종 업데이트 (변수명 반영)

---

## 전체 일정 요약

| Phase | 기간 | 상태 | 주요 산출물 |
|-------|------|------|-------------|
| Phase 0: 환경 설정 및 Notion 연동 | 2026-02-22 | ✅ 완료 | Notion SDK 연동, `getInvoiceById()` 구현 |
| Phase 1: 견적서 조회 페이지 | 2026-02-22 | ✅ 완료 | 견적서 웹 뷰어 컴포넌트 완성 |
| Phase 2: PDF 다운로드 | 2026-03-07 ~ 2026-03-13 | 🔲 대기 | PDF 생성 API 및 다운로드 버튼 |
| Phase 3: 반응형 UX 완성 | 2026-03-14 ~ 2026-03-17 | 🔲 대기 | 로딩/에러 UI, OG 태그 |
| Phase 4: 배포 | 2026-03-18 ~ 2026-03-20 | 🔲 대기 | Vercel 배포, E2E 테스트 |

---

## 파일 현황

```
✅ 완료
├── lib/notion.ts                              (Notion 클라이언트 + API 함수)
├── lib/helpers.ts                             (formatKRW, formatDate)
├── types/invoice.ts                           (Invoice, InvoiceItem 타입)
├── src/app/invoice/[id]/page.tsx
├── src/app/invoice/[id]/not-found.tsx
├── src/app/api/invoice/[id]/route.ts
├── components/invoice/InvoiceView.tsx
├── components/invoice/InvoiceHeader.tsx
├── components/invoice/InvoiceItemsTable.tsx
└── components/invoice/InvoiceSummary.tsx

🔲 미구현 (Phase 2)
├── src/app/api/invoice/[id]/pdf/route.ts
├── components/invoice/InvoicePDF.tsx
├── components/invoice/PDFDownloadButton.tsx
└── public/fonts/                              (한국어 폰트)

🔲 미구현 (Phase 3)
├── src/app/invoice/[id]/loading.tsx
└── src/app/invoice/[id]/error.tsx
```

---

## 리스크 및 완화 전략

| 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|--------|--------|------------|----------|
| Notion API Rate Limit (초당 3회 요청 제한) | 높음 | 낮음 | Next.js `revalidate` 옵션으로 응답 캐싱 |
| `@react-pdf/renderer` 한국어 폰트 미지원 | 높음 | 높음 | Phase 2 초반에 폰트 테스트 선행, 문제 시 Puppeteer로 전환 검토 |
| `@react-pdf/renderer` Vercel Edge Runtime 미지원 | 높음 | 높음 | API Route에 `export const runtime = 'nodejs'` 명시 필수 |
| Notion API Key 노출 | 높음 | 낮음 | `NOTION_API_KEY`는 서버 전용 변수 (`NEXT_PUBLIC_` 접두사 절대 금지) |
| `@notionhq/client` v5 업그레이드 | 높음 | 중간 | v2 고정 사용. v5는 `databases.query()` 미지원 확인됨 |
| Notion 데이터베이스 스키마 변경 | 중간 | 중간 | `lib/notion.ts` 매핑 헬퍼 함수가 단일 진입점 — 여기만 수정 |
| 대용량 PDF 생성 시 Vercel 함수 타임아웃 (10초) | 중간 | 낮음 | 항목 수 제한 (50개 이하) |

---

## 보류 사항 및 미결 질문

| 번호 | 항목 | 현재 상태 | 결정 필요자 |
|------|------|----------|------------|
| Q1 | Items(견적 항목) 관리 방식 | ✅ **결정됨**: 별도 DB + Relation 방식으로 구현 완료 | — |
| Q2 | 부가세(10%) 처리 방식 | ✅ **임시 결정**: `total_amount`를 공급가액으로 처리, UI에서 10% 계산 표시. 노션 DB에 별도 필드 불필요 | — |
| Q3 | 발행자 정보 관리 방식 | ✅ **결정됨**: Notion 별도 DB(`NOTION_SENDER_DB_ID`) 사용. Phase 2 시작 전 DB 생성 및 ID 설정 필요 | — |
| Q4 | `status = rejected` 견적서 URL 접근 허용 여부 | 🔲 **미결**: 거절된 견적서 조회 정책 결정 필요 | 기획자 |
| Q5 | PDF 파일명 규칙 | ✅ **결정됨**: `견적서_[invoice_number].pdf` | — |
| Q6 | `@react-pdf/renderer` vs Puppeteer | 🔲 **미결**: Phase 2 초반 한국어 폰트 테스트 후 결정 | 개발자 |

---

## 향후 Phase (MVP 이후)

### Phase 5 (MVP+1): 관리 기능
- 인증 추가 (NextAuth.js + 관리자 계정)
- `/admin` 대시보드: 발행한 견적서 전체 목록 조회
- 견적서 상태(승인/거절) 변경 기능 (Notion API PATCH)
- 견적서 검색 및 날짜 필터링

### Phase 6 (MVP+2): 자동화
- 이메일 자동 발송 (Resend 또는 SendGrid 연동)
- 견적서 유효기간 만료 알림 (Vercel Cron Jobs)
- 클라이언트 열람 여부 트래킹

### Phase 7 (MVP+3): 고급 기능
- 다중 PDF 템플릿 지원
- 전자 서명 기능 (DocuSign/Adobe Sign API)
- 견적서 버전 관리 및 히스토리
- 다국어 지원 (next-intl)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| v1.0 | 2026-02-21 | 최초 작성 (PRD v1.0 기반) |
| v1.1 | 2026-02-22 | Phase 0·1 완료 반영. 환경 변수명 확정, @notionhq/client v2 고정, 보류 Q1·Q2·Q5 결정 처리 |
| v1.2 | 2026-02-22 | 발행자 DB 설정 완료 (Q3 결정). 테스트 데이터 삽입 완료. ROADMAP에 발행자 DB 스키마 반영 |

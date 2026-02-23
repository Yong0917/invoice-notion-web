# PRD to ROADMAP 에이전트 메모리

## 프로젝트 핵심 정보

- **프로젝트명**: 노션 기반 견적서 관리 시스템
- **목적**: Notion을 CMS로 활용한 견적서 웹 뷰어 + PDF 다운로드
- **기술 스택**: Next.js 16.1.6 (App Router), TypeScript 5.x, React 19, TailwindCSS v4, shadcn/ui
- **배포**: Vercel / 패키지 관리: npm
- **앱 라우터 루트**: `src/app/` (CLAUDE.md의 `app/` 과 다름 - 실제 코드는 `src/app/`)

## 로드맵 파일 구조

- `docs/ROADMAP.md` — UI 개선 로드맵 v1.0 (2026-02-23, Phase A~D: 홈 버튼, 정렬, 새로고침, 페이지네이션)
- `docs/roadmaps/ROADMAP_v2.md` — 고도화 로드맵 (Phase 5~7), v2.5 기준 (2026-02-23 업데이트)
- `docs/roadmaps/ROADMAP_v1.md` — MVP 로드맵 (Phase 0~4), v1.5 완료 기준
- `docs/PRD.md` — 원본 제품 요구사항 문서

## MVP 완료 상태 (2026-02-22, Phase 0~4 전체 완료)

핵심 파일:
- `lib/notion.ts` — Notion 클라이언트, `getInvoiceById()`, `getSenderInfo()`, `getInvoiceList()`
- `src/app/invoice/[id]/page.tsx` — 견적서 조회 페이지
- `src/app/api/invoice/[id]/route.ts` — GET API
- `src/app/api/invoice/[id]/pdf/route.tsx` — PDF 생성 API (runtime: nodejs)
- `components/invoice/` — InvoiceView, InvoiceHeader, InvoiceItemsTable, InvoiceSummary, InvoicePDF, PDFDownloadButton
- `types/invoice.ts` — Invoice, InvoiceItem, Sender 타입

## 노션 데이터베이스 구조 (Phase 5.5 확장 예정)

- 발행자 DB (`NOTION_SENDER_DB_ID`): 회사명, 대표자명, 사업자등록번호, 주소, 전화번호, 이메일, 은행명, 계좌번호, 예금주
- 견적서 DB (`NOTION_QUOTE_DB_ID`): 이름(견적번호), 고객명, 발행일, 유효기간, 합계금액, 상태(select), 항목(relation)
  - Phase 5.5 추가 예정: 고객 회사명, 고객 담당자명, 프로젝트명, 납기일, 공급가액, 클라이언트 이메일(email타입), 클라이언트 연락처(phone_number타입), 결제 조건, 비고, 세금계산서 발행 여부(checkbox)
- 견적 항목 DB (`NOTION_QUOTE_ITEM_DB_ID`): 이름(항목명), 수량, 단가, 공급가액(formula), 견적서(relation)
  - Phase 5.5 추가 예정: 단위(select), 비고(rich_text), 카테고리(select)

## Phase별 로드맵 패턴 (확정)

- Phase 0~4: MVP 완료 (2026-02-22)
- Phase 5: 관리 기능 (NextAuth.js v5, Notion PATCH API) — 완료 (2026-02-22)
- Phase 5.5: 데이터 모델 확장 (Notion DB 스키마 13개 컬럼 추가, TypeScript 타입 확장, UI 5종 수정) — 2주
- Phase 6: 자동화 (Resend, Vercel Cron Jobs) — 3주 (Phase 5.5 완료 권장, client_email 활용)
- Phase 7: 고급 기능 — 분할 착수 권장
  - 7-a 다중 PDF 템플릿 (1~2주, Phase 5.5 완료 후 권장), 7-b 전자 서명 (2~3주), 7-c 버전 관리 (2주), 7-d 다국어 (2주)

## Phase 5.5 핵심 설계 결정

- 신규 필드 전체 optional 선언 → 기존 견적서 하위 호환 유지
- `supply_amount` 없으면 `items.reduce()`로 fallback 계산 (InvoiceSummary, InvoicePDF 공통)
- `extractCheckbox()`, `extractPhone()` 헬퍼를 lib/notion.ts에 신규 추가 필요
- InvoiceSummary의 props 시그니처 변경 (`totalAmount: number` → `invoice: Pick<Invoice, ...>`) → InvoiceView.tsx 동시 수정 필수
- 5.5-1(DB 스키마)이 가장 선행 — 실제 데이터 없으면 나머지 태스크 검증 불가

## 기술적 주의사항

- `@react-pdf/renderer`는 Vercel Edge Runtime 미지원 → `export const runtime = 'nodejs'` 필수
- `next.config.ts`에 `serverExternalPackages: ['@react-pdf/renderer']` 설정됨
- 한국어 PDF: NanumGothic TTF (`public/fonts/NanumGothic-Regular.ttf`, `NanumGothic-Bold.ttf`) 사용
- `NOTION_API_KEY`는 서버 전용 환경 변수 (NEXT_PUBLIC_ 금지)
- Next.js 15+ 라우트 `params`는 `Promise<{id: string}>` 타입
- `@notionhq/client` v2 고정 (v5는 `databases.query()` 미지원)

## 고도화 설계 시 핵심 결정 사항

- Notion 텍스트 검색 미지원 → 전체 목록 로드 후 클라이언트 필터링
- Vercel Cron Job Hobby 플랜: 1일 1개 Cron 제한 → D-3, D-1 알림을 단일 핸들러에서 처리
- Phase 6 Resend 도메인 DNS 인증: 24~48시간 전파 대기 시간 일정에 반영 필요
- Phase 7 다국어(next-intl)는 middleware.ts 수정을 요구하므로 NextAuth.js와 충돌 가능 → 마지막 착수 권장
- 전자 서명: 자체 캔버스 구현은 법적 구속력 없음. 착수 전 법적 효력 요건 결정 필수
- Notion 페이지 복사 API 없음 → `pages.create()`로 프로퍼티 수동 복사

## 미결 보류 사항 (Q7~Q12)

- Q7: 전자 서명 법적 효력 요건 (자체 vs 공인 서비스)
- Q8: 서명 이미지 저장소 (Vercel Blob vs Cloudflare R2 vs Notion 파일)
- Q9: 다국어 지원 언어 범위
- Q10: 웹 UI에서 견적서 신규 생성 기능 필요 여부
- Q11: Vercel Pro 플랜 필요 여부
- Q12: 거절된 견적서 클라이언트 열람 허용 여부 (MVP에서 이월)

## shadcn/ui 설치 현황

- Pagination 컴포넌트 미설치 확인 (2026-02-23). 페이지네이션 구현 전 `npx shadcn@latest add pagination` 필요
- `components/ui/` 디렉토리에서 설치 여부 사전 확인 후 ROADMAP 작성 권장

## UI 개선 로드맵 패턴 (docs/ROADMAP.md)

- 소규모 UX 픽스는 Phase A/B/C/D 알파벳 네이밍으로 분리 (숫자 Phase와 구분)
- `router.refresh()` + `useTransition`으로 서버 컴포넌트 새로고침 구현 (Next.js 공식 권장 방식)
- 클라이언트 사이드 페이지네이션: `useSearchParams`로 URL `?page=N` 연동, 필터 변경 시 `page` 파라미터 제거로 1페이지 리셋
- `StatusChangeButton` 정렬 이슈: `h-auto p-0` vs `h-8 w-8` 혼재 → 명시적 `h-8` 통일로 해결

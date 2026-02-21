# 노션 기반 견적서 관리 시스템 개발 로드맵

> 마지막 업데이트: 2026-02-21
> 버전: v1.0

---

## 프로젝트 개요

노션 데이터베이스를 백엔드로 활용하여 프리랜서/소규모 기업이 견적서를 관리하고, 클라이언트가 고유 URL로 접속하여 견적서를 웹에서 조회하고 PDF로 다운로드할 수 있는 경량 시스템이다. 별도의 데이터베이스나 관리자 시스템 없이 노션을 그대로 CMS로 활용하는 것이 핵심이다.

---

## 성공 지표 (MVP 기준)

- [ ] 노션 데이터베이스에서 견적서 데이터 정상 조회 (응답 시간 3초 이내)
- [ ] `/invoice/[notionPageId]` 경로로 접근 시 견적서 웹 렌더링 정상 동작
- [ ] PDF 다운로드 버튼 클릭 시 10초 이내 PDF 파일 생성 및 다운로드
- [ ] 모바일(375px), 태블릿(768px), 데스크톱(1280px) 3가지 뷰포트에서 레이아웃 정상 표시
- [ ] 잘못된 `notionPageId` 접근 시 커스텀 404 페이지 표시

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
| Notion SDK | @notionhq/client | latest | 공식 SDK, 타입 지원 |
| PDF 생성 | @react-pdf/renderer | latest | React 컴포넌트 기반 PDF 생성, 서버/클라이언트 모두 지원 |
| 배포 | Vercel | - | Next.js 최적화, 환경 변수 관리 용이 |
| 패키지 관리 | npm | - | 프로젝트 기본 설정 |

---

## 현재 구현 상태 (2026-02-21 기준)

이미 스캐폴딩이 완료된 파일 목록 (TODO 주석 포함, 실제 로직 미구현):

- `src/app/invoice/[id]/page.tsx` - 라우트 구조 및 Props 타입 정의 완료
- `src/app/api/invoice/[id]/route.ts` - API 엔드포인트 구조 및 에러 처리 패턴 정의 완료
- `lib/notion.ts` - `getInvoiceById()`, `getInvoiceList()` 함수 시그니처 정의 완료 (구현 필요)
- `types/invoice.ts` - `Invoice`, `InvoiceItem`, `InvoiceStatus`, `NotionInvoiceProperties` 타입 정의 완료
- `lib/constants.ts` - `SITE_CONFIG`, `NAV_ITEMS` 견적서 서비스용으로 설정 완료
- `src/app/page.tsx` - 홈페이지 서비스 소개 UI 완료

---

## 개발 로드맵

### Phase 0: 환경 설정 및 Notion 연동 기반 구축 (1주)

**목표**: 실제 Notion API 호출이 가능한 개발 환경을 구성하고, 데이터 조회 레이어를 완성한다.

**완료 기준**:
- Notion SDK 설치 완료
- `.env.local`에 실제 Notion API Key 및 Database ID 설정
- `getInvoiceById()` 함수가 Notion API로부터 실제 데이터를 반환
- TypeScript 타입 오류 없이 빌드 성공

#### 태스크

- [ ] `@notionhq/client` 패키지 설치 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 높음
  - `npm install @notionhq/client`
  - `package.json` dependencies에 추가 확인

- [ ] `.env.local` 파일 생성 및 환경 변수 설정 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 높음
  - `NOTION_API_KEY=secret_xxx` 설정
  - `NOTION_DATABASE_ID=xxx` 설정
  - `NEXT_PUBLIC_APP_URL=http://localhost:3000` 설정
  - `.env.example` 파일 업데이트

- [ ] Notion Integration 생성 및 데이터베이스 권한 연결 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 높음
  - [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) 에서 Integration 생성
  - 견적서 데이터베이스에 Integration 연결
  - 항목(Items) 데이터베이스에도 Integration 연결

- [ ] `lib/notion.ts` - Notion 클라이언트 초기화 구현 | 담당: 풀스택 | 예상: 1d | 우선순위: 높음
  - `@notionhq/client` import 주석 해제
  - `getNotionClient()` 싱글톤 함수 활성화
  - `getRequiredEnv()` 함수로 환경 변수 검증 연결

- [ ] `lib/notion.ts` - `getInvoiceById()` 함수 구현 | 담당: 풀스택 | 예상: 2d | 우선순위: 높음
  - `notion.pages.retrieve({ page_id: pageId })` 호출
  - Notion 프로퍼티를 `Invoice` 타입으로 매핑 (`mapNotionPageToInvoice()` 헬퍼 작성)
  - 존재하지 않는 페이지 접근 시 `null` 반환 처리
  - Notion API 에러 코드별 처리 (`object_not_found` 등)

- [ ] `lib/notion.ts` - Items 데이터베이스 연동 구현 | 담당: 풀스택 | 예상: 1d | 우선순위: 높음
  - `notion.databases.query()` 로 Relation 연결된 항목 조회
  - `InvoiceItem[]` 타입으로 매핑
  - `getInvoiceById()` 내에서 items 필드 병합

- [ ] `types/invoice.ts` - Notion 프로퍼티 타입 보강 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 중간
  - `@notionhq/client` 의 실제 프로퍼티 타입으로 `NotionInvoiceProperties` 업데이트
  - Notion `PageObjectResponse` 타입 활용

---

### Phase 1: 견적서 조회 페이지 구현 (1주)

**목표**: 클라이언트가 고유 URL로 접속했을 때 견적서 정보가 정확하고 아름답게 표시된다.

**완료 기준**:
- `/invoice/[notionPageId]` 접속 시 견적서 데이터가 화면에 표시됨
- 견적서 번호, 클라이언트명, 발행일, 유효기간, 항목 목록, 합계 금액이 모두 노출됨
- 존재하지 않는 ID 접속 시 404 페이지로 이동
- API Route가 견적서 데이터를 JSON으로 정상 반환

#### 태스크

- [ ] `src/app/api/invoice/[id]/route.ts` - GET 핸들러 구현 | 담당: 풀스택 | 예상: 1d | 우선순위: 높음
  - `getInvoiceById(id)` 호출 주석 해제 및 활성화
  - 404 응답 처리 로직 활성화
  - Notion API 에러 시 500 응답 반환

- [ ] `components/invoice/InvoiceHeader.tsx` 컴포넌트 생성 | 담당: 프론트엔드 | 예상: 1d | 우선순위: 높음
  - 견적서 번호 표시 (예: Q-2024-001)
  - 발행일 / 유효기간 표시
  - 클라이언트명 표시
  - 견적서 상태 배지 (대기/승인/거절) - shadcn/ui `Badge` 컴포넌트 활용

- [ ] `components/invoice/InvoiceItemsTable.tsx` 컴포넌트 생성 | 담당: 프론트엔드 | 예상: 1d | 우선순위: 높음
  - 항목 테이블 (항목명, 수량, 단가, 금액) 렌더링
  - shadcn/ui `Table` 컴포넌트 활용 (없으면 `npx shadcn@latest add table`)
  - 금액 포맷팅 (원화: `xxx,xxx원`)
  - 합계 행 표시

- [ ] `components/invoice/InvoiceSummary.tsx` 컴포넌트 생성 | 담당: 프론트엔드 | 예상: 0.5d | 우선순위: 높음
  - 공급가액, 부가세(10%), 합계금액 섹션 표시
  - 금액 강조 스타일 적용

- [ ] `components/invoice/InvoiceView.tsx` 컴포넌트 생성 | 담당: 프론트엔드 | 예상: 1d | 우선순위: 높음
  - `InvoiceHeader`, `InvoiceItemsTable`, `InvoiceSummary` 통합
  - `Invoice` 타입 데이터를 props로 수신
  - 인쇄 시 레이아웃 최적화 고려 (`@media print` CSS)

- [ ] `src/app/invoice/[id]/page.tsx` - 실제 데이터 조회 및 렌더링 연결 | 담당: 풀스택 | 예상: 1d | 우선순위: 높음
  - `getInvoiceById(id)` 호출 주석 해제
  - `notFound()` 호출 활성화
  - `InvoiceView` 컴포넌트에 데이터 전달
  - `generateMetadata` 에서 실제 견적서 번호로 title 업데이트

- [ ] `src/app/invoice/[id]/not-found.tsx` 컴포넌트 생성 | 담당: 프론트엔드 | 예상: 0.5d | 우선순위: 중간
  - "견적서를 찾을 수 없습니다" 안내 메시지
  - 발행자에게 문의하도록 가이드 문구
  - 홈으로 이동 링크

- [ ] `lib/helpers.ts` - 금액 포맷팅 유틸리티 추가 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 중간
  - `formatKRW(amount: number): string` 함수 (예: `1,000,000원`)
  - `formatDate(dateStr: string): string` 함수 (예: `2024년 1월 1일`)

---

### Phase 2: PDF 다운로드 구현 (1주)

**목표**: PDF 다운로드 버튼 클릭 시 견적서가 PDF 파일로 즉시 다운로드된다.

**완료 기준**:
- PDF 다운로드 버튼 클릭 시 10초 이내 PDF 생성 완료
- 생성된 PDF에 견적서 번호, 항목, 금액이 정확하게 표시됨
- PDF 파일명이 견적서 번호 기반으로 생성됨 (예: `견적서_Q-2024-001.pdf`)
- 다운로드 중 로딩 상태 표시

#### 태스크

- [ ] `@react-pdf/renderer` 패키지 설치 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 높음
  - `npm install @react-pdf/renderer`
  - TypeScript 타입 패키지 확인 (`@types/react-pdf` 필요 시 설치)

- [ ] `src/app/api/invoice/[id]/pdf/route.ts` - PDF 생성 API 라우트 생성 | 담당: 풀스택 | 예상: 1d | 우선순위: 높음
  - GET 핸들러 구현
  - `getInvoiceById(id)` 로 데이터 조회
  - `@react-pdf/renderer` 의 `renderToBuffer()` 로 PDF 바이너리 생성
  - `Content-Type: application/pdf`, `Content-Disposition: attachment` 헤더 설정
  - 404/500 에러 처리

- [ ] `components/invoice/InvoicePDF.tsx` - PDF 템플릿 컴포넌트 생성 | 담당: 프론트엔드 | 예상: 2d | 우선순위: 높음
  - `@react-pdf/renderer` 의 `Document`, `Page`, `View`, `Text`, `StyleSheet` 활용
  - 한국어 폰트 설정 (Noto Sans KR 또는 나눔고딕 폰트 등록)
  - 견적서 헤더 (발행자 정보, 클라이언트 정보)
  - 항목 테이블 (항목명, 수량, 단가, 금액)
  - 합계 섹션
  - A4 사이즈 레이아웃

- [ ] `components/invoice/PDFDownloadButton.tsx` - 다운로드 버튼 Client 컴포넌트 생성 | 담당: 프론트엔드 | 예상: 1d | 우선순위: 높음
  - `'use client'` 지시어 추가
  - 클릭 시 `/api/invoice/[id]/pdf` API 호출
  - 다운로드 중 로딩 스피너 표시 (`LoadingSpinner` 컴포넌트 재사용)
  - Blob 응답을 `<a>` 태그로 다운로드 처리
  - shadcn/ui `Button` 컴포넌트 활용

- [ ] `InvoiceView.tsx` 에 `PDFDownloadButton` 통합 | 담당: 프론트엔드 | 예상: 0.5d | 우선순위: 높음
  - 견적서 상단 또는 하단에 다운로드 버튼 배치
  - 버튼 위치 및 스타일 조정

- [ ] PDF 폰트 설정 및 한국어 깨짐 방지 | 담당: 풀스택 | 예상: 1d | 우선순위: 높음
  - Google Fonts 또는 로컬 폰트 파일에서 한국어 지원 폰트 다운로드
  - `public/fonts/` 디렉토리에 폰트 파일 저장
  - `@react-pdf/renderer` 의 `Font.register()` 로 폰트 등록

---

### Phase 3: 반응형 레이아웃 및 UX 완성 (0.5주)

**목표**: 모든 디바이스에서 견적서가 올바르게 표시되고, 사용자 경험이 완성된다.

**완료 기준**:
- 375px, 768px, 1280px 뷰포트에서 레이아웃 깨짐 없음
- 로딩 상태 및 에러 상태 UI 완성
- 페이지 메타데이터(OG 태그) 설정 완료

#### 태스크

- [ ] `InvoiceView.tsx` 반응형 CSS 적용 | 담당: 프론트엔드 | 예상: 1d | 우선순위: 높음
  - 모바일: 단일 컬럼, 폰트 크기 축소
  - 태블릿 이상: 2컬럼 헤더 레이아웃
  - `InvoiceItemsTable` 모바일 가로 스크롤 처리
  - TailwindCSS `sm:`, `md:`, `lg:` 반응형 프리픽스 활용

- [ ] `src/app/invoice/[id]/loading.tsx` - 로딩 상태 UI 생성 | 담당: 프론트엔드 | 예상: 0.5d | 우선순위: 중간
  - 견적서 레이아웃 형태의 스켈레톤 UI
  - shadcn/ui `Skeleton` 컴포넌트 활용 (없으면 `npx shadcn@latest add skeleton`)

- [ ] `src/app/invoice/[id]/page.tsx` - OG 메타태그 설정 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 중간
  - `generateMetadata()` 에서 `openGraph` 속성 설정
  - 견적서 번호, 클라이언트명을 title/description에 반영

- [ ] 에러 경계 `src/app/invoice/[id]/error.tsx` 생성 | 담당: 프론트엔드 | 예상: 0.5d | 우선순위: 중간
  - Notion API 일시 장애 시 사용자 친화적 에러 메시지 표시
  - "잠시 후 다시 시도해주세요" 안내 및 새로고침 버튼

---

### Phase 4: 배포 및 운영 준비 (0.5주)

**목표**: Vercel에 배포하고 실제 운영 가능한 상태로 마무리한다.

**완료 기준**:
- Vercel 환경 변수 설정 완료
- 프로덕션 빌드 오류 없음
- 실제 Notion 데이터로 End-to-End 테스트 통과

#### 태스크

- [ ] Vercel 프로젝트 환경 변수 설정 | 담당: DevOps/풀스택 | 예상: 0.5d | 우선순위: 높음
  - Vercel 대시보드에서 `NOTION_API_KEY` 추가
  - Vercel 대시보드에서 `NOTION_DATABASE_ID` 추가
  - Vercel 대시보드에서 `NEXT_PUBLIC_APP_URL` 추가 (배포 도메인)

- [ ] `next.config.ts` - 프로덕션 설정 검토 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 중간
  - `@react-pdf/renderer` 서버사이드 렌더링 호환성 확인
  - Vercel Edge Runtime 대신 Node.js Runtime 사용 확인 (`export const runtime = 'nodejs'`)

- [ ] 프로덕션 빌드 테스트 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 높음
  - `npm run build` 실행 및 오류 수정
  - TypeScript 타입 오류 전량 해결
  - ESLint 경고 처리

- [ ] End-to-End 수동 테스트 | 담당: 풀스택 | 예상: 1d | 우선순위: 높음
  - 실제 Notion 데이터베이스에 테스트 견적서 1건 생성
  - 견적서 조회 URL 접속 → 데이터 표시 확인
  - PDF 다운로드 → 파일 내용 확인
  - 잘못된 ID 접속 → 404 페이지 확인
  - 모바일 Chrome/Safari에서 레이아웃 확인

- [ ] `.env.example` 최종 업데이트 | 담당: 풀스택 | 예상: 0.5d | 우선순위: 낮음
  - 모든 환경 변수 샘플 값 및 설명 추가

---

## 전체 일정 요약

| Phase | 기간 | 주요 산출물 |
|-------|------|-------------|
| Phase 0: 환경 설정 및 Notion 연동 | 1주 (2026-02-21 ~ 2026-02-27) | Notion SDK 연동, `getInvoiceById()` 실제 구현 |
| Phase 1: 견적서 조회 페이지 | 1주 (2026-02-28 ~ 2026-03-06) | 견적서 웹 뷰어 컴포넌트 완성 |
| Phase 2: PDF 다운로드 | 1주 (2026-03-07 ~ 2026-03-13) | PDF 생성 API 및 다운로드 버튼 |
| Phase 3: 반응형 UX 완성 | 0.5주 (2026-03-14 ~ 2026-03-17) | 모바일 대응, 로딩/에러 UI |
| Phase 4: 배포 | 0.5주 (2026-03-18 ~ 2026-03-20) | Vercel 배포, E2E 테스트 |
| **총 기간** | **약 4주** | **MVP 완성** |

---

## 생성될 파일 목록 (Phase별)

```
Phase 0
└── lib/notion.ts                              (수정: TODO 주석 해제 및 구현)

Phase 1
├── src/app/invoice/[id]/page.tsx             (수정: 실제 데이터 연결)
├── src/app/invoice/[id]/not-found.tsx        (신규)
├── components/invoice/InvoiceView.tsx         (신규)
├── components/invoice/InvoiceHeader.tsx       (신규)
├── components/invoice/InvoiceItemsTable.tsx   (신규)
├── components/invoice/InvoiceSummary.tsx      (신규)
└── lib/helpers.ts                             (수정: 금액/날짜 포맷 유틸 추가)

Phase 2
├── src/app/api/invoice/[id]/pdf/route.ts      (신규)
├── components/invoice/InvoicePDF.tsx          (신규)
├── components/invoice/PDFDownloadButton.tsx   (신규)
└── public/fonts/                              (신규: 한국어 폰트 파일)

Phase 3
├── src/app/invoice/[id]/loading.tsx           (신규)
└── src/app/invoice/[id]/error.tsx             (신규)

Phase 4
└── .env.example                               (수정)
```

---

## 리스크 및 완화 전략

| 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|--------|--------|------------|----------|
| Notion API Rate Limit (초당 3회 요청 제한) | 높음 | 낮음 | Next.js `revalidate` 옵션으로 응답 캐싱, 동시 접속 폭주 시 대응 |
| `@react-pdf/renderer` 한국어 폰트 미지원 | 높음 | 높음 | Phase 2 초반에 폰트 테스트 선행, 문제 시 Puppeteer로 전환 검토 |
| `@react-pdf/renderer` Vercel Edge Runtime 미지원 | 높음 | 높음 | API Route에 `export const runtime = 'nodejs'` 명시 필수 |
| Notion API Key 노출 | 높음 | 낮음 | `NOTION_API_KEY`는 서버 전용 변수 (`NEXT_PUBLIC_` 접두사 절대 금지) |
| Notion 데이터베이스 스키마 변경 | 중간 | 중간 | `mapNotionPageToInvoice()` 매핑 함수 단일 진입점 유지, 스키마 고정 합의 |
| 대용량 PDF 생성 시 Vercel 함수 타임아웃 (10초) | 중간 | 낮음 | 항목 수 제한 (50개 이하), 필요 시 스트리밍 응답 고려 |
| Notion 서비스 장애 | 중간 | 낮음 | `error.tsx` 에서 사용자 안내, Vercel 캐싱으로 일시 대응 |

---

## 기술적 의존성

```
Phase 0 (Notion 연동)
    └── Phase 1에 필수 (데이터 없이 UI 구현 불가)
         └── Phase 2에 필수 (PDF에 견적서 데이터 필요)
              └── Phase 3 (데이터 로딩 중 UI 필요)
                   └── Phase 4 (모두 완성 후 배포)

패키지 의존성:
    @notionhq/client        → lib/notion.ts 구현에 필수
    @react-pdf/renderer     → InvoicePDF.tsx, PDF API Route에 필수
    shadcn/ui Table         → InvoiceItemsTable.tsx 에 필요
    shadcn/ui Skeleton      → loading.tsx 에 필요
```

---

## 보류 사항 및 미결 질문

| 번호 | 항목 | 현재 상태 | 결정 필요자 |
|------|------|----------|------------|
| Q1 | Items(견적 항목)가 별도 Notion 데이터베이스인지, 견적서 페이지의 하위 블록인지 | PRD에 Relation으로 명시되어 있으나, 구현 방식 확인 필요 | 개발자 |
| Q2 | PDF에 부가세(10%) 항목을 별도 표시할지 여부 | PRD에 명시 없음. `total_amount`가 부가세 포함인지 제외인지 확인 필요 | 기획자 |
| Q3 | 발행자(프리랜서/기업) 정보 (회사명, 사업자번호, 연락처)를 어디서 관리할지 | PRD 데이터 모델에 발행자 정보 없음. 환경 변수 or Notion 별도 DB 결정 필요 | 기획자 |
| Q4 | Notion 견적서 페이지의 `status` 가 `거절` 인 경우 웹 조회를 허용할지 | PRD에 명시 없음. 거절된 견적서 URL 접근 정책 결정 필요 | 기획자 |
| Q5 | PDF 파일명 규칙 | PRD에 명시 없음. `견적서_[invoice_number].pdf` 로 가정하고 진행 | 개발자 |
| Q6 | `@react-pdf/renderer` vs Puppeteer 최종 선택 | PRD에 "또는" 으로 명시. 한국어 폰트 지원 테스트 후 Phase 2 초반 결정 | 개발자 |

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

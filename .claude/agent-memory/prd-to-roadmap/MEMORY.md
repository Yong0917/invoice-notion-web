# PRD to ROADMAP 에이전트 메모리

## 프로젝트 핵심 정보

- **프로젝트명**: 노션 기반 견적서 관리 시스템
- **목적**: Notion을 CMS로 활용한 견적서 웹 뷰어 + PDF 다운로드
- **기술 스택**: Next.js 16.1.6 (App Router), TypeScript 5.x, React 19, TailwindCSS v4, shadcn/ui
- **배포**: Vercel / 패키지 관리: npm
- **앱 라우터 루트**: `src/app/` (CLAUDE.md의 `app/` 과 다름 - 실제 코드는 `src/app/`)

## 현재 구현 상태 (2026-02-21)

스캐폴딩 완료, 실제 로직 미구현:
- `lib/notion.ts` - 함수 시그니처만 존재, `@notionhq/client` 미설치
- `src/app/invoice/[id]/page.tsx` - 라우트 구조만 완성
- `src/app/api/invoice/[id]/route.ts` - 501 응답 반환 중
- `types/invoice.ts` - `Invoice`, `InvoiceItem` 타입 완성
- `src/app/page.tsx` - 서비스 소개 홈페이지 완성

## PRD 분석 시 발견한 누락 사항 (자주 확인할 것)

1. **발행자 정보**: PRD 데이터 모델에 발행자(회사명, 사업자번호 등) 필드 없음
2. **부가세 처리**: `total_amount`가 부가세 포함/제외 여부 불명확
3. **Items DB 구조**: Notion Relation vs 하위 블록 여부 확인 필요
4. **거절 상태 견적서**: 접근 허용 여부 정책 미정

## 로드맵 구조 패턴 (이 프로젝트에 적합)

- Phase 0: 외부 API 연동 기반 (Notion SDK 설치 및 데이터 레이어)
- Phase 1: 핵심 UI (견적서 조회 컴포넌트)
- Phase 2: 핵심 기능 (PDF 생성)
- Phase 3: 반응형 및 UX 완성
- Phase 4: 배포 및 E2E 테스트
- 총 약 4주 예상 (1인 개발 기준)

## 기술적 주의사항

- `@react-pdf/renderer`는 Vercel Edge Runtime 미지원 → `export const runtime = 'nodejs'` 필수
- 한국어 PDF는 폰트 직접 등록 필요 (Noto Sans KR 등)
- `NOTION_API_KEY`는 서버 전용 환경 변수 (NEXT_PUBLIC_ 금지)
- Next.js 라우트 `params`는 `Promise<{id: string}>` 타입 (Next.js 15+)

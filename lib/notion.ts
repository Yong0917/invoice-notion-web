/**
 * 노션 클라이언트 초기화 및 API 헬퍼 함수
 *
 * 사용 전 필수 환경 변수:
 * - NOTION_API_KEY: 노션 Integration 시크릿 키
 * - NOTION_DATABASE_ID: 견적서 메인 데이터베이스 ID
 *
 * TODO: @notionhq/client 패키지 설치 후 주석 해제
 * npm install @notionhq/client
 */

// import { Client } from '@notionhq/client'
import type { Invoice } from '@/types/invoice'

// ─── 환경 변수 검증 ──────────────────────────────────────────────────
// TODO: @notionhq/client 클라이언트 초기화 시 사용 예정
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`환경 변수가 설정되지 않았습니다: ${key}`)
  }
  return value
}

// ─── 노션 클라이언트 싱글톤 ──────────────────────────────────────────
// TODO: @notionhq/client 설치 후 아래 코드 활성화
//
// let notionClient: Client | null = null
//
// function getNotionClient(): Client {
//   if (!notionClient) {
//     notionClient = new Client({
//       auth: getRequiredEnv('NOTION_API_KEY'),
//     })
//   }
//   return notionClient
// }

// ─── 데이터베이스 ID 상수 ─────────────────────────────────────────────
// 서버 사이드에서만 접근 가능 (NEXT_PUBLIC_ 접두사 없음)
export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID ?? ''

/**
 * 노션 페이지 ID로 견적서 데이터를 조회합니다.
 *
 * @param pageId - 노션 페이지 ID (URL의 마지막 32자리 문자열)
 * @returns 견적서 데이터 또는 null (존재하지 않는 경우)
 *
 * TODO: 구현 항목
 * 1. notionClient.pages.retrieve({ page_id: pageId }) 호출
 * 2. 노션 프로퍼티를 Invoice 타입으로 변환
 * 3. 관련 견적 항목(InvoiceItem) 조회 및 매핑
 */
export async function getInvoiceById(
  pageId: string // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<Invoice | null> {
  // TODO: 실제 구현
  // const client = getNotionClient()
  // const page = await client.pages.retrieve({ page_id: pageId })
  // return mapNotionPageToInvoice(page)
  return null
}

/**
 * 데이터베이스의 모든 견적서 목록을 조회합니다.
 * (관리자 화면 등에서 활용 예정)
 *
 * TODO: 구현 항목
 * 1. notionClient.databases.query({ database_id: NOTION_DATABASE_ID }) 호출
 * 2. 결과를 Invoice[] 타입으로 변환
 */
export async function getInvoiceList(): Promise<[]> {
  // TODO: 실제 구현
  return []
}

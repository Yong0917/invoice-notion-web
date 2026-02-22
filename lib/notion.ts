/**
 * 노션 클라이언트 초기화 및 API 헬퍼 함수
 *
 * 필수 환경 변수:
 * - NOTION_API_KEY: 노션 Integration 시크릿 키
 * - NOTION_QUOTE_DB_ID: 견적서 메인 데이터베이스 ID
 * - NOTION_QUOTE_ITEM_DB_ID: 견적 항목 데이터베이스 ID
 */

import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/types/invoice'

// ─── 환경 변수 검증 ──────────────────────────────────────────────────
function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`환경 변수가 설정되지 않았습니다: ${key}`)
  return value
}

// ─── 노션 클라이언트 싱글톤 ──────────────────────────────────────────
let notionClient: Client | null = null

function getNotionClient(): Client {
  if (!notionClient) {
    notionClient = new Client({ auth: getRequiredEnv('NOTION_API_KEY') })
  }
  return notionClient
}

// ─── 노션 프로퍼티 추출 헬퍼 ─────────────────────────────────────────
type NotionProperties = PageObjectResponse['properties']

function extractTitle(props: NotionProperties, key: string): string {
  const prop = props[key]
  if (prop?.type !== 'title') return ''
  return prop.title[0]?.plain_text ?? ''
}

function extractText(props: NotionProperties, key: string): string {
  const prop = props[key]
  if (prop?.type !== 'rich_text') return ''
  return prop.rich_text[0]?.plain_text ?? ''
}

function extractDate(props: NotionProperties, key: string): string {
  const prop = props[key]
  if (prop?.type !== 'date') return ''
  return prop.date?.start ?? ''
}

function extractNumber(props: NotionProperties, key: string): number {
  const prop = props[key]
  if (prop?.type !== 'number') return 0
  return prop.number ?? 0
}

function extractSelect(props: NotionProperties, key: string): string {
  const prop = props[key]
  if (prop?.type !== 'select') return ''
  return prop.select?.name ?? ''
}

function extractFormulaNumber(props: NotionProperties, key: string): number {
  const prop = props[key]
  if (prop?.type !== 'formula') return 0
  if (prop.formula.type !== 'number') return 0
  return prop.formula.number ?? 0
}

// ─── 노션 페이지 → 도메인 타입 변환 ──────────────────────────────────
function mapToInvoiceItem(page: PageObjectResponse): InvoiceItem {
  const props = page.properties
  return {
    id: page.id,
    description: extractTitle(props, '이름'),
    quantity: extractNumber(props, '수량'),
    unit_price: extractNumber(props, '단가'),
    amount: extractFormulaNumber(props, '공급가액'),
  }
}

function mapToInvoice(page: PageObjectResponse, items: InvoiceItem[]): Invoice {
  const props = page.properties
  return {
    id: page.id,
    invoice_number: extractTitle(props, '이름'),
    client_name: extractText(props, '고객명'),
    issue_date: extractDate(props, '발행일'),
    valid_until: extractDate(props, '유효기간'),
    total_amount: extractNumber(props, '합계금액'),
    status: extractSelect(props, '상태') as InvoiceStatus,
    items,
  }
}

// ─── 공개 API ────────────────────────────────────────────────────────

/**
 * 노션 페이지 ID로 견적서 데이터를 조회합니다.
 * @param pageId 노션 페이지 ID (URL의 마지막 32자리)
 */
export async function getInvoiceById(pageId: string): Promise<Invoice | null> {
  try {
    const client = getNotionClient()

    // 견적서 페이지 조회
    const page = await client.pages.retrieve({ page_id: pageId })

    if (!('properties' in page)) return null

    // 연결된 견적 항목 조회 (견적서 ID로 필터링)
    const itemsRes = await client.databases.query({
      database_id: getRequiredEnv('NOTION_QUOTE_ITEM_DB_ID'),
      filter: {
        property: '견적서',
        relation: { contains: pageId },
      },
    })

    const items = itemsRes.results
      .filter((p): p is PageObjectResponse => 'properties' in p)
      .map(mapToInvoiceItem)

    return mapToInvoice(page, items)
  } catch (error: unknown) {
    // 존재하지 않는 페이지 또는 접근 권한 없음
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'object_not_found'
    ) {
      return null
    }
    throw error
  }
}

/**
 * 견적서 전체 목록을 조회합니다. (관리자 화면용)
 */
export async function getInvoiceList(): Promise<Invoice[]> {
  const client = getNotionClient()

  const res = await client.databases.query({
    database_id: getRequiredEnv('NOTION_QUOTE_DB_ID'),
    sorts: [{ property: '발행일', direction: 'descending' }],
  })

  return res.results
    .filter((p): p is PageObjectResponse => 'properties' in p)
    .map((page) => mapToInvoice(page, []))
}

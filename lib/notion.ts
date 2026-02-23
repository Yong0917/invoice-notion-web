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
import type { Invoice, InvoiceItem, InvoiceStatus, Sender } from '@/types/invoice'

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

function extractEmail(props: NotionProperties, key: string): string {
  const prop = props[key]
  if (prop?.type !== 'email') return ''
  return prop.email ?? ''
}

function extractCheckbox(props: NotionProperties, key: string): boolean {
  const prop = props[key]
  if (prop?.type !== 'checkbox') return false
  return prop.checkbox ?? false
}

function extractPhone(props: NotionProperties, key: string): string {
  const prop = props[key]
  if (prop?.type !== 'phone_number') return ''
  return prop.phone_number ?? ''
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
    unit: extractSelect(props, '단위') || undefined,
    item_notes: extractText(props, '비고') || undefined,
    category: extractSelect(props, '카테고리') || undefined,
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
    // Phase 5.5 확장 필드
    client_company: extractText(props, '고객 회사명') || undefined,
    client_contact_name: extractText(props, '고객 담당자명') || undefined,
    project_name: extractText(props, '프로젝트명') || undefined,
    delivery_date: extractDate(props, '납기일') || undefined,
    supply_amount: extractNumber(props, '공급가액') || undefined,
    client_email: extractEmail(props, '클라이언트 이메일') || undefined,
    client_phone: extractPhone(props, '클라이언트 연락처') || undefined,
    payment_terms: extractText(props, '결제 조건') || undefined,
    notes: extractText(props, '비고') || undefined,
    tax_invoice_required: extractCheckbox(props, '세금계산서 발행 여부'),
  }
}

function mapToSender(page: PageObjectResponse): Sender {
  const props = page.properties
  return {
    company_name: extractText(props, '회사명'),
    representative: extractText(props, '대표자명'),
    business_number: extractText(props, '사업자등록번호'),
    address: extractText(props, '주소'),
    phone: extractText(props, '전화번호'),
    email: extractEmail(props, '이메일'),
    bank_name: extractText(props, '은행명'),
    account_number: extractText(props, '계좌번호'),
    account_holder: extractText(props, '예금주'),
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
    // 페이지 없음, 접근 권한 없음, 잘못된 ID 형식 → 모두 null 반환 (custom not-found 트리거)
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      ['object_not_found', 'validation_error', 'invalid_request_url', 'unauthorized'].includes(
        error.code as string
      )
    ) {
      return null
    }
    throw error
  }
}

/**
 * 발행자 정보를 조회합니다. (DB 첫 번째 행 고정)
 */
export async function getSenderInfo(): Promise<Sender | null> {
  const client = getNotionClient()

  const res = await client.databases.query({
    database_id: getRequiredEnv('NOTION_SENDER_DB_ID'),
    page_size: 1,
  })

  const page = res.results.find((p): p is PageObjectResponse => 'properties' in p)
  if (!page) return null

  return mapToSender(page)
}

/**
 * 견적서 상태를 변경합니다. (관리자 전용)
 * @param pageId 노션 페이지 ID
 * @param status 변경할 상태 ('pending' | 'approved' | 'rejected')
 */
export async function updateInvoiceStatus(pageId: string, status: InvoiceStatus): Promise<void> {
  const client = getNotionClient()
  await client.pages.update({
    page_id: pageId,
    properties: {
      '상태': { select: { name: status } },
    },
  })
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

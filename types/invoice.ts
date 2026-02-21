/**
 * 견적서 도메인 타입 정의
 *
 * 노션 데이터베이스의 각 페이지가 하나의 Invoice에 대응합니다.
 * InvoiceItem은 해당 페이지의 하위 블록 또는 별도 DB로 관리합니다.
 */

// ─── 견적서 상태 ──────────────────────────────────────────────────────
export type InvoiceStatus = 'pending' | 'approved' | 'rejected'

// ─── 견적 항목 ────────────────────────────────────────────────────────
export interface InvoiceItem {
  /** 항목 고유 ID */
  id: string
  /** 항목 설명 (예: "웹사이트 개발", "UI/UX 디자인") */
  description: string
  /** 수량 */
  quantity: number
  /** 단가 (원화, 정수) */
  unit_price: number
  /** 공급가액 = quantity * unit_price */
  amount: number
}

// ─── 견적서 ───────────────────────────────────────────────────────────
export interface Invoice {
  /** 노션 페이지 ID (라우트 파라미터로 사용) */
  id: string
  /** 견적서 번호 (예: "Q-2024-001") */
  invoice_number: string
  /** 클라이언트(수신인) 이름 또는 회사명 */
  client_name: string
  /** 발행일 (ISO 8601 형식: YYYY-MM-DD) */
  issue_date: string
  /** 유효기간 만료일 (ISO 8601 형식: YYYY-MM-DD) */
  valid_until: string
  /** 견적 항목 목록 */
  items: InvoiceItem[]
  /** 합계 금액 (모든 항목의 amount 합산, 원화) */
  total_amount: number
  /** 견적서 처리 상태 */
  status: InvoiceStatus
}

// ─── 노션 프로퍼티 매핑용 타입 ───────────────────────────────────────
// 노션 API 응답을 Invoice 타입으로 변환할 때 사용하는 중간 타입
// TODO: @notionhq/client 설치 후 실제 노션 프로퍼티 타입으로 교체
export interface NotionInvoiceProperties {
  invoice_number: string
  client_name: string
  issue_date: string
  valid_until: string
  total_amount: number
  status: InvoiceStatus
}

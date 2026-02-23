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
  /** 단위 (예: 식, 개, 시간, 일, 월, 건, 세트) */
  unit?: string
  /** 항목별 비고 */
  item_notes?: string
  /** 카테고리 (예: 개발, 디자인, 기획, 컨설팅, 기타) */
  category?: string
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
  // ── Phase 5.5 확장 필드 ─────────────────────────────────────────────
  /** 고객 회사명 */
  client_company?: string
  /** 고객 담당자명 */
  client_contact_name?: string
  /** 클라이언트 이메일 */
  client_email?: string
  /** 클라이언트 연락처 */
  client_phone?: string
  /** 프로젝트명 */
  project_name?: string
  /** 납기일 (ISO 8601 형식: YYYY-MM-DD) */
  delivery_date?: string
  /** 공급가액 (부가세 제외 합계) */
  supply_amount?: number
  /** 결제 조건 */
  payment_terms?: string
  /** 비고 */
  notes?: string
  /** 세금계산서 발행 여부 */
  tax_invoice_required?: boolean
}

// ─── 발행자(Sender) ───────────────────────────────────────────────────
export interface Sender {
  /** 회사명 */
  company_name: string
  /** 대표자명 */
  representative: string
  /** 사업자등록번호 */
  business_number: string
  /** 주소 */
  address: string
  /** 전화번호 */
  phone: string
  /** 이메일 */
  email: string
  /** 은행명 */
  bank_name: string
  /** 계좌번호 */
  account_number: string
  /** 예금주 */
  account_holder: string
}


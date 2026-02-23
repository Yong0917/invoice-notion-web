import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/helpers'
import type { Invoice, InvoiceStatus } from '@/types/invoice'

// ─── 상태 배지 매핑 ────────────────────────────────────────────────────
const STATUS_MAP: Record<
  InvoiceStatus,
  { label: string; variant: 'outline' | 'default' | 'destructive' }
> = {
  pending: { label: '대기', variant: 'outline' },
  approved: { label: '승인', variant: 'default' },
  rejected: { label: '거절', variant: 'destructive' },
}

type InvoiceHeaderProps = {
  invoice: Pick<
    Invoice,
    | 'invoice_number'
    | 'client_name'
    | 'issue_date'
    | 'valid_until'
    | 'status'
    | 'client_company'
    | 'client_contact_name'
    | 'project_name'
    | 'delivery_date'
    | 'client_phone'
  >
}

export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  const { label, variant } = STATUS_MAP[invoice.status]

  return (
    <div className="space-y-4">
      {/* 견적서 번호 및 상태 */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          견적서 {invoice.invoice_number}
        </h1>
        <Badge variant={variant}>{label}</Badge>
      </div>

      {/* 클라이언트 및 날짜 정보 */}
      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-sm">
        <div>
          <dt className="text-muted-foreground">수신</dt>
          <dd className="font-medium">{invoice.client_company ?? invoice.client_name}</dd>
          {invoice.client_contact_name && (
            <dd className="text-muted-foreground">{invoice.client_contact_name}</dd>
          )}
        </div>
        <div>
          <dt className="text-muted-foreground">발행일</dt>
          <dd className="font-medium">{formatDate(invoice.issue_date)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">유효기간</dt>
          <dd className="font-medium">{formatDate(invoice.valid_until)}</dd>
        </div>
      </dl>

      {/* 프로젝트명 / 납기일 / 연락처 (데이터가 있을 때만 표시) */}
      {(invoice.project_name || invoice.delivery_date || invoice.client_phone) && (
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-sm border-t pt-3">
          {invoice.project_name && (
            <div>
              <dt className="text-muted-foreground">프로젝트명</dt>
              <dd className="font-medium">{invoice.project_name}</dd>
            </div>
          )}
          {invoice.delivery_date && (
            <div>
              <dt className="text-muted-foreground">납기일</dt>
              <dd className="font-medium">{formatDate(invoice.delivery_date)}</dd>
            </div>
          )}
          {invoice.client_phone && (
            <div>
              <dt className="text-muted-foreground">연락처</dt>
              <dd className="font-medium">{invoice.client_phone}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  )
}

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
    'invoice_number' | 'client_name' | 'issue_date' | 'valid_until' | 'status'
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
          <dd className="font-medium">{invoice.client_name}</dd>
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
    </div>
  )
}

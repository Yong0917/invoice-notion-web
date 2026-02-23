import { Badge } from '@/components/ui/badge'
import { formatKRW } from '@/lib/helpers'
import type { Invoice } from '@/types/invoice'

type InvoiceSummaryProps = {
  invoice: Pick<
    Invoice,
    'total_amount' | 'supply_amount' | 'payment_terms' | 'notes' | 'tax_invoice_required'
  >
}

export function InvoiceSummary({ invoice }: InvoiceSummaryProps) {
  const supplyAmount = invoice.supply_amount ?? invoice.total_amount
  const tax = Math.round(supplyAmount * 0.1)
  const grandTotal = Math.round(supplyAmount * 1.1)

  return (
    <div className="space-y-6">
      {/* 금액 요약 */}
      <div className="flex justify-end">
        <dl className="w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">공급가액</dt>
            <dd>{formatKRW(supplyAmount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">부가세 (10%)</dt>
            <dd>{formatKRW(tax)}</dd>
          </div>
          <div className="flex justify-between border-t pt-2">
            <dt className="font-bold">합계금액</dt>
            <dd className="text-lg font-bold">{formatKRW(grandTotal)}</dd>
          </div>
        </dl>
      </div>

      {/* 결제 조건 / 비고 / 세금계산서 (데이터가 있을 때만 표시) */}
      {(invoice.payment_terms || invoice.notes || invoice.tax_invoice_required !== undefined) && (
        <dl className="space-y-3 text-sm border-t pt-4">
          {invoice.payment_terms && (
            <div>
              <dt className="text-muted-foreground">결제 조건</dt>
              <dd className="mt-1">{invoice.payment_terms}</dd>
            </div>
          )}
          {invoice.notes && (
            <div>
              <dt className="text-muted-foreground">비고</dt>
              <dd className="mt-1">{invoice.notes}</dd>
            </div>
          )}
          {invoice.tax_invoice_required !== undefined && (
            <div className="flex items-center gap-2">
              <dt className="text-muted-foreground">세금계산서</dt>
              <dd>
                <Badge variant={invoice.tax_invoice_required ? 'default' : 'outline'}>
                  {invoice.tax_invoice_required ? '발행 예정' : '발행 안함'}
                </Badge>
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  )
}

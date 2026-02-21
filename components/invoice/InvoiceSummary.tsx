import { formatKRW } from '@/lib/helpers'

// TODO(Q2): total_amount를 공급가액으로 처리 중.
// 추후 노션 DB에 별도 공급가액 필드 추가 시 분리 필요.

type InvoiceSummaryProps = {
  totalAmount: number
}

export function InvoiceSummary({ totalAmount }: InvoiceSummaryProps) {
  const tax = Math.round(totalAmount * 0.1)
  const grandTotal = Math.round(totalAmount * 1.1)

  return (
    <div className="flex justify-end">
      <dl className="w-full max-w-xs space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">공급가액</dt>
          <dd>{formatKRW(totalAmount)}</dd>
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
  )
}

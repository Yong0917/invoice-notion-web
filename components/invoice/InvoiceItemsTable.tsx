import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatKRW } from '@/lib/helpers'
import type { InvoiceItem } from '@/types/invoice'

type InvoiceItemsTableProps = {
  items: InvoiceItem[]
}

export function InvoiceItemsTable({ items }: InvoiceItemsTableProps) {
  const hasUnit = items.some((item) => item.unit)
  const hasNotes = items.some((item) => item.item_notes)
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    // 모바일 가로 스크롤 지원
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>항목명</TableHead>
            {hasUnit && <TableHead>단위</TableHead>}
            <TableHead className="text-right">수량</TableHead>
            <TableHead className="text-right">단가</TableHead>
            <TableHead className="text-right">금액</TableHead>
            {/* 비고 컬럼 최대 너비 제한 */}
            {hasNotes && <TableHead className="max-w-[160px]">비고</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.description}</TableCell>
              {hasUnit && <TableCell>{item.unit ?? '-'}</TableCell>}
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">{formatKRW(item.unit_price)}</TableCell>
              <TableCell className="text-right">{formatKRW(item.amount)}</TableCell>
              {hasNotes && (
                // 비고 셀: 최대 너비 제한 후 2줄까지만 표시
                <TableCell className="text-muted-foreground max-w-[160px] text-xs">
                  <span className="line-clamp-2">{item.item_notes ?? ''}</span>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        {/* 합계 행 */}
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3 + (hasUnit ? 1 : 0)}>합계</TableCell>
            <TableCell className="text-right">{formatKRW(totalAmount)}</TableCell>
            {hasNotes && <TableCell />}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

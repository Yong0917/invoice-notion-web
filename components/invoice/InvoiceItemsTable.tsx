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
  totalAmount: number
}

export function InvoiceItemsTable({ items, totalAmount }: InvoiceItemsTableProps) {
  return (
    // 모바일 가로 스크롤 지원
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>항목명</TableHead>
            <TableHead className="text-right">수량</TableHead>
            <TableHead className="text-right">단가</TableHead>
            <TableHead className="text-right">금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">{formatKRW(item.unit_price)}</TableCell>
              <TableCell className="text-right">{formatKRW(item.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* 합계 행 */}
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>합계</TableCell>
            <TableCell className="text-right">{formatKRW(totalAmount)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

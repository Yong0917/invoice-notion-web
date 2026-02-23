'use client'

import { useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatKRW, formatDate } from '@/lib/helpers'
import { StatusChangeButton } from './StatusChangeButton'
import { SendEmailButton } from './SendEmailButton'
import type { Invoice, InvoiceStatus } from '@/types/invoice'
interface InvoiceListTableProps {
  invoices: Invoice[]
  searchParams: {
    q?: string
    status?: string
  }
}

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  pending: '대기중',
  approved: '승인',
  rejected: '거절',
}

const STATUS_VARIANT: Record<
  InvoiceStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
}

export function InvoiceListTable({ invoices, searchParams }: InvoiceListTableProps) {
  // 낙관적 상태 업데이트를 위한 로컬 상태
  const [localStatuses, setLocalStatuses] = useState<Record<string, InvoiceStatus>>({})

  // 클라이언트 사이드 필터링 (Notion API 텍스트 검색 미지원)
  const filtered = useMemo(() => {
    const q = searchParams.q?.toLowerCase() ?? ''
    const status = searchParams.status as InvoiceStatus | undefined

    return invoices.filter((inv) => {
      const matchesQuery =
        !q ||
        inv.invoice_number.toLowerCase().includes(q) ||
        inv.client_name.toLowerCase().includes(q) ||
        (inv.project_name?.toLowerCase().includes(q) ?? false) ||
        (inv.client_email?.toLowerCase().includes(q) ?? false)

      const matchesStatus = !status || inv.status === status

      return matchesQuery && matchesStatus
    })
  }, [invoices, searchParams.q, searchParams.status])

  function handleStatusChange(invoiceId: string, newStatus: InvoiceStatus) {
    setLocalStatuses((prev) => ({ ...prev, [invoiceId]: newStatus }))
  }

  if (filtered.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          조건에 맞는 견적서가 없습니다.
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>견적번호</TableHead>
            <TableHead>고객명</TableHead>
            <TableHead className="hidden lg:table-cell">프로젝트명</TableHead>
            <TableHead className="hidden xl:table-cell">이메일</TableHead>
            <TableHead className="hidden sm:table-cell">발행일</TableHead>
            <TableHead className="hidden md:table-cell">유효기간</TableHead>
            <TableHead className="hidden lg:table-cell">열람</TableHead>
            <TableHead className="text-right">합계금액</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="w-[100px]">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((invoice) => {
            const currentStatus = localStatuses[invoice.id] ?? invoice.status
            return (
              <TableRow key={invoice.id}>
                {/* 견적번호 — 클릭 시 새 탭으로 조회 페이지 이동 */}
                <TableCell>
                  <a
                    href={`/invoice/${invoice.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {invoice.invoice_number}
                  </a>
                </TableCell>
                <TableCell>{invoice.client_name}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {invoice.project_name ?? '-'}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {invoice.client_email ?? '-'}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {invoice.issue_date ? formatDate(invoice.issue_date) : '-'}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {invoice.valid_until ? formatDate(invoice.valid_until) : '-'}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {invoice.viewed_at ? (
                    <span className="text-sm text-muted-foreground">
                      {formatDate(invoice.viewed_at)}
                    </span>
                  ) : (
                    <Badge variant="outline">미열람</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatKRW(invoice.total_amount)}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[currentStatus]}>
                    {STATUS_LABEL[currentStatus]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <StatusChangeButton
                      invoiceId={invoice.id}
                      currentStatus={currentStatus}
                      onStatusChange={(newStatus) => handleStatusChange(invoice.id, newStatus)}
                    />
                    <SendEmailButton
                      invoiceId={invoice.id}
                      clientEmail={invoice.client_email}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export { type InvoiceListTableProps }
export { STATUS_LABEL, STATUS_VARIANT }
// handleStatusChange 콜백 타입 내보내기 (StatusChangeButton 통합 시 사용)
export type { InvoiceStatus }

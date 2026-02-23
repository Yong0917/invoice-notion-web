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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { formatKRW, formatDate } from '@/lib/helpers'
import { StatusChangeButton } from './StatusChangeButton'
import { SendEmailButton } from './SendEmailButton'
import type { Invoice, InvoiceStatus } from '@/types/invoice'

const PAGE_SIZE = 10

interface InvoiceListTableProps {
  invoices: Invoice[]
  searchParams: {
    q?: string
    status?: string
    page?: string
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

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const result: (number | 'ellipsis')[] = []

  result.push(1)

  if (current > 3) result.push('ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    result.push(i)
  }

  if (current < total - 2) result.push('ellipsis')

  result.push(total)

  return result
}

export function InvoiceListTable({ invoices, searchParams }: InvoiceListTableProps) {
  const [localStatuses, setLocalStatuses] = useState<Record<string, InvoiceStatus>>({})

  // 클라이언트 사이드 필터링
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

  // 페이지네이션 계산
  const currentPage = Math.max(1, Number(searchParams.page ?? '1'))
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function buildPageUrl(page: number): string {
    const params = new URLSearchParams()
    if (searchParams.q) params.set('q', searchParams.q)
    if (searchParams.status) params.set('status', searchParams.status)
    params.set('page', String(page))
    return `/admin?${params.toString()}`
  }

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
            <TableHead className="hidden 2xl:table-cell">이메일</TableHead>
            <TableHead className="hidden sm:table-cell">발행일</TableHead>
            <TableHead className="hidden md:table-cell">유효기간</TableHead>
            <TableHead className="hidden lg:table-cell">열람</TableHead>
            <TableHead className="text-right">합계금액</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="w-[100px]">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((invoice) => {
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
                <TableCell className="hidden 2xl:table-cell">
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

      {/* 페이지네이션 UI */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length}건
          </p>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={buildPageUrl(Math.max(1, currentPage - 1))}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {getPageNumbers(currentPage, totalPages).map((num, i) =>
                num === 'ellipsis' ? (
                  <PaginationItem key={`e-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={num}>
                    <PaginationLink
                      href={buildPageUrl(num)}
                      isActive={num === currentPage}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  href={buildPageUrl(Math.min(totalPages, currentPage + 1))}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export { type InvoiceListTableProps }
export { STATUS_LABEL, STATUS_VARIANT }
export type { InvoiceStatus }

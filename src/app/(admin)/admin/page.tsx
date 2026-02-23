import { Suspense } from 'react'
import { getInvoiceList } from '@/lib/notion'
import { InvoiceListTable } from '@/components/admin/InvoiceListTable'
import { InvoiceFilters } from '@/components/admin/InvoiceFilters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { RefreshButton } from '@/components/admin/RefreshButton'
import type { InvoiceStatus } from '@/types/invoice'

interface AdminPageProps {
  searchParams: Promise<{
    q?: string
    status?: string
    page?: string
  }>
}

export const metadata = {
  title: '관리자 대시보드',
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const [invoices, params] = await Promise.all([
    getInvoiceList(),
    searchParams,
  ])

  // 상태별 건수 집계
  const counts = {
    total: invoices.length,
    pending: invoices.filter((i) => i.status === 'pending').length,
    approved: invoices.filter((i) => i.status === 'approved').length,
    rejected: invoices.filter((i) => i.status === 'rejected').length,
  }

  const summaryCards = [
    { label: '전체', value: counts.total, icon: FileText, color: 'text-foreground' },
    { label: '대기중', value: counts.pending, icon: Clock, color: 'text-yellow-500' },
    { label: '승인', value: counts.approved, icon: CheckCircle, color: 'text-green-500' },
    { label: '거절', value: counts.rejected, icon: XCircle, color: 'text-destructive' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">견적서 관리</h1>
          <p className="text-sm text-muted-foreground">
            총 {counts.total}건의 견적서가 있습니다.
          </p>
        </div>
        <RefreshButton />
      </div>

      {/* 상태 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 검색/필터 */}
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <InvoiceFilters />
      </Suspense>

      {/* 견적서 목록 테이블 */}
      <InvoiceListTable
        invoices={invoices}
        searchParams={{
          q: params.q,
          status: params.status as InvoiceStatus | undefined,
          page: params.page,
        }}
      />
    </div>
  )
}

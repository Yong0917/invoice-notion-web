'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDebounce } from '@/hooks/use-debounce'
import { Search } from 'lucide-react'
import type { InvoiceStatus } from '@/types/invoice'

type StatusFilter = InvoiceStatus | 'all'

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: '대기중' },
  { value: 'approved', label: '승인' },
  { value: 'rejected', label: '거절' },
]

export function InvoiceFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const debouncedQuery = useDebounce(query, 300)

  const currentStatus = (searchParams.get('status') ?? 'all') as StatusFilter

  // 검색어 디바운스 처리 후 URL 업데이트
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedQuery) {
      params.set('q', debouncedQuery)
    } else {
      params.delete('q')
    }

    router.push(`/admin?${params.toString()}`)
  }, [debouncedQuery]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleStatusChange(status: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (status === 'all') {
      params.delete('status')
    } else {
      params.set('status', status)
    }

    router.push(`/admin?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* 텍스트 검색 */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="견적번호 또는 고객명 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* 상태 필터 탭 */}
      <Tabs value={currentStatus} onValueChange={handleStatusChange}>
        <TabsList>
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}

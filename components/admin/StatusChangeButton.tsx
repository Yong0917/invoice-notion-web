'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ChevronDown, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { STATUS_LABEL, STATUS_VARIANT } from './InvoiceListTable'
import type { InvoiceStatus } from '@/types/invoice'

interface StatusChangeButtonProps {
  invoiceId: string
  currentStatus: InvoiceStatus
  onStatusChange: (newStatus: InvoiceStatus) => void
}

const ALL_STATUSES: InvoiceStatus[] = ['pending', 'approved', 'rejected']

export function StatusChangeButton({
  invoiceId,
  currentStatus,
  onStatusChange,
}: StatusChangeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSelect(newStatus: InvoiceStatus) {
    if (newStatus === currentStatus || isLoading) return

    // 낙관적 UI 업데이트
    onStatusChange(newStatus)
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/invoice/${invoiceId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        // 실패 시 원래 상태로 롤백
        onStatusChange(currentStatus)
        toast.error('상태 변경에 실패했습니다.')
        return
      }

      toast.success(`상태가 "${STATUS_LABEL[newStatus]}"으로 변경되었습니다.`)
    } catch {
      onStatusChange(currentStatus)
      toast.error('네트워크 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto gap-1 p-0 hover:bg-transparent"
          disabled={isLoading}
        >
          <Badge variant={STATUS_VARIANT[currentStatus]}>
            {STATUS_LABEL[currentStatus]}
          </Badge>
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {ALL_STATUSES.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleSelect(status)}
            disabled={status === currentStatus}
          >
            <Badge variant={STATUS_VARIANT[status]} className="mr-2">
              {STATUS_LABEL[status]}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

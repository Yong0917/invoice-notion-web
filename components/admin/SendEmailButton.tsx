'use client'

import { useState } from 'react'
import { Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SendEmailButtonProps {
  invoiceId: string
  clientEmail?: string
}

export function SendEmailButton({ invoiceId, clientEmail }: SendEmailButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSend() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/invoice/${invoiceId}/send-email`, {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error ?? '이메일 발송에 실패했습니다.')
        return
      }

      toast.success('이메일이 발송되었습니다.')
    } catch {
      toast.error('네트워크 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 이메일 없을 때: 비활성화 + 툴팁 안내
  if (!clientEmail) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" disabled className="h-8 w-8">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>이메일 주소가 설정되지 않았습니다</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>이메일 발송 확인</AlertDialogTitle>
          <AlertDialogDescription>
            아래 주소로 견적서 이메일을 발송합니다.
            <br />
            <span className="mt-1 block font-medium text-foreground">
              {clientEmail}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleSend}>발송</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

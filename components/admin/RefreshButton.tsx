'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function RefreshButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleRefresh() {
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isPending}
    >
      <RefreshCw className={cn('mr-1.5 h-4 w-4', isPending && 'animate-spin')} />
      새로고침
    </Button>
  )
}

'use client'

// Next.js error boundary는 반드시 클라이언트 컴포넌트여야 합니다.
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * 견적서 페이지 에러 바운더리
 *
 * 서버 컴포넌트에서 발생한 런타임 에러를 캐치하여 사용자에게 안내합니다.
 * not-found.tsx와 동일한 레이아웃 구조를 사용합니다.
 */
interface InvoiceErrorProps {
  /** Next.js가 주입하는 에러 객체 (digest 포함 가능) */
  error: Error & { digest?: string }
  /** 동일 세그먼트를 다시 렌더링하는 리셋 함수 */
  reset: () => void
}

export default function InvoiceError({ error: _error, reset }: InvoiceErrorProps) {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-16 text-center">
      {/* 에러 아이콘 */}
      <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />

      {/* 에러 제목 */}
      <h1 className="mb-2 text-2xl font-bold">오류가 발생했습니다</h1>

      {/* 에러 안내 메시지 */}
      <p className="mb-8 text-muted-foreground">
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>

      {/* 다시 시도 버튼 — TODO: 필요 시 에러 리포팅 로직 연결 */}
      <Button onClick={reset}>다시 시도</Button>
    </div>
  )
}

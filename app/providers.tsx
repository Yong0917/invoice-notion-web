'use client'

import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * 앱 전체 Provider 래퍼
 * - ThemeProvider: 다크/라이트 모드 지원
 * - TooltipProvider: shadcn Tooltip 컴포넌트 사용을 위해 필수
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  )
}

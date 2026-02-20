'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMounted } from '@/hooks'

/**
 * 다크/라이트/시스템 모드 전환 토글 컴포넌트
 * useMounted 훅으로 hydration 불일치 방지
 */
export function ThemeToggle() {
  const { setTheme } = useTheme()
  const mounted = useMounted()

  // 마운트 전: 레이아웃 shift 방지용 빈 버튼
  if (!mounted) {
    return <Button variant="outline" size="icon" className="h-9 w-9" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">테마 전환</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>라이트</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>다크</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>시스템</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

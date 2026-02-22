'use client'

import { signOut } from 'next-auth/react'
import { FileText, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminHeaderProps {
  email: string
}

export function AdminHeader({ email }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center gap-2 font-semibold">
            <FileText className="h-5 w-5 text-primary" />
            <span>견적서 관리</span>
          </div>

          {/* 관리자 정보 + 로그아웃 */}
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

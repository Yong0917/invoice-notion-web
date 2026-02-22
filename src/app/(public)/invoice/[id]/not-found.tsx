import Link from 'next/link'
import { FileX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function InvoiceNotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-16 text-center">
      <FileX className="mb-4 h-16 w-16 text-muted-foreground" />
      <h1 className="mb-2 text-2xl font-bold">견적서를 찾을 수 없습니다</h1>
      <p className="mb-8 text-muted-foreground">
        올바른 링크를 발행자에게 문의해주세요.
      </p>
      <Button asChild>
        <Link href="/">홈으로 이동</Link>
      </Button>
    </div>
  )
}

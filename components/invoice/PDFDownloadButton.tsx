'use client'

import { useState } from 'react'
import { Loader2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  invoiceId: string
  invoiceNumber: string
}

export function PDFDownloadButton({ invoiceId, invoiceNumber }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDownload() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/invoice/${invoiceId}/pdf`)
      if (!res.ok) throw new Error('PDF 생성 실패')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `견적서_${invoiceNumber}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('[PDFDownloadButton] 다운로드 실패:', e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={isLoading} variant="outline">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isLoading ? 'PDF 생성 중...' : 'PDF 다운로드'}
    </Button>
  )
}

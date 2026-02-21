import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getInvoiceById } from '@/lib/notion'
import { InvoiceView } from '@/components/invoice/InvoiceView'

// ─── 페이지 Props 타입 ────────────────────────────────────────────────
interface InvoicePageProps {
  params: Promise<{
    id: string
  }>
}

// ─── 동적 메타데이터 생성 ─────────────────────────────────────────────
export async function generateMetadata(
  { params }: InvoicePageProps
): Promise<Metadata> {
  const { id } = await params
  const invoice = await getInvoiceById(id)
  return {
    title: invoice ? `견적서 ${invoice.invoice_number}` : '견적서',
  }
}

/**
 * 견적서 조회 페이지
 *
 * 라우트: /invoice/[id]
 * - [id]: 노션 페이지 ID
 */
export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params
  const invoice = await getInvoiceById(id)

  if (!invoice) notFound()

  return <InvoiceView invoice={invoice} />
}

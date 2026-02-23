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

  // OG 제목 및 설명 — invoice 존재 여부에 따라 분기
  const title = invoice ? `견적서 ${invoice.invoice_number}` : '견적서'
  const description = invoice
    ? `${invoice.client_name} 앞 견적서입니다.`
    : '견적서를 확인하세요.'

  return {
    title,
    openGraph: {
      title,
      description,
      type: 'website',
      // invoice가 있을 때만 정규 URL을 명시합니다.
      ...(invoice && {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${id}`,
      }),
    },
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

  // 최초 열람 시 열람일시 기록 (viewed_at 없는 경우에만)
  // 비동기 처리 — 실패해도 페이지 렌더링에 영향 없음
  if (!invoice.viewed_at) {
    void fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/invoice/${id}/view`, {
      method: 'POST',
      cache: 'no-store',
    }).catch(() => {})
  }

  return <InvoiceView invoice={invoice} />
}

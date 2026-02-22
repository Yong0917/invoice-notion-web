/**
 * GET /api/invoice/[id]/pdf
 *
 * 노션 견적서 데이터를 조회하여 PDF 바이너리를 생성·반환합니다.
 * @react-pdf/renderer는 Edge Runtime을 지원하지 않으므로 nodejs runtime 필수.
 */

import { renderToBuffer } from '@react-pdf/renderer'
import { getInvoiceById, getSenderInfo } from '@/lib/notion'
import { InvoicePDF } from '@/components/invoice/InvoicePDF'
import type { Sender } from '@/types/invoice'

// ─── 라우트 세그먼트 설정 ─────────────────────────────────────────────
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// sender가 null인 경우를 위한 빈 Sender 기본값
const DEFAULT_SENDER: Sender = {
  company_name: '',
  representative: '',
  business_number: '',
  address: '',
  phone: '',
  email: '',
  bank_name: '',
  account_number: '',
  account_holder: '',
}

// ─── 라우트 핸들러 컨텍스트 타입 ─────────────────────────────────────
interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/invoice/[id]/pdf
 *
 * 응답:
 * - 200: PDF 바이너리 (application/pdf)
 * - 404: 존재하지 않는 견적서
 * - 500: 서버 오류
 */
export async function GET(_req: Request, { params }: RouteContext): Promise<Response> {
  const { id } = await params

  try {
    // 견적서 + 발행자 정보 병렬 조회
    console.log(`[PDF] 요청 시작: id=${id}`)
    const [invoice, sender] = await Promise.all([getInvoiceById(id), getSenderInfo()])
    console.log(`[PDF] 조회 결과: invoice=${invoice ? invoice.invoice_number : 'null'}, sender=${sender ? sender.company_name : 'null'}`)

    if (!invoice) {
      console.warn(`[PDF] 견적서 없음: id=${id}`)
      return new Response(JSON.stringify({ error: '견적서를 찾을 수 없습니다.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const senderData = sender ?? DEFAULT_SENDER

    // PDF 바이너리 생성
    const pdfBuffer = await renderToBuffer(
      <InvoicePDF invoice={invoice} sender={senderData} />
    )

    // RFC 5987 파일명 인코딩
    const filename = encodeURIComponent(`견적서_${invoice.invoice_number}.pdf`)

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename*=UTF-8''${filename}`,
      },
    })
  } catch (error) {
    console.error('[API] PDF 생성 실패:', error)
    return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

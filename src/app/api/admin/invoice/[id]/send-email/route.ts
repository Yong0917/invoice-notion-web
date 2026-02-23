import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getInvoiceById, getSenderInfo } from '@/lib/notion'
import { sendInvoiceEmail } from '@/lib/email'
import type { ApiResponse } from '@/types'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * POST /api/admin/invoice/[id]/send-email
 *
 * 견적서 이메일을 클라이언트에게 발송합니다. 관리자 세션 인증이 필요합니다.
 *
 * 응답:
 * - 200: 발송 성공
 * - 400: 클라이언트 이메일 미설정
 * - 401: 미인증
 * - 404: 견적서 없음
 * - 500: 서버 오류
 */
export async function POST(
  _request: Request,
  { params }: RouteContext
): Promise<NextResponse<ApiResponse<null>>> {
  // 세션 인증 검증
  const session = await auth()
  if (!session) {
    return NextResponse.json(
      { success: false, error: '로그인이 필요합니다.' },
      { status: 401 }
    )
  }

  const { id } = await params

  try {
    const [invoice, sender] = await Promise.all([
      getInvoiceById(id),
      getSenderInfo(),
    ])

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: '견적서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (!invoice.client_email) {
      return NextResponse.json(
        { success: false, error: '클라이언트 이메일이 설정되지 않았습니다.' },
        { status: 400 }
      )
    }

    await sendInvoiceEmail(invoice, sender?.company_name ?? '')

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    console.error('[API] 이메일 발송 실패:', error)
    return NextResponse.json(
      { success: false, error: '이메일 발송에 실패했습니다.' },
      { status: 500 }
    )
  }
}

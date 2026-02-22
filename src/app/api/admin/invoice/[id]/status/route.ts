import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { updateInvoiceStatus } from '@/lib/notion'
import type { ApiResponse } from '@/types'
import type { InvoiceStatus } from '@/types/invoice'

export const dynamic = 'force-dynamic'

const VALID_STATUSES: InvoiceStatus[] = ['pending', 'approved', 'rejected']

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * PATCH /api/admin/invoice/[id]/status
 *
 * 견적서 상태를 변경합니다. 관리자 세션 인증이 필요합니다.
 *
 * Body: { status: 'pending' | 'approved' | 'rejected' }
 * 응답:
 * - 200: 상태 변경 성공
 * - 400: 유효하지 않은 status 값
 * - 401: 미인증
 * - 500: 서버 오류
 */
export async function PATCH(
  request: Request,
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
    const body = await request.json()
    const { status } = body as { status: unknown }

    // 유효한 status 값 검증
    if (!status || !VALID_STATUSES.includes(status as InvoiceStatus)) {
      return NextResponse.json(
        { success: false, error: `유효하지 않은 상태값입니다. 허용값: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    await updateInvoiceStatus(id, status as InvoiceStatus)

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    console.error('[API] 견적서 상태 변경 실패:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

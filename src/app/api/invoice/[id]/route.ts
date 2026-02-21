import { NextResponse } from 'next/server'
import { getInvoiceById } from '@/lib/notion'
import type { ApiResponse } from '@/types'
import type { Invoice } from '@/types/invoice'

// ─── 라우트 세그먼트 설정 ─────────────────────────────────────────────
// 견적서 데이터는 노션 API에서 실시간으로 가져오므로 캐시 비활성화
export const dynamic = 'force-dynamic'

// ─── 라우트 핸들러 컨텍스트 타입 ─────────────────────────────────────
interface RouteContext {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/invoice/[id]
 *
 * 노션 페이지 ID로 견적서 데이터를 조회합니다.
 *
 * 응답:
 * - 200: 견적서 데이터 반환
 * - 404: 존재하지 않는 견적서
 * - 500: 서버 오류
 */
export async function GET(
  _request: Request,
  { params }: RouteContext
): Promise<NextResponse<ApiResponse<Invoice>>> {
  const { id } = await params

  try {
    const invoice = await getInvoiceById(id)

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: '견적서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: invoice })
  } catch (error) {
    console.error('[API] 견적서 조회 실패:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

/**
 * Phase 5.5 테스트 데이터 삽입 스크립트 (전체 견적서 업데이트)
 *
 * 실행 방법:
 *   node -r dotenv/config scripts/seed-test-data.cjs dotenv_config_path=.env.local
 */

'use strict'

const { Client } = require('@notionhq/client')

const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_QUOTE_DB_ID = process.env.NOTION_QUOTE_DB_ID
const NOTION_QUOTE_ITEM_DB_ID = process.env.NOTION_QUOTE_ITEM_DB_ID

if (!NOTION_API_KEY || !NOTION_QUOTE_DB_ID || !NOTION_QUOTE_ITEM_DB_ID) {
  console.error('❌ 환경 변수 누락')
  process.exit(1)
}

const notion = new Client({ auth: NOTION_API_KEY })

// ─── DB 스키마 조회 ─────────────────────────────────────────────────
async function getDbProperties(dbId) {
  const db = await notion.databases.retrieve({ database_id: dbId })
  return Object.keys(db.properties)
}

// ─── 견적서별 테스트 데이터 ──────────────────────────────────────────
// 견적서 이름(견적번호) 기준으로 매핑. 없으면 마지막 항목(기본값) 사용.
const INVOICE_TEST_DATA = {
  'Q-2025-001': {
    '고객 회사명': { rich_text: [{ text: { content: '(주)테스트코리아' } }] },
    '고객 담당자명': { rich_text: [{ text: { content: '김철수 부장' } }] },
    '프로젝트명': { rich_text: [{ text: { content: '기업 홈페이지 리뉴얼' } }] },
    '납기일': { date: { start: '2026-05-31' } },
    '클라이언트 이메일': { email: 'cskim@testkorea.com' },
    '클라이언트 연락처': { phone_number: '02-1234-5678' },
    '결제 조건': { rich_text: [{ text: { content: '계약 시 30%, 중도 30%, 납품 시 40%' } }] },
    '비고': { rich_text: [{ text: { content: '디자인 시안 2회 수정 포함. 유지보수 3개월 무상.' } }] },
    '세금계산서 발행 여부': { checkbox: true },
  },
  'Q-2025-002': {
    '고객 회사명': { rich_text: [{ text: { content: '홍길동 디자인 스튜디오' } }] },
    '고객 담당자명': { rich_text: [{ text: { content: '홍길동 대표' } }] },
    '프로젝트명': { rich_text: [{ text: { content: '브랜드 아이덴티티 디자인' } }] },
    '납기일': { date: { start: '2026-04-15' } },
    '클라이언트 이메일': { email: 'hong@hgd-design.com' },
    '클라이언트 연락처': { phone_number: '010-9876-5432' },
    '결제 조건': { rich_text: [{ text: { content: '계약 시 50%, 납품 시 50%' } }] },
    '비고': { rich_text: [{ text: { content: '로고 원본 파일(AI, PDF) 포함 납품.' } }] },
    '세금계산서 발행 여부': { checkbox: false },
  },
  // 기본값 (위 목록에 없는 견적서에 사용)
  '__default__': {
    '고객 회사명': { rich_text: [{ text: { content: '(주)샘플 클라이언트' } }] },
    '고객 담당자명': { rich_text: [{ text: { content: '이영희 과장' } }] },
    '프로젝트명': { rich_text: [{ text: { content: '신규 서비스 개발' } }] },
    '납기일': { date: { start: '2026-06-30' } },
    '클라이언트 이메일': { email: 'sample@client.com' },
    '클라이언트 연락처': { phone_number: '010-5555-6666' },
    '결제 조건': { rich_text: [{ text: { content: '납품 완료 후 30일 이내 지급' } }] },
    '비고': { rich_text: [{ text: { content: '요구사항 변경 시 추가 견적 협의.' } }] },
    '세금계산서 발행 여부': { checkbox: true },
  },
}

// ─── 견적항목별 테스트 데이터 ────────────────────────────────────────
// 카테고리·단위를 다양하게 설정
const ITEM_TEST_DATA = [
  {
    '단위': { select: { name: '식' } },
    '카테고리': { select: { name: '기획' } },
    '비고': { rich_text: [{ text: { content: '요구사항 분석 및 기획서 작성 포함' } }] },
  },
  {
    '단위': { select: { name: '시간' } },
    '카테고리': { select: { name: '디자인' } },
    '비고': { rich_text: [{ text: { content: 'UI/UX 설계 및 시안 2회 수정 포함' } }] },
  },
  {
    '단위': { select: { name: '식' } },
    '카테고리': { select: { name: '개발' } },
    '비고': { rich_text: [{ text: { content: '반응형 퍼블리싱 및 CMS 연동' } }] },
  },
  {
    '단위': { select: { name: '개' } },
    '카테고리': { select: { name: '개발' } },
    '비고': { rich_text: [] },
  },
  {
    '단위': { select: { name: '월' } },
    '카테고리': { select: { name: '컨설팅' } },
    '비고': { rich_text: [{ text: { content: '월 2회 미팅 포함' } }] },
  },
  {
    '단위': { select: { name: '건' } },
    '카테고리': { select: { name: '기타' } },
    '비고': { rich_text: [] },
  },
]

// ─── 존재하는 속성만 필터링 ─────────────────────────────────────────
function filterByExistingProps(candidates, existingProps) {
  return Object.fromEntries(
    Object.entries(candidates).filter(([key]) => existingProps.includes(key))
  )
}

// ─── 공급가액 계산 ───────────────────────────────────────────────────
function calcSupplyAmount(items) {
  let total = 0
  for (const item of items) {
    const formula = item.properties['공급가액']
    if (formula?.type === 'formula' && formula.formula?.type === 'number') {
      total += formula.formula.number ?? 0
    } else {
      total += (item.properties['수량']?.number ?? 0) * (item.properties['단가']?.number ?? 0)
    }
  }
  return total
}

// ─── 메인 ────────────────────────────────────────────────────────────
async function main() {
  // DB 속성 목록 조회
  console.log('🔍 DB 속성 조회 중...')
  const [invoiceProps, itemProps] = await Promise.all([
    getDbProperties(NOTION_QUOTE_DB_ID),
    getDbProperties(NOTION_QUOTE_ITEM_DB_ID),
  ])

  // 누락 속성 체크
  const requiredInvoice = [
    '고객 회사명', '고객 담당자명', '프로젝트명', '납기일', '공급가액',
    '클라이언트 이메일', '클라이언트 연락처', '결제 조건', '비고', '세금계산서 발행 여부',
  ]
  const requiredItem = ['단위', '비고', '카테고리']
  const missingInvoice = requiredInvoice.filter(p => !invoiceProps.includes(p))
  const missingItem = requiredItem.filter(p => !itemProps.includes(p))

  if (missingInvoice.length > 0) {
    console.warn('\n⚠️  견적서 DB 누락 속성:', missingInvoice.join(', '))
    console.warn('   → 해당 속성은 업데이트에서 제외됩니다.\n')
  }
  if (missingItem.length > 0) {
    console.warn('\n⚠️  견적항목 DB 누락 속성:', missingItem.join(', '))
    console.warn('   → 해당 속성은 업데이트에서 제외됩니다.\n')
  }
  if (missingInvoice.length === 0 && missingItem.length === 0) {
    console.log('✅ 모든 신규 속성 확인 완료\n')
  }

  // 전체 견적서 조회
  const invoicesRes = await notion.databases.query({
    database_id: NOTION_QUOTE_DB_ID,
    sorts: [{ property: '발행일', direction: 'descending' }],
  })
  const invoices = invoicesRes.results.filter(p => 'properties' in p)

  console.log(`📋 총 ${invoices.length}개 견적서 업데이트 시작\n`)
  console.log('─'.repeat(50))

  for (const invoice of invoices) {
    const name = invoice.properties['이름']?.title?.[0]?.plain_text ?? '(이름 없음)'
    const client = invoice.properties['고객명']?.rich_text?.[0]?.plain_text ?? '(고객명 없음)'
    console.log(`\n📄 [${name}] — ${client}`)

    // 견적서별 데이터 선택 (없으면 기본값)
    const candidateData = INVOICE_TEST_DATA[name] ?? INVOICE_TEST_DATA['__default__']

    // 항목 조회 및 공급가액 계산
    const itemsRes = await notion.databases.query({
      database_id: NOTION_QUOTE_ITEM_DB_ID,
      filter: { property: '견적서', relation: { contains: invoice.id } },
    })
    const items = itemsRes.results.filter(p => 'properties' in p)
    const supplyAmount = calcSupplyAmount(items)

    // 견적서 업데이트
    const invoiceUpdateData = filterByExistingProps(candidateData, invoiceProps)
    if (invoiceProps.includes('공급가액')) {
      invoiceUpdateData['공급가액'] = { number: supplyAmount || 0 }
    }

    await notion.pages.update({ page_id: invoice.id, properties: invoiceUpdateData })
    console.log(`   ✅ 견적서: ${Object.keys(invoiceUpdateData).join(', ')}`)
    if (invoiceProps.includes('공급가액')) {
      console.log(`   💰 공급가액: ${supplyAmount.toLocaleString()}원`)
    }

    // 견적항목 업데이트
    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const itemName = item.properties['이름']?.title?.[0]?.plain_text ?? `항목 ${i + 1}`
        const testData = ITEM_TEST_DATA[i % ITEM_TEST_DATA.length]
        const itemUpdateData = filterByExistingProps(testData, itemProps)

        if (Object.keys(itemUpdateData).length > 0) {
          await notion.pages.update({ page_id: item.id, properties: itemUpdateData })
          const unit = testData['단위']?.select?.name ?? '-'
          const cat = testData['카테고리']?.select?.name ?? '-'
          console.log(`   ✅ 항목 [${itemName}]: ${unit} | ${cat}`)
        }
      }
    } else {
      console.log(`   ℹ️  연결된 항목 없음`)
    }
  }

  console.log('\n' + '─'.repeat(50))
  console.log('\n🎉 전체 업데이트 완료!\n')

  // 결과 요약
  console.log('📊 결과 요약:')
  for (const invoice of invoices) {
    const name = invoice.properties['이름']?.title?.[0]?.plain_text ?? '(이름 없음)'
    console.log(`   • /invoice/${invoice.id}  →  ${name}`)
  }
}

main().catch(err => {
  console.error('\n❌ 오류 발생:', err.message ?? err)
  if (err.body) console.error('   상세:', err.body)
  process.exit(1)
})

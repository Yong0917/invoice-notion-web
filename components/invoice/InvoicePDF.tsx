/**
 * 견적서 PDF 템플릿 컴포넌트
 *
 * @react-pdf/renderer를 사용하여 A4 크기 견적서 PDF를 생성합니다.
 * 서버(API Route)에서 renderToBuffer()와 함께 사용됩니다.
 */

import path from 'path'
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer'
import type { Invoice, Sender } from '@/types/invoice'

// ─── 폰트 등록 ────────────────────────────────────────────────────────
// 서버 사이드에서 실행되므로 로컬 절대 경로 사용
const fontsDir = path.join(process.cwd(), 'public', 'fonts')

Font.register({
  family: 'NanumGothic',
  fonts: [
    { src: path.join(fontsDir, 'NanumGothic-Regular.ttf'), fontWeight: 'normal' },
    { src: path.join(fontsDir, 'NanumGothic-Bold.ttf'), fontWeight: 'bold' },
  ],
})

// ─── 금액 포맷 ────────────────────────────────────────────────────────
function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원'
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ─── 스타일 정의 ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    fontFamily: 'NanumGothic',
    fontSize: 10,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 56,
    color: '#111111',
    backgroundColor: '#ffffff',
  },

  // 제목
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },

  // 발행자 / 수신자 정보 행
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 24,
  },
  infoBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    padding: 12,
  },
  infoBoxTitle: {
    fontWeight: 'bold',
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  infoLine: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    color: '#6b7280',
    width: 80,
    fontSize: 9,
  },
  infoValue: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.5,
  },
  infoValueBold: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
  },

  // 발행 정보 (날짜 등)
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metaLeft: {
    flexDirection: 'row',
    gap: 24,
  },
  metaItem: {
    flexDirection: 'row',
    gap: 6,
  },
  metaLabel: {
    color: '#6b7280',
    fontSize: 9,
  },
  metaValue: {
    fontSize: 9,
  },

  // 항목 테이블
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  colName: { flex: 4 },
  colUnit: { flex: 1 },
  colQty: { flex: 1, textAlign: 'right' },
  colPrice: { flex: 2, textAlign: 'right' },
  colAmount: { flex: 2, textAlign: 'right' },
  headerText: {
    fontWeight: 'bold',
    fontSize: 9,
    color: '#374151',
  },
  cellText: {
    fontSize: 9,
  },

  // 합계 섹션
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  summaryBox: {
    width: 220,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 9,
  },
  summaryValue: {
    fontSize: 9,
  },
  summaryLabelTotal: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  summaryValueTotal: {
    fontWeight: 'bold',
    fontSize: 10,
  },

  // 계좌 정보
  accountBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#f9fafb',
  },
  accountTitle: {
    fontWeight: 'bold',
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 6,
  },
  accountRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  accountLabel: {
    color: '#6b7280',
    width: 56,
    fontSize: 9,
  },
  accountValue: {
    fontSize: 9,
  },
})

// ─── 컴포넌트 ────────────────────────────────────────────────────────
type InvoicePDFProps = {
  invoice: Invoice
  sender: Sender
}

export function InvoicePDF({ invoice, sender }: InvoicePDFProps) {
  const supplyAmount = invoice.supply_amount ?? invoice.total_amount
  const tax = Math.round(supplyAmount * 0.1)
  const grandTotal = Math.round(supplyAmount * 1.1)
  const hasUnit = invoice.items.some((item) => item.unit)

  return (
    <Document title={`견적서 ${invoice.invoice_number}`} language="ko">
      <Page size="A4" style={styles.page}>

        {/* 제목 */}
        <Text style={styles.title}>견 적 서</Text>

        {/* 발행일 / 유효기간 (좌) / 견적번호 (우) */}
        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>발행일</Text>
              <Text style={styles.metaValue}>{formatDate(invoice.issue_date)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>유효기간</Text>
              <Text style={styles.metaValue}>{formatDate(invoice.valid_until)}</Text>
            </View>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>견적번호</Text>
            <Text style={styles.metaValue}>{invoice.invoice_number}</Text>
          </View>
        </View>

        {/* 발행자 / 수신자 정보 */}
        <View style={styles.infoRow}>
          {/* 발행자 */}
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>공급자 (발행자)</Text>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>상호</Text>
              <Text style={styles.infoValueBold}>{sender.company_name}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>대표자</Text>
              <Text style={styles.infoValue}>{sender.representative}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>사업자번호</Text>
              <Text style={styles.infoValue}>{sender.business_number}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>주소</Text>
              <Text style={styles.infoValue}>{sender.address}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>연락처</Text>
              <Text style={styles.infoValue}>{sender.phone}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>이메일</Text>
              <Text style={styles.infoValue}>{sender.email}</Text>
            </View>
          </View>

          {/* 수신자 */}
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>공급받는자 (수신자)</Text>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>상호</Text>
              <Text style={styles.infoValueBold}>
                {invoice.client_company ?? invoice.client_name}
              </Text>
            </View>
            {invoice.client_contact_name && (
              <View style={styles.infoLine}>
                <Text style={styles.infoLabel}>담당자</Text>
                <Text style={styles.infoValue}>{invoice.client_contact_name}</Text>
              </View>
            )}
            {invoice.client_phone && (
              <View style={styles.infoLine}>
                <Text style={styles.infoLabel}>연락처</Text>
                <Text style={styles.infoValue}>{invoice.client_phone}</Text>
              </View>
            )}
            {invoice.client_email && (
              <View style={styles.infoLine}>
                <Text style={styles.infoLabel}>이메일</Text>
                <Text style={styles.infoValue}>{invoice.client_email}</Text>
              </View>
            )}
            {invoice.project_name && (
              <View style={styles.infoLine}>
                <Text style={styles.infoLabel}>프로젝트명</Text>
                <Text style={styles.infoValue}>{invoice.project_name}</Text>
              </View>
            )}
            {invoice.delivery_date && (
              <View style={styles.infoLine}>
                <Text style={styles.infoLabel}>납기일</Text>
                <Text style={styles.infoValue}>{formatDate(invoice.delivery_date)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 항목 테이블 */}
        <View style={styles.table}>
          {/* 헤더 */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colName]}>항목명</Text>
            {hasUnit && <Text style={[styles.headerText, styles.colUnit]}>단위</Text>}
            <Text style={[styles.headerText, styles.colQty]}>수량</Text>
            <Text style={[styles.headerText, styles.colPrice]}>단가</Text>
            <Text style={[styles.headerText, styles.colAmount]}>금액</Text>
          </View>

          {/* 항목 행 */}
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.cellText, styles.colName]}>{item.description}</Text>
              {hasUnit && (
                <Text style={[styles.cellText, styles.colUnit]}>{item.unit ?? '-'}</Text>
              )}
              <Text style={[styles.cellText, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.cellText, styles.colPrice]}>{formatKRW(item.unit_price)}</Text>
              <Text style={[styles.cellText, styles.colAmount]}>{formatKRW(item.amount)}</Text>
            </View>
          ))}
        </View>

        {/* 합계 섹션 */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>공급가액</Text>
              <Text style={styles.summaryValue}>{formatKRW(supplyAmount)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>부가세 (10%)</Text>
              <Text style={styles.summaryValue}>{formatKRW(tax)}</Text>
            </View>
            <View style={styles.summaryRowTotal}>
              <Text style={styles.summaryLabelTotal}>합계금액</Text>
              <Text style={styles.summaryValueTotal}>{formatKRW(grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* 결제 조건 / 비고 */}
        {(invoice.payment_terms || invoice.notes) && (
          <View style={{ marginBottom: 16, padding: 12, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4 }}>
            {invoice.payment_terms && (
              <View style={{ marginBottom: invoice.notes ? 8 : 0 }}>
                <Text style={{ fontSize: 9, color: '#6b7280', marginBottom: 3 }}>결제 조건</Text>
                <Text style={{ fontSize: 9 }}>{invoice.payment_terms}</Text>
              </View>
            )}
            {invoice.notes && (
              <View>
                <Text style={{ fontSize: 9, color: '#6b7280', marginBottom: 3 }}>비고</Text>
                <Text style={{ fontSize: 9 }}>{invoice.notes}</Text>
              </View>
            )}
          </View>
        )}

        {/* 계좌 정보 */}
        {(sender.bank_name || sender.account_number) && (
          <View style={styles.accountBox}>
            <Text style={styles.accountTitle}>입금 계좌 정보</Text>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>은행명</Text>
              <Text style={styles.accountValue}>{sender.bank_name}</Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>계좌번호</Text>
              <Text style={styles.accountValue}>{sender.account_number}</Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>예금주</Text>
              <Text style={styles.accountValue}>{sender.account_holder}</Text>
            </View>
          </View>
        )}

      </Page>
    </Document>
  )
}

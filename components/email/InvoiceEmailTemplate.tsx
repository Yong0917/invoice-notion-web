/**
 * 견적서 발송 이메일 템플릿
 *
 * Resend의 @react-email/render로 HTML 변환하여 사용합니다.
 * 이메일 클라이언트 호환을 위해 인라인 스타일만 사용합니다.
 */

import type { Invoice } from '@/types/invoice'

interface InvoiceEmailTemplateProps {
  invoice: Invoice
  senderCompany: string
  appUrl: string
}

export function InvoiceEmailTemplate({
  invoice,
  senderCompany,
  appUrl,
}: InvoiceEmailTemplateProps) {
  const invoiceUrl = `${appUrl}/invoice/${invoice.id}`

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f5f5f5', fontFamily: 'Apple SD Gothic Neo, Malgun Gothic, sans-serif' }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#f5f5f5', padding: '40px 16px' }}>
          <tbody>
            <tr>
              <td align="center">
                <table width="600" cellPadding={0} cellSpacing={0} style={{ maxWidth: '600px', width: '100%', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden' }}>
                  <tbody>
                    {/* 헤더 */}
                    <tr>
                      <td style={{ backgroundColor: '#111827', padding: '32px 40px' }}>
                        <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          {senderCompany}
                        </p>
                        <h1 style={{ margin: '8px 0 0', color: '#ffffff', fontSize: '24px', fontWeight: 700 }}>
                          견적서가 도착했습니다
                        </h1>
                      </td>
                    </tr>

                    {/* 본문 */}
                    <tr>
                      <td style={{ padding: '40px' }}>
                        <p style={{ margin: '0 0 24px', color: '#374151', fontSize: '15px', lineHeight: '1.6' }}>
                          안녕하세요, <strong>{invoice.client_name}</strong>님.<br />
                          {senderCompany}에서 견적서를 보내드립니다.
                        </p>

                        {/* 견적서 정보 테이블 */}
                        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#f9fafb', borderRadius: '6px', marginBottom: '32px' }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
                                <table width="100%" cellPadding={0} cellSpacing={0}>
                                  <tbody>
                                    <tr>
                                      <td style={{ color: '#6b7280', fontSize: '13px', width: '40%' }}>견적번호</td>
                                      <td style={{ color: '#111827', fontSize: '13px', fontWeight: 600 }}>{invoice.invoice_number}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            {invoice.project_name && (
                              <tr>
                                <td style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
                                  <table width="100%" cellPadding={0} cellSpacing={0}>
                                    <tbody>
                                      <tr>
                                        <td style={{ color: '#6b7280', fontSize: '13px', width: '40%' }}>프로젝트명</td>
                                        <td style={{ color: '#111827', fontSize: '13px' }}>{invoice.project_name}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
                                <table width="100%" cellPadding={0} cellSpacing={0}>
                                  <tbody>
                                    <tr>
                                      <td style={{ color: '#6b7280', fontSize: '13px', width: '40%' }}>합계금액</td>
                                      <td style={{ color: '#111827', fontSize: '15px', fontWeight: 700 }}>
                                        {invoice.total_amount.toLocaleString('ko-KR')}원
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: '20px 24px' }}>
                                <table width="100%" cellPadding={0} cellSpacing={0}>
                                  <tbody>
                                    <tr>
                                      <td style={{ color: '#6b7280', fontSize: '13px', width: '40%' }}>유효기간</td>
                                      <td style={{ color: '#111827', fontSize: '13px' }}>{invoice.valid_until}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* CTA 버튼 */}
                        <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '32px' }}>
                          <tbody>
                            <tr>
                              <td align="center">
                                <a
                                  href={invoiceUrl}
                                  style={{
                                    display: 'inline-block',
                                    backgroundColor: '#111827',
                                    color: '#ffffff',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    padding: '14px 32px',
                                    borderRadius: '6px',
                                  }}
                                >
                                  견적서 확인하기
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px', lineHeight: '1.6' }}>
                          위 버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요.<br />
                          <a href={invoiceUrl} style={{ color: '#6b7280', wordBreak: 'break-all' }}>{invoiceUrl}</a>
                        </p>
                      </td>
                    </tr>

                    {/* 푸터 */}
                    <tr>
                      <td style={{ backgroundColor: '#f9fafb', padding: '24px 40px', borderTop: '1px solid #e5e7eb' }}>
                        <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px', textAlign: 'center' }}>
                          본 이메일은 {senderCompany}에서 발송된 자동 이메일입니다.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}

/**
 * 견적서 유효기간 만료 알림 이메일 템플릿
 *
 * Resend의 @react-email/render로 HTML 변환하여 사용합니다.
 * 이메일 클라이언트 호환을 위해 인라인 스타일만 사용합니다.
 */

import type { Invoice } from '@/types/invoice'

interface ExpiryReminderEmailTemplateProps {
  invoice: Invoice
  daysLeft: 3 | 1
  appUrl: string
}

export function ExpiryReminderEmailTemplate({
  invoice,
  daysLeft,
  appUrl,
}: ExpiryReminderEmailTemplateProps) {
  const invoiceUrl = `${appUrl}/invoice/${invoice.id}`
  const isUrgent = daysLeft === 1
  const accentColor = isUrgent ? '#dc2626' : '#d97706'
  const badgeText = isUrgent ? 'D-1 긴급' : 'D-3 안내'

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
                      <td style={{ backgroundColor: accentColor, padding: '32px 40px' }}>
                        <p style={{ margin: '0 0 8px', color: 'rgba(255,255,255,0.8)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          {badgeText}
                        </p>
                        <h1 style={{ margin: 0, color: '#ffffff', fontSize: '22px', fontWeight: 700 }}>
                          견적서 유효기간이 {daysLeft}일 남았습니다
                        </h1>
                      </td>
                    </tr>

                    {/* 본문 */}
                    <tr>
                      <td style={{ padding: '40px' }}>
                        <p style={{ margin: '0 0 24px', color: '#374151', fontSize: '15px', lineHeight: '1.6' }}>
                          안녕하세요, <strong>{invoice.client_name}</strong>님.<br />
                          아래 견적서의 유효기간이 <strong style={{ color: accentColor }}>{daysLeft}일 후</strong> 만료됩니다.<br />
                          아직 검토 중이시라면 기간 내에 확인해 주시기 바랍니다.
                        </p>

                        {/* 견적서 정보 테이블 */}
                        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#f9fafb', borderRadius: '6px', marginBottom: '32px', border: `2px solid ${accentColor}` }}>
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
                                      <td style={{ color: '#6b7280', fontSize: '13px', width: '40%' }}>만료일</td>
                                      <td style={{ color: accentColor, fontSize: '13px', fontWeight: 700 }}>{invoice.valid_until}</td>
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
                                    backgroundColor: accentColor,
                                    color: '#ffffff',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    padding: '14px 32px',
                                    borderRadius: '6px',
                                  }}
                                >
                                  견적서 지금 확인하기
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
                          본 이메일은 견적서 유효기간 만료 알림을 위해 자동 발송되었습니다.
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

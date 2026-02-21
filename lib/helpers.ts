// ─── 문자열 유틸리티 ──────────────────────────────────────────────────
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...`
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// ─── 날짜 유틸리티 ────────────────────────────────────────────────────
export function formatDate(date: Date | string, locale = 'ko-KR'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ─── 숫자 유틸리티 ────────────────────────────────────────────────────
export function formatNumber(num: number, locale = 'ko-KR'): string {
  return new Intl.NumberFormat(locale).format(num)
}

export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount)
}

// ─── URL 유틸리티 ─────────────────────────────────────────────────────
export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//.test(url)
}

// ─── 배열 유틸리티 ────────────────────────────────────────────────────
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const group = String(item[key])
      acc[group] = [...(acc[group] ?? []), item]
      return acc
    },
    {} as Record<string, T[]>,
  )
}

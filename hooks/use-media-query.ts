'use client'

import { useState, useEffect } from 'react'

/**
 * 미디어 쿼리 상태를 추적하는 훅
 * @param query - CSS 미디어 쿼리 문자열 (예: '(max-width: 768px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    // window.matchMedia API(외부 시스템)와 동기화하는 의도적 패턴
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

// 편의 훅: 자주 쓰이는 breakpoint 프리셋
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
export const useIsTablet = () => useMediaQuery('(max-width: 1023px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')

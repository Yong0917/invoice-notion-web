'use client'

import { useState, useEffect } from 'react'

/**
 * 컴포넌트가 마운트되었는지 추적하는 훅
 * 다크모드 토글 등 hydration 불일치 방지에 사용
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // 외부 시스템(DOM)의 마운트 상태와 동기화하는 의도적 패턴
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  return mounted
}

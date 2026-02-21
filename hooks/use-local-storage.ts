'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * localStorage를 React state처럼 사용하는 훅
 * SSR 환경에서 안전하게 동작
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // 클라이언트에서만 localStorage 읽기
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        // localStorage(외부 시스템)와 초기 상태 동기화하는 의도적 패턴
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStoredValue(JSON.parse(item) as T)
      }
    } catch (error) {
      console.warn(`useLocalStorage: "${key}" 읽기 실패`, error)
    }
  }, [key])

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.warn(`useLocalStorage: "${key}" 쓰기 실패`, error)
      }
    },
    [key, storedValue],
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`useLocalStorage: "${key}" 삭제 실패`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

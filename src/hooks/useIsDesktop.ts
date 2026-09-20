import { useEffect, useState } from 'react'
import { DESKTOP_BREAKPOINT } from '../config/app'

/**
 * PC 쇼케이스를 보여줄지 판단한다.
 * User-Agent가 아니라 화면 너비를 기준으로 한다. (PROJECT_SPEC.md §3)
 *
 * 이 값이 바뀌어도 컴포넌트 트리는 그대로 두고 표현만 바꾼다.
 * 화면 크기 변경으로 현재 페이지나 입력값이 초기화되면 안 된다.
 */
function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`).matches
  })

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`)
    const handleChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches)

    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return isDesktop
}

export default useIsDesktop

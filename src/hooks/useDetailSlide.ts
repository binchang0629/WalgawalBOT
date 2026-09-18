import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { NavigateOptions } from 'react-router-dom'

/**
 * MY 하위 상세 화면의 좌우 슬라이드 전환.
 *
 * 들어올 때는 오른쪽에서 왼쪽으로 덮고, 돌아갈 때는 왼쪽에서 오른쪽으로 빠진다.
 * 모바일 앱의 화면 계층 감각을 그대로 옮긴 것이라 두 방향이 짝을 이뤄야 한다.
 * 들어오는 모션은 이미 `my-detail-slide-enter`로 있었고, 나가는 쪽을 여기서 맞춘다.
 *
 * 나가는 모션은 화면을 바꾸기 전에 재생해야 해서, 이동을 애니메이션 길이만큼 미룬다.
 * 움직임을 줄이는 설정이면 기다리지 않고 바로 이동한다.
 *
 * 되돌아오는 길에는 들어오는 모션을 켜지 않는다.
 * 앞 화면이 오른쪽으로 빠지는 것만으로 이미 한 번 움직였는데, 도착한 화면이 또 오른쪽에서
 * 들어오면 같은 방향으로 두 번 이동한 것처럼 보인다. 게다가 도착 화면은 애니메이션이
 * 시작되기 전 한두 프레임 동안 제자리에 먼저 그려져서, 떴다가 다시 움직이는 것으로 읽힌다.
 * 그래서 `leave`가 넘기는 `skipEnterMotion` 표시를 받으면 들어오는 모션을 건너뛴다.
 *
 * 스타일은 `pages/My/MyPageTransitions.css`에 있다. 쓰는 화면에서 함께 import한다.
 */

/** 나가는 애니메이션 길이. MyPageTransitions.css의 `my-detail-slide-out`과 같은 값이다. */
const EXIT_DURATION = 260

interface DetailSlide {
  /** 화면 루트에 붙이는 클래스. 들어올 때와 나갈 때가 다르다. */
  className: string
  /** 돌아가기 버튼에 연결한다. 나가는 모션을 재생한 뒤 이동한다. */
  leave: (to: string, options?: NavigateOptions) => void
}

function useDetailSlide(enabled = true): DetailSlide {
  const navigate = useNavigate()
  const location = useLocation()
  // 뒤로 가기로 도착한 화면인지. `leave`가 이동할 때 붙여 준다.
  const isReturning = (location.state as { skipEnterMotion?: boolean } | null)?.skipEnterMotion === true
  const [isLeaving, setIsLeaving] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
  }, [])

  const leave = useCallback((to: string, options?: NavigateOptions) => {
    /*
     * 도착한 화면이 들어오는 모션을 다시 재생하지 않도록 표시를 같이 넘긴다.
     * 넘기는 쪽에서 붙여야 한다 — 도착 화면은 자기가 앞으로 온 것인지 되돌아온 것인지 모른다.
     */
    const next: NavigateOptions = {
      ...options,
      state: { ...(options?.state as Record<string, unknown> | undefined), skipEnterMotion: true },
    }
    const skipMotion = !enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (skipMotion) {
      navigate(to, next)
      return
    }
    // 연타로 타이머가 겹치면 이동이 두 번 일어난다.
    if (timerRef.current !== null) return

    setIsLeaving(true)
    timerRef.current = window.setTimeout(() => navigate(to, next), EXIT_DURATION)
  }, [enabled, navigate])

  return {
    className: enabled
      ? (isLeaving ? 'my-detail-slide-exit' : isReturning ? '' : 'my-detail-slide-enter')
      : '',
    leave,
  }
}

export default useDetailSlide

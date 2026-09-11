import { useEffect, useRef, useState } from 'react'

export interface Countdown {
  hours: number
  minutes: number
  seconds: number
  /** 마감이 지났는지. 지나면 세 값 모두 0이다. */
  isOver: boolean
}

/**
 * 남은 시간을 세는 타이머.
 *
 * 서버가 없어서 사건별 마감 일시를 받아올 수 없다. 그래서 화면을 처음 그린 시점부터
 * `hours`만큼을 마감으로 잡고 거꾸로 센다. 새로고침하면 다시 시작한다.
 * 실제 API가 붙으면 `deadlineRef`에 서버가 준 마감 일시를 넣기만 하면 된다.
 */
function useCountdown(hours: number): Countdown {
  // 마감 시각은 첫 렌더에 한 번만 정한다. 다시 그려도 흔들리지 않는다.
  const deadlineRef = useRef(Date.now() + hours * 60 * 60 * 1000)
  const [remaining, setRemaining] = useState(() => Math.max(0, deadlineRef.current - Date.now()))

  useEffect(() => {
    // 정확히 1초마다 재면 초가 가끔 건너뛴다. 더 자주 확인하고 값이 같으면 그냥 둔다.
    const id = window.setInterval(() => {
      setRemaining((prev) => {
        const next = Math.max(0, deadlineRef.current - Date.now())
        return Math.floor(next / 1000) === Math.floor(prev / 1000) ? prev : next
      })
    }, 200)
    return () => window.clearInterval(id)
  }, [])

  const totalSeconds = Math.floor(remaining / 1000)
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isOver: remaining <= 0,
  }
}

export default useCountdown

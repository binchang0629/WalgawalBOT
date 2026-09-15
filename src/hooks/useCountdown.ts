import { useEffect, useState } from 'react'

const demoDeadlines = new Map<string, number>()

export interface Countdown {
  hours: number
  minutes: number
  seconds: number
  /** 마감이 지났는지. 지나면 세 값 모두 0이다. */
  isOver: boolean
}

/**
 * 남은 시간 문자열(`hh:mm:ss` 또는 `mm:ss`)을 밀리초로 바꾼다.
 * 숫자를 주면 시간 단위로 본다. (예전 호출부 호환)
 */
function toMilliseconds(duration: number | string): number {
  if (typeof duration === 'number') return duration * 60 * 60 * 1000

  const seconds = duration
    .split(':')
    .reduce((total, part) => total * 60 + Number(part), 0)

  return Number.isFinite(seconds) ? seconds * 1000 : 0
}

function getDemoDeadline(key: string, duration: number | string): number {
  const cached = demoDeadlines.get(key)
  if (cached) return cached

  const storageKey = `walgawalbot:deadline:${key}`
  let deadline = 0
  try {
    const stored = Number(window.sessionStorage.getItem(storageKey))
    if (Number.isFinite(stored) && stored > Date.now()) deadline = stored
  } catch {
    // 저장소 접근이 막힌 환경은 현재 앱 실행 중인 메모리 공유만 사용한다.
  }

  if (!deadline) {
    deadline = Date.now() + Math.max(0, toMilliseconds(duration))
    try {
      window.sessionStorage.setItem(storageKey, String(deadline))
    } catch {
      // 메모리에 기록한 deadline은 계속 사용할 수 있다.
    }
  }

  demoDeadlines.set(key, deadline)
  return deadline
}

/**
 * 남은 시간을 세는 타이머.
 *
 * 서버가 없어서 사건별 마감 일시를 받아올 수 없다. 그래서 화면을 처음 그린 시점부터
 * 주어진 만큼을 마감으로 잡고 거꾸로 센다. 새로고침하면 다시 시작한다.
 *
 * `duration`은 `'01:32:47'` 같은 문자열이 기본이다.
 * 숫자를 넘기면 시간 단위로 해석한다.
 */
function useCountdown(duration: number | string, eventKey = String(duration)): Countdown {
  const [deadline] = useState(() => getDemoDeadline(eventKey, duration))
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline - Date.now()))

  useEffect(() => {
    const updateRemaining = () => {
      setRemaining((previous) => {
        const next = Math.max(0, deadline - Date.now())
        return Math.ceil(next / 1000) === Math.ceil(previous / 1000) ? previous : next
      })
    }

    updateRemaining()
    const id = window.setInterval(updateRemaining, 200)
    return () => window.clearInterval(id)
  }, [deadline])

  const totalSeconds = Math.ceil(remaining / 1000)
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isOver: remaining <= 0,
  }
}

export default useCountdown

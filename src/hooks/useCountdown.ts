import { useEffect, useState } from 'react'
import { demoEventAt, JURY_VOTE_DURATION_MINUTES } from '../data/common/demoClock'
import { demoTimeline } from '../data/common/demoTimeline'
import { plazaCaseAgeMinutes } from '../data/common/plazaContent'

const demoDeadlines = new Map<string, number>()

/** 로그아웃 시 브라우저 저장값과 함께 실행 중인 데모 마감 시간도 비운다. */
export function clearDemoDeadlines() {
  demoDeadlines.clear()
}

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

  const caseAgeMinutes = key === 'case-wedding-gift'
    ? demoTimeline.weddingGift.ageMinutes
    : plazaCaseAgeMinutes[key]
  if (caseAgeMinutes !== undefined) {
    const deadline = demoEventAt(caseAgeMinutes) + JURY_VOTE_DURATION_MINUTES * 60_000
    demoDeadlines.set(key, deadline)
    return deadline
  }

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
 * 시연 사건은 첫 방문 기준 게시 시각부터 24시간을 투표 기간으로 쓴다.
 * 새로고침하거나 다른 페이지에서 다시 열어도 마감 시각은 같다.
 * 사건 정보가 없는 일반 호출은 전달받은 기간을 사용한다.
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

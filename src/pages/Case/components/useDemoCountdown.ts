import { useEffect, useState } from 'react'

/** 화면별 Figma 예시 시간으로 시작하는 표시용 타이머. 실제 투표 마감 API는 미연결. */
export default function useDemoCountdown(initialTime: string) {
  const [remaining, setRemaining] = useState(() =>
    initialTime.split(':').reduce((seconds, part) => seconds * 60 + Number(part), 0),
  )

  useEffect(() => {
    const seconds = initialTime.split(':').reduce((total, part) => total * 60 + Number(part), 0)
    const deadline = Date.now() + seconds * 1000
    const timer = window.setInterval(() => {
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setRemaining(next)
      if (next === 0) window.clearInterval(timer)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [initialTime])

  const parts = [Math.floor(remaining / 60) % 60, remaining % 60]
  if (initialTime.split(':').length === 3) parts.unshift(Math.floor(remaining / 3600))
  return parts.map((part) => String(part).padStart(2, '0')).join(':')
}

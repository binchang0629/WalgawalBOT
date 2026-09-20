import { useEffect, useState } from 'react'
import { formatDemoElapsed, formatElapsedMinutes } from '../../data/common/demoClock'

function parseDemoElapsed(label: string): number | null {
  if (label === '어제') return 1440
  const match = /^(\d+)(분|시간|일) 전$/.exec(label)
  if (!match) return null
  const count = Number(match[1])
  return count * ({ 분: 1, 시간: 60, 일: 1440 }[match[2]] ?? 1)
}

/** 시연 데이터의 첫 방문 당시 나이를 실제 경과 시간만큼 늘려 표시한다. */
export default function DemoRelativeTime({ minutesAgo, label, timestamp }: { minutesAgo?: number; label?: string; timestamp?: number }) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])
  const initialMinutes = minutesAgo ?? (label ? parseDemoElapsed(label) : null)
  if (timestamp !== undefined) return <>{formatElapsedMinutes(Math.max(0, Math.floor((now - timestamp) / 60_000)))}</>
  return <>{initialMinutes === null || initialMinutes === undefined ? label : formatDemoElapsed(initialMinutes, now)}</>
}

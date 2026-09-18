/**
 * 시연 콘텐츠의 시작점. 첫 방문 시각을 브라우저별로 기억해 기존 사건의
 * 상대적인 게시 순서와 댓글 간격을 같은 시간축에 놓는다.
 */
export const DEMO_FIRST_VISIT_KEY = 'walgawalbot:demo:first-visit:v1'
const MINUTE = 60_000
export const JURY_VOTE_DURATION_MINUTES = 24 * 60
export const JURY_VOTE_DURATION = '24:00:00'
let firstVisit: number | undefined

export function getDemoFirstVisit(): number {
  if (firstVisit !== undefined) return firstVisit

  const now = Date.now()
  try {
    const stored = Number(window.localStorage.getItem(DEMO_FIRST_VISIT_KEY))
    firstVisit = Number.isFinite(stored) && stored > 0 && stored <= now ? stored : now
    if (firstVisit === now) window.localStorage.setItem(DEMO_FIRST_VISIT_KEY, String(now))
  } catch {
    firstVisit = now
  }
  return firstVisit
}

export function demoEventAt(minutesBeforeFirstVisit: number): number {
  return getDemoFirstVisit() - minutesBeforeFirstVisit * MINUTE
}

export function demoMinutesAgo(minutesBeforeFirstVisit: number, now = Date.now()): number {
  return Math.max(0, Math.floor((now - demoEventAt(minutesBeforeFirstVisit)) / MINUTE))
}

export function formatElapsedMinutes(minutes: number): string {
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`
  return `${Math.floor(minutes / 1440)}일 전`
}

export function formatDemoElapsed(minutesBeforeFirstVisit: number, now = Date.now()): string {
  return formatElapsedMinutes(demoMinutesAgo(minutesBeforeFirstVisit, now))
}

/** 사건 상세가 쓰는 `26/09/18 · 06:40` 형식. 한국 서비스의 시각으로 통일한다. */
export function formatDemoDateTime(timestamp: number, withSeconds = false): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul', year: '2-digit', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', ...(withSeconds ? { second: '2-digit' } : {}),
    hourCycle: 'h23',
  }).formatToParts(timestamp)
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '00'
  return `${value('year')}/${value('month')}/${value('day')} · ${value('hour')}:${value('minute')}${withSeconds ? `:${value('second')}` : ''}`
}

export function formatDemoReceivedDate(timestamp = getDemoFirstVisit()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(timestamp)
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '00'
  return `${value('year')}.${value('month')}.${value('day')}`
}

/**
 * 첫 접속일(한국 시각) 기준으로 `months`개월 앞뒤 날짜를 `2026.09.25` 형식으로 낸다.
 * 구독 결제일·결제 내역처럼 매달 같은 날짜가 반복되는 표기에 쓴다.
 * 옮겨 간 달에 그 날짜가 없으면(예: 31일 → 30일까지인 달) 그 달의 마지막 날로 맞춘다.
 */
export function formatDemoMonthOffset(months: number, timestamp = getDemoFirstVisit()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: 'numeric', day: 'numeric',
  }).formatToParts(timestamp)
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 1)
  const monthIndex = value('year') * 12 + (value('month') - 1) + months
  const year = Math.floor(monthIndex / 12)
  const month = monthIndex - year * 12 + 1
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const day = Math.min(value('day'), lastDay)
  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`
}

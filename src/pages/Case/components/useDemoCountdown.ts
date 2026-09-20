import useCountdown from '../../../hooks/useCountdown'

/** 홈과 같은 사건 ID의 공통 마감 시각을 문자열로 표시한다. */
export default function useDemoCountdown(initialTime: string, eventKey: string) {
  const { hours, minutes, seconds } = useCountdown(initialTime, eventKey)
  const parts = [minutes, seconds]
  if (initialTime.split(':').length === 3) parts.unshift(hours)
  return parts.map((part) => String(part).padStart(2, '0')).join(':')
}

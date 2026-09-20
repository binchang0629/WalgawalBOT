import { useEffect, useId, useRef, useState } from 'react'

type SummaryItem = { readonly title: string; readonly body: string }

/** 오늘의 사건과 지난 사건이 같은 스크롤 진입 모션을 공유한다. */
function AiSummary({ items }: { items: readonly SummaryItem[] }) {
  const titleId = useId()
  const summaryRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(
    () => typeof window === 'undefined' || !('IntersectionObserver' in window),
  )

  useEffect(() => {
    const summary = summaryRef.current
    if (!summary || !('IntersectionObserver' in window)) return

    const appViewport = summary.closest('.app-viewport')
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsVisible(true)
      observer.disconnect()
    }, {
      root: appViewport,
      /*
       * 박스가 기기 내부 화면의 가운데 30% 영역에 들어오면 재생한다.
       * 이전에는 16%로 좁아서 정확히 가운데까지 스크롤해야 시작해, 재생 자체가 늦게 느껴졌다.
       */
      rootMargin: '-35% 0px -35% 0px',
      threshold: 0.01,
    })

    observer.observe(summary)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={summaryRef}
      className={`ai-summary ai-summary--reveal${isVisible ? ' is-visible' : ''}`}
      aria-labelledby={titleId}
    >
      <h2 id={titleId}>AI 핵심요약</h2>
      <ol>
        {items.map((item, index) => (
          <li key={item.title}>
            <span>{index + 1}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default AiSummary

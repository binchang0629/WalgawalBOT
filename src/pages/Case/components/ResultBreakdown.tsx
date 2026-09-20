import { useEffect, useId, useRef, useState } from 'react'
import chevronIcon from '../../../assets/case/disagreement/vote-chevron.svg'
import type { WeddingGiftVoteId } from '../../../data/common/caseDetailContent'

export interface ResultBreakdownItem {
  id: WeddingGiftVoteId
  label: string
  percent: number
}

/** 지난 사건 결과 화면과 광장의 해결 사건이 공유하는 2심 투표 결과 카드. */
export default function ResultBreakdown({ breakdown, headingId = 'vote-result-title' }: {
  breakdown: readonly ResultBreakdownItem[]
  headingId?: string
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [animationProgress, setAnimationProgress] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0
  ))
  const breakdownListRef = useRef<HTMLUListElement>(null)
  const hasAnimatedRef = useRef(false)
  const panelId = useId()

  useEffect(() => {
    const breakdownList = breakdownListRef.current
    if (!breakdownList || hasAnimatedRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hasAnimatedRef.current = true
      return
    }

    const scrollRoot = breakdownList.closest<HTMLElement>('.main-layout__scroll')
    if (!scrollRoot) return

    let animationFrameId: number | null = null
    let hasScrollIntent = false

    const startAnimation = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true

      const duration = 1100
      let startedAt: number | null = null

      const animate = (timestamp: number) => {
        startedAt ??= timestamp
        const elapsed = Math.min((timestamp - startedAt) / duration, 1)
        const easedProgress = 1 - Math.pow(1 - elapsed, 3)
        setAnimationProgress(easedProgress)
        if (elapsed < 1) animationFrameId = window.requestAnimationFrame(animate)
      }
      animationFrameId = window.requestAnimationFrame(animate)
    }

    const markScrollIntent = () => { hasScrollIntent = true }
    const handleScroll = () => {
      if (!hasScrollIntent || hasAnimatedRef.current) return
      const rootRect = scrollRoot.getBoundingClientRect()
      const listRect = breakdownList.getBoundingClientRect()
      const triggerLine = rootRect.top + rootRect.height * 0.78
      if (listRect.top <= triggerLine && listRect.bottom > rootRect.top) startAnimation()
    }

    scrollRoot.addEventListener('wheel', markScrollIntent, { passive: true })
    scrollRoot.addEventListener('touchstart', markScrollIntent, { passive: true })
    scrollRoot.addEventListener('pointerdown', markScrollIntent, { passive: true })
    scrollRoot.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', markScrollIntent)

    return () => {
      scrollRoot.removeEventListener('wheel', markScrollIntent)
      scrollRoot.removeEventListener('touchstart', markScrollIntent)
      scrollRoot.removeEventListener('pointerdown', markScrollIntent)
      scrollRoot.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', markScrollIntent)
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="result-breakdown">
      <h2 id={headingId} className="result-breakdown__heading">
        <button
          type="button"
          className="result-breakdown__toggle"
          onClick={() => setIsExpanded((value) => !value)}
          aria-expanded={isExpanded}
          aria-controls={panelId}
        >
          <span>2심 배심원 투표 결과</span>
          <img className={isExpanded ? 'is-open' : ''} src={chevronIcon} alt="" />
        </button>
      </h2>
      <div
        id={panelId}
        className={'result-breakdown__panel' + (isExpanded ? ' is-open' : '')}
        aria-hidden={!isExpanded}
        inert={!isExpanded}
      >
        <div className="result-breakdown__clip">
          <ul ref={breakdownListRef} className="result-breakdown__list">
            {breakdown.map((item, index) => (
              <li key={item.id} className={index === 0 ? 'is-leading' : undefined}>
                <div><span>{item.label}</span><strong>{Math.round(item.percent * animationProgress)}%</strong></div>
                <span className={'result-breakdown__track' + (index === 0 ? ' result-breakdown__track--leader' : '')}>
                  <i style={{ width: `${item.percent * animationProgress}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

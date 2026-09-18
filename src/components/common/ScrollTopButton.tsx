import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FLOATING_SCROLL_SELECTOR, hasBottomNavigation } from './floatingButtonLayout'
import './ScrollTopButton.css'

/**
 * 맨 위로 올리는 버튼.
 *
 * 하단 내비게이션이 있는 화면의 스크롤 영역(`.main-layout__scroll`)을 따라간다.
 * 후일담 상세·MY 하위 화면처럼 자체 스크롤 영역이 있는 화면은 그 영역을 따라간다.
 * 하단 내비게이션이 없는 화면에서는 내비 대신 화면 아래를 기준으로 자리를 잡는다.
 * 한참 내려간 뒤에만 나타나고, 그 전에는 화면을 가리지 않게 숨어 있다.
 *
 * 자리는 챗봇 버튼(내비 바로 위 오른쪽) 위다.
 * 챗봇 버튼은 이 버튼 아래, 예전 맨 위로 버튼 자리로 내려간다.
 * 둘 다 오른쪽 아래에 세로로 쌓인다.
 */

/** 이만큼 내려가면 버튼이 나타난다. 한 화면 남짓 내려간 높이다. */
const SHOW_AFTER = 240

/*
 * 버튼이 따라가는 스크롤 영역은 floatingButtonLayout.ts에 모아 둔다.
 * 후일담 상세·MY 하위 화면은 헤더를 고정하고 본문만 스크롤해서,
 * 공통 영역만 보면 버튼이 끝내 나타나지 않았다.
 */
const SCROLL_SELECTOR = FLOATING_SCROLL_SELECTOR

function ScrollTopButton() {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)
  const scrollRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const viewport = document.getElementById('app-viewport')
    if (!viewport) return

    /*
     * 경로가 바뀐 순간에는 새 화면의 스크롤 영역이 아직 없을 수 있다.
     * 그래서 영역을 미리 찍어 두지 않고, 실제로 스크롤된 영역을 따라간다.
     * scroll 이벤트는 버블링되지 않으므로 캡처 단계에서 받는다.
     */
    const handleScroll = (event: Event) => {
      const target = event.target
      if (!(target instanceof HTMLElement) || !target.matches(SCROLL_SELECTOR)) return
      scrollRef.current = target
      setIsVisible(target.scrollTop > SHOW_AFTER)
    }

    /*
     * 뒤로 가기로 복원된 위치처럼 스크롤 없이 이미 내려가 있는 경우도 있다.
     * 한 프레임 뒤 화면에 있는 영역 중 가장 안쪽(문서 순서상 마지막)의 위치로 맞춘다.
     */
    const frame = window.requestAnimationFrame(() => {
      const areas = viewport.querySelectorAll<HTMLElement>(SCROLL_SELECTOR)
      const area = areas.length > 0 ? areas[areas.length - 1] : null
      scrollRef.current = area
      setIsVisible((area?.scrollTop ?? 0) > SHOW_AFTER)
    })
    viewport.addEventListener('scroll', handleScroll, { capture: true, passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      viewport.removeEventListener('scroll', handleScroll, { capture: true })
    }
  }, [location.pathname])

  const handleClick = () => {
    const scroll = scrollRef.current
    if (!scroll) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scroll.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={`scroll-top-button${hasBottomNavigation(location.pathname) ? '' : ' scroll-top-button--no-nav'}${isVisible ? ' is-visible' : ''}`}
      onClick={handleClick}
      aria-label="맨 위로"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M10 16V5M10 5 4.8 10.2M10 5l5.2 5.2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default ScrollTopButton

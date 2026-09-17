import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './ScrollTopButton.css'

/**
 * 맨 위로 올리는 버튼.
 *
 * 하단 내비게이션이 있는 화면의 스크롤 영역(`.main-layout__scroll`)을 따라간다.
 * 한참 내려간 뒤에만 나타나고, 그 전에는 화면을 가리지 않게 숨어 있다.
 *
 * 자리는 예전 챗봇 버튼 자리(내비 바로 위 오른쪽)이고,
 * 챗봇 버튼은 이 버튼 위로 올라간다. 둘 다 오른쪽 아래에 세로로 쌓인다.
 */

/** 이만큼 내려가면 버튼이 나타난다. 한 화면 남짓 내려간 높이다. */
const SHOW_AFTER = 240

function ScrollTopButton() {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)
  const scrollRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // 화면마다 스크롤 컨테이너가 새로 그려지므로 경로가 바뀔 때마다 다시 찾는다.
    const scroll = document.querySelector<HTMLElement>('.app-viewport .main-layout__scroll')
    scrollRef.current = scroll

    const update = () => setIsVisible((scroll?.scrollTop ?? 0) > SHOW_AFTER)
    const frame = window.requestAnimationFrame(update)
    scroll?.addEventListener('scroll', update, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      scroll?.removeEventListener('scroll', update)
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
      className={`scroll-top-button${isVisible ? ' is-visible' : ''}`}
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

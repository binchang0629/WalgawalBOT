import { useEffect, useLayoutEffect, useRef } from 'react'
import type { MouseEvent, PointerEvent, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import FloatingChatButton from '../common/FloatingChatButton'
import ScrollTopButton from '../common/ScrollTopButton'
import ClickSpark from '../common/ClickSpark'
import { PATHS } from '../../routes/paths'
import './AppViewport.css'

interface AppViewportProps {
  children: ReactNode
}

/**
 * 앱의 화면 경계.
 *
 * PC에서는 기기 목업 안쪽, 모바일에서는 실제 화면 전체가 이 영역이다.
 * 모달·바텀시트·토스트는 브라우저 전체가 아니라 이 안에서 표시한다. (PROJECT_SPEC.md §2, §7-4)
 * 스크롤은 이 안의 콘텐츠 컨테이너가 담당한다. window를 스크롤하지 않는다.
 */
function AppViewport({ children }: AppViewportProps) {
  const location = useLocation()
  const routeContentRef = useRef<HTMLDivElement>(null)
  const previousPathRef = useRef(location.pathname)
  const backIntentRef = useRef<{ from: string; at: number } | null>(null)
  const pendingActionsRef = useRef(new WeakSet<HTMLElement>())
  const replayingActionsRef = useRef(new WeakSet<HTMLElement>())
  const timersRef = useRef(new Set<number>())

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
    }
  }, [])

  useLayoutEffect(() => {
    const previousPath = previousPathRef.current
    previousPathRef.current = location.pathname
    const intent = backIntentRef.current
    backIntentRef.current = null
    const routeContent = routeContentRef.current
    if (!routeContent) return

    routeContent.classList.remove('app-route-content--back-enter')
    if (!intent || intent.from !== previousPath || previousPath === location.pathname
      || location.pathname === PATHS.home || performance.now() - intent.at > 600
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // 뒤로 가기는 방향만 느껴지도록 작게 이동한다. 전체 화면을 왕복시키면 어지럽다.
    routeContent.classList.add('app-route-content--back-enter')
    const animation = routeContent.animate(
      [
        { transform: 'translate3d(-14px, 0, 0)', opacity: 0.92 },
        { transform: 'translate3d(0, 0, 0)', opacity: 1 },
      ],
      { duration: 180, easing: 'ease-out' },
    )
    void animation.finished.then(() => routeContent.classList.remove('app-route-content--back-enter')).catch(() => {})
    return () => {
      animation.cancel()
      routeContent.classList.remove('app-route-content--back-enter')
    }
  }, [location.pathname])

  const getOrangePrimaryAction = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return null

    const action = target.closest<HTMLElement>('button, a')
    if (!action) return null
    if (action instanceof HTMLButtonElement && action.disabled) return null
    if (action.getAttribute('aria-disabled') === 'true') return null

    const bounds = action.getBoundingClientRect()
    const background = window.getComputedStyle(action).backgroundColor
    const isPrimaryOrange = background === 'rgb(255, 149, 36)'

    /* 작은 페이지 번호·태그는 제외하고, 화면의 주요 CTA 크기만 공통화한다. */
    if (!isPrimaryOrange || bounds.width < 160 || bounds.height < 38 || bounds.height > 72) {
      return null
    }

    return action
  }

  const handlePrimaryPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const action = getOrangePrimaryAction(event.target)
    if (!action) return

    action.classList.add('app-primary-action', 'is-pressing')
  }

  const clearPrimaryPress = (event: PointerEvent<HTMLDivElement>) => {
    getOrangePrimaryAction(event.target)?.classList.remove('is-pressing')
  }

  const handlePrimaryClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const backButton = event.target instanceof Element
      ? event.target.closest<HTMLButtonElement>('button[aria-label]')
      : null
    if (backButton && ['뒤로 가기', '이전 화면으로 돌아가기', '마이페이지로 돌아가기'].includes(backButton.getAttribute('aria-label') ?? '')) {
      backIntentRef.current = { from: location.pathname, at: performance.now() }
    }

    const action = getOrangePrimaryAction(event.target)
    if (!action) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (replayingActionsRef.current.has(action)) {
      replayingActionsRef.current.delete(action)
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (pendingActionsRef.current.has(action)) return
    pendingActionsRef.current.add(action)

    action.classList.remove('is-pressing', 'is-activating')
    /* 같은 버튼을 연속 실행해도 애니메이션이 처음부터 재생되게 한다. */
    void action.offsetWidth
    action.classList.add('app-primary-action', 'is-activating')

    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer)
      action.classList.remove('is-activating')
      pendingActionsRef.current.delete(action)

      if (!action.isConnected) return
      replayingActionsRef.current.add(action)
      action.click()
    }, 280)

    timersRef.current.add(timer)
  }

  return (
    <div
      className="app-viewport"
      id="app-viewport"
      onPointerDownCapture={handlePrimaryPointerDown}
      onPointerUpCapture={clearPrimaryPress}
      onPointerCancelCapture={clearPrimaryPress}
      onClickCapture={handlePrimaryClick}
    >
      <ClickSpark><div ref={routeContentRef} className="app-route-content">{children}</div></ClickSpark>
      <ScrollTopButton />
      <FloatingChatButton />
      {/* 모달·바텀시트 portal 대상. 스크롤 콘텐츠 바깥이면서 기기 내부에 있다. */}
      <div id="app-overlay-root" />
    </div>
  )
}

export default AppViewport

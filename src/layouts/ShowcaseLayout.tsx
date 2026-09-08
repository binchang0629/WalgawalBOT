import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import DeviceFrame from '../components/device/DeviceFrame'
import AppViewport from '../components/device/AppViewport'
import PersonaSwitcher from '../components/demo/PersonaSwitcher'
import useIsDesktop from '../hooks/useIsDesktop'
import { DEVICE_FRAME, SERVICE, SHOWCASE_BACKGROUND } from '../config/app'
import './ShowcaseLayout.css'

/**
 * PC와 모바일의 바깥 표현만 다르게 하고, 안쪽 컴포넌트 트리는 같다.
 * PC·모바일 전환으로 라우터나 Provider를 다시 만들지 않는다. (PROJECT_SPEC.md §7-4)
 *
 * 축소 비율은 상태로 들고 있지 않고 창 높이에서 렌더 중에 계산한다.
 * effect 안에서 setState를 부르면 렌더가 연쇄로 일어나므로,
 * effect는 창 크기 변화를 구독하는 용도로만 쓴다.
 */
function ShowcaseLayout() {
  const isDesktop = useIsDesktop()
  const [fitToScreen, setFitToScreen] = useState(true)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window === 'undefined' ? 0 : window.innerHeight,
  )

  // 창 크기 변화 구독. setState는 effect 본문이 아니라 콜백 안에서만 부른다.
  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 한 번이라도 앱 안을 스크롤하면 안내 문구를 숨긴다.
  useEffect(() => {
    if (!isDesktop) return

    const viewport = document.getElementById('app-viewport')
    if (!viewport) return

    const handleScroll = () => setHasScrolled(true)
    viewport.addEventListener('scroll', handleScroll, { capture: true, once: true })
    return () => viewport.removeEventListener('scroll', handleScroll, { capture: true })
  }, [isDesktop])

  /*
   * 브라우저 높이가 낮으면 목업을 비율에 맞춰 줄인다. 내부 기준 크기는 그대로 둔다.
   * 위아래 여백은 축소되지 않으므로 먼저 빼고 남는 높이로만 비율을 낸다.
   */
  const availableHeight = viewportHeight - DEVICE_FRAME.stageVerticalPadding
  const shouldScale = isDesktop && fitToScreen && availableHeight > 0
  const scale = shouldScale
    ? Number(
        Math.min(
          1,
          Math.max(DEVICE_FRAME.minScale, availableHeight / DEVICE_FRAME.height),
        ).toFixed(3),
      )
    : 1

  // 모바일: 목업과 바깥 배경 없이 실제 화면을 그대로 쓴다. (PROJECT_SPEC.md §3)
  if (!isDesktop) {
    return (
      <div className="showcase showcase--mobile">
        <AppViewport>
          <Outlet />
        </AppViewport>
      </div>
    )
  }

  return (
    <div
      className={`showcase showcase--desktop ${fitToScreen ? 'showcase--fit' : ''}`}
      style={{
        backgroundImage: SHOWCASE_BACKGROUND.backgroundImage
          ? `url(${SHOWCASE_BACKGROUND.backgroundImage})`
          : SHOWCASE_BACKGROUND.gradient,
      }}
    >
      {/*
        좌 패널 · 기기 · 우 패널을 한 줄에 놓는다.
        두 패널의 폭이 같으므로 기기는 언제나 정확히 가로 중앙에 온다.
        절대 위치를 쓰면 창 크기에 따라 어긋나므로 쓰지 않는다. (PROJECT_SPEC.md §2)
      */}
      <div className={`showcase__stage ${fitToScreen ? '' : 'showcase__stage--actual'}`}>
        <aside className="showcase__aside showcase__aside--left">
          <h1 className="showcase__title">{SERVICE.name}</h1>
          <p className="showcase__tagline">{SERVICE.tagline}</p>

          {!hasScrolled && <p className="showcase__hint">기기 안에서 스크롤해 보세요</p>}
        </aside>

        <DeviceFrame scale={scale}>
          <AppViewport>
            <Outlet />
          </AppViewport>
        </DeviceFrame>

        <aside className="showcase__aside showcase__aside--right">
          {/* 시연용 계정 전환 도구. 서비스 UI가 아니라 기기 바깥에 둔다. (PROJECT_SPEC.md §4) */}
          <PersonaSwitcher />

          <button
            type="button"
            className="showcase__toggle"
            onClick={() => setFitToScreen((prev) => !prev)}
          >
            {fitToScreen ? '원본 크기 보기' : '화면에 맞추기'}
          </button>
        </aside>
      </div>
    </div>
  )
}

export default ShowcaseLayout

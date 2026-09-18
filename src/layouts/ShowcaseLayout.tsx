import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import DeviceFrame from '../components/device/DeviceFrame'
import AppViewport from '../components/device/AppViewport'
import PersonaSwitcher from '../components/demo/PersonaSwitcher'
import wgwbLogo from '../assets/brand/wgwb-logo.svg'
import onboardingQr from '../assets/brand/onboarding-qr.svg'
import useIsDesktop from '../hooks/useIsDesktop'
import { DEVICE_FRAME, SERVICE, SHOWCASE_BACKGROUND } from '../config/app'
import { resetDemoSession } from '../utils/demoReset'
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
          <h1 className="showcase__title">
            <img src={wgwbLogo} width={266} height={45} alt={SERVICE.name} />
          </h1>
          <p className="showcase__tagline">
            <span>내 고민,</span>
            <span>
              <strong className="showcase__tagline-ai">AI</strong>와{' '}
              <strong className="showcase__tagline-jury">배심원이</strong>{' '}
              함께 판단해드려요
            </span>
          </p>

          <p className={`showcase__hint ${hasScrolled ? 'is-hidden' : ''}`}>
            기기 안에서 스크롤해 보세요
          </p>
          <div className="showcase__qr">
            <img src={onboardingQr} width={120} height={120} alt="왈가왈BOT 온보딩 페이지 QR 코드" />
            <p>QR을 스캔하면 왈가왈BOT으로 이동해요</p>
          </div>
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

          {/*
            다음 사람에게 넘기기 전에 누른다. 같은 브라우저로 여러 명이 돌아가며 볼 때,
            앞사람이 단 댓글과 배심 참여 기록이 남아 있으면 시연이 처음 상태가 아니게 된다.
            지우고 첫 화면(스플래시)부터 다시 시작한다.
            서비스 UI가 아니라 시연 도구라서 기기 바깥에 둔다. (PROJECT_SPEC.md §4)
          */}
          <button
            type="button"
            className="showcase__reset"
            onClick={() => {
              resetDemoSession()
              // 지운 상태로 새로 띄운다. replace라 뒤로 가기로 되돌아오지 않는다.
              window.location.replace('/')
            }}
          >
            시연 초기화
          </button>
          <p className="showcase__reset-note">댓글 · 로그인 · 배심 기록을 모두 지우고 처음부터 시작해요</p>
        </aside>
      </div>
    </div>
  )
}

export default ShowcaseLayout

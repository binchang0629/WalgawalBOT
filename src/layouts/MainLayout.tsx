import { useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import BottomNavigation from '../components/common/BottomNavigation'
import { PATHS } from '../routes/paths'
import './MainLayout.css'

// 상세 화면이 같은 스크롤 영역을 재사용하거나 레이아웃이 잠시 언마운트되어도 유지한다.
let lastHomeScrollTop = 0

/**
 * 홈·배심원 광장·왈가왈후~·MY 등 주요 메뉴 화면의 공통 틀.
 *
 * 스크롤은 window가 아니라 이 안의 콘텐츠 컨테이너가 담당한다.
 * 기기 목업 안에서도 같은 방식으로 동작한다. (PROJECT_SPEC.md §7-7)
 *
 * TODO: 앱 헤더(TopBar)는 아직 홈 화면 안에 있다.
 *       두 번째 화면의 컨펌 시안에서 같은 구조가 확인되면 공통 컴포넌트로 올린다. (PROJECT_SPEC.md §7-2)
 */
function MainLayout() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const scrollRef = useRef<HTMLDivElement>(null)
  const previousPathRef = useRef<string | null>(null)

  useLayoutEffect(() => {
    if (location.pathname === PATHS.afterStory && previousPathRef.current === PATHS.home) {
      const routeState = location.state as { scrollToTop?: boolean } | null
      if (routeState?.scrollToTop) {
        scrollRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      }
    }
    if (location.pathname === PATHS.home && previousPathRef.current !== PATHS.home) {
      const routeState = location.state as { restoreHomeScroll?: boolean; homeCaseId?: string } | null
      const restore = navigationType === 'POP'
        || routeState?.restoreHomeScroll === true
      const scrollTop = restore ? lastHomeScrollTop : 0
      if (!restore) lastHomeScrollTop = 0
      scrollRef.current?.scrollTo({ top: scrollTop, left: 0, behavior: 'auto' })
      if (routeState?.homeCaseId && scrollRef.current) {
        const scrollRoot = scrollRef.current
        const caseLink = Array.from(scrollRoot.querySelectorAll<HTMLElement>('[data-home-case-id]'))
          .find((element) => element.dataset.homeCaseId === routeState.homeCaseId)
        if (caseLink) {
          const rootRect = scrollRoot.getBoundingClientRect()
          const cardRect = caseLink.getBoundingClientRect()
          scrollRoot.scrollTo({
            top: scrollRoot.scrollTop + cardRect.top - rootRect.top - (scrollRoot.clientHeight - cardRect.height) / 2,
            behavior: 'auto',
          })
          lastHomeScrollTop = scrollRoot.scrollTop
        }
      }
    }
    previousPathRef.current = location.pathname
  }, [location.pathname, location.state, navigationType])

  return (
    <div className="main-layout">
      <div
        ref={scrollRef}
        className="main-layout__scroll"
        onScroll={(event) => {
          if (location.pathname === PATHS.home) lastHomeScrollTop = event.currentTarget.scrollTop
        }}
      >
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  )
}

export default MainLayout

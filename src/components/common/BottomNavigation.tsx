import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useLoginGate from '../../hooks/useLoginGate'
import type { LoginGateReason } from '../../state/loginGateContext'
import { PATHS } from '../../routes/paths'
import homeIcon from '../../assets/icons/nav-home.svg'
import plazaIcon from '../../assets/icons/nav-plaza.svg'
import submitIcon from '../../assets/icons/nav-submit.svg'
import afterStoryIcon from '../../assets/icons/nav-afterstory.svg'
import myIcon from '../../assets/icons/nav-my.svg'
import navBackground from '../../assets/home/figma/imgDownNav.svg'

/**
 * 공통 하단 내비게이션.
 *
 * 메뉴 구성은 Figma 컨펌 시안과 개발 페이지의 `BottomNavigation`을 따른다.
 * 홈 / 배심원 광장 / 사건 접수(중앙 CTA) / 왈가왈후~ / MY
 * 자료 IA에는 `알림`이 하단 메뉴로 적혀 있으나, 시안에서 알림은 상단 헤더 아이콘이다.
 * (PROJECT_SPEC.md §1-1, §9 정리된 것 4)
 *
 * 활성 상태는 별도 state가 아니라 현재 URL에서 판단한다. (PROJECT_SPEC.md §7-7)
 * 홈 인디케이터 막대는 여기서 그리지 않는다. 목업의 HomeIndicator가 담당한다.
 *
 * 아이콘은 Figma에서 내보낸 SVG를 CSS mask로 얹는다.
 * `<img>`로 넣으면 파일에 박힌 색이 그대로 나와 활성·비활성 색을 바꿀 수 없다.
 * mask는 벡터 모양은 그대로 두고 색만 CSS가 정하게 해준다.
 */

interface NavItem {
  label: string
  icon: string
  to: string
  /** 해당 화면의 라우트가 아직 없으면 false. 디자인 확정 후 켠다. */
  enabled: boolean
  isCta?: boolean
  /**
   * 로그인해야 들어갈 수 있는 메뉴면 이유를 적는다.
   * 비로그인으로 누르면 이동하지 않고 보던 화면 위에 안내 팝업이 뜬다.
   * 홈·배심원 광장·왈가왈후~는 둘러보기 대상이라 비워 둔다. (PROJECT_SPEC.md §0-6, §7-5)
   */
  gate?: LoginGateReason
}

const NAV_ITEMS: NavItem[] = [
  { label: '홈', icon: homeIcon, to: PATHS.home, enabled: true },
  { label: '배심원 광장', icon: plazaIcon, to: PATHS.plaza, enabled: true },
  { label: '사건 접수', icon: submitIcon, to: PATHS.caseSubmit, enabled: true, isCta: true, gate: 'caseSubmit' },
  { label: '왈가왈후~', icon: afterStoryIcon, to: PATHS.afterStory, enabled: true },
  // 비로그인 상태에서는 현재 화면을 유지하고 MY 전용 로그인 팝업을 띄운다.
  { label: 'MY', icon: myIcon, to: PATHS.my, enabled: true, gate: 'my' },
]

function NavIcon({ src, isCta }: { src: string; isCta?: boolean }) {
  /*
   * 아이콘 경로를 CSS 변수로 넘긴다.
   * mask-image를 인라인으로 주면 CTA의 원형 배경까지 함께 잘려 나가므로,
   * 어디에 mask를 적용할지는 CSS가 정하게 한다.
   */
  const style = { '--nav-icon': `url(${src})` } as React.CSSProperties

  return (
    <span
      className={isCta ? 'bottom-nav__icon bottom-nav__icon--cta' : 'bottom-nav__icon'}
      style={style}
      aria-hidden="true"
    />
  )
}

function BottomNavigation() {
  const { requireLogin } = useLoginGate()
  const navigate = useNavigate()
  const ctaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [ctaPressed, setCtaPressed] = useState(false)

  useEffect(() => () => {
    if (ctaTimer.current) clearTimeout(ctaTimer.current)
  }, [])

  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      <img className="bottom-nav__background" src={navBackground} alt="" aria-hidden="true" />
      {NAV_ITEMS.map((item) => {
        const className = item.isCta ? 'bottom-nav__item case-nav' : 'bottom-nav__item'

        if (!item.enabled) {
          return (
            <button
              key={item.label}
              type="button"
              className={className}
              disabled
              aria-disabled="true"
              title="시안 확정 후 연결됩니다"
            >
              <NavIcon src={item.icon} isCta={item.isCta} />
              <span className="bottom-nav__label">{item.label}</span>
            </button>
          )
        }

        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => `${className}${isActive ? ' active' : ''}${item.isCta && ctaPressed ? ' case-nav--pressed' : ''}`}
            aria-label={item.isCta ? item.label : undefined}
            onClick={(event) => {
              if (item.isCta && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return

              // 비로그인이면 이동을 막고 안내 팝업만 띄운다. 보던 화면은 그대로 남는다.
              if (item.gate && !requireLogin(item.gate, item.to)) {
                event.preventDefault()
                return
              }

              if (item.isCta) {
                event.preventDefault()
                if (ctaTimer.current) return
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                  navigate(item.to)
                  return
                }
                setCtaPressed(true)
                ctaTimer.current = setTimeout(() => {
                  ctaTimer.current = null
                  navigate(item.to)
                }, 240)
                return
              }

              // MainLayout은 라우트가 바뀌어도 같은 내부 스크롤 영역을 재사용한다.
              // 네비로 이동할 때와 현재 메뉴를 다시 눌렀을 때 모두 화면 맨 위에서 시작한다.
              event.currentTarget
                .closest<HTMLElement>('.main-layout')
                ?.querySelector<HTMLElement>('.main-layout__scroll')
                ?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
            }}
          >
            <NavIcon src={item.icon} isCta={item.isCta} />
            <span className="bottom-nav__label">{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export default BottomNavigation

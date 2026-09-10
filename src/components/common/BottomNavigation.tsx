import type React from 'react'
import { NavLink } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import homeIcon from '../../assets/icons/nav-home.svg'
import plazaIcon from '../../assets/icons/nav-plaza.svg'
import submitIcon from '../../assets/icons/nav-submit.svg'
import afterStoryIcon from '../../assets/icons/nav-afterstory.svg'
import myIcon from '../../assets/icons/nav-my.svg'

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
}

const NAV_ITEMS: NavItem[] = [
  { label: '홈', icon: homeIcon, to: PATHS.home, enabled: true },
  { label: '배심원 광장', icon: plazaIcon, to: PATHS.plaza, enabled: true },
  { label: '사건 접수', icon: submitIcon, to: PATHS.caseSubmit, enabled: true, isCta: true },
  { label: '왈가왈후~', icon: afterStoryIcon, to: PATHS.afterStory, enabled: false },
  { label: 'MY', icon: myIcon, to: PATHS.my, enabled: false },
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
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
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
            className={({ isActive }) => (isActive ? `${className} active` : className)}
            aria-label={item.isCta ? item.label : undefined}
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

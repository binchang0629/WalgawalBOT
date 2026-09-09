import { NavLink } from 'react-router-dom'
import { PATHS } from '../../routes/paths'

/**
 * 공통 하단 내비게이션.
 *
 * 메뉴 구성은 Figma 컨펌 시안의 down_nav를 따른다.
 * 홈 / 배심원 광장 / 사건 접수(중앙 CTA) / 왈가왈후~ / MY
 * 자료 IA에는 `알림`이 하단 메뉴로 적혀 있으나, 컨펌 시안에서 알림은 상단 헤더 아이콘이다.
 * 컨펌 우선 원칙에 따라 시안을 따른다. (PROJECT_SPEC.md §1-1, §9-4)
 *
 * 활성 상태는 별도 state가 아니라 현재 URL에서 판단한다. (PROJECT_SPEC.md §7-7)
 * 홈 인디케이터 막대는 여기서 그리지 않는다. 목업의 HomeIndicator가 담당한다.
 *
 * TODO: 아이콘을 src/assets/home/figma/의 실제 SVG로 교체한다.
 *       현재 문자는 시안 확인 전 임시 표시다. (PROJECT_CONTEXT.md 홈 잔여 항목)
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
  { label: '홈', icon: '⌂', to: PATHS.home, enabled: true },
  { label: '배심원 광장', icon: '♟', to: PATHS.plaza, enabled: false },
  { label: '사건 접수', icon: '＋', to: PATHS.caseSubmit, enabled: true, isCta: true },
  { label: '왈가왈후~', icon: '▢', to: PATHS.afterStory, enabled: false },
  { label: 'MY', icon: '♙', to: PATHS.my, enabled: false },
]

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
              <span>{item.icon}</span>
              {item.label}
            </button>
          )
        }

        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => (isActive ? `${className} active` : className)}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}

export default BottomNavigation

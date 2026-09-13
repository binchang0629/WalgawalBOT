import type { ReactNode } from 'react'
import searchIcon from '../../assets/icons/search.svg'
import notificationIcon from '../../assets/icons/notification.svg'
import './TopBar.css'

/**
 * 공통 앱 헤더.
 *
 * Figma `top_nav`(402 × 128)의 아래 66px에 해당한다.
 * 위 62px 시스템 상태바는 기기 목업이 그린다. (PROJECT_SPEC.md §0-4)
 *
 * 홈과 배심원 광장 두 화면에서 같은 구조가 확인되어 공통 컴포넌트로 올렸다.
 * (PROJECT_SPEC.md §7-2 — 두 번째 사용에서 공통화)
 *
 * 알림은 하단바가 아니라 이 헤더의 아이콘이다. (PROJECT_SPEC.md §9 정리된 것 4)
 */

interface TopBarProps {
  /** 화면별 확정 시안에 별도 로고 표기가 있을 때만 지정한다. */
  logo?: ReactNode
  /** 읽지 않은 알림 표시. 서버가 없어 지금은 화면에서 내려준다. */
  hasUnreadNotification?: boolean
}

function TopBar({ hasUnreadNotification = false, logo }: TopBarProps) {
  return (
    <header className="top-bar">
      <strong className="top-bar__logo">
        {logo ?? <>왈가왈<span>BOT</span></>}
      </strong>
      <div className="top-bar__actions">
        <button type="button" className="top-bar__action" aria-label="검색">
          <img src={searchIcon} alt="" width={24} height={24} />
        </button>
        <button type="button" className="top-bar__action" aria-label="알림">
          <img src={notificationIcon} alt="" width={24} height={24} />
          {hasUnreadNotification && <i className="top-bar__dot" aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}

export default TopBar

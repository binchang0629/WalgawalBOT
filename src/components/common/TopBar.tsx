import type { ReactNode } from 'react'
import wgwbLogo from '../../assets/brand/wgwb-logo.svg'
import searchIcon from '../../assets/icons/search-topbar.svg'
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
  /** 페이지 이름만 가운데에 두는 상세형 헤더. */
  title?: string
  /** 검색창은 각 화면의 콘텐츠 영역에서 열고, 헤더는 트리거만 제공한다. */
  onSearch?: () => void
  isSearchOpen?: boolean
  /** 로그인 상태는 현재 프로필 사진, 비로그인 상태는 기본 사람 아이콘. */
  accountAvatar?: string
  accountPersona?: 'A' | 'B'
  onAccountSwitch?: () => void
  isAccountSwitchOpen?: boolean
}

function TopBar({
  logo,
  title,
  onSearch,
  isSearchOpen = false,
  accountAvatar,
  accountPersona,
  onAccountSwitch,
  isAccountSwitchOpen = false,
}: TopBarProps) {
  if (title) {
    return (
      <header className="top-bar top-bar--title">
        <span aria-hidden="true" />
        <h1>{title}</h1>
        <span aria-hidden="true" />
      </header>
    )
  }

  return (
    <header className="top-bar">
      <strong className="top-bar__logo">
        {logo ?? <img src={wgwbLogo} width={100} height={18} alt="왈가왈BOT" />}
      </strong>
      <div className="top-bar__actions">
        <button
          type="button"
          className="top-bar__action"
          aria-label={isSearchOpen ? '검색창 닫기' : '검색창 열기'}
          aria-expanded={isSearchOpen}
          aria-controls="home-global-search"
          onClick={onSearch}
        >
          <img src={searchIcon} alt="" width={24} height={24} />
        </button>
        {accountAvatar && onAccountSwitch && (
          <button
            type="button"
            className={`top-bar__action top-bar__action--account${accountPersona ? ` top-bar__action--account-${accountPersona}` : ' top-bar__action--account-guest'}`}
            aria-label={accountPersona ? '계정 전환' : '로그인하고 프로필 보기'}
            aria-haspopup={accountPersona ? 'dialog' : undefined}
            aria-expanded={accountPersona ? isAccountSwitchOpen : undefined}
            onClick={onAccountSwitch}
          >
            <img src={accountAvatar} alt="" />
          </button>
        )}
      </div>
    </header>
  )
}

export default TopBar

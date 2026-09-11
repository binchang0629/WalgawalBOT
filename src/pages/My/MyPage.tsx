import { useCallback, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { DEMO_ACCOUNTS } from '../../data/personas'
import { useNavigate } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { PATHS } from '../../routes/paths'
import profileImage from '../../assets/my/profile.png'
import jihunProfileImage from '../../assets/my/account-jihun.png'
import AccountSwitchSheet from './components/AccountSwitchSheet'
import switchIcon from '../../assets/my/switch.svg'
import chevronBrownIcon from '../../assets/my/chevron-brown.svg'
import collapseIcon from '../../assets/my/collapse.svg'
import achievementIcon from '../../assets/my/achievement.svg'
import justiceIcon from '../../assets/my/justice.svg'
import voteIcon from '../../assets/my/vote.svg'
import bookmarkIcon from '../../assets/my/bookmark.svg'
import bellIcon from '../../assets/my/bell.svg'
import banIcon from '../../assets/my/ban.svg'
import serviceIcon from '../../assets/my/service.svg'
import expertIcon from '../../assets/my/expert.svg'
import chevronIcon from '../../assets/my/chevron.svg'
import chevronDisabledIcon from '../../assets/my/chevron-disabled.svg'
import './MyPage.css'

interface MenuItem {
  label: string
  icon: string
  disabled?: boolean
  onClick?: () => void
}

/** 기존 SVG 모양을 재사용하고 메뉴 상태에 따라 색상만 일관되게 적용한다. */
function MenuIcon({ icon }: { icon: string }) {
  return <span className="my-menu__icon" aria-hidden="true" style={{ '--my-menu-icon': `url("${icon}")` } as CSSProperties} />
}

function MenuRow({ label, icon, disabled = false, onClick }: MenuItem) {
  return (
    <button
      type="button"
      className={`my-menu__row${disabled ? ' is-disabled' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="my-menu__label">
        <MenuIcon icon={icon} />
        {label}
      </span>
      <img
        className="my-menu__chevron"
        src={disabled ? chevronDisabledIcon : chevronIcon}
        alt=""
      />
    </button>
  )
}

function MyPage() {
  const navigate = useNavigate()
  const { personaId, currentUser, switchPersona, signOut } = useSession()
  const [activityOpen, setActivityOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(true)
  const [accountSheetOpen, setAccountSheetOpen] = useState(false)
  const [switchMessage, setSwitchMessage] = useState('')
  useEffect(() => {
    if (!switchMessage) return
    const timer = window.setTimeout(() => setSwitchMessage(''), 3500)
    return () => window.clearTimeout(timer)
  }, [switchMessage])
  const closeAccountSheet = useCallback(() => setAccountSheetOpen(false), [])
  const displayName = currentUser?.name ?? (personaId === 'A' ? '윤서아' : '곽지훈')
  const displayNickname = currentUser?.nickname ?? DEMO_ACCOUNTS[personaId].nickname

  const handleSwitchAccount = () => {
    setSwitchMessage('')
    setAccountSheetOpen(true)
  }

  return (
    <main className="my-page">
      <header className="my-page__header">
        <span className="my-page__header-spacer" aria-hidden="true" />
        <h1>MY</h1>
        <span className="my-page__header-spacer" aria-hidden="true" />
      </header>

      <div className="my-page__content">
        <section className="profile-card" aria-label="프로필">
          <div className="profile-card__top">
            <div className="profile-card__user">
              <span className={`profile-card__avatar${personaId === 'B' ? ' profile-card__avatar--jihun' : ''}`}><img src={personaId === 'A' ? profileImage : jihunProfileImage} alt="" /></span>
              <span>
                <span className="profile-card__name-row">
                  <strong>{displayName}</strong>
                  <span className="profile-card__nickname">{displayNickname}</span>
                </span>
                <small>AI 배심원단 활동 중 · 611명 소통</small>
              </span>
            </div>
            <button type="button" className="profile-card__switch" onClick={handleSwitchAccount} aria-haspopup="dialog" aria-expanded={accountSheetOpen}>
              계정 전환 <img src={switchIcon} alt="" />
            </button>
          </div>
          <dl className="profile-card__stats">
            <div><dt>접수한 사건</dt><dd><strong>4</strong>건</dd></div>
            <div><dt>배심 참여</dt><dd><strong>24</strong>건</dd></div>
            <div><dt>포인트</dt><dd className="profile-card__points"><strong>{DEMO_ACCOUNTS[personaId].points}</strong><span>pt</span></dd></div>
          </dl>
        </section>

        <section className="plan-card" aria-label="구독 플랜">
          <div className="plan-card__header">
            <div><h2>월간 왈봇 플랜</h2><span>이용중</span></div>
            <small>D-23</small>
          </div>
          <div className="plan-card__details">
            <p>광고 제거 · 재판 이용권 무제한 · AI 심층리포트 (판정별 해석)</p>
            <div>
              <span>다음 결제일: 2026.09.25</span>
              <button type="button">결제 수단 및 내역 관리 <img src={chevronBrownIcon} alt="" /></button>
            </div>
          </div>
        </section>

        <section className="my-menu">
          <button type="button" className="my-menu__header" onClick={() => setActivityOpen((open) => !open)} aria-expanded={activityOpen}>
            <span>나의 활동</span>
            <img className={activityOpen ? '' : 'is-closed'} src={collapseIcon} alt="" />
          </button>
          {activityOpen && (
            <div>
              <MenuRow label="업적 · 미션 (뱃지 및 리워드)" icon={achievementIcon} disabled />
              <MenuRow label="내 사건 (접수한 사건 목록 및 결과)" icon={justiceIcon} onClick={() => navigate(PATHS.myCases)} />
              <MenuRow label="참여한 사건 (투표 및 배심원 활동)" icon={voteIcon} disabled />
              <MenuRow label="저장함 (판결 스크랩 및 북마크)" icon={bookmarkIcon} disabled />
            </div>
          )}
        </section>

        <section className="my-menu">
          <button type="button" className="my-menu__header" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen}>
            <span>설정</span>
            <img className={settingsOpen ? '' : 'is-closed'} src={collapseIcon} alt="" />
          </button>
          {settingsOpen && (
            <div>
              <MenuRow label="공개 범위 · 개인정보 · 알림" icon={bellIcon} disabled />
              <MenuRow label="차단 · 신고 목록" icon={banIcon} disabled />
              <MenuRow label="도움말 · 서비스 설정 / 고객센터" icon={serviceIcon} disabled />
            </div>
          )}
        </section>

        <button type="button" className="expert-card is-disabled" disabled>
          <span><MenuIcon icon={expertIcon} />전문가 정보 기록</span>
          <img className="my-menu__chevron" src={chevronDisabledIcon} alt="" />
        </button>
      </div>
      {accountSheetOpen && (
        <AccountSwitchSheet
          key={personaId}
          currentPersona={personaId}
          onClose={closeAccountSheet}
          onConfirm={(nextPersona) => {
            switchPersona(nextPersona)
            closeAccountSheet()
            setSwitchMessage(`${DEMO_ACCOUNTS[nextPersona].name} 프로필로 전환되었습니다`)
          }}
          onLogout={() => {
            signOut()
            closeAccountSheet()
            navigate(PATHS.home)
          }}
        />
      )}
      {switchMessage && document.getElementById('app-overlay-root') && createPortal(
        <p className="profile-switch-toast" role="status" aria-live="polite">{switchMessage}</p>,
        document.getElementById('app-overlay-root')!,
      )}
    </main>
  )
}

export default MyPage

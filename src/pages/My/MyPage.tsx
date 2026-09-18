import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { DEMO_ACCOUNTS } from '../../data/personas'
import { Link, useNavigate } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { PATHS } from '../../routes/paths'
import { readMyComments } from '../../utils/myComments'
import profileImage from '../../assets/my/profile.png'
import jihunProfileImage from '../../assets/my/account-jihun.png'
import guestMascotImage from '../../assets/auth/loginPopUpMy.webp'
import planMascot from '../../assets/home/figma/img1What.png'
import AccountSwitchSheet from './components/AccountSwitchSheet'
import LogoutConfirmDialog from './components/LogoutConfirmDialog'
import useToast from '../../hooks/useToast'
import switchIcon from '../../assets/my/switch.svg'
import chevronBrownIcon from '../../assets/my/chevron-brown.svg'
import justiceIcon from '../../assets/my/justice.svg'
import bookmarkIcon from '../../assets/my/bookmark.svg'
import commentIcon from '../../assets/my/comment.svg'
import bellIcon from '../../assets/my/bell.svg'
import banIcon from '../../assets/my/ban.svg'
import serviceIcon from '../../assets/my/service.svg'
import expertIcon from '../../assets/my/expert.svg'
import chevronIcon from '../../assets/my/chevron.svg'
import chevronDisabledIcon from '../../assets/my/chevron-disabled.svg'
import seoaSwitchIcon from '../../assets/my/seoa-switch.svg'
import seoaAchievementIcon from '../../assets/my/seoa-achievement.svg'
import seoaBookmarkIcon from '../../assets/my/seoa-bookmark.svg'
import seoaBellIcon from '../../assets/my/seoa-bell.svg'
import './MyPage.css'

interface MenuItem {
  label: string
  icon: string
  iconSize?: number
  className?: string
  disabled?: boolean
  onClick?: () => void
}

/** 기존 SVG 모양을 재사용하고 메뉴 상태에 따라 색상만 일관되게 적용한다. */
function MenuIcon({ icon, iconSize = 20 }: { icon: string; iconSize?: number }) {
  return <span className="my-menu__icon" aria-hidden="true" style={{ '--my-menu-icon': `url("${icon}")`, '--my-menu-icon-size': `${iconSize}px` } as CSSProperties} />
}

function MenuRow({ label, icon, iconSize, className = '', disabled = false, onClick }: MenuItem) {
  return (
    <button
      type="button"
      className={`my-menu__row${className ? ` ${className}` : ''}${disabled ? ' is-disabled' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="my-menu__label">
        <MenuIcon icon={icon} iconSize={iconSize} />
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
  const { showToast } = useToast()
  const { personaId, currentUser, activityStats, signIn, signOut } = useSession()
  const isSeoa = personaId === 'A'
  const [activityOpen, setActivityOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(true)
  const [accountSheetOpen, setAccountSheetOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const pointValueRef = useRef<HTMLElement>(null)
  const previousPointsRef = useRef(activityStats.points)
  useEffect(() => {
    if (previousPointsRef.current === activityStats.points) return
    previousPointsRef.current = activityStats.points
    const pointValue = pointValueRef.current
    if (!pointValue || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const animation = pointValue.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.18)', offset: 0.42 },
        { transform: 'scale(1)' },
      ],
      { duration: 420, easing: 'cubic-bezier(.22, 1, .36, 1)' },
    )
    return () => animation.cancel()
  }, [activityStats.points])
  const closeAccountSheet = useCallback(() => setAccountSheetOpen(false), [])
  const closeLogoutDialog = useCallback(() => setLogoutDialogOpen(false), [])
  const displayName = currentUser?.name ?? (personaId === 'A' ? '윤서아' : '곽지훈')
  const displayNickname = currentUser?.isCustomProfile ? null : currentUser?.nickname ?? DEMO_ACCOUNTS[personaId].nickname
  const activityCount = activityStats.submittedCases + activityStats.juryParticipations
  // 마이페이지에 들어올 때마다 다시 읽는다. 댓글을 쓰고 돌아오면 바로 활성화된다.
  const myCommentCount = readMyComments(personaId).length

  const handleSwitchAccount = () => {
    setAccountSheetOpen(true)
  }

  if (!currentUser) {
    const from = encodeURIComponent(PATHS.my)

    return (
      <main className="my-page my-page--guest">
        <header className="my-page__header">
          <span className="my-page__header-spacer" aria-hidden="true" />
          <h1>MY</h1>
          <span className="my-page__header-spacer" aria-hidden="true" />
        </header>

        <section className="my-guest" aria-labelledby="my-guest-title">
          <img className="my-guest__mascot" src={guestMascotImage} alt="" aria-hidden="true" />
          <div className="my-guest__copy">
            <h2 id="my-guest-title">로그인이 필요해요</h2>
            <p>로그인하고 내 사건과 배심 활동,<br />포인트를 한곳에서 확인해보세요.</p>
          </div>
          <Link className="my-guest__login" to={`${PATHS.login}?from=${from}`}>
            로그인하기
          </Link>
          <p className="my-guest__signup">
            아직 계정이 없나요?
            <Link to={`${PATHS.signup}?from=${from}`}>회원가입</Link>
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className={`my-page${isSeoa ? ' my-page--seoa' : ''}`}>
      <header className="my-page__header">
        <span className="my-page__header-spacer" aria-hidden="true" />
        <h1>MY</h1>
        <span className="my-page__header-spacer" aria-hidden="true" />
      </header>

      <div className="my-page__content">
        <section className="profile-card" aria-label="프로필">
          <div className="profile-card__top">
            <div className="profile-card__user">
              <span className={`profile-card__avatar${currentUser.isCustomProfile ? ' profile-card__avatar--custom' : personaId === 'B' ? ' profile-card__avatar--jihun' : ''}`}><img src={currentUser.isCustomProfile ? currentUser.anonymousAvatarUrl : personaId === 'A' ? profileImage : jihunProfileImage} alt="" /></span>
              <span>
                <span className="profile-card__name-row">
                  <strong>{displayName}</strong>
                  {displayNickname && <span className="profile-card__nickname">{displayNickname}</span>}
                </span>
                <small>{activityCount === 0
                  ? '아직 활동 기록이 없어요'
                  : `접수 ${activityStats.submittedCases}건 · 배심 참여 ${activityStats.juryParticipations}건`}</small>
              </span>
            </div>
            <button type="button" className="profile-card__switch" onClick={handleSwitchAccount} aria-haspopup="dialog" aria-expanded={accountSheetOpen}>
              계정 전환 <img src={isSeoa ? seoaSwitchIcon : switchIcon} alt="" />
            </button>
          </div>
          <div className="profile-card__stats" aria-label="나의 활동 요약">
            <button
              type="button"
              className={`profile-card__stat profile-card__stat--action${activityStats.submittedCases === 0 ? ' is-empty' : ''}`}
              disabled={activityStats.submittedCases === 0}
              onClick={() => navigate(PATHS.myCases)}
              aria-label={`접수한 사건 ${activityStats.submittedCases}건${activityStats.submittedCases > 0 ? ', 내가 접수한 사건 목록으로 이동' : ''}`}
            >
              <span className="profile-card__stat-label">접수한 사건</span>
              <span className="profile-card__stat-value"><strong>{activityStats.submittedCases}</strong>건</span>
            </button>
            <button
              type="button"
              className={`profile-card__stat profile-card__stat--action${activityStats.juryParticipations === 0 ? ' is-empty' : ''}`}
              disabled={activityStats.juryParticipations === 0}
              onClick={() => navigate(PATHS.myJury)}
              aria-label={`배심 참여 ${activityStats.juryParticipations}건${activityStats.juryParticipations > 0 ? ', 참여한 사건 목록으로 이동' : ''}`}
            >
              <span className="profile-card__stat-label">배심 참여</span>
              <span className="profile-card__stat-value"><strong>{activityStats.juryParticipations}</strong>건</span>
            </button>
            <div className="profile-card__stat">
              <span className="profile-card__stat-label">포인트</span>
              <span className="profile-card__stat-value profile-card__points"><strong ref={pointValueRef}>{activityStats.points}</strong><span>pt</span></span>
            </div>
          </div>
        </section>

        {isSeoa ? (
          <section className="plan-card plan-card--empty" aria-label="구독 플랜">
            <div className="plan-card__intro">
              <h2>아직 이용 중인 플랜이 없어요</h2>
              <p>광고 없이 사건을 보고,<br />재판 이용권과 AI 심층리포트를 이용해보세요.</p>
            </div>
            <img className="plan-card__mascot" src={planMascot} width="78" height="61" alt="" />
            <button type="button" className="plan-card__browse" onClick={() => navigate(PATHS.myPlan)}>
              왈봇 플랜 살펴보기
            </button>
          </section>
        ) : (
          <Link className="plan-card plan-card--active" to={PATHS.myPlan} aria-label="구독 플랜 관리">
            <div className="plan-card__header">
              <div><h2>월간 왈봇 플랜</h2><span>이용중</span></div>
              <small>D-23</small>
            </div>
            <div className="plan-card__details">
              <p>광고 제거 · 재판 이용권 무제한 · AI 심층리포트 (판정별 해석)</p>
              <div>
                <span>다음 결제일: 2026.09.25</span>
                <span className="plan-card__manage-label">결제 수단 및 내역 관리 <img src={chevronBrownIcon} alt="" /></span>
              </div>
            </div>
          </Link>
        )}

        <section className="my-menu">
          <button type="button" className="my-menu__header" onClick={() => setActivityOpen((open) => !open)} aria-expanded={activityOpen}>
            <span>나의 활동</span>
          </button>
          {activityOpen && (
            <div>
              <MenuRow label="업적 · 미션" icon={seoaAchievementIcon} iconSize={17} disabled />
              <MenuRow label="내가 접수한 사건" icon={justiceIcon} iconSize={20} onClick={() => navigate(PATHS.myCases)} />
              {/*
                댓글을 한 번도 안 썼으면 열 것이 없으므로 비활성으로 둔다.
                기록은 로그인한 계정으로 등록한 댓글만 쌓인다. (utils/myComments.ts)
              */}
              <MenuRow
                label="내가 쓴 댓글"
                icon={commentIcon}
                iconSize={16}
                className="my-menu__row--comments"
                disabled={myCommentCount === 0}
                onClick={() => navigate(PATHS.myComments)}
              />
              <MenuRow label="사건 저장함" icon={isSeoa ? seoaBookmarkIcon : bookmarkIcon} disabled />
            </div>
          )}
        </section>

        <section className="my-menu">
          <button type="button" className="my-menu__header" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen}>
            <span>설정</span>
          </button>
          {settingsOpen && (
            <div>
              <MenuRow label="공개 범위 · 개인정보 · 알림" icon={isSeoa ? seoaBellIcon : bellIcon} disabled />
              <MenuRow label="차단 · 신고 목록" icon={banIcon} disabled />
              <MenuRow label="도움말 · 서비스 설정 / 고객센터" icon={serviceIcon} disabled />
            </div>
          )}
        </section>

        <button type="button" className="expert-card is-disabled" disabled>
          <span><MenuIcon icon={expertIcon} />전문가 정보 기록</span>
          <img className="my-menu__chevron" src={chevronDisabledIcon} alt="" />
        </button>
        <button
          type="button"
          className="my-page__logout profile-switch-confirm__logout"
          aria-haspopup="dialog"
          aria-expanded={logoutDialogOpen}
          onClick={() => setLogoutDialogOpen(true)}
        >
          로그아웃 하기
        </button>
      </div>
      {logoutDialogOpen && (
        <LogoutConfirmDialog
          onClose={closeLogoutDialog}
          onConfirm={() => {
            closeLogoutDialog()
            signOut()
            navigate(PATHS.home, { replace: true })
            showToast('로그아웃 되었습니다')
          }}
        />
      )}
      {accountSheetOpen && (
        <AccountSwitchSheet
          key={personaId}
          currentPersona={personaId}
          currentUser={currentUser}
          onClose={closeAccountSheet}
          onConfirm={(nextPersona) => {
            signIn(nextPersona)
            closeAccountSheet()
            showToast(`${DEMO_ACCOUNTS[nextPersona].name} 프로필로 전환되었습니다`)
          }}
          onLogout={() => {
            signOut()
            closeAccountSheet()
            navigate(PATHS.home)
            showToast('로그아웃 되었습니다')
          }}
        />
      )}
    </main>
  )
}

export default MyPage

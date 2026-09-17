import { useState } from 'react'
import TopBar from '../../components/common/TopBar'
import useSession from '../../hooks/useSession'
import useLoginGate from '../../hooks/useLoginGate'
import useToast from '../../hooks/useToast'
import { DEMO_ACCOUNTS } from '../../data/personas'
import { PATHS } from '../../routes/paths'
import seoaProfileImage from '../../assets/my/profile.png'
import jihunProfileImage from '../../assets/my/account-jihun.png'
import guestProfileIcon from '../../assets/icons/profile-topbar-guest.svg'
import AccountSwitchSheet from '../My/components/AccountSwitchSheet'
import PopularCaseSection from './components/PopularCaseSection'
import RecentCasesSection from './components/RecentCasesSection'
import AdBanner from './components/AdBanner'
import BalanceGameSection from './components/BalanceGameSection'
import CloseCallSection from './components/CloseCallSection'
import AfterStorySection from './components/AfterStorySection'
import AiRecommendSection from './components/AiRecommendSection'
import CompactAiRecommendCard from './components/CompactAiRecommendCard'
import HomeSearchPanel from './components/HomeSearchPanel'
import './Home.css'
import './components/BalanceGame.css'

/**
 * 홈 화면. Figma `개발 > 홈/로그인 전 > 홈 수정 후` (노드 `1402:7104`) 기준.
 *
 * 시스템 상태바는 이 화면이 그리지 않는다. 기기 목업의 StatusBar가 담당한다. (PROJECT_SPEC.md §0-4)
 * 앱 헤더는 공통 TopBar, 하단 내비게이션은 MainLayout이 담당한다. (PROJECT_SPEC.md §7-2, §7-4)
 *
 * 페이지는 섹션을 조립하는 역할만 한다. 각 섹션은 `components/`에 있다. (PROJECT_SPEC.md §7-2)
 *
 * 로그인 전후에 같은 홈을 재사용하고, 로그인 후에만 AI 맞춤 추천 섹션을 추가한다.
 */
function HomePage() {
  const { sessionStatus, personaId, currentUser, signIn, signOut } = useSession()
  const { requireLogin } = useLoginGate()
  const { showToast } = useToast()
  const isAuthenticated = sessionStatus === 'authenticated'
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAccountSwitchOpen, setIsAccountSwitchOpen] = useState(false)

  return (
    <main className="home-screen">
      <TopBar
        isSearchOpen={isSearchOpen}
        onSearch={() => setIsSearchOpen((isOpen) => !isOpen)}
        accountAvatar={currentUser?.isCustomProfile ? currentUser.anonymousAvatarUrl : isAuthenticated ? (personaId === 'A' ? seoaProfileImage : jihunProfileImage) : guestProfileIcon}
        accountPersona={currentUser?.isCustomProfile ? 'custom' : isAuthenticated ? personaId : undefined}
        isAccountSwitchOpen={isAccountSwitchOpen}
        onAccountSwitch={() => {
          setIsSearchOpen(false)
          if (isAuthenticated) {
            setIsAccountSwitchOpen(true)
            return
          }
          requireLogin('my', PATHS.my)
        }}
      />
      {isSearchOpen && <HomeSearchPanel onClose={() => setIsSearchOpen(false)} />}
      <PopularCaseSection />
      {isAuthenticated && <RecentCasesSection />}
      <AdBanner />
      {!isAuthenticated && <CompactAiRecommendCard />}
      {isAuthenticated && <AiRecommendSection />}
      <BalanceGameSection key={personaId} />
      <CloseCallSection />
      <AfterStorySection />
      {isAccountSwitchOpen && currentUser && (
        <AccountSwitchSheet
          key={personaId}
          currentPersona={personaId}
          currentUser={currentUser}
          onClose={() => setIsAccountSwitchOpen(false)}
          onConfirm={(nextPersona) => {
            signIn(nextPersona)
            setIsAccountSwitchOpen(false)
            showToast(`${DEMO_ACCOUNTS[nextPersona].name} 프로필로 전환되었습니다`)
          }}
          onLogout={() => {
            signOut()
            setIsAccountSwitchOpen(false)
            showToast('로그아웃 되었습니다')
          }}
        />
      )}
    </main>
  )
}

export default HomePage

import TopBar from '../../components/common/TopBar'
import RankingHeroSection from './components/RankingHeroSection'
import CaseFeedSection from './components/CaseFeedSection'
import './Plaza.css'

/**
 * 배심원 광장.
 * Figma `개발 > 광장 > JuryPlazaScreen` (1301:9105) 기준.
 *
 * 페이지는 섹션을 조립하는 역할만 한다. (PROJECT_SPEC.md §7-2)
 * 상단 헤더는 공통 TopBar, 하단바는 MainLayout이 담당한다.
 */
function PlazaPage() {
  return (
    <main className="plaza-screen">
      <TopBar hasUnreadNotification />
      <RankingHeroSection />
      <CaseFeedSection />
    </main>
  )
}

export default PlazaPage

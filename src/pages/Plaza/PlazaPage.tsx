import RankingHeroSection from './components/RankingHeroSection'
import CaseFeedSection from './components/CaseFeedSection'
import TopBar from '../../components/common/TopBar'
import './Plaza.css'

/**
 * 배심원 광장.
 * 사용자 지정 Figma 광장 (2101:21799) 기준.
 *
 * 페이지는 섹션을 조립하는 역할만 한다. (PROJECT_SPEC.md §7-2)
 * 시스템 상태바는 DeviceFrame, 하단바는 MainLayout이 담당한다.
 */
function PlazaPage() {
  return (
    <main className="plaza-screen">
      <TopBar logo="왈가왈BOT LOGO" />
      <RankingHeroSection />
      <CaseFeedSection />
    </main>
  )
}

export default PlazaPage

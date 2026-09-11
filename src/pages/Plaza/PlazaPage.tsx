import RankingHeroSection from './components/RankingHeroSection'
import CaseFeedSection from './components/CaseFeedSection'
import './Plaza.css'

/**
 * 배심원 광장.
 * Figma `개발 > 광장 > JuryPlazaScreen` (1301:9105) 기준.
 *
 * 페이지는 섹션을 조립하는 역할만 한다. (PROJECT_SPEC.md §7-2)
 * 상단 헤더는 MY·왈가왈후와 같은 가운데 제목 형태다. 하단바는 MainLayout이 담당한다.
 */
function PlazaPage() {
  return (
    <main className="plaza-screen">
      <header className="plaza-header">
        <span aria-hidden="true" />
        <h1>배심원 광장</h1>
        <span aria-hidden="true" />
      </header>
      <RankingHeroSection />
      <CaseFeedSection />
    </main>
  )
}

export default PlazaPage

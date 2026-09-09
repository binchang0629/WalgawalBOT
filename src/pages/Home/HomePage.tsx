import { Link } from 'react-router-dom'
import TopBar from '../../components/common/TopBar'
import useSession from '../../hooks/useSession'
import { PATHS } from '../../routes/paths'
import PopularCaseSection from './components/PopularCaseSection'
import RecentCasesSection from './components/RecentCasesSection'
import AdBanner from './components/AdBanner'
import BalanceGameSection from './components/BalanceGameSection'
import CloseCallSection from './components/CloseCallSection'
import AfterStorySection from './components/AfterStorySection'
import AiRecommendSection from './components/AiRecommendSection'
import './Home.css'

/**
 * 홈 화면. Figma `개발 > 홈/로그인 전 > 홈 수정 후` (노드 `1402:7104`) 기준.
 *
 * 시스템 상태바는 이 화면이 그리지 않는다. 기기 목업의 StatusBar가 담당한다. (PROJECT_SPEC.md §0-4)
 * 앱 헤더는 공통 TopBar, 하단 내비게이션은 MainLayout이 담당한다. (PROJECT_SPEC.md §7-2, §7-4)
 *
 * 페이지는 섹션을 조립하는 역할만 한다. 각 섹션은 `components/`에 있다. (PROJECT_SPEC.md §7-2)
 *
 * 로그인 후 홈(`개발 > 홈/로그인 후`, 노드 `1473:8830`)은 아직 옮기지 않았다.
 */
function HomePage() {
  const { sessionStatus, personaId } = useSession()
  const isAuthenticated = sessionStatus === 'authenticated'

  /*
    시연 흐름상 가입 진입점은 사건 상세의 `로그인하고 나도 투표하기`다.
    홈 시안에도 같은 문구의 버튼이 막상막하 아래에 있어 여기에 연결해 둔다.
    사건 상세를 구현하면 그쪽이 본래 자리다. (PROJECT_SPEC.md §7-3, §9-3)
  */
  const cta = isAuthenticated ? (
    <button
      type="button"
      className="vote-cta"
      disabled
      title="사건 상세 화면을 만들면 연결됩니다"
    >
      나도 투표하기
    </button>
  ) : (
    <Link className="vote-cta" to={`${PATHS.signup}?from=${PATHS.home}`}>
      로그인 하고 나도 투표하기
    </Link>
  )

  return (
    <main className="home-screen">
      <TopBar />
      <PopularCaseSection />
      <RecentCasesSection />
      <AdBanner />
      <BalanceGameSection key={personaId} />
      <CloseCallSection cta={cta} />
      <AfterStorySection />
      <AiRecommendSection />
    </main>
  )
}

export default HomePage

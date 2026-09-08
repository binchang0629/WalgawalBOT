import { Outlet } from 'react-router-dom'
import BottomNavigation from '../components/common/BottomNavigation'
import './MainLayout.css'

/**
 * 홈·배심원 광장·왈가왈후~·MY 등 주요 메뉴 화면의 공통 틀.
 *
 * 스크롤은 window가 아니라 이 안의 콘텐츠 컨테이너가 담당한다.
 * 기기 목업 안에서도 같은 방식으로 동작한다. (PROJECT_SPEC.md §7-7)
 *
 * TODO: 앱 헤더(TopBar)는 아직 홈 화면 안에 있다.
 *       두 번째 화면의 컨펌 시안에서 같은 구조가 확인되면 공통 컴포넌트로 올린다. (PROJECT_SPEC.md §7-2)
 */
function MainLayout() {
  return (
    <div className="main-layout">
      <div className="main-layout__scroll">
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  )
}

export default MainLayout

import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { PATHS } from '../routes/paths'
import CaseSubmitHeader from '../pages/Submit/components/CaseSubmitHeader'
import './AuthLayout.css'

/**
 * 온보딩·가입·로그인 계열 화면의 틀.
 * 하단 내비게이션은 표시하지 않는다. (PROJECT_SPEC.md §7-4)
 *
 * 레이아웃과 접근 권한은 별개다. 이 레이아웃을 쓴다고 모두 비로그인 전용은 아니다.
 *
 * 상단 헤더는 사건 접수 흐름과 같은 공통 헤더를 재사용한다.
 * 페이지마다 그리지 않고 여기서 한 번만 그리며 제목만 경로로 고른다.
 */

/** 경로별 헤더 제목. 시안의 문구를 그대로 쓴다. */
const TITLES: Record<string, string> = {
  [PATHS.login]: '로그인',
  [PATHS.signup]: '회원 가입',
}

function AuthLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  // 외부에서 바로 들어온 경우 history를 믿지 않고 정해진 경로로 보낸다. (PROJECT_SPEC.md §7-7)
  const handleBack = () => {
    const hasInternalHistory = location.key !== 'default'
    if (hasInternalHistory) {
      navigate(-1)
      return
    }
    navigate(PATHS.home, { replace: true })
  }

  const title = TITLES[location.pathname]

  return (
    <div className="auth-layout">
      <CaseSubmitHeader onBack={handleBack} title={title} showTempSave={false} />
      <div className="auth-layout__scroll">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout

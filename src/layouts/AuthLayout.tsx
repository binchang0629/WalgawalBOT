import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { PATHS } from '../routes/paths'
import './AuthLayout.css'

/**
 * 온보딩·가입·로그인 계열 화면의 틀.
 * 하단 내비게이션은 표시하지 않는다. (PROJECT_SPEC.md §7-4)
 *
 * 레이아웃과 접근 권한은 별개다. 이 레이아웃을 쓴다고 모두 비로그인 전용은 아니다.
 */
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

  return (
    <div className="auth-layout">
      <header className="auth-layout__bar">
        <button type="button" className="auth-layout__back" onClick={handleBack} aria-label="뒤로 가기">
          ‹
        </button>
      </header>
      <div className="auth-layout__scroll">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout

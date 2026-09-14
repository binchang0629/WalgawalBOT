import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { PATHS } from '../routes/paths'
import backIcon from '../assets/icons/tail-arrow-left.svg'
import './AuthLayout.css'

/**
 * 온보딩·가입·로그인 계열 화면의 틀.
 * 하단 내비게이션은 표시하지 않는다. (PROJECT_SPEC.md §7-4)
 *
 * 레이아웃과 접근 권한은 별개다. 이 레이아웃을 쓴다고 모두 비로그인 전용은 아니다.
 *
 * 상단 헤더는 로그인(`2187:24325`)과 회원가입(`2264:10514`) 시안이 같은 모양이라
 * 페이지마다 그리지 않고 여기서 한 번만 그린다. 제목만 경로로 고른다.
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
      <header className="auth-layout__bar">
        <button type="button" className="auth-layout__back" onClick={handleBack} aria-label="뒤로 가기">
          <img src={backIcon} alt="" aria-hidden="true" />
        </button>
        <h1 className="auth-layout__title">{title}</h1>
        {/* 시안은 좌우 대칭을 위해 오른쪽에도 같은 크기의 빈 자리를 둔다. */}
        <span className="auth-layout__spacer" aria-hidden="true" />
      </header>
      <div className="auth-layout__scroll">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout

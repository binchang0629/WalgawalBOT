import { useLocation, useNavigate } from 'react-router-dom'

/**
 * 단일 화면 흐름(사건 접수·챗봇 등) 공통 뒤로가기.
 * 앱 내부에서 이동해 온 기록이 있으면 그대로 돌아가고,
 * 외부에서 이 화면으로 바로 들어온 경우에는 fallbackPath로 보낸다. (PROJECT_SPEC.md §7-7)
 *
 * 사건 접수 전용 훅이었으나 챗봇 화면도 같은 규칙이 필요해 공통 훅으로 올렸다.
 * (PROJECT_SPEC.md §7-2 — 두 번째 사용이 확인되면 공통 폴더로)
 */
function useWizardBack(fallbackPath: string) {
  const navigate = useNavigate()
  const location = useLocation()

  return () => {
    const hasInternalHistory = location.key !== 'default'
    if (hasInternalHistory) {
      navigate(-1)
      return
    }
    navigate(fallbackPath, { replace: true })
  }
}

export default useWizardBack

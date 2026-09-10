import { useLocation, useNavigate } from 'react-router-dom'

/**
 * 사건 접수 단계 공통 뒤로가기.
 * 앱 내부에서 이동해 온 기록이 있으면 그대로 돌아가고,
 * 외부에서 이 단계로 바로 들어온 경우에는 fallbackPath로 보낸다. (PROJECT_SPEC.md §7-7)
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

import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LoginPopUp from '../components/common/LoginPopUp'
import useSession from '../hooks/useSession'
import { PATHS, toAuthEntry } from '../routes/paths'
import { LoginGateContext } from './loginGateContext'
import type { LoginGateReason } from './loginGateContext'

/**
 * 로그인이 필요한 동작을 가로채 안내 팝업을 띄운다.
 *
 * 팝업은 화면마다 따로 만들지 않고 여기 한 곳에서만 띄운다.
 * 사건 접수는 DetailLayout, MY와 홈은 MainLayout이라 공통 조상이 여기뿐이기도 하다.
 *
 * 라우트로 막지 않고 클릭 시점에 가로채는 이유는 시안 때문이다.
 * 네 시안 모두 "보던 화면이 그대로 어두워지고 그 위에 팝업"이다.
 * 라우트를 바꾸면 보던 화면이 사라져 시안과 달라진다.
 */

interface GateState {
  reason: LoginGateReason
  destination: string
}

function LoginGateProvider({ children }: { children: ReactNode }) {
  const { personaId, sessionStatus } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const [gate, setGate] = useState<GateState | null>(null)

  const requireLogin = useCallback(
    (reason: LoginGateReason, destination?: string) => {
      if (sessionStatus === 'authenticated') return true

      /*
       * 복귀 경로는 검증된 앱 내부 경로만 받는다. (PROJECT_SPEC.md §7-5)
       * `//`로 시작하면 브라우저가 외부 주소로 읽으므로 막는다.
       */
      const requested = destination ?? location.pathname
      const safe =
        requested.startsWith('/') && !requested.startsWith('//') ? requested : PATHS.home

      setGate({ reason, destination: safe })
      return false
    },
    [location.pathname, sessionStatus],
  )

  const handleClose = useCallback(() => setGate(null), [])

  const handleLogin = useCallback(() => {
    if (!gate) return
    setGate(null)
    // 두 시나리오 모두 로그인 화면을 보되, 화면 안의 활성 진입점은 퍼소나별로 다르다.
    // 완료 뒤에는 `from`에 담아 둔 원래 위치로 돌아간다.
    navigate(toAuthEntry(personaId, gate.destination))
  }, [gate, navigate, personaId])

  const value = useMemo(() => ({ requireLogin }), [requireLogin])

  return (
    <LoginGateContext.Provider value={value}>
      {children}
      {gate && (
        <LoginPopUp reason={gate.reason} onLogin={handleLogin} onClose={handleClose} />
      )}
    </LoginGateContext.Provider>
  )
}

export default LoginGateProvider

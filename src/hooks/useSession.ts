import { useContext } from 'react'
import { SessionContext } from '../state/sessionContext'
import type { SessionValue } from '../state/sessionContext'

/** 시연 세션 상태를 읽는다. SessionProvider 밖에서 호출하면 오류를 던진다. */
function useSession(): SessionValue {
  const value = useContext(SessionContext)

  if (!value) {
    throw new Error('useSession은 SessionProvider 안에서만 쓸 수 있습니다.')
  }

  return value
}

export default useSession

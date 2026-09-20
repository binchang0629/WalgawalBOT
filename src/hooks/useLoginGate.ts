import { useContext } from 'react'
import { LoginGateContext } from '../state/loginGateContext'
import type { LoginGateValue } from '../state/loginGateContext'

/** 로그인 유도 팝업을 띄운다. LoginGateProvider 밖에서 호출하면 오류를 던진다. */
function useLoginGate(): LoginGateValue {
  const value = useContext(LoginGateContext)

  if (!value) {
    throw new Error('useLoginGate은 LoginGateProvider 안에서만 쓸 수 있습니다.')
  }

  return value
}

export default useLoginGate

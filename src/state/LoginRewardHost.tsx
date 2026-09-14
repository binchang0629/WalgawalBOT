import { useSyncExternalStore } from 'react'
import LoginRewardPopUp from '../components/common/LoginRewardPopUp'
import useSession from '../hooks/useSession'
import { DEMO_ACCOUNTS } from '../data/personas'
import { clearLoginReward, getLoginReward, subscribeLoginReward } from './loginRewardSignal'

/**
 * 로그인·회원가입을 마치면 보던 화면 위에 출석 포인트 팝업을 띄운다.
 *
 * 팝업은 어느 화면 위에나 떠야 해서 화면마다 두지 않고 여기 한 곳에서만 띄운다.
 * 신호는 `loginRewardSignal`이 들고 있다.
 */

/** 회원가입과 서아 로그인 모두 같은 신규 계정 시연 흐름으로 0PT에서 시작한다. */
const REWARD_START_POINT = 0

function LoginRewardHost() {
  const { currentUser, syncRewardPointTotal } = useSession()
  const kind = useSyncExternalStore(subscribeLoginReward, getLoginReward, getLoginReward)

  if (!kind) return null

  // 시안은 성을 뗀 이름으로 부른다. 로그인 상태가 아직 없으면 시안 기본값을 쓴다.
  const fullName = currentUser?.name ?? DEMO_ACCOUNTS.A.name
  const name = fullName.length > 2 ? fullName.slice(1) : fullName

  return (
    <LoginRewardPopUp
      kind={kind}
      name={name}
      startPoint={REWARD_START_POINT}
      onSettled={syncRewardPointTotal}
      onClose={clearLoginReward}
    />
  )
}

export default LoginRewardHost

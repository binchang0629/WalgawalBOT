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

/**
 * 로그인은 시안(`loginRewardPopUp01`)의 50PT에서 시작한다.
 * 회원가입은 이제 막 가입한 참이라 0PT다.
 * 시안의 50PT는 `DEMO_ACCOUNTS`의 보유 포인트와 다르다. → PROJECT_SPEC.md §9
 */
const LOGIN_START_POINT = 50

function LoginRewardHost() {
  const { currentUser } = useSession()
  const kind = useSyncExternalStore(subscribeLoginReward, getLoginReward, getLoginReward)

  if (!kind) return null

  // 시안은 성을 뗀 이름으로 부른다. 로그인 상태가 아직 없으면 시안 기본값을 쓴다.
  const fullName = currentUser?.name ?? DEMO_ACCOUNTS.A.name
  const name = fullName.length > 2 ? fullName.slice(1) : fullName

  return (
    <LoginRewardPopUp
      kind={kind}
      name={name}
      startPoint={kind === 'signup' ? 0 : LOGIN_START_POINT}
      onClose={clearLoginReward}
    />
  )
}

export default LoginRewardHost

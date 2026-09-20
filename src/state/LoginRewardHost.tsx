import { useState, useSyncExternalStore } from 'react'
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

function RewardForCurrentLogin({ kind }: { kind: 'login' | 'signup' }) {
  const { currentUser, activityStats, syncRewardPointTotal } = useSession()
  // 팝업 중간에 합계가 갱신돼도 시작 숫자가 다시 바뀌지 않게 첫 값을 고정한다.
  const [startPoint] = useState(() => kind === 'signup' ? 0 : activityStats.points)
  const fullName = currentUser?.name ?? DEMO_ACCOUNTS.A.name
  const name = currentUser?.isCustomProfile ? fullName : fullName.length > 2 ? fullName.slice(1) : fullName

  return (
    <LoginRewardPopUp
      kind={kind}
      name={name}
      startPoint={startPoint}
      onSettled={syncRewardPointTotal}
      onClose={clearLoginReward}
    />
  )
}

function LoginRewardHost() {
  const kind = useSyncExternalStore(subscribeLoginReward, getLoginReward, getLoginReward)

  if (!kind) return null
  return <RewardForCurrentLogin kind={kind} />
}

export default LoginRewardHost

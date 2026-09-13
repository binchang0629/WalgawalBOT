import type { LoginRewardKind } from '../components/common/LoginRewardPopUp'

/**
 * 출석 포인트 팝업을 띄워 달라는 신호.
 *
 * 로그인·가입을 마친 화면과 팝업을 띄우는 곳이 서로 멀리 떨어져 있어서,
 * 라우터 상태로 넘기는 대신 아주 작은 신호함을 하나 둔다.
 *
 * 라우터 상태(`navigate(..., { state })`)를 쓰지 않는 이유가 둘 있다.
 *   - 뒤로가기로 그 기록에 돌아오면 팝업이 다시 뜬다.
 *   - 한 번 띄운 뒤 상태를 지우려면 effect 안에서 이동을 다시 불러야 한다.
 *
 * `useSyncExternalStore`로 읽으므로 effect 안에서 setState를 부르지 않아도 된다.
 */

type Listener = () => void

let pending: LoginRewardKind | null = null
const listeners = new Set<Listener>()

function emit() {
  for (const listener of listeners) listener()
}

/** 로그인·가입을 마쳤을 때 부른다. 다음 화면에서 팝업이 뜬다. */
export function requestLoginReward(kind: LoginRewardKind) {
  pending = kind
  emit()
}

/** 팝업을 닫았을 때 부른다. */
export function clearLoginReward() {
  pending = null
  emit()
}

export function subscribeLoginReward(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getLoginReward() {
  return pending
}

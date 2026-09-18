import { DEMO } from '../config/app'

/**
 * 시연 상태 비우기.
 *
 * 저장된 값은 전부 `DEMO.storagePrefix`로 시작한다. 여기서는 그중 어디까지 지울지만 정한다.
 * 비우는 정도가 둘이다.
 *
 *   · `resetDemoComments()` — 앱이 뜰 때마다. 이번에 직접 쓴 댓글만 지운다.
 *   · `resetDemoSession()`  — 바깥 `시연 초기화` 버튼. 로그인·활동 기록까지 전부 지운다.
 *
 * 서버가 없어서 모든 값이 이 브라우저 안에만 있다. 다른 사람이 자기 기기로 들어와 보는 것은
 * 애초에 서로 영향을 주지 않는다. 여기서 다루는 건 `같은 브라우저를 여러 명이 쓸 때`다.
 */

/** 이 조각이 들어간 키가 직접 쓴 댓글이다. */
const COMMENT_KEY_MARKS = [':thread-comments:', ':my-comments']

function clearKeys(store: Storage, matches: (key: string) => boolean) {
  const doomed: string[] = []
  for (let index = 0; index < store.length; index += 1) {
    const key = store.key(index)
    if (!key || !key.startsWith(DEMO.storagePrefix)) continue
    if (matches(key)) doomed.push(key)
  }
  // 순회하면서 지우면 인덱스가 밀려 건너뛰는 키가 생긴다. 다 모은 다음 지운다.
  doomed.forEach((key) => store.removeItem(key))
}

/*
 * 두 저장소를 모두 훑는다.
 * 지금 댓글은 sessionStorage에 있지만 배심 참여 기록은 localStorage에 있고,
 * 예전에 댓글을 localStorage에 넣던 때가 있어 그 시절 값이 남은 브라우저도 있다.
 */
function clearBothStores(matches: (key: string) => boolean) {
  try {
    clearKeys(window.sessionStorage, matches)
    clearKeys(window.localStorage, matches)
  } catch {
    // 저장소를 못 쓰는 경우. 남아 있을 값도 없다.
  }
}

/**
 * 앱이 뜰 때 한 번 돈다(`main.tsx`). 새로고침하거나 링크를 새로 열 때만 비워진다는 뜻이고,
 * 화면을 오가는 동안에는 돌지 않아서 방금 단 댓글은 그대로 남는다.
 *
 * 발표 때마다 앞사람이 남긴 댓글이 쌓여 있으면 안 되지만, 한 번 시연하는 동안에는
 * 방금 쓴 글이 사라지지 않아야 한다. 그 사이를 맞춘 것이다.
 *
 * 로그인 상태와 배심 참여 기록은 두고 간다. 그것까지 지우면 새로고침할 때마다
 * 로그인부터 다시 해야 한다. 미리 심어 둔 지훈의 댓글은 코드에 있어서 지울 대상이 아니다.
 */
export function resetDemoComments() {
  clearBothStores((key) => COMMENT_KEY_MARKS.some((mark) => key.includes(mark)))
}

/**
 * 다음 사람에게 넘기기 전에 완전히 처음으로 돌린다.
 *
 * 로그인·배심 참여·접수·후일담 게시까지 이 시연이 만든 값을 전부 지운다.
 * 기기 바깥의 `시연 초기화` 버튼만 부른다 — 시연 도중 실수로 새로고침해도
 * 여기까지 날아가지는 않게 하려고 자동 실행과 분리해 두었다.
 */
export function resetDemoSession() {
  clearBothStores(() => true)
}

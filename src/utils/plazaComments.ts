import { DEMO } from '../config/app'
import type { PersonaId } from '../types'

/**
 * 화면에서 직접 단 댓글의 보관소.
 *
 * 원래 광장 사건에만 있던 기능이라 이름이 `plazaComments`다.
 * 그런데 후일담과 사건 결과 화면에서 단 댓글은 저장되지 않아, 화면을 나갔다 오면
 * 방금 쓴 댓글이 사라졌다. MY > 내가 쓴 댓글에는 남아 있어서 둘이 어긋났다.
 * 그래서 댓글 목록이 있는 모든 화면이 이 유틸을 함께 쓴다. (파일 이름은 나중에 옮긴다)
 *
 * sessionStorage에 둔다. 화면을 오가는 동안에는 남고, 탭을 닫으면 사라진다.
 * 앱이 뜰 때 `demoReset`이 한 번 더 비우므로 새로고침해도 처음 상태로 돌아간다.
 * 발표 때마다 앞사람이 남긴 댓글이 쌓여 있으면 안 되기 때문이다.
 *
 * 계정(퍼소나)마다 키를 나눈다. 서아로 단 댓글이 지훈 화면에 뜨면 안 된다.
 * MY 기록(`myComments`)과 같은 규칙이라 저장 위치가 한자리에 모인다.
 *
 * 댓글 모양이 화면마다 조금씩 달라서(ThreadComment · CaseResultComment · JihoonSimilarComment)
 * 타입은 쓰는 쪽에서 정한다.
 *
 * 서버가 없으므로 이 브라우저 안에서만 유지된다. 실제로 저장된 것처럼 보이게 하지 않는다.
 * (PROJECT_SPEC.md — mock 데이터를 실제 응답처럼 표시하지 않는다)
 */

/** `threadId`는 댓글 목록 하나를 가리킨다. 사건은 사건 id, 후일담은 후일담 id다. */
const storageKey = (personaId: PersonaId, threadId: string) =>
  `${DEMO.storagePrefix}:${personaId}:thread-comments:${threadId}:v1`

export function readThreadComments<T>(personaId: PersonaId, threadId: string): T[] {
  try {
    const value = window.sessionStorage.getItem(storageKey(personaId, threadId))
    const parsed: unknown = value ? JSON.parse(value) : []
    return Array.isArray(parsed) ? parsed as T[] : []
  } catch {
    // 저장소를 못 쓰거나 값이 깨진 경우. 직접 단 댓글이 없는 것으로 본다.
    return []
  }
}

export function saveThreadComments<T>(personaId: PersonaId, threadId: string, comments: T[]) {
  try {
    window.sessionStorage.setItem(storageKey(personaId, threadId), JSON.stringify(comments))
  } catch {
    // 저장에 실패해도 화면에 달린 댓글은 그대로 보인다.
  }
}

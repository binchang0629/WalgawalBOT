import { DEMO } from '../config/app'
import type { PersonaId } from '../types'

/**
 * 미리 심어 둔 댓글에 대한 수정·삭제 기록.
 *
 * 지훈은 기존 사용자라 예전에 남긴 댓글을 갖고 있는데, 그 댓글은 코드(`jihoonComments.ts`)에
 * 들어 있어서 화면에서 고칠 대상이 없었다. 자기가 쓴 글인데 수정도 삭제도 안 되는 셈이다.
 *
 * 그래서 원본은 그대로 두고, `무엇을 어떻게 바꿨는지`만 따로 적어 둔다.
 * 화면에 그릴 때 이 기록을 덮어씌운다.
 *
 * 직접 쓴 댓글도 같은 방식으로 다룬다. 두 갈래로 나누면 화면마다 분기가 생겨서
 * 어떤 댓글은 되고 어떤 건 안 되는 상태가 만들어진다.
 *
 * 저장 위치는 댓글 본문(`plazaComments`)·MY 기록(`myComments`)과 같은 sessionStorage다.
 * 새로고침하면 `demoReset`이 함께 비워서 시연이 처음 상태로 돌아간다.
 */

export interface CommentEdit {
  /** 고쳐 쓴 본문. 삭제한 경우에는 없다. */
  body?: string
  /** 고친 시각. 화면의 `수정됨` 표시가 이 값에서 나온다. */
  editedAtMs?: number
  deleted?: boolean
}

/** 지훈의 예전 댓글 id는 이 꼬리를 단다. (`jihoonComments.ts`의 `jihoonCommentId`) */
const JIHOON_COMMENT_SUFFIX = '-jihoon-comment'

/** 이번에 직접 쓴 댓글 id는 이 머리를 단다. */
const OWN_COMMENT_PREFIX = 'new-comment-'

/**
 * 지금 계정이 고치거나 지울 수 있는 댓글인지.
 *
 * 이번에 직접 쓴 것과, 지훈으로 들어왔을 때의 지훈 예전 댓글이 해당한다.
 * 다른 배심원의 댓글에는 수정·삭제 메뉴 자체를 띄우지 않는다.
 */
export function isOwnComment(personaId: PersonaId, commentId: string): boolean {
  if (commentId.startsWith(OWN_COMMENT_PREFIX)) return true
  return personaId === 'B' && commentId.endsWith(JIHOON_COMMENT_SUFFIX)
}

const storageKey = (personaId: PersonaId) => `${DEMO.storagePrefix}:${personaId}:comment-edits:v1`

export function readCommentEdits(personaId: PersonaId): Record<string, CommentEdit> {
  try {
    const raw = window.sessionStorage.getItem(storageKey(personaId))
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
    return parsed as Record<string, CommentEdit>
  } catch {
    // 저장소를 못 쓰거나 값이 깨진 경우. 고친 적 없는 것으로 본다.
    return {}
  }
}

function writeCommentEdits(personaId: PersonaId, edits: Record<string, CommentEdit>) {
  try {
    window.sessionStorage.setItem(storageKey(personaId), JSON.stringify(edits))
  } catch {
    // 저장에 실패해도 화면에는 방금 고친 내용이 그대로 보인다.
  }
}

/** 본문을 고쳐 쓴다. */
export function editComment(personaId: PersonaId, commentId: string, body: string) {
  const next = readCommentEdits(personaId)
  next[commentId] = { ...next[commentId], body, editedAtMs: Date.now(), deleted: false }
  writeCommentEdits(personaId, next)
}

/** 지운다. 원본은 코드에 남아 있으므로 `지웠다`는 사실만 적어 둔다. */
export function deleteComment(personaId: PersonaId, commentId: string) {
  const next = readCommentEdits(personaId)
  next[commentId] = { ...next[commentId], deleted: true }
  writeCommentEdits(personaId, next)
}

/** 화면에 그릴 목록의 최소 모양. 사건·후일담마다 댓글 타입이 조금씩 달라 공통 부분만 묶는다. */
interface EditableComment {
  id: string
  body: string
  editedAtMs?: number
}

/**
 * 목록에 수정·삭제를 반영한다. 지운 댓글은 빠지고, 고친 댓글은 새 본문으로 바뀐다.
 *
 * 저장소를 여기서 읽지 않고 `edits`를 받는다. 화면은 이 값을 state로 들고 있어야
 * 고치는 순간 목록이 다시 그려진다. 저장소는 바뀌어도 리렌더를 일으키지 않는다.
 */
export function applyCommentEdits<T extends EditableComment>(
  edits: Record<string, CommentEdit>,
  comments: T[],
): T[] {
  // 고친 적이 한 번도 없으면 원본을 그대로 넘겨 쓸데없는 배열을 만들지 않는다.
  if (Object.keys(edits).length === 0) return comments

  const result: T[] = []
  for (const comment of comments) {
    const edit = edits[comment.id]
    if (!edit) {
      result.push(comment)
      continue
    }
    if (edit.deleted) continue
    result.push({
      ...comment,
      body: edit.body ?? comment.body,
      editedAtMs: edit.editedAtMs ?? comment.editedAtMs,
    })
  }
  return result
}

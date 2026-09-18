import { DEMO } from '../config/app'
import { JIHOON_COMMENT_REACTIONS, jihoonCommentRecords } from '../data/personas/jihoonComments'
import type { PersonaId } from '../types'

/**
 * MY > 내가 쓴 댓글 기록.
 *
 * 로그인한 계정으로 실제 댓글을 등록했을 때만 쌓인다. 안 쓰면 아무것도 저장되지 않고,
 * 마이페이지의 `내가 쓴 댓글` 항목도 비활성으로 남는다.
 *
 * 계정(퍼소나)마다 키를 나눠서, 서아로 쓴 댓글이 지훈 기록에 섞이지 않는다.
 * 배심 참여·접수 기록(`activity:v3`)과 같은 방식이라 저장 위치가 한 곳에 모인다.
 *
 * 서버가 없으므로 이 브라우저 안에서만 유지된다. 실제로 저장된 것처럼 보이게 하지 않는다.
 * (PROJECT_SPEC.md — mock 데이터를 실제 응답처럼 표시하지 않는다)
 */

export type CommentReactionValue = 'like' | 'dislike' | null

export interface MyCommentRecord {
  /** 댓글 화면에 실제로 그려진 댓글과 같은 id다. 두 화면의 공감/반대 수를 맞추는 열쇠다. */
  id: string
  /** 어느 사건·후일담에 단 댓글인지. */
  caseId: string
  caseTitle: string
  /** 눌렀을 때 돌아갈 화면. */
  href: string
  body: string
  /** 작성 시각. 화면에 보이는 `3분 전` 문구는 이 값에서 만든다. */
  createdAt: number
  /** 내가 내 댓글에 누른 공감/반대. 화면의 +1은 여기서 온다. */
  reaction: CommentReactionValue
  /**
   * 받은 공감/반대. 미리 심어 둔 지훈의 댓글만 값을 갖는다.
   * 직접 쓴 댓글은 값이 없고 id에서 계산한다(`seedCommentReactions`).
   */
  likes?: number
  dislikes?: number
}

/** 화면에 보여 줄 공감/반대 수. 심어 둔 값이 있으면 그걸 쓰고, 없으면 id에서 만든다. */
export function commentReactionCounts(record: MyCommentRecord): { likes: number; dislikes: number } {
  if (record.likes !== undefined && record.dislikes !== undefined) {
    return { likes: record.likes, dislikes: record.dislikes }
  }
  return seedCommentReactions(record.id)
}

/** 시연용이라 무한정 쌓을 필요가 없다. 최근 것부터 이만큼만 남긴다. */
const MAX_RECORDS = 30

const storageKey = (personaId: PersonaId) => `${DEMO.storagePrefix}:${personaId}:my-comments:v1`

/**
 * 다른 배심원이 눌러 준 공감/반대 수. 서버가 없어서 실제 집계가 아니라,
 * 댓글 id에서 계산해 낸 시연용 고정 수치다. 랜덤이 아니라 순수 함수라서
 * 댓글 화면에서 보든 MY에서 보든, 새로고침을 해도 같은 숫자가 나온다.
 * 값은 발표용으로 낮게 잡는다. (공감 1~2 / 반대 0~2)
 */
const SEED_PAIRS: ReadonlyArray<readonly [number, number]> = [
  [1, 0], [2, 0], [1, 1], [2, 1], [1, 2],
]

export function seedCommentReactions(id: string): { likes: number; dislikes: number } {
  let hash = 0
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) >>> 0
  }
  const [likes, dislikes] = SEED_PAIRS[hash % SEED_PAIRS.length]
  return { likes, dislikes }
}

function isRecord(value: unknown): value is MyCommentRecord {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Partial<MyCommentRecord>
  return typeof item.id === 'string'
    && typeof item.caseId === 'string'
    && typeof item.caseTitle === 'string'
    && typeof item.href === 'string'
    && typeof item.body === 'string'
    && typeof item.createdAt === 'number'
}

/** 이 브라우저에 실제로 저장된 것만. 미리 심어 둔 지훈 댓글은 포함하지 않는다. */
function readStoredComments(personaId: PersonaId): MyCommentRecord[] {
  try {
    const raw = window.localStorage.getItem(storageKey(personaId))
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(isRecord)
      // reaction을 넣기 전에 저장된 기록도 그대로 읽히게 기본값을 채운다.
      .map((record) => ({ ...record, reaction: record.reaction ?? null }))
  } catch {
    // 저장소를 못 쓰거나 값이 깨진 경우. 기록이 없는 것으로 본다.
    return []
  }
}

/**
 * 지훈(B)이 예전에 남긴 댓글.
 *
 * 지훈은 기존 사용자라 MY > 내가 쓴 댓글이 처음부터 비어 있으면 앞뒤가 맞지 않는다.
 * 실제 사건·후일담 댓글 목록에 같은 id로 들어가 있어서, 눌러서 가 보면 그 글이 정말 있다.
 * 서아(A)는 신규 가입이라 아무것도 심지 않는다 — 직접 쓴 것만 쌓인다.
 */
function seededComments(personaId: PersonaId): MyCommentRecord[] {
  if (personaId !== 'B') return []
  return jihoonCommentRecords().map((record) => ({
    ...record,
    reaction: null,
    ...JIHOON_COMMENT_REACTIONS,
  }))
}

/** 최신 댓글이 앞에 온다. 심어 둔 댓글과 직접 쓴 댓글을 한 목록으로 합친다. */
export function readMyComments(personaId: PersonaId): MyCommentRecord[] {
  const stored = readStoredComments(personaId)
  const storedIds = new Set(stored.map((record) => record.id))
  // 같은 id가 양쪽에 있으면 저장된 쪽이 최신이다 (공감/반대를 눌러 둔 경우).
  return [...stored, ...seededComments(personaId).filter((record) => !storedIds.has(record.id))]
    .sort((a, b) => b.createdAt - a.createdAt)
}

/** 댓글 화면이 마운트될 때 내가 눌러 둔 공감/반대를 복원하려고 쓴다. */
export function readMyCommentReactions(personaId: PersonaId): Record<string, CommentReactionValue> {
  const map: Record<string, CommentReactionValue> = {}
  for (const record of readMyComments(personaId)) {
    if (record.reaction) map[record.id] = record.reaction
  }
  return map
}

function writeMyComments(personaId: PersonaId, records: MyCommentRecord[]) {
  try {
    window.localStorage.setItem(storageKey(personaId), JSON.stringify(records.slice(0, MAX_RECORDS)))
  } catch {
    // 저장에 실패해도 댓글 자체는 화면에 그대로 달린다.
  }
}

/**
 * 댓글 화면에서 방금 만든 댓글의 id를 그대로 넘겨야 한다.
 * 그래야 MY에 보이는 공감/반대 수가 그 댓글의 수와 같아진다.
 */
export function addMyComment(
  personaId: PersonaId,
  record: Omit<MyCommentRecord, 'createdAt' | 'reaction'>,
): MyCommentRecord | null {
  const body = record.body.trim()
  if (!body) return null

  const created: MyCommentRecord = { ...record, body, createdAt: Date.now(), reaction: null }
  writeMyComments(personaId, [created, ...readStoredComments(personaId).filter((item) => item.id !== created.id)])
  return created
}

/** 내가 내 댓글에 공감/반대를 눌렀을 때. 한 번 더 누르면 null이 들어와 취소된다. */
export function setMyCommentReaction(personaId: PersonaId, id: string, reaction: CommentReactionValue) {
  // 심어 둔 지훈 댓글에 누른 경우에도 남도록, 합친 목록에서 찾아 저장소로 옮긴다.
  const target = readMyComments(personaId).find((record) => record.id === id)
  if (!target) return
  const rest = readStoredComments(personaId).filter((record) => record.id !== id)
  writeMyComments(personaId, [{ ...target, reaction }, ...rest])
}

/**
 * `3분 전`처럼 읽히게 만든다. 하루가 넘으면 날짜로 바꾼다.
 * 지금 화면은 공용 DemoRelativeTime을 쓰지만, 시연 시계를 타지 않는 표기가
 * 필요한 자리를 위해 남겨 둔다.
 */
export function formatCommentTime(createdAt: number, now = Date.now()) {
  const minutes = Math.floor((now - createdAt) / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`

  const date = new Date(createdAt)
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

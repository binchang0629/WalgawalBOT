import { DEMO } from '../config/app'
import { jihoonCommentRecords } from '../data/personas/jihoonComments'
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

export interface MyCommentRecord {
  id: string
  /** 어느 사건·후일담에 단 댓글인지. */
  caseId: string
  caseTitle: string
  /** 눌렀을 때 돌아갈 화면. */
  href: string
  body: string
  /** 작성 시각. 화면에 보이는 `3분 전` 문구는 이 값에서 만든다. */
  createdAt: number
}

/** 시연용이라 무한정 쌓을 필요가 없다. 최근 것부터 이만큼만 남긴다. */
const MAX_RECORDS = 30

const storageKey = (personaId: PersonaId) => `${DEMO.storagePrefix}:${personaId}:my-comments:v1`

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

/**
 * 이 계정이 시연 시작 시점에 이미 갖고 있는 댓글.
 *
 * 지훈은 기존 사용자라 처음부터 지난 댓글이 있어야 자연스럽다. 광장 사건에 미리 심어 둔
 * 12건을 여기서 함께 읽는다. (`data/personas/jihoonComments.ts`)
 * 서아는 신규 가입이라 비어 있고, 직접 댓글을 써야 목록이 생긴다.
 */
function seededRecords(personaId: PersonaId): MyCommentRecord[] {
  return personaId === 'B' ? jihoonCommentRecords() : []
}

function readStoredRecords(personaId: PersonaId): MyCommentRecord[] {
  try {
    const raw = window.localStorage.getItem(storageKey(personaId))
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isRecord)
  } catch {
    // 저장소를 못 쓰거나 값이 깨진 경우. 기록이 없는 것으로 본다.
    return []
  }
}

/** 최신 댓글이 앞에 온다. 미리 심어 둔 댓글과 직접 쓴 댓글을 시각 순으로 함께 늘어놓는다. */
export function readMyComments(personaId: PersonaId): MyCommentRecord[] {
  return [...readStoredRecords(personaId), ...seededRecords(personaId)]
    .sort((a, b) => b.createdAt - a.createdAt)
}

export function addMyComment(personaId: PersonaId, record: Omit<MyCommentRecord, 'id' | 'createdAt'>) {
  const body = record.body.trim()
  if (!body) return

  try {
    // 미리 심어 둔 댓글은 저장소에 다시 쓰지 않는다. 직접 쓴 것만 쌓는다.
    const next: MyCommentRecord[] = [
      { ...record, body, id: `my-comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: Date.now() },
      ...readStoredRecords(personaId),
    ].slice(0, MAX_RECORDS)
    window.localStorage.setItem(storageKey(personaId), JSON.stringify(next))
  } catch {
    // 저장에 실패해도 댓글 자체는 화면에 그대로 달린다.
  }
}

/** `3분 전`처럼 읽히게 만든다. 하루가 넘으면 날짜로 바꾼다. */
export function formatCommentTime(createdAt: number, now = Date.now()) {
  const minutes = Math.floor((now - createdAt) / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`

  const date = new Date(createdAt)
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

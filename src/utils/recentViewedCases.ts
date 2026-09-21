import { DEMO } from '../config/app'
import type { PersonaId } from '../types'

/**
 * 홈 `최근 본 사건`이 쓰는 열람 기록.
 *
 * 예전에는 시안용 사건 두 건이 코드에 박혀 있어 가입 직후 서아에게도 `최근 본 사건`이 이미 있었다.
 * 한 번도 연 적 없는 사건이 "최근 본"으로 뜨는 셈이라, 실제로 연 사건만 쌓이도록 바꿨다.
 * 아무것도 열지 않았으면 섹션 자체가 나오지 않는다.
 *
 * 계정(퍼소나)마다 키를 나눈다. 서아로 본 사건이 지훈 홈에 뜨면 안 된다.
 * 로그인 여부는 따지지 않는다 — 둘러보다 가입하는 서아의 흐름에서는
 * 가입 전에 본 사건도 본인이 본 것이 맞다. (PROJECT_SPEC.md §0-6 둘러보기 우선)
 *
 * 배심 참여 기록과 같은 localStorage에 둔다. 사건을 열고 홈으로 돌아오는 사이
 * 새로고침이 끼어도 남아야 하고, 투표 기록만 남고 열람 기록은 사라지면 둘이 어긋난다.
 * 키가 `DEMO.storagePrefix`로 시작하므로 바깥 `시연 초기화`가 함께 비운다.
 *
 * 서버가 없으므로 이 브라우저 안에서만 유지된다.
 */

export interface RecentCaseView {
  id: string
  /** 연 시각(ms). 화면에는 여기서 계산한 상대 시각을 보여준다. */
  at: number
}

/**
 * 화면에는 두 장만 나오지만 넉넉히 들고 있는다.
 * 앞쪽 사건이 카드로 만들 수 없는 경우(데이터가 없는 id)에 뒤엣것으로 채우기 위해서다.
 */
const MAX_STORED = 6

const storageKey = (personaId: PersonaId) => `${DEMO.storagePrefix}:${personaId}:recent-cases:v1`

function isView(value: unknown): value is RecentCaseView {
  if (typeof value !== 'object' || value === null) return false
  const { id, at } = value as Partial<RecentCaseView>
  return typeof id === 'string' && id.length > 0 && typeof at === 'number' && Number.isFinite(at)
}

/** 최근에 연 순서(앞이 가장 최근)로 돌려준다. */
export function readRecentCaseViews(personaId: PersonaId): RecentCaseView[] {
  try {
    const raw = window.localStorage.getItem(storageKey(personaId))
    const parsed: unknown = raw ? JSON.parse(raw) : []
    // 저장소 값은 사용자가 고칠 수 있다. 모양이 맞는 항목만 받는다.
    return Array.isArray(parsed) ? parsed.filter(isView) : []
  } catch {
    // 저장소를 못 쓰거나 값이 깨진 경우. 본 사건이 없는 것으로 본다.
    return []
  }
}

/** 같은 사건을 다시 열면 기록이 늘지 않고 시각만 최신으로 올라온다. */
export function recordCaseView(personaId: PersonaId, caseId: string) {
  try {
    const next = [
      { id: caseId, at: Date.now() },
      ...readRecentCaseViews(personaId).filter((view) => view.id !== caseId),
    ].slice(0, MAX_STORED)
    window.localStorage.setItem(storageKey(personaId), JSON.stringify(next))
  } catch {
    // 저장에 실패해도 사건을 보는 데는 지장이 없다. 홈에만 안 남는다.
  }
}

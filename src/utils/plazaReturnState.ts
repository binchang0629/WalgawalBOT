import type { PlazaViewKey } from '../data/common/plazaContent'
import type { CaseCategory } from '../types'

export type PlazaReturnState = {
  cardId: string
  category: CaseCategory | '전체'
  currentPage: number
  searchQuery: string
  scrollTop: number
  view: PlazaViewKey
}

const PLAZA_RETURN_STATE_KEY = 'walgawalbot:plaza-return-state'
const PLAZA_RETURN_READY_KEY = 'walgawalbot:plaza-return-ready'

/** 상세로 이동하기 직전의 광장 목록 상태와 기기 내부 스크롤 위치를 보관한다. */
export function savePlazaReturnState(state: PlazaReturnState) {
  window.sessionStorage.setItem(PLAZA_RETURN_STATE_KEY, JSON.stringify(state))
  window.sessionStorage.removeItem(PLAZA_RETURN_READY_KEY)
}

/** 상세 화면의 뒤로가기를 눌렀을 때만 다음 광장 진입에서 복원을 허용한다. */
export function markPlazaReturnReady() {
  if (window.sessionStorage.getItem(PLAZA_RETURN_STATE_KEY)) {
    window.sessionStorage.setItem(PLAZA_RETURN_READY_KEY, 'true')
  }
}

/** 렌더 중 여러 번 읽혀도 같은 상태를 돌려준다. */
export function readPlazaReturnState(): PlazaReturnState | null {
  if (window.sessionStorage.getItem(PLAZA_RETURN_READY_KEY) !== 'true') return null

  const serializedState = window.sessionStorage.getItem(PLAZA_RETURN_STATE_KEY)
  if (!serializedState) return null

  try {
    return JSON.parse(serializedState) as PlazaReturnState
  } catch {
    return null
  }
}

/** 화면이 복원 상태를 받은 뒤 지워 다음 광장 진입에는 남기지 않는다. */
export function clearPlazaReturnState() {
  window.sessionStorage.removeItem(PLAZA_RETURN_READY_KEY)
  window.sessionStorage.removeItem(PLAZA_RETURN_STATE_KEY)
}

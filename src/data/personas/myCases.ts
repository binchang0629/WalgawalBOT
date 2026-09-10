import type { PersonaId } from '../../types'

export type MyCaseFilter = 'all' | 'progress' | 'complete' | 'private'

export interface MyCase {
  id: string
  category: string
  titleLines: readonly string[]
  receivedAt: string
  visibility: string
  participation: string
  status: 'complete' | 'private'
  resultAvailable: boolean
}

/** 사용자 확인: 서아=조별 과제, 지훈=의뢰인 잔금. 실제 서버 데이터가 아닌 시연용 사건. */
export const MY_CASES: Record<PersonaId, MyCase> = {
  A: {
    id: 'CASE-FRIEND-01',
    category: '친구',
    titleLines: ['조별 과제에서 친구를 공개적으로 지적한', '제가 너무 예민했던 걸까요?'],
    receivedAt: '2026.09.02',
    visibility: 'AI 1심 · 배심원 2심',
    participation: '배심원 611명',
    status: 'complete',
    resultAvailable: true,
  },
  B: {
    id: 'CASE-COMPANY-01',
    category: '직장',
    titleLines: ['작업물을 사용하면서', '잔금 지급을 미루는 의뢰인'],
    receivedAt: '2026.09.02',
    visibility: 'AI 1심(나만 보기)',
    participation: '없음',
    status: 'private',
    // 목록 시안만 제공됨. 다른 사람의 결과 화면으로 연결하지 않는다.
    resultAvailable: false,
  },
}

export function getMyCaseFilters(caseInfo: MyCase) {
  return [
    { value: 'all', label: '전체 1', enabled: true },
    { value: 'progress', label: '진행중 0', enabled: false },
    { value: 'complete', label: caseInfo.status === 'complete' ? '투표 완료 1' : '투표 완료', enabled: caseInfo.status === 'complete' },
    { value: 'private', label: caseInfo.status === 'private' ? '비공개 1' : '비공개 0', enabled: caseInfo.status === 'private' },
  ] satisfies { value: MyCaseFilter; label: string; enabled: boolean }[]
}

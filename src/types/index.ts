/**
 * 화면 사이에서 공유하는 데이터 타입.
 * 화면 전용 타입은 해당 페이지 폴더에 둔다. (PROJECT_SPEC.md §7-9)
 */

/**
 * 사건 카드에 붙는 분류.
 * 광장 시안의 카테고리 칩(연인·친구·가족·직장·학업)과 IA 사례의 분류를 합친 값이다.
 */
export type CaseCategory = '친구' | '연인' | '가족' | '직장' | '학업' | '금전' | '이웃'

/** 사건 상세의 관점 선택. 승패가 아니라 이해의 방향이다. (PROJECT_SPEC.md §0-6) */
export type OpinionSide = 'writer' | 'other' | 'both'

/** 사건 진행 상태. */
export type CaseStatus = 'voting' | 'closed' | 'private'

export interface CaseSummary {
  id: string
  title: string
  /** '친구 · 금전'처럼 화면에 그대로 노출되는 태그 문자열 */
  tag: string
  category?: CaseCategory
  status?: CaseStatus
  commentCount?: number
  participantCount?: number
}

export interface PollResult {
  /** 왼쪽 선택지 라벨과 비율(%) */
  leftLabel: string
  leftPercent: number
  rightLabel: string
  rightPercent: number
  totalCount: number
}

export interface AfterStory {
  id: string
  caseId: string
  caseTitle: string
  body: string
  isNew?: boolean
}

/** 밸런스 게임 한 문항. */
export interface BalanceQuestion {
  id: string
  title: string
  imageUrl: string
  leftLabel: string
  rightLabel: string
}

/**
 * 시연 퍼소나.
 * A = 윤서아(신규 가입), B = 곽지훈(기존 사용자). C는 두지 않는다. (PROJECT_SPEC.md §0-5)
 */
export type PersonaId = 'A' | 'B'

export interface Persona {
  id: PersonaId
  name: string
  /** 신규 사용자인지 기존 사용자인지 — 시연 선택 도구에 그대로 노출된다. */
  kind: 'new' | 'existing'
  /** 서비스 이용 목적 */
  purpose: string
  /** 관심사. 아직 확정되지 않은 항목은 빈 배열로 둔다. */
  interests: string[]
  /** 시연할 핵심 행동 */
  keyActions: string[]
}

/** 배심원 광장의 명판관 랭킹 한 줄. */
export interface JurorRank {
  rank: 1 | 2 | 3
  nickname: string
  point: number
}

/** 광장 사건 목록 정렬 기준. URL 쿼리로 관리한다. (PROJECT_SPEC.md §7-7) */
export type PlazaSortKey = 'latest' | 'popular' | 'closed'

export type SessionStatus = 'restoring' | 'anonymous' | 'authenticated'

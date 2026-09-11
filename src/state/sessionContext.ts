import { createContext } from 'react'
import type { PersonaId, SessionStatus } from '../types'

/**
 * 퍼소나 선택과 로그인 여부는 다른 값이다. 같은 상태로 합치지 않는다. (PROJECT_SPEC.md §7-5)
 *
 * - personaId    : 어떤 시연 시나리오인지 (A 윤서아 / B 곽지훈)
 * - sessionStatus: 복원 중 / 비로그인 / 로그인
 * - currentUser  : 로그인한 데모 사용자 또는 null
 */
export interface SessionUser {
  personaId: PersonaId
  name: string
  email: string
  nickname: string
  anonymousAvatarUrl: string
}

export interface ActivityStats {
  submittedCases: number
  juryParticipations: number
  points: number
}

export interface SessionValue {
  personaId: PersonaId
  sessionStatus: SessionStatus
  currentUser: SessionUser | null
  /** 현재 계정의 데모 활동 집계. 실제 서버 기록이나 결제 포인트가 아니다. */
  activityStats: ActivityStats
  recordCaseSubmission: (submissionId: string) => void
  recordJuryVote: (caseId: string) => void
  /** 가입·로그인 완료. 해당 퍼소나의 데모 계정으로 로그인 상태가 된다. */
  signIn: (personaId: PersonaId) => void
  signOut: () => void
  /** 계정 전환. 발표에서 서아 → 지훈으로 넘어갈 때 쓴다. */
  switchPersona: (personaId: PersonaId) => void
}

export const SessionContext = createContext<SessionValue | null>(null)

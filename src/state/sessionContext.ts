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
  /** 직접 입력한 가입 정보로 표시하는 시연용 프로필. 별도 인증 계정은 아니다. */
  isCustomProfile: boolean
}

export interface SignupProfile {
  nickname: string
  email: string
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
  /**
   * 후일담을 게시한 사건의 id 목록. 아직 쓰지 않았으면 빈 배열이다.
   * `내가 쓴 후일담` 화면은 이 목록으로 보여줄 글이 있는지 판단한다.
   */
  publishedAfterStoryIds: string[]
  /** 후일담 게시 완료. 미리보기에서 `후일담 게시하기`를 누른 시점에 기록한다. */
  recordAfterStory: (storyId: string) => void
  /** 리워드 팝업의 최종 숫자와 MY의 포인트 합계를 같은 시점에 맞춘다. */
  syncRewardPointTotal: (totalPoints: number) => void
  /** 가입·로그인 완료. 직접 가입한 프로필은 서아 시나리오를 쓰되 활동 기록은 별도로 시작한다. */
  signIn: (personaId: PersonaId, signupProfile?: SignupProfile) => void
  signOut: () => void
  /**
   * 계정 전환. 발표에서 서아 → 지훈으로 넘어갈 때 쓴다.
   *
   * 기본은 그 퍼소나의 시연 시작 지점(서아 비로그인 / 지훈 로그인)이다.
   * `startSignedOut`을 주면 퍼소나와 상관없이 비로그인으로 시작한다.
   * 지훈의 로그인 화면부터 보여주는 시연에서 쓴다.
   */
  switchPersona: (personaId: PersonaId, options?: { startSignedOut?: boolean }) => void
}

export const SessionContext = createContext<SessionValue | null>(null)

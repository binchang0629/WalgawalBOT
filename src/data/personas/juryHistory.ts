import type { WeddingGiftVoteId } from '../common/caseDetailContent'

/** 지훈 계정의 시연용 기존 배심 참여 12건. 순서는 최근 참여한 사건부터다. */
export const JIHUN_JURY_HISTORY: readonly { caseId: string; voteId: WeddingGiftVoteId }[] = [
  { caseId: 'case-work-after-hours', voteId: 'writer' },
  { caseId: 'case-school-lab-data', voteId: 'both' },
  { caseId: 'case-family-moving', voteId: 'both' },
  { caseId: 'case-dating-travel-cost', voteId: 'neither' },
  { caseId: 'case-work-credit', voteId: 'writer' },
  { caseId: 'case-friend-loan', voteId: 'writer' },
  { caseId: 'case-family-care', voteId: 'writer' },
  { caseId: 'case-group-project-credit', voteId: 'both' },
  { caseId: 'case-school-ai-report', voteId: 'other' },
  { caseId: 'case-friend-trip-cancel', voteId: 'both' },
  { caseId: 'case-dating-anniversary', voteId: 'writer' },
  { caseId: 'case-secret-told', voteId: 'writer' },
]

export const JIHUN_JURY_CASE_IDS = JIHUN_JURY_HISTORY.map(({ caseId }) => caseId)
export const JIHUN_JURY_VOTES = Object.fromEntries(
  JIHUN_JURY_HISTORY.map(({ caseId, voteId }) => [caseId, voteId]),
) as Partial<Record<string, WeddingGiftVoteId>>

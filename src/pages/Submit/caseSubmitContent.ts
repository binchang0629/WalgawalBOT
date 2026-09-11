import type { CaseSummary } from './types'
import type { PersonaId } from '../../types'

/**
 * 지훈01~05는 실제 백엔드·AI 없이 하나의 예시 사연(디자이너 잔금 미지급 분쟁)을
 * 그대로 따라가는 시연 흐름이다. 사용자가 1단계에 어떤 내용을 적어도
 * 이 문서에 정리되는 예시 문구는 Figma 시안 그대로다 — 실제 생성형 AI 응답이 아니다. (PROJECT_SPEC.md §6)
 */

export const DEMO_SUMMARY: CaseSummary = {
  title: '작업물을 사용하면서\n잔금 지급을 미루는 의뢰인',
  facts:
    '총 320만 원의 디자인 작업을 맡아 계약금 100만 원을 받았어요. 최종 파일을 전달했지만 잔금 220만 원은 지급되지 않았고, 업체는 결과물을 사용 중이에요.',
  issues: '잔금 지급 조건 · 추가 수정 범위 · 원본 파일 제공 여부',
  help: '어떤 자료를 정리하고, 의뢰인에게 어떻게 답하면 좋을지 알고 싶어요.',
}

export const AI_OPINION = {
  eyebrow: '판멍이의 1심 판결',
  headline: '전달 기록과 계약 조건이\n주요 확인 포인트예요.',
  reasons: ['최종 파일 전달 여부와 결과물 사용 내역', '잔금 지급 약속과 추가 수정에 대한 합의'],
  disclaimer: '작성한 내용에 기반한 참고 의견이며,\n전문가의 판단을 대신하지 않아요.',
}

/** 서아 시안의 고정 예시. 입력 내용을 분석한 실제 AI 결과가 아니다. */
export const SEOA_CONTENT = '동아리 축제 준비 중, 한 팀원이 약속한 시간까지 홍보물을 올리지 않았고 연락도 없었어요.\n\n결국 제가 급하게 대신 만든 뒤 단체방에 “다음부터 중요한 일을 맡기기 어렵다”고 말했습니다.\n\n팀원은 노트북 고장으로 늦었다며, 사람들 앞에서 무책임한 사람처럼 만든 건 과했다고 했어요. 마감을 지적한 제가 너무 심했던 걸까요?'

/**
 * 지훈 사건 작성(1단계) `더미 텍스트 입력`에 채울 문구.
 * 확정 문구를 아직 받지 못해 우선 지훈 시나리오의 기존 사실관계(DEMO_SUMMARY.facts)를 그대로 쓴다.
 * 사용자가 확정 문구를 주면 이 값만 교체하면 된다.
 */
export const JIHOON_CONTENT = DEMO_SUMMARY.facts

export const DUMMY_CASE_CONTENT: Record<PersonaId, string> = {
  A: SEOA_CONTENT,
  B: JIHOON_CONTENT,
}

export const SUBMIT_SCENARIOS = {
  A: {
    totalSteps: 3,
    allowedVisibility: 'community',
    summary: {
      title: '마감이 늦어진 팀원에게\n단체방에서 제 생각을 전했어요',
      facts: '동아리 축제 준비 중, 팀원이 약속한 시간까지 홍보물을 올리지 않아 서아가 대신 작업했습니다. 서아는 단체방에서 “다음부터 중요한 일을 맡기기 어렵다”고 말했습니다.',
      issues: '마감 지연의 책임 · 공개적인 지적의 적절성 · 사전 연락 여부',
      help: '팀원의 잘못을 공개적으로 지적한 제 행동이 지나쳤는지 알고 싶어요.',
    },
    opinion: {
      ...AI_OPINION,
      headline: '팀원에게 마감 책임이 있지만\n단체방에서의 표현도 아쉬웠어요',
      reasons: ['팀원은 약속한 마감 시간을 지키지 않았어요.', '다만 공개적인 지적은 아쉬움이 있어요.'],
    },
  },
  B: { totalSteps: 4, allowedVisibility: 'private', summary: DEMO_SUMMARY, opinion: AI_OPINION },
} satisfies Record<PersonaId, {
  totalSteps: 3 | 4
  allowedVisibility: 'private' | 'community'
  summary: CaseSummary
  opinion: typeof AI_OPINION
}>

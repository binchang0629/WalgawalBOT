import type { Persona, PersonaId } from '../../types'
import seoaAnonymousAvatar from '../../assets/case/result/comment-avatar-2.png'
import jihunAnonymousAvatar from '../../assets/case/result/comment-avatar-3.png'

/**
 * 시연 퍼소나 정의.
 *
 * A = 윤서아(신규 가입), B = 곽지훈(기존 사용자). C는 두지 않는다.
 * 강사 기준 초안은 A·B·C 세 개를 전제하지만, "실제 기획을 따른다"는 단서에 따라 두 개로 운영한다.
 * (PROJECT_SPEC.md §0-5, §4)
 *
 * purpose는 기존 PRD의 목표 사용자 서술에서 가져왔다.
 * interests와 keyActions의 세부 항목은 아직 확정되지 않아 비워 둔다. (PROJECT_SPEC.md §9-1)
 */
export const PERSONAS: Record<PersonaId, Persona> = {
  A: {
    id: 'A',
    name: '윤서아',
    kind: 'new',
    purpose:
      '자신의 상황을 정리해 사건을 접수하고, 다른 사람의 다양한 관점과 이후 이야기를 참고한다.',
    interests: [],
    keyActions: [],
  },
  B: {
    id: 'B',
    name: '곽지훈',
    kind: 'existing',
    purpose:
      '민감한 사연을 공개하기보다 AI 1심, 챗봇, 유사 사례로 먼저 판단 근거를 모은다.',
    interests: [],
    keyActions: [],
  },
}

export const PERSONA_ORDER: PersonaId[] = ['A', 'B']

/**
 * 시연용 계정 정보.
 *
 * 실제 계정이 아니라 발표용 더미 값이다. 비밀번호는 어디에도 저장하지 않는다.
 * (PROJECT_SPEC.md §6 — "실제 비밀번호를 localStorage 등에 저장하지 않는다")
 *
 * 이메일은 Figma 마이페이지 섹션의 프로필 팝업 시안에 적힌 값을 그대로 썼다.
 * 해당 시안은 아직 확정 전이므로 값이 바뀌면 여기만 고친다. (PROJECT_SPEC.md §9-11)
 */
export interface DemoAccount {
  personaId: PersonaId
  name: string
  email: string
  nickname: string
  /** MY 시안에 표시된 데모 포인트. 실제 적립/차감 기능은 미연결. */
  points: number
  /** 공개 댓글용 캐릭터. 계정 전환/MY의 실제 인물 사진과 구분한다. */
  anonymousAvatarUrl: string
  /** 가입 폼에 흐리게 미리 채워 둘 비밀번호 표시용 문자열. 검증에만 쓰고 저장하지 않는다. */
  passwordPlaceholder: string
}

export const DEMO_ACCOUNTS: Record<PersonaId, DemoAccount> = {
  A: {
    personaId: 'A',
    name: '윤서아',
    email: 'seoa_daily@gmail.com',
    nickname: '익명의 왈가닥',
    points: 10,
    anonymousAvatarUrl: seoaAnonymousAvatar,
    passwordPlaceholder: 'seoa1234!',
  },
  B: {
    personaId: 'B',
    name: '곽지훈',
    email: 'kwak_freelancer@gmail.com',
    nickname: '익명의 왈랑이',
    points: 0,
    anonymousAvatarUrl: jihunAnonymousAvatar,
    passwordPlaceholder: 'jihun1234!',
  },
}

/**
 * 챗봇(판멍이) 대화 스크립트.
 *
 * 백엔드가 없어 mock으로 구현한다(PROJECT_SPEC.md §6). 실제 생성형 AI 응답이 아니라
 * 정해진 시나리오를 따라가는 규칙 기반 대화다. 화면(ChatbotPage)과 이 데이터를 분리해 두면
 * 나중에 실제 API로 바꿀 때 `src/services/chatbotService.ts`만 교체하면 된다.
 *
 * "내 사건에 대해 물어볼게요" 전체 흐름과 그 안의 문구·카드·버튼은
 * Figma `Chatbot / Conversation02`(node 1951:4051) 기준을 그대로 옮겼다.
 * 나머지 4개 진입 칩과, 시안에 없는 세부 분기(예: "메시지만 있어요")의 답변은
 * 시안이 다루지 않는 영역이라 이 프로젝트의 안전 원칙(PROJECT_SPEC.md §0-6)에 맞춰 새로 썼다.
 */

export interface ChatOption {
  id: string
  label: string
  /** 다음으로 이동할 스텝 id. STEP_MAP의 key와 짝을 이룬다. */
  next: string
}

export type BotBlock = { kind: 'p'; text: string } | { kind: 'list'; items: string[] }

export interface BotStep {
  id: string
  /** 아바타를 작게 그리는 이어지는 발화. Figma "Bot Message Container"(구분 있는 후속 메시지). */
  compact?: boolean
  blocks: BotBlock[]
  postedCase?: { label: string; lines: string[] }
  /** actions=고정폭 2버튼 가로 배치, chips=꽉 채운 세로 목록. 생략하면 chips. */
  optionsLayout?: 'actions' | 'chips'
  options?: ChatOption[]
  /** 이 스텝 다음에 사용자가 버튼 대신 글을 직접 입력하면 이동할 스텝. */
  freeTextNext?: string
}

function p(text: string): BotBlock {
  return { kind: 'p', text }
}

function list(items: string[]): BotBlock {
  return { kind: 'list', items }
}

/** 처음 화면(대화 시작 전)의 추천 질문 5종. Figma `Chatbot / Initial`(node 1951:4252) 기준. */
export const INITIAL_OPTIONS: ChatOption[] = [
  { id: 'how-to-use', label: '왈가왈봇 이용 방법이 궁금해요', next: 'howToUse' },
  { id: 'ask-my-case', label: '내 사건에 대해 물어볼게요', next: 'caseIntro' },
  { id: 'ai-result', label: 'AI 판정·배심원 결과가 궁금해요', next: 'aiResultInfo' },
  { id: 'need-expert', label: '전문가 도움이 필요한지 궁금해요', next: 'needExpertInfo' },
  { id: 'trouble', label: '이용 중 문제가 생겼어요', next: 'troubleInfo' },
]

/** "내 사건에 대해 물어볼게요"·"내 사건으로 확인할게요"는 세션의 최근 사건 보유 여부로 분기한다. */
export const CASE_ROUTED_OPTION_IDS = new Set(['ask-my-case', 'goCase'])

/** 첫 화면에서 지금 눌러볼 수 있는 유일한 칩. 나머지 4개는 비활성 상태로만 보여준다. */
export const ENABLED_INITIAL_OPTION_ID = 'ask-my-case'

/**
 * 대화 중 선택지 중에서 항상 비활성으로 보여주는 것들.
 * 데모에서 실제로 지원하지 않는 동작(다른 사건 선택)이라, 눌러서 "준비 중" 답을
 * 받게 하는 대신 처음 화면의 비활성 칩과 같은 방식(gray_400 텍스트)으로 막아 둔다.
 */
export const ALWAYS_DISABLED_OPTION_IDS = new Set([
  'pick-other',
  'respond-other',
  'similar-cases',
  'has-messages',
  'not-sure',
])

export const RESTART_STEP_ID = 'restart'

export const STEP_MAP: Record<string, BotStep> = {
  restart: {
    id: 'restart',
    blocks: [p('더 궁금한 점이 있으면 골라주세요.')],
    options: INITIAL_OPTIONS,
  },

  howToUse: {
    id: 'howToUse',
    blocks: [
      p('왈가왈봇은 크게 세 단계로 쓸 수 있어요.'),
      p('**① 사례 둘러보기** — 로그인 없이 홈과 배심원 광장에서 비슷한 사건을 먼저 살펴볼 수 있어요.'),
      p('**② 사건 접수와 AI 1심** — 내 사건을 접수하면 판멍이가 먼저 핵심 쟁점을 정리해드려요.'),
      p('**③ 배심원 2심** — 필요하다고 느끼면 사건을 공개해 여러 사람의 관점을 더 모을 수 있어요.'),
    ],
    options: [{ id: 'more', label: '다른 질문 할게요', next: RESTART_STEP_ID }],
  },

  aiResultInfo: {
    id: 'aiResultInfo',
    blocks: [
      p('AI 판정은 배심원 투표를 하기 전까지는 보여드리지 않아요.'),
      p('먼저 결과를 보면 **의견을 따라가는 편향**이 생길 수 있기 때문이에요.'),
      p(
        '투표를 마치면 **배심원 최다 의견**과 **AI 1심 판단**, 그리고 둘의 판단 확신도를 함께 확인할 수 있어요.',
      ),
    ],
    options: [{ id: 'more', label: '다른 질문 할게요', next: RESTART_STEP_ID }],
  },

  needExpertInfo: {
    id: 'needExpertInfo',
    blocks: [
      p('모든 사건에 전문가가 필요한 건 아니에요.'),
      p(
        '다만 **금전·법률처럼 되돌리기 어려운 문제**거나 **감정적으로 많이 힘든 상황**이라면 전문가 도움을 먼저 권해드려요.',
      ),
      p('접수한 사건이 있다면 그 내용을 바탕으로 더 구체적으로 안내해드릴게요.'),
    ],
    options: [
      { id: 'goCase', label: '내 사건으로 확인할게요', next: 'caseIntro' },
      { id: 'more', label: '다른 질문 할게요', next: RESTART_STEP_ID },
    ],
  },

  troubleInfo: {
    id: 'troubleInfo',
    blocks: [
      p('이용 중 불편한 점이 있었다면 먼저 사과드릴게요.'),
      p('지금은 시연용 데모라 **실제 신고·문의 접수는 연결되어 있지 않아요.**'),
      p('급한 문제라면 MY의 고객센터 안내를 확인해주세요. (준비 중)'),
    ],
    options: [{ id: 'more', label: '다른 질문 할게요', next: RESTART_STEP_ID }],
  },

  /** 최근에 접수한 사건이 없는 세션(윤서아 등)이 "내 사건" 관련 옵션을 골랐을 때. */
  caseIntroEmpty: {
    id: 'caseIntroEmpty',
    blocks: [
      p('아직 접수한 사건이 없어서 함께 볼 내용이 없어요.'),
      p('사건을 먼저 접수하면 그 내용을 바탕으로 답변해드릴 수 있어요.'),
    ],
    options: [
      { id: 'toSubmit', label: '사건 접수하러 갈게요', next: RESTART_STEP_ID },
      { id: 'more', label: '다른 질문 할게요', next: RESTART_STEP_ID },
    ],
  },

  /** Figma Conversation02 — 최근 접수한 사건 안내. */
  caseIntro: {
    id: 'caseIntro',
    blocks: [p('**최근 접수한 사건이 있어요**'), p('이 사건에 대해 질문할까요?')],
    postedCase: {
      label: '최근 작성한 사건',
      lines: ['작업물을 사용하면서', '잔금 지급을 미루는 의뢰인'],
    },
    optionsLayout: 'actions',
    options: [
      { id: 'use-case', label: '이 사건으로 질문할게요', next: 'caseFocused' },
      { id: 'pick-other', label: '다른 사건 선택할래요', next: 'caseOtherUnavailable' },
    ],
  },

  caseOtherUnavailable: {
    id: 'caseOtherUnavailable',
    blocks: [
      p('지금 데모에서는 최근에 접수한 사건 하나만 살펴볼 수 있어요.'),
      p('다른 사건을 고르는 기능은 준비 중이에요.'),
    ],
    options: [
      { id: 'use-case-anyway', label: '이 사건으로 볼게요', next: 'caseFocused' },
      { id: 'more', label: '다른 질문 할게요', next: RESTART_STEP_ID },
    ],
  },

  /** Figma Conversation02 — "좋아요. 이 사건 내용을 바탕으로 답변할게요." */
  caseFocused: {
    id: 'caseFocused',
    blocks: [p('**좋아요. 이 사건 내용을 바탕으로 답변할게요.**'), p('어떤 점이 가장 궁금한가요?')],
    optionsLayout: 'chips',
    options: [
      { id: 'need-expert-2', label: '전문가 도움이 필요할까?', next: 'expertCheck' },
      { id: 'respond-other', label: '상대에게 어떻게 대응할까?', next: 'respondAdvice' },
      { id: 'similar-cases', label: '비슷한 사건도 보고 싶어', next: 'similarCases' },
    ],
    freeTextNext: 'expertCheck',
  },

  respondAdvice: {
    id: 'respondAdvice',
    blocks: [
      p('상대방에게는 감정적인 표현보다 **사실과 요청을 분리해서** 전달하는 편이 좋아요.'),
      p('예를 들어 "언제까지 잔금을 받을 수 있을지 알려주세요"처럼 **기한을 정확히 묻는 방식**이 도움이 돼요.'),
    ],
    options: [{ id: 'more', label: '다른 질문 할게요', next: RESTART_STEP_ID }],
  },

  similarCases: {
    id: 'similarCases',
    blocks: [p('비슷한 사건은 배심원 광장에서 더 살펴볼 수 있어요.')],
    options: [
      { id: 'toPlaza', label: '배심원 광장으로 갈게요', next: RESTART_STEP_ID },
      { id: 'more', label: '다른 질문 할게요', next: RESTART_STEP_ID },
    ],
  },

  /** Figma Conversation02 — 전문가 도움 필요 여부 안내. */
  expertCheck: {
    id: 'expertCheck',
    blocks: [
      p('현재 사건은 작업을 완료했지만'),
      p('**잔금 220만 원이 지급되지 않았고,** **지급 예정일도 지난 상태**예요.'),
      p(''),
      p('계약 내용이나 지급 약속을 확인할 수 있는 자료가 있다면'),
      p('**전문가에게 검토받아볼 만한 상황**으로 보여요.'),
      p(''),
      p('다만 지금 정보만으로 **법적인 결과를 단정할 수는 없어요.**'),
      p(''),
      p('먼저 어떤 자료를 가지고 있는지 확인해볼까요?'),
    ],
    optionsLayout: 'chips',
    options: [
      { id: 'has-contract', label: '계약서가 있어요', next: 'gatherDocs' },
      { id: 'has-messages', label: '메시지만 있어요', next: 'messagesOnly' },
      { id: 'not-sure', label: '잘 모르겠어요', next: 'notSureDocs' },
    ],
    freeTextNext: 'gatherDocs',
  },

  messagesOnly: {
    id: 'messagesOnly',
    blocks: [
      p('메시지만 있어도 괜찮아요.'),
      p('**날짜와 잔금 약속이 드러나는 대화**라면 자료로 쓸 수 있어요. 스크린샷으로 모아두면 좋아요.'),
    ],
    options: [{ id: 'more', label: '다른 질문 할게요', next: RESTART_STEP_ID }],
  },

  notSureDocs: {
    id: 'notSureDocs',
    blocks: [
      p('괜찮아요, 지금 없어도 돼요.'),
      p('계약서, 입금 내역, 잔금 지급일이 적힌 대화 중 **가지고 있는 것부터** 먼저 정리해보세요.'),
    ],
    options: [{ id: 'more', label: '다른 질문 할게요', next: RESTART_STEP_ID }],
  },

  /** Figma Conversation02 — 자료 정리 안내(아바타가 작은 이어지는 발화). */
  gatherDocs: {
    id: 'gatherDocs',
    compact: true,
    blocks: [
      p('**그렇다면 상담 전에 아래 자료를 정리해두면 좋아요.**'),
      list([
        '계약서',
        '계약금·입금 내역',
        '작업물을 전달한 기록',
        '잔금 지급일이 적힌 대화',
        '작업물이 실제 사용되고 있다면 관련 자료',
      ]),
      p('지금 바로 **전문가를 찾아볼 수도 있고**,'),
      p('먼저 **상담 전에 필요한 내용을 더 정리할 수도 있어요.**'),
    ],
    freeTextNext: 'consultCheck',
  },

  /** Figma Conversation02 — 상담 필요 여부 안내. */
  consultCheck: {
    id: 'consultCheck',
    blocks: [
      p('현재 확인된 내용만으로'),
      p('**상담이 꼭 필요하다고 단정할 수는 없어요.**'),
      p(''),
      p('다만 잔금 지급이 지연되고 있고'),
      p('관련 자료도 남아 있기 때문에,'),
      p('자료를 정리한 뒤 **전문가 검토를 받을지 선택해볼 수 있는 단계**예요.'),
      p(''),
      p('원하면 지금 사건에 맞춰'),
      p('**상담할 때 물어볼 질문**도 정리해드릴게요.'),
    ],
    optionsLayout: 'chips',
    options: [
      { id: 'prep-questions', label: '질문 정리해줘', next: 'questionList' },
      { id: 'match-expert', label: '전문가 매칭해줘', next: 'expertMatchUnavailable' },
      { id: 'expert-ranking', label: '전문가 랭킹 보여줘', next: 'expertRankingUnavailable' },
    ],
  },

  questionList: {
    id: 'questionList',
    blocks: [
      p('상담 전에 이런 질문을 준비해두면 좋아요.'),
      list([
        '계약서에 잔금 지급일이 정확히 적혀 있나요?',
        '잔금 지급을 미루는 이유를 상대가 설명했나요?',
        '작업물이 실제로 사용되고 있다는 근거가 있나요?',
        '지금까지 받은 금액과 남은 잔금은 얼마인가요?',
      ]),
    ],
    options: [{ id: 'more', label: '다른 질문 할게요', next: RESTART_STEP_ID }],
  },

  expertMatchUnavailable: {
    id: 'expertMatchUnavailable',
    blocks: [
      p('전문가 매칭은 아직 이 데모에는 연결되어 있지 않아요.'),
      p('실제 서비스에서는 이 단계에서 **전문가 도움 화면**으로 안내할 예정이에요.'),
    ],
    options: [{ id: 'more', label: '다른 질문 할게요', next: RESTART_STEP_ID }],
  },

  expertRankingUnavailable: {
    id: 'expertRankingUnavailable',
    blocks: [
      p('전문가 랭킹 화면도 아직 준비 중이에요.'),
      p('지금은 배심원 광장의 명판관 랭킹만 확인할 수 있어요.'),
    ],
    options: [
      { id: 'toPlaza2', label: '배심원 광장으로 갈게요', next: RESTART_STEP_ID },
      { id: 'more', label: '다른 질문 할게요', next: RESTART_STEP_ID },
    ],
  },
}

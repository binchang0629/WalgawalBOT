import type { CaseSummary } from '../../types'

/**
 * 홈 화면 정적 데이터.
 *
 * 기준 시안: Figma `개발 > 홈/로그인 전 > 홈 수정 후` (노드 `1402:7104`)
 *
 * 서버가 없는 단계이므로 모두 예시 데이터다. (PROJECT_SPEC.md §1-5)
 * 사건 문구는 임의로 만들지 않고 시안과 IA에 있는 사례를 쓴다. (PROJECT_SPEC.md §0-7)
 * seed는 화면에서 직접 수정하지 않는다. (PROJECT_SPEC.md §7-8)
 */

/** 오늘의 사건 — 투표가 진행 중인 대표 사건 */
export const todayCase = {
  id: 'case-wedding-gift',
  /** 제목은 강조 구간이 나뉘어 있어 조각으로 둔다. 주황 강조는 `accent` */
  titleParts: [
    { text: '친구 ', accent: false },
    { text: '축의금', accent: true },
    { text: ' ', accent: false },
    { text: '10만원', accent: true },
  ] as const,
  titleSecondLine: '적당한가?',
  /** 카운트다운은 시안처럼 자리마다 한 칸씩 그린다. `:`은 구분자다. */
  countdown: ['0', '1', ':', '0', '1'] as const,
  countdownLabel: '투표 마감까지',
  participantCount: 1245,
  ctaLabel: '투표하러 가기',
  contextTip: {
    lead: '10년 지기 친구의 결혼식',
    leadTail: '이긴 하지만',
    highlight: '최근 연락이 뜸했다면',
    tail: ' 10만원은 적당한 금액일까요?',
  },
  aiKeyPoint: {
    badge: '판별이가 짚은 핵심',
    first: '관계의 깊이',
    second: '최근 교류',
    connector: '와 ',
    tail: '가',
    secondLine: '축의금 판단의 핵심이에요.',
  },
} as const

/** 최근 본 사건 — 시안의 메모지 카드 2장 */
export interface RecentCase extends CaseSummary {
  /** 카드 본문 한 줄 요약. 넘치면 말줄임 */
  summary: string
  /** 화면에 그대로 노출되는 상대 시각 */
  viewedAt: string
  tone: 'blue' | 'yellow'
}

export const recentCases: RecentCase[] = [
  {
    id: 'case-always-paying',
    tag: '친구 · 모임',
    title: '친구 모임에서 항상\n저만 계산해요',
    summary: '제가 먼저 결제하면 나중에 보내준다고 하지만, 매번 입금을 요청하기도 지쳐요.',
    viewedAt: '어제',
    tone: 'blue',
  },
  {
    id: 'case-laundry-noise',
    tag: '생활 · 이웃',
    title: '이웃의 늦은밤 세탁기 소음, 참아야 할까요?',
    summary: '거의 매일 자정이 넘은 시간에 세탁기와 건조기를 돌려 잠들기 어려워요.',
    viewedAt: '2일 전',
    tone: 'yellow',
  },
]

/** 광고 배너 — 실제 광고가 아니라 시안에 있는 자리 표시 */
export const adBanner = {
  lead: '둘이서 나누는 행복,',
  title: '도라에몽쉘',
  label: 'AD',
} as const

/** 밸런스 게임. 추가 3문항은 사용자 요청으로 작성한 데모 카피다.
 * 주제 참고: https://www.nocutnews.co.kr/news/5788798
 */
export const balanceQuestions = [
  { id: 'balance-perilla', order: 'A.', title: '깻잎 논쟁, 당신의 선택은?',
    scenario: '내 애인이 이성 친구의 붙은 깻잎을 떼어 준다면?',
    leftLabel: '상관 없음', rightLabel: '절대 안됨', guide: '깻잎을 좌우로 밀어 선택!' },
  { id: 'balance-shrimp', order: 'B.', title: '새우 논쟁, 당신의 선택은?',
    scenario: '내 애인이 이성 친구의 새우 껍질을 까 준다면?',
    leftLabel: '상관 없음', rightLabel: '절대 안됨', guide: '질문을 밀거나 버튼으로 선택!' },
  { id: 'balance-zipper', order: 'C.', title: '패딩 지퍼, 어디까지 괜찮아?',
    scenario: '내 애인이 이성 친구의 끼인 패딩 지퍼를 풀어 준다면?',
    leftLabel: '상관 없음', rightLabel: '절대 안됨', guide: '질문을 밀거나 버튼으로 선택!' },
  { id: 'balance-bluetooth', order: 'D.', title: '차 안의 음악, 당신의 선택은?',
    scenario: '내 애인 차에 이성 친구의 휴대폰이 자동 연결된다면?',
    leftLabel: '상관 없음', rightLabel: '신경 쓰임', guide: '질문을 밀거나 버튼으로 선택!' },
] as const

/** 막상막하 — 표가 팽팽한 대표 사건 */
export const closeCallCase = {
  id: 'case-dog-bite',
  titleLines: ['반려견 개물림 사고,', '견주 구속 합당한가?'],
  leftLabel: '구속 합당',
  leftPercent: 52,
  rightLabel: '구속 과도',
  rightPercent: 48,
  /** 시안에 그대로 적힌 문구. 두 비율의 차이를 사람이 읽을 수 있게 옮긴 것 */
  gapText: '단 4% 차이',
} as const

/** 막상막하 아래의 바꿔보기 카드 */
export const closeCallMiniCase = {
  id: 'case-secondhand-fraud',
  tag: '치열한 공방 중',
  changeLabel: '바꿔보기',
  title: '중고거래 사기, 플랫폼의 책임은 어디까지인가?',
  leftLabel: '플랫폼 책임 O',
  leftPercent: 58,
  rightLabel: '플랫폼 책임 X',
  rightPercent: 42,
} as const

/** 왈가왈후~ (이어진 이야기) — 편지 카드 */
export const featuredAfterStory = {
  id: 'afterstory-idea-credit',
  isNew: true,
  quoteLines: ['조언대로 이메일 증거 제출 후', '공동 기여를 인정받았어요'],
  caseTitleLines: ['제 아이디어를 가로챈', '직속 사수와의 면담'],
  envelopeCta: '사건 상세보기 +',
} as const

/**
 * 왈가왈후~ 가로 스크롤 인용 카드.
 *
 * 시안에는 카드가 3장 있으나 같은 내용이 반복되는 자리 표시다.
 * IA에 실제 후일담이 적힌 사건은 두 건뿐이라 두 장만 둔다.
 * 세 번째 카드의 사건이 정해지면 여기에 추가한다. → PROJECT_SPEC.md §9-21
 */
export const afterStoryQuotes = [
  {
    id: 'afterstory-friend-loan',
    bodyLines: ['직접 대화해보니 오해였고,', '친구도 미안하다고 했어요.', '서로 더 이해하게 됐습니다.'],
    caseTitleLines: ['친구에게 300만원', '빌려주고 6개월째 미변제'],
  },
  {
    id: 'afterstory-idea-credit-card',
    bodyLines: ['조언대로 이메일 증거를', '제출한 뒤 공동 기여를', '인정받았습니다.'],
    caseTitleLines: ['제 아이디어를 가로챈', '직속 사수와의 면담'],
  },
]

/** AI 맞춤 추천 */
export const aiRecommendation = {
  title: '내 고민과 닮은 사건이 있을까?',
  lead: '관심사에 맞는 사건을',
  highlight: 'AI챗봇 판멍이가 추천',
  tail: '해드려요.',
} as const

/** 섹션 제목 — 시안의 `SectionTitle` 인스턴스 값 */
export const homeSectionTitles = {
  today: { title: '오늘의 사건' },
  recent: { title: '최근 본 사건', action: '더보기 +' },
  balance: { title: '밸런스 게임' },
  closeCall: { title: '막상막하', description: '한 표로 달라질 수 있는, 팽팽한 사건', action: '자세히 보기' },
  afterStory: { title: '왈가왈후~', description: '판정 이후, 이렇게 달라졌어요.', action: '더보기' },
  aiRecommend: { title: 'AI 맞춤 추천', description: '자주 참여했던 기록을 반영했어요.' },
} as const

import type { BalanceQuestion, CaseSummary, PollResult } from '../../types'
import perillaTable from '../../assets/home/perilla-table.png'

/**
 * 홈 화면 정적 데이터.
 *
 * 서버가 없는 단계이므로 모두 예시 데이터다. (PROJECT_SPEC.md §1-5)
 * 사건 문구는 임의로 만들지 않고 IA에 있는 사례를 쓴다. (PROJECT_SPEC.md §0-7)
 * seed는 화면에서 직접 수정하지 않는다. (PROJECT_SPEC.md §7-8)
 */

/** 오늘 사건 — 투표가 진행 중인 대표 사건 */
export const todayCase = {
  id: 'case-wedding-gift',
  title: '친구 축의금 10만원, 적당한가?',
  deadline: '01 : 01',
  participantCount: 1245,
  contextTip: {
    lead: '10년 지기 친구의 결혼식이긴 하지만',
    highlight: '최근 연락이 뜸했다면',
    tail: '10만원은 적당할까요?',
  },
  aiKeyPoint: {
    first: '관계의 깊이',
    second: '최근 교류',
    tail: '축의금 판단의 핵심이에요.',
  },
} as const

/** 최근 본 사건 */
export const recentCases: (CaseSummary & { tone: 'blue' | 'yellow' })[] = [
  {
    id: 'case-always-paying',
    tag: '친구 · 금전',
    title: '친구 모임에서 항상\n계산은 제가 해요',
    commentCount: 24,
    tone: 'blue',
  },
  {
    id: 'case-laundry-noise',
    tag: '연인 · 약속',
    title: '이웃의 늦은 밤 세탁기\n소음, 참아야 할까요?',
    commentCount: 12,
    tone: 'yellow',
  },
]

/** 광고 배너 — 실제 광고가 아니라 시안에 있는 자리 표시 */
export const adBanner = {
  lead: '판멍이가 바꿔놓은',
  title: '소곤소곤 톡!',
  label: 'AD',
} as const

/** 밸런스 게임 */
export const balanceQuestion: BalanceQuestion = {
  id: 'balance-perilla',
  title: '깻잎 논쟁, 당신의 선택은?',
  imageUrl: perillaTable,
  leftLabel: '상관 없음',
  rightLabel: '절대 안됨',
}

export const balancePager = { current: 1, total: 4 } as const

/** 막상막하 — 표가 팽팽한 사건 */
export const closeCallCase = {
  id: 'case-dog-bite',
  lead: '반려견 개물림 사고',
  title: '견주 구속 합당한가?',
  commentCount: 76,
  poll: {
    leftLabel: '구속 찬성',
    leftPercent: 52,
    rightLabel: '구속 반대',
    rightPercent: 48,
    totalCount: 4252,
  } satisfies PollResult,
}

export const closeCallMiniCase = {
  id: 'case-secondhand-fraud',
  tag: '공개 지적 긍정',
  title: '중고거래 사기, 플랫폼 책임은 어디까지인가?',
  commentCount: 42,
  leftPercent: 58,
  rightPercent: 42,
}

/** 왈가왈후~ (이어진 이야기) */
export const featuredAfterStory = {
  id: 'afterstory-idea-credit',
  isNew: true,
  quote: '조언대로 이메일 증거 제출 후\n공동 기여를 인정받았어요',
  caseTitle: '제 아이디어를 가로챈\n직속 사수와의 면담',
} as const

export const afterStoryQuotes = [
  {
    id: 'afterstory-friend-talk',
    body: '직접 대화해보니 오해였고, 친구도 미안하다고 했어요. 서로 더 이해하게 됐습니다.',
    caseTitle: '친구에게 300만원\n빌려주고 6개월째 미변제',
  },
  {
    id: 'afterstory-small-promise',
    body: '작은 약속부터 다시 지키며 관계를 회복하고 있어요.',
    caseTitle: '친구에게 300만원\n빌려주고 6개월째 미변제',
  },
]

/** AI 맞춤 추천 */
export const aiRecommendation = {
  title: '내 고민과 닮은 사건이 있을까?',
  lead: '관심사에 맞는 사건을',
  highlight: 'AI챗봇 판멍이가 추천',
  tail: '해드려요.',
} as const

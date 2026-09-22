import { weddingGiftCase } from './caseDetailContent'

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
  /**
   * 투표 마감까지 남은 시간 `hh:mm:ss`.
   *
   * 홈·사건 상세·사건 결과가 모두 같은 축의금 사건을 보여주므로 값을 하나로 쓴다.
   * 출처는 `caseDetailContent.ts`의 `weddingGiftCase.deadline` 한 곳이다.
   * 서버가 없어 화면을 연 시점부터 이만큼을 센다. (PROJECT_SPEC.md §1-5)
   */
  deadline: weddingGiftCase.deadline,
  countdownLabel: '투표 마감까지',
  participantCount: weddingGiftCase.participantCount,
  ctaLabel: '투표하러 가기',
  contextTip: {
    lead: '10년 지기 친구의 결혼식',
    leadTail: '이긴 하지만',
    highlight: '최근 연락이 뜸했다면',
    tail: ' 10만원은 적당한 금액일까요?',
  },
  aiKeyPoint: {
    badge: '판멍이가 짚은 핵심',
    first: '관계의 깊이',
    second: '최근 교류',
    connector: '와 ',
    tail: '가',
    secondLine: '축의금 판단의 핵심이에요.',
  },
} as const

/*
 * 최근 본 사건은 더 이상 여기에 고정 데이터로 두지 않는다.
 * 한 번도 연 적 없는 사건이 `최근 본`으로 뜨면 가입 직후 서아의 화면이 앞뒤가 맞지 않는다.
 * 실제 열람 기록은 `utils/recentViewedCases.ts`가 계정별로 들고 있고,
 * 카드에 쓸 사건 정보는 `getRecentCaseCard`(plazaCaseStories.ts)가 만든다.
 */

/** 광고 배너 — 실제 광고가 아니라 시안에 있는 자리 표시 */
export const adBanner = {
  lead: '둘이서 나누는 행복,',
  title: '도라에몽쉘',
  label: 'AD',
} as const

/** 밸런스 게임. 추가 3문항은 사용자 요청으로 작성한 데모 카피다.
 * 주제 참고: https://www.nocutnews.co.kr/news/5788798
 */
export const mintBalanceQuestion = {
    id: 'balance-mint', order: 'B.', title: '민트초코,당신의 선택은?',
    scenario: '스쿱에 담긴 민트초코 아이스크림',
    leftLabel: '좋다', rightLabel: '싫다', guide: '아이스크림을 밀거나 접시를 눌러 선택!',
    leftPercent: 57, rightPercent: 43,
} as const

export const balanceQuestions = [
    { id: 'balance-perilla', order: 'A.', title: '깻잎 논쟁, 당신의 선택은?',
      scenario: '내 애인이 이성 친구의 붙은 깻잎을 떼어 준다면?',
      leftLabel: '상관 없음', rightLabel: '절대 안됨', guide: '깻잎을 밀거나 접시를 눌러 선택!',
      leftPercent: 38, rightPercent: 62 },
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

/** 막상막하에서 위 게이지와 아래 사건 카드를 교환하는 두 사건. */
export const closeCallCases = [
  {
    id: 'case-dog-bite',
    titleLines: ['반려견 개물림 사고', '견주 구속 합당한가?'],
    leftLabel: '구속 합당',
    leftPercent: 48,
    rightLabel: '구속 과도',
    rightPercent: 52,
  },
  {
    id: 'case-secondhand-fraud',
    titleLines: ['중고거래 사기', '플랫폼의 책임은 어디까지인가?'],
    leftLabel: '플랫폼 책임 O',
    leftPercent: 53,
    rightLabel: '플랫폼 책임 X',
    rightPercent: 47,
  },
] as const

/** 왈가왈후~ (이어진 이야기) — 편지 카드 */
export const featuredAfterStory = {
  id: 'afterstory-idea-credit-card',
  isNew: true,
  quoteLines: ['조언대로 이메일 증거 제출 후', '공동 기여를 인정받았어요'],
  caseTitleLines: ['제 아이디어를 가로챈', '직속 사수와의 면담'],
  envelopeCta: '사건 상세보기 +',
} as const

/**
 * 왈가왈후~ 가로 스크롤 인용 카드.
 *
 * 대표 봉투의 직장 후일담과 겹치지 않게 각각 다른 사건의 후일담을 보여준다.
 */
export const afterStoryQuotes = [
  {
    id: 'afterstory-friend-loan',
    bodyLines: ['직접 대화해보니 오해였고,', '친구도 미안하다고 했어요.', '서로 더 이해하게 됐습니다.'],
    caseTitleLines: ['친구에게 300만원', '빌려주고 6개월째 미변제'],
  },
  {
    id: 'afterstory-secret-told',
    bodyLines: ['친구와 직접 이야기하고,', '제 이야기를 더 퍼뜨리지 않기로', '약속했어요.'],
    caseTitleLines: ['친구가 학교에서', '제 비밀을 말한 일'],
  },
]

/** AI 맞춤 추천 */
export const aiRecommendation = {
  title: '내 고민과 닮은 사건이 있을까?',
  lead: '로그인하고',
  highlight: '관심사에 맞는 사건을 찾아보세요!',
  tail: '',
} as const

/**
 * 추천 근거 문구. 계정이 아니라 **실제 활동 건수**로 고른다.
 *
 * 활동이 0건인데 `자주 참여했던 기록을 반영했어요`라고 하면 같은 계정의 MY(접수 0건·배심 참여 0건)와
 * 화면에서 바로 어긋난다. 가입 직후 서아가 그 경우다. 그래서 기록이 없을 때는 무엇을 근거로 골랐는지
 * 사실대로 말한다 — `getPopularVotingCases()`가 진행 사건을 조회수 높은 순으로 내놓고 앞의 세 건을 쓴다.
 * 근거로 삼은 조회수가 카드에 그대로 찍혀 있어, 말한 기준과 화면을 바로 대조할 수 있다.
 *
 * 투표나 접수가 한 건이라도 쌓이면 `history` 쪽으로 저절로 넘어간다.
 * 지훈은 배심 참여 기록을 갖고 시작하므로 처음부터 `history`다.
 */
export const recommendationCopy = {
  history: {
    description: '자주 참여했던 기록을 반영했어요.',
    lead: '님에게 맞는',
    tail: '을 찾았어요!',
  },
  coldStart: {
    description: '아직 활동 기록이 없어 조회수가 높은 진행 사건을 골랐어요.',
    lead: '님이 시작하기 좋은',
    topic: '지금 많이 보는 사건',
    tail: '이에요',
  },
} as const

/** 로그인 후 추천 시안 1473:8571. 개인화 API 대신 데모 계정별 관심 분야를 구분한다. */
export const personalizedRecommendation = {
  A: {
    displayName: '서아',
    topic: '관계·학업 갈등 사건',
    caseIds: [
      'case-friend-group-chat',
      'case-school-lab-data',
      'case-dating-phone',
      'case-invite-ex',
      'case-dating-travel-cost',
      'case-family-moving',
      'case-parents-interfere',
      'case-work-new-hire',
      'case-work-after-hours',
    ],
  },
  B: {
    displayName: '지훈',
    topic: '직장·관계 갈등 사건',
    caseIds: [
      'case-work-new-hire',
      'case-friend-group-chat',
      'case-parents-interfere',
      'case-dating-phone',
      'case-invite-ex',
    ],
  },
} as const

/** 섹션 제목 — 시안의 `SectionTitle` 인스턴스 값 */
export const homeSectionTitles = {
  today: { title: '오늘의 사건' },
  recent: { title: '최근 본 사건' },
  balance: { title: '밸런스 게임' },
  closeCall: { title: '막상막하', description: '한 표로 달라질 수 있는, 팽팽한 사건', action: '자세히 보기' },
  afterStory: { title: '왈가왈후~', description: '판정 이후, 이렇게 달라졌어요.', action: '더보기' },
  /* 부제는 활동 건수에 따라 달라져서 위 `recommendationCopy`가 갖고 있다. */
  aiRecommend: { title: 'AI 맞춤 추천' },
} as const

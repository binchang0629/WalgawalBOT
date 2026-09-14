import type { CaseCategory, CaseSummary, JurorRank, PlazaSortKey } from '../../types'

export const rankingTabs = [
  { key: 'juror', label: '명판관 배심원' },
  { key: 'voter', label: '최다 투표자' },
] as const

export const rankingPanel = {
  title: '이달의 명판관 배심원',
  description: '판결 포인트와 참여 기록을 반영했어요',
} as const

export const jurorRanking: JurorRank[] = [
  { rank: 1, nickname: '정의의 다람쥐', point: 1045 },
  { rank: 2, nickname: '판결 요정', point: 842 },
  { rank: 3, nickname: '증거수집가', point: 756 },
]

export const caseCategories: (CaseCategory | '전체')[] = [
  '전체',
  '연인',
  '친구',
  '가족',
  '직장',
  '학업',
]

export const plazaSortOptions: { key: PlazaSortKey; label: string }[] = [
  { key: 'latest', label: '최신순' },
  { key: 'popular', label: '인기순' },
]

type PlazaCase = CaseSummary & {
  category: CaseCategory
  summary: string
  viewCount: number
  isVerdictAligned: boolean
}

/** 필터에서 선택할 수 있는 다섯 카테고리는 각각 네 건의 정적 시연 사례를 제공한다. */
export const plazaCases: PlazaCase[] = [
  {
    id: 'case-company-874',
    category: '직장',
    tag: '직장',
    title: '수정 2회를 마쳤는데,\n의뢰인이 잔금 지급을 미루고 있어요.',
    summary: '카페 홍보영상을 제작한 뒤, 의뢰인이 추가 수정과 원본 파일 제공을 요구하며 잔금 지급을 미루고 있어요.',
    viewCount: 465,
    commentCount: 46,
    isVerdictAligned: true,
  },
  {
    id: 'case-secret-told',
    category: '친구',
    tag: '친구',
    title: '친한 친구가 학교에서 저의 비밀을\n다른 친구에게 말했어요.',
    summary: '믿고 털어놓은 비밀이 제 허락 없이 퍼졌어요.',
    viewCount: 245,
    commentCount: 22,
    isVerdictAligned: false,
  },
  {
    id: 'case-parents-interfere',
    category: '가족',
    tag: '가족',
    title: '부모님이 자꾸만 제 결정에 간섭하는데\n해결 방안을 알려주세요.',
    summary: '내 삶의 선택을 존중받고 싶은데 계속 설득하려 하세요.',
    viewCount: 125,
    commentCount: 14,
    isVerdictAligned: true,
  },
  {
    id: 'case-invite-ex',
    category: '연인',
    tag: '연인',
    title: '전 애인을 친구 모임에 초대해도\n괜찮을까요?',
    summary: '친구로 지내고 싶지만 현재 연인이 불편해해요.',
    viewCount: 144,
    commentCount: 47,
    isVerdictAligned: false,
  },
  {
    id: 'case-group-project-credit',
    category: '학업',
    tag: '학업',
    title: '조별 과제에서 친구들을 공개적으로\n지적한 사건',
    summary: '역할 분담이 지켜지지 않아 단체 대화방에서 문제를 꺼냈어요.',
    viewCount: 318,
    commentCount: 31,
    isVerdictAligned: false,
  },

  {
    id: 'case-dating-anniversary',
    category: '연인',
    tag: '연인',
    title: '기념일 약속을 깜빡한 연인에게\n서운함을 말해도 될까요?',
    summary: '바쁜 일정 때문이었다지만 매년 챙기던 날이라 마음이 남아요.',
    viewCount: 214,
    commentCount: 26,
    isVerdictAligned: true,
  },
  {
    id: 'case-dating-phone',
    category: '연인',
    tag: '연인',
    title: '연인이 제 휴대폰 알림을 보는 건\n관심일까요, 침해일까요?',
    summary: '비밀번호를 공유하지 않았는데도 메시지 내용을 묻곤 해요.',
    viewCount: 189,
    commentCount: 18,
    isVerdictAligned: false,
  },
  {
    id: 'case-dating-travel-cost',
    category: '연인',
    tag: '연인',
    title: '여행 경비를 더 낸 쪽이\n일정을 정해도 되는 걸까요?',
    summary: '예약금과 숙소 비용을 제가 더 냈지만 함께 가는 여행이에요.',
    viewCount: 166,
    commentCount: 20,
    isVerdictAligned: true,
  },

  {
    id: 'case-friend-loan',
    category: '친구',
    tag: '친구',
    title: '친구에게 빌려준 300만 원을\n6개월째 받지 못하고 있어요.',
    summary: '약속한 상환일이 지나도 사정이 어렵다는 말만 반복돼요.',
    viewCount: 352,
    commentCount: 39,
    isVerdictAligned: true,
  },
  {
    id: 'case-friend-trip-cancel',
    category: '친구',
    tag: '친구',
    title: '여행 직전 취소한 친구에게\n예약금을 모두 받아야 할까요?',
    summary: '친구가 개인 사정으로 못 가게 됐는데 환불 불가 숙소였어요.',
    viewCount: 231,
    commentCount: 28,
    isVerdictAligned: false,
  },
  {
    id: 'case-friend-group-chat',
    category: '친구',
    tag: '친구',
    title: '단체 대화방에서 제 이야기만 빼고\n약속을 잡는 친구들',
    summary: '우연히 알게 된 뒤 서운함을 말했지만 예민하다는 반응을 들었어요.',
    viewCount: 197,
    commentCount: 24,
    isVerdictAligned: false,
  },

  {
    id: 'case-family-care',
    category: '가족',
    tag: '가족',
    title: '부모님 병원 동행을 저에게만\n부탁하는 형제자매',
    summary: '각자 바쁘다는 이유로 돌봄 일정이 제게 몰리고 있어요.',
    viewCount: 286,
    commentCount: 35,
    isVerdictAligned: true,
  },
  {
    id: 'case-family-living-expenses',
    category: '가족',
    tag: '가족',
    title: '취업 후에도 생활비를 전부 내라는\n부모님 말씀',
    summary: '독립 준비를 하고 있지만 가족의 기대도 이해하려고 해요.',
    viewCount: 203,
    commentCount: 19,
    isVerdictAligned: false,
  },
  {
    id: 'case-family-moving',
    category: '가족',
    tag: '가족',
    title: '이사 날짜를 가족이 먼저 정한 뒤\n도움을 부탁했어요.',
    summary: '이미 잡아둔 개인 일정이 있는데 거절하면 서운해할까 걱정돼요.',
    viewCount: 164,
    commentCount: 16,
    isVerdictAligned: true,
  },

  {
    id: 'case-work-credit',
    category: '직장',
    tag: '직장',
    title: '상사가 제 아이디어를 자신의 공로로\n발표했어요.',
    summary: '회의에서 제가 준비한 기획안을 팀장 이름으로 소개했어요.',
    viewCount: 401,
    commentCount: 52,
    isVerdictAligned: false,
  },
  {
    id: 'case-work-after-hours',
    category: '직장',
    tag: '직장',
    title: '퇴근 뒤 단체 대화방 업무 지시에\n답하지 않았어요.',
    summary: '다음 날 확인하겠다고 했지만 팀 분위기가 좋지 않아졌어요.',
    viewCount: 257,
    commentCount: 33,
    isVerdictAligned: true,
  },
  {
    id: 'case-work-new-hire',
    category: '직장',
    tag: '직장',
    title: '신입 교육 자료를 혼자 만들라는\n요청이 부담스러워요.',
    summary: '공동 업무라고 들었지만 마감이 다가오며 제 몫으로 남았어요.',
    viewCount: 178,
    commentCount: 17,
    isVerdictAligned: false,
  },

  {
    id: 'case-school-attendance',
    category: '학업',
    tag: '학업',
    title: '친구 대신 출석을 불러달라는 부탁을\n거절했더니 멀어졌어요.',
    summary: '한 번만 도와달라는 말이었지만 규정을 어기는 일이라 망설였어요.',
    viewCount: 221,
    commentCount: 27,
    isVerdictAligned: true,
  },
  {
    id: 'case-school-ai-report',
    category: '학업',
    tag: '학업',
    title: 'AI를 활용한 과제라서 표절이 아니라는\n조원의 주장',
    summary: '보고서 작성 도구의 사용 범위를 두고 조원끼리 의견이 갈렸어요.',
    viewCount: 265,
    commentCount: 34,
    isVerdictAligned: false,
  },
  {
    id: 'case-school-lab-data',
    category: '학업',
    tag: '학업',
    title: '실험 결과가 나오지 않아 데이터를\n다시 정리하자고 했어요.',
    summary: '마감은 다가오고, 조원은 지금 자료로 제출하자고 해요.',
    viewCount: 149,
    commentCount: 15,
    isVerdictAligned: true,
  },
]

export const categoryDotColor: Record<CaseCategory, string> = {
  연인: 'var(--pink)',
  친구: 'var(--blue-700)',
  가족: 'var(--green)',
  직장: 'var(--orange-700)',
  금전: 'var(--orange-900)',
  이웃: 'var(--blue-500)',
  학업: 'var(--blue-600)',
}

export const casePagination = { current: 1, total: 5 } as const

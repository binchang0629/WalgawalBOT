import type { CaseCategory, CaseSummary, JurorRank, PlazaSortKey } from '../../types'

/**
 * 배심원 광장 정적 데이터.
 * 근거: Figma `개발 > 광장 > JuryPlazaScreen` (1301:9105)
 *
 * 서버가 없는 단계라 모두 예시 데이터다. (PROJECT_SPEC.md §1-5)
 * seed는 화면에서 직접 수정하지 않는다. (PROJECT_SPEC.md §7-8)
 */

/** 히어로 랭킹 탭. 지금은 표시만 하고 전환 동작은 시안에 없다. */
export const rankingTabs = [
  { key: 'juror', label: '명판관 배심원' },
  { key: 'voter', label: '최다 투표자' },
] as const

export const rankingPanel = {
  title: '이달의 명판관 배심원',
  description: '판결 포인트와 참여 기록을 반영했어요',
} as const

/** 시상대 순서대로가 아니라 순위대로 담는다. 배치는 화면이 정한다. */
export const jurorRanking: JurorRank[] = [
  { rank: 1, nickname: '정의의 다람쥐', point: 1045 },
  { rank: 2, nickname: '판결 요정', point: 842 },
  { rank: 3, nickname: '증거수집가', point: 756 },
]

/** 사건 목록 카테고리 칩. `전체`는 필터 해제를 뜻한다. */
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

/**
 * 사건 목록.
 *
 * `친구가 제 비밀을...`, `전 애인을 친구 모임에...`, `부모님이 제 결정에...`는
 * IA 사례 목록에 있는 사건이다. (PROJECT_SPEC.md §0-7)
 * 첫 번째 카드(프리랜서 잔금)는 시안에만 있는 사건이라 시안 문구를 그대로 옮겼다.
 */
export const plazaCases: (CaseSummary & {
  category: CaseCategory
  summary: string
  viewCount: number
  /** AI 판정과 배심원 다수 의견이 갈렸는지. 카드 오른쪽 태그로 쓴다. */
  isVerdictAligned: boolean
})[] = [
  {
    id: 'case-freelance-balance',
    category: '직장',
    tag: '직장',
    title: '잔금과 원본 파일을 문제 삼는 의뢰인 때문에\n골치가 아픕니다.',
    summary:
      '카페 홍보영상 제작을 180만원에 맡아 수정 2회 후 최종본을 전달했어요. 의뢰인은 영상을 SNS 광고에 게시했지만, 색감이 생각과 다르다며 추가 수정과 편집 원본 파일을 요구했습니다.',
    viewCount: 465,
    commentCount: 46,
    isVerdictAligned: true,
  },
  {
    id: 'case-secret-told',
    category: '친구',
    tag: '친구',
    title: '친한 친구가 학교에서 저의 비밀을 다른 친구에게 말했어요',
    summary: '믿고 털어놓은 비밀이 제 허락 없이 퍼졌어요',
    viewCount: 245,
    commentCount: 22,
    isVerdictAligned: false,
  },
  {
    id: 'case-parents-interfere',
    category: '가족',
    tag: '가족',
    title: '부모님이 자꾸만 제 결정에 간섭하는데 해결 방안을 알려주세요.',
    summary: '내 삶의 선택을 존중받고 싶은데 계속 설득하려 하세요.',
    viewCount: 125,
    commentCount: 14,
    isVerdictAligned: true,
  },
  {
    id: 'case-invite-ex',
    category: '연인',
    tag: '연애',
    title: '전 애인을 친구 모임에 초대해도\n괜찮을까요?',
    summary: '친구로 지내고 싶지만 현재 연인이 불편해해요',
    viewCount: 144,
    commentCount: 47,
    isVerdictAligned: false,
  },
]

/** 카테고리별 점 색상. 확정 스타일가이드 안의 색만 쓴다. (PROJECT_SPEC.md §1-3) */
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

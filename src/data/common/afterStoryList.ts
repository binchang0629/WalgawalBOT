export type AfterStoryTone = 'friend' | 'company'

export interface CommunityAfterStory {
  id: string
  category: string
  tone: AfterStoryTone
  /** `24분 전`, `3일 전`처럼 화면에 그대로 나오는 문구. */
  updatedAt: string
  /**
   * 이 후일담이 어느 사건의 뒷이야기인지.
   *
   * 후일담 상세에서 원래 사건으로 건너가는 버튼이 이 값을 쓴다.
   * 광장 목록 밖으로 밀려난 예전 사건의 후일담은 갈 곳이 없어 비워 둔다.
   */
  caseId?: string
  /**
   * 사건 결과 화면 맨 아래 `이 사건의 후일담` 카드에 인용으로 들어가는 두세 줄.
   *
   * 목록 카드의 `summary`는 한 줄이라 그 자리에는 너무 앙상하다.
   * `case-company-874`만 예외로, 지훈 사건 전용 화면이 자기 데이터를 쓰고 있어 비워 둔다.
   */
  quote?: string
  title: string
  summary: string
  reactions: number
}

/*
 * 다른 후일담 목록. 한 페이지 5건씩 5페이지다.
 *
 * 후일담은 판결이 끝난 뒤에 쓰는 글이라, 광장에서 아직 투표 중인 사건의 후일담은 두지 않는다.
 * 앞의 12건은 광장의 해결 사건과 이어져 있고, 뒤의 4건은 광장에 더 이상 올라와 있지 않은
 * 예전 사건의 후일담이다. 광장 목록은 최근 20건만 보여주므로 그보다 오래된 사건은 여기에만 남는다.
 *
 * 시각은 앞쪽이 분 단위, 뒤로 갈수록 시간·일 단위로 벌어진다.
 * 전에는 25건이 6시간 45분 안에 몰려 있어 페이지를 넘겨도 같은 시각처럼 보였다.
 *
 * 한 시간이 넘어가면 분은 적지 않는다. `1시간 30분 전`이 아니라 `1시간 전`이다.
 * 게시판에서 몇 분까지 따지는 건 방금 올라온 글일 때뿐이라, 그 아래로는 읽는 부담만 늘어난다.
 * 하루가 넘으면 `N일 전`으로 묶는다.
 *
 * 공감 수는 오래된 글일수록 대체로 쌓여 있되 편차를 뒀다. 전부 한 자리 수로 비슷하면
 * 게시판이 아니라 표처럼 보이고, 오래 걸린 글일수록 반응이 모였다는 흐름도 드러나지 않는다.
 * 2일 전 글에 23과 76이 같이 있는 것처럼, 글마다 반응이 갈리는 쪽이 실제에 가깝다.
 *
 * 이 문구는 후일담 상세의 댓글 시각을 정하는 기준이기도 하다.
 * (`afterStoryCardComments.ts`의 parseElapsedMinutes → retimeComments)
 */
export const COMMUNITY_AFTER_STORIES: CommunityAfterStory[] = [
  {
    id: 'video-payment', category: '직장', tone: 'company', updatedAt: '8분 전',
    caseId: 'case-company-874',
    title: '카페 홍보영상 제작, 수정 범위와 잔금 갈등', summary: '최종본을 전달한 뒤 잔금도 무사히 받았어요.', reactions: 3,
  },
  {
    id: 'friend-loan', category: '친구', tone: 'friend', updatedAt: '25분 전',
    caseId: 'case-friend-loan',
    quote: '돈 이야기를 피하지 않고 꺼냈더니\n친구도 미뤄서 미안했다고 했어요.\n언제 얼마씩 갚을지 함께 정했어요.',
    title: '친구에게 빌려준 300만 원, 6개월째 미변제', summary: '직접 대화한 뒤 서로 오해를 풀었어요.', reactions: 9,
  },
  {
    id: 'idea-credit-card', category: '직장', tone: 'company', updatedAt: '52분 전',
    caseId: 'case-work-credit',
    quote: '메일과 초안 기록을 정리해 보여드렸어요.\n회의에서 공동 기여로 다시 언급됐고,\n다음 발표는 함께 준비하기로 했어요.',
    title: '상사가 제 아이디어를 자신의 공로로 발표했어요', summary: '기록을 정리해 공동 기여를 인정받았어요.', reactions: 5,
  },
  {
    id: 'secret-told', category: '친구', tone: 'friend', updatedAt: '2시간 전',
    caseId: 'case-secret-told',
    quote: '왜 서운했는지 차분히 이야기했어요.\n친구도 걱정이 앞섰다고 털어놨고,\n말해도 되는 선을 같이 정했어요.',
    title: '친구가 제 비밀을 다른 친구에게 말했어요', summary: '서로의 경계를 다시 정하며 대화를 이어갔어요.', reactions: 21,
  },
  {
    id: 'anniversary', category: '연인', tone: 'friend', updatedAt: '4시간 전',
    caseId: 'case-dating-anniversary',
    quote: '서운했던 마음을 그대로 전했어요.\n탓하려던 게 아니라는 걸 알아줬고,\n다음 약속은 같이 적어두기로 했어요.',
    title: '기념일 약속을 깜빡한 연인에게 서운함을 말해도 될까요?', summary: '바랐던 마음을 솔직하게 전하고 오해를 풀었어요.', reactions: 12,
  },
  {
    id: 'friend-mistake', category: '친구', tone: 'friend', updatedAt: '5시간 전',
    caseId: 'case-friend-mistake',
    quote: '웃어넘기지 않고 한 번 더 말했어요.\n친구도 그제야 제 표정을 떠올렸다며\n그 뒤로는 꺼내지 않고 있어요.',
    title: '오랜 친구가 제 실수를 계속 이야기했어요', summary: '다시 한번 말한 뒤로는 꺼내지 않기로 했어요.', reactions: 26,
  },
  {
    id: 'trip-cancel', category: '친구', tone: 'friend', updatedAt: '7시간 전',
    caseId: 'case-friend-trip-cancel',
    quote: '환불되는 금액부터 하나씩 확인했어요.\n남은 몫은 반씩 나누기로 했고,\n다음엔 취소 규정을 먼저 보기로 했어요.',
    title: '여행 직전 취소한 친구에게 예약금을 모두 받아야 할까요?', summary: '환불 가능한 부분부터 차분히 정리했어요.', reactions: 34,
  },
  {
    id: 'family-care', category: '가족', tone: 'friend', updatedAt: '11시간 전',
    caseId: 'case-family-care',
    quote: '달력에 병원 일정을 전부 적어봤어요.\n숫자로 보이니 말이 쉬워졌고,\n이번 달부터 번갈아 가기로 했어요.',
    title: '부모님 병원 동행을 저에게만 부탁하는 형제자매', summary: '돌봄 일정을 나눠 맡기로 했어요.', reactions: 19,
  },
  {
    id: 'attendance', category: '학업', tone: 'friend', updatedAt: '15시간 전',
    caseId: 'case-school-attendance',
    quote: '왜 못 하겠는지 이유를 설명했어요.\n친구도 부탁이 지나쳤다고 했고,\n지금은 예전처럼 지내고 있어요.',
    title: '친구 대신 출석을 불러달라는 부탁을 거절했더니 멀어졌어요', summary: '규정을 지키는 이유를 설명하고 풀었어요.', reactions: 47,
  },
  {
    id: 'ai-report', category: '학업', tone: 'friend', updatedAt: '20시간 전',
    caseId: 'case-school-ai-report',
    quote: '과제 지침을 다시 찾아 함께 읽었어요.\n어디까지 도구를 써도 되는지 정리했고,\n출처를 적어 다시 제출했어요.',
    title: 'AI를 활용한 과제라서 표절이 아니라는 조원의 주장', summary: '과제 도구 사용 기준을 다시 정리했어요.', reactions: 28,
  },
  {
    id: 'family-living-expenses', category: '가족', tone: 'friend', updatedAt: '1일 전',
    caseId: 'case-family-living-expenses',
    quote: '제 고정비를 정리해 보여드렸어요.\n부모님도 사정을 알고 놀라셨고,\n매달 낼 금액과 기간을 함께 정했어요.',
    title: '취업 후에도 생활비를 전부 내라는 부모님 말씀', summary: '부담 가능한 금액을 함께 정했어요.', reactions: 63,
  },
  {
    id: 'group-project-credit', category: '학업', tone: 'friend', updatedAt: '2일 전',
    caseId: 'case-group-project-credit',
    quote: '먼저 사과하고 친구 이야기를 들었어요.\n노트북이 고장 나 연락이 늦었다고 했고,\n이제는 서로 먼저 묻고 시작해요.',
    title: '조별 과제에서 친구를 공개적으로 지적한 사건', summary: '먼저 사과한 뒤 서로의 의견을 묻게 됐어요.', reactions: 41,
  },
  {
    id: 'study-presentation', category: '학업', tone: 'friend', updatedAt: '2일 전',
    caseId: 'case-study-presentation',
    quote: '바꾼 이유를 물어보니 이해가 됐어요.\n다만 말없이 바꾼 건 서운했다고 전했고,\n수정 전엔 서로 확인하기로 했어요.',
    title: '제 의견은 무시하고 팀원이 발표 자료를 바꿨어요', summary: '수정 전에 서로 확인하기로 했어요.', reactions: 85,
  },

  // 여기서부터는 광장에 없는 예전 사건(3~5일 전)의 후일담이다. 광장 목록 20건 밖으로 밀려난 사건들이다.
  {
    id: 'birthday-gift', category: '친구', tone: 'friend', updatedAt: '3일 전',
    title: '친한 친구의 생일 선물 때문에 생긴 오해', summary: '늦게라도 마음을 전하고 화해했어요.', reactions: 57,
  },
  {
    id: 'holiday-schedule', category: '가족', tone: 'friend', updatedAt: '4일 전',
    title: '명절마다 한쪽 집에만 가는 일정이 반복됐어요', summary: '해마다 번갈아 가기로 정리했어요.', reactions: 72,
  },
  {
    id: 'team-dinner', category: '직장', tone: 'company', updatedAt: '5일 전',
    title: '회식 불참을 말했더니 분위기가 어색해졌어요', summary: '참석 기준을 팀과 미리 공유하기로 했어요.', reactions: 124,
  },
  {
    id: 'couple-money', category: '연인', tone: 'friend', updatedAt: '5일 전',
    title: '데이트 비용을 누가 더 내는지로 다퉜어요', summary: '각자 부담을 적어보고 기준을 정했어요.', reactions: 88,
  },
  {
    id: 'roommate-chores', category: '친구', tone: 'friend', updatedAt: '6일 전',
    title: '룸메이트가 청소 당번을 계속 미뤘어요', summary: '당번표를 붙인 뒤로 다툴 일이 줄었어요.', reactions: 152,
  },
  {
    id: 'sibling-borrow', category: '가족', tone: 'friend', updatedAt: '6일 전',
    title: '동생이 제 물건을 말없이 가져다 썼어요', summary: '쓰기 전에 한마디 하기로 약속했어요.', reactions: 71,
  },
  {
    id: 'study-group-noshow', category: '학업', tone: 'friend', updatedAt: '7일 전',
    title: '스터디에 계속 늦는 팀원 때문에 지쳤어요', summary: '지각 기준을 함께 정하고 다시 모였어요.', reactions: 118,
  },
]
/** 이 사건에 이어진 후일담. 없으면 null. 사건 결과 화면이 후일담 카드를 그릴지 여기서 정한다. */
export function findAfterStoryByCaseId(caseId: string | undefined): CommunityAfterStory | null {
  if (!caseId) return null
  return COMMUNITY_AFTER_STORIES.find((story) => story.caseId === caseId) ?? null
}

/** 라우트에서 쓰는 후일담 상세 id. 목록 id 앞에 `afterstory-`가 붙는다. */
export const toAfterStoryId = (storyId: string) => `afterstory-${storyId}`

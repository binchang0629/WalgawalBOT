import commentAvatar1 from '../../assets/case/disagreement/comment-1.png'
import commentAvatar2 from '../../assets/case/disagreement/comment-2.png'
import commentAvatar3 from '../../assets/case/disagreement/comment-3.png'
import commentAvatar4 from '../../assets/case/disagreement/comment-4.png'
import commentAvatar5 from '../../assets/case/disagreement/comment-5.png'
import authorAvatar from '../../assets/case/jihoon/author.png'
import verdictArtwork from '../../assets/case/jihoon/verdict-artwork.png'
import type { CommentStickerId } from './commentStickers'
import { demoTimeline } from './demoTimeline'

export type JihoonSimilarVoteId = 'other' | 'writer' | 'both' | 'neither'

export interface JihoonSimilarComment {
  id: string
  nickname: string
  createdAt: string
  voteId: JihoonSimilarVoteId | null
  voteLabel: string | null
  body: string
  stickerId?: CommentStickerId
  likes: number
  dislikes: number
  avatarUrl?: string
}

export const jihoonSimilarCase = {
  id: 'case-company-874',
  category: '직장',
  author: {
    nickname: '원본은영업비밀',
    createdAt: demoTimeline.company.createdAt,
    avatarUrl: authorAvatar,
  },
  title: '수정 2회를 마쳤는데, 의뢰인이 잔금 지급을 미루고 있어요.',
  detailTitle: '수정 2회를 마쳤는데, 의뢰인이\n잔금 지급을 미루고 있어요.',
  resultTitle: '수정 2회를 마쳤는데,\n의뢰인이 잔금 지급을 미루고 있어요.',
  cardSummary: '카페 홍보영상을 180만 원에 제작했습니다. 수정 2회를 마쳤지만 의뢰인은 요청한 색감이 반영되지 않았다며 추가 수정과 원본 파일을 요구하고 있어요.',
  caseNumber: 'CASE-COMPANY-874',
  age: demoTimeline.company.age,
  participantCount: 450,
  paragraphs: [
    '카페 홍보영상을 180만 원에 제작했습니다.\n계약에는 수정 2회와 원본 파일 제공이 포함됐고,\n최종 승인 후 잔금 90만 원을 받기로 했어요.',
    '의뢰인은 처음부터 밝고 따뜻한 색감을 요청했지만, 저는 차분한 색감이 카페와 더 잘 어울린다고 판단해 두 번의 수정에서도 밝기만 조금 조절했습니다.',
    '의뢰인은 요청한 색감이 반영되지 않았다며 추가 수정과 원본 파일을 요구하고 있어요. 영상은 광고 일정 때문에 먼저 게시했을 뿐, 최종 승인한 것은 아니라고 합니다.',
    '저는 약속한 수정 횟수를 모두 채웠는데도 다시 수정해야 할까요?',
  ],
  summary: [
    {
      title: '요청한 색감 미반영',
      body: '의뢰인이 처음 요청한 밝고 따뜻한 색감이 두 차례 수정 후에도 충분히 반영되지 않았어요.',
    },
    {
      title: '수정 횟수와 작업 완료 여부',
      body: '수정 횟수를 채웠더라도 합의한 요구사항이 반영되지 않았다면 작업이 완료됐다고 보기 어려워요.',
    },
    {
      title: '게시와 최종 승인은 별개',
      body: '광고 일정 때문에 영상을 먼저 게시한 것만으로 최종 승인했다고 단정하기는 어려워요.',
    },
  ],
} as const

export const jihoonSimilarReasonComparison = {
  eyebrow: '왜 달랐을까요?',
  title: '‘작업 완료’의\n기준이 달랐어요',
  criteria: [
    {
      id: 'ai',
      label: '판멍이가 본 기준',
      keyword: '수정 횟수',
      description: '약속한 수정\n2회를 마쳤어요',
    },
    {
      id: 'jury',
      label: '배심원 댓글의 기준',
      keyword: '요청 반영',
      description: '요청한 색감은\n반영되지 않았어요',
    },
  ],
} as const

export const jihoonSimilarResult = {
  artworkUrl: verdictArtwork,
  verdict: {
    label: '배심원의 한 줄 판결',
    title: '상대방의 입장이\n더 타당해요',
    description: '합의한 결과물이 완성되지 않아,\n상대방의 입장이 더 타당하다는 의견이에요.',
  },
  breakdown: [
    { id: 'other', label: '상대방 입장이 더 타당해요', percent: 61 },
    { id: 'writer', label: '글쓴이 입장이 더 타당해요', percent: 9 },
    { id: 'both', label: '양쪽 모두 일리가 있어요', percent: 27 },
    { id: 'neither', label: '양쪽 모두 타당하지 않아요', percent: 3 },
  ] as const,
  aiVerdict: {
    summary: '약속한 수정은 완료했고,\n결과물도 사용하고 있다는 점',
    comparisonReasons: [
      '계약서에 명시된 수정 2회를 완료했고, 의뢰인이 영상을 실제 광고에 사용하고 있다는 점을 고려했어요.',
      '약속한 수정 횟수를 마친 결과물을 사용하면서 잔금 전액을 보류하는 대응은 과하다고 판단했어요.',
    ],
    title: 'AI 판멍이는 글쓴이의 손을 들어줬어요.',
    reasons: [
      '계약서에 명시된 수정 2회를 모두 완료했고, 의뢰인이 영상을 실제 광고에 사용하고 있다는 점을 고려했어요.',
      '약속한 수정 횟수를 마친 결과물을 사용하면서 잔금 전액을 보류하는 대응은 과하다고 판단했어요.',
      '다만 원본 파일은 계약 범위에 포함되어 있고 요청한 색감의 반영 여부도 쟁점이므로, 작업 기록을 바탕으로 남은 이행 범위를 다시 확인할 필요가 있어요.',
    ],
    confidence: 73,
    comparison: '판멍이는 글쓴이의 손을 들어줬지만,\n배심원 다수는 상대방의 입장이 더 타당하다고 판단했어요.',
  },
  /** 결과 댓글은 5개씩 5페이지를 제공하므로 전체 시연 데이터도 25개로 맞춘다. */
  commentCount: 25,
  comments: [
    {
      id: 'jihoon-comment-1',
      avatarUrl: commentAvatar1,
      nickname: '달이예쁘네요',
      createdAt: '1분 전',
      voteId: 'other',
      voteLabel: '투표 · 상대방 입장',
      body: '두 번 수정했다는 사실만으로 작업이 끝났다고 보기는 어려워 보여요. 핵심 요청이 그대로 남아 있으니까요.',
      likes: 3,
      dislikes: 1,
    },
    {
      id: 'jihoon-comment-2',
      avatarUrl: commentAvatar2,
      nickname: '침낭펴야지?',
      createdAt: '3분 전',
      voteId: 'other',
      voteLabel: '투표 · 상대방 입장',
      body: '의뢰인이 처음부터 같은 부분을 이야기했다면 추가 수정이라기보다 기존 요청의 보완에 가까워 보여요.',
      stickerId: 'wallang-listen',
      likes: 3,
      dislikes: 1,
    },
    {
      id: 'jihoon-comment-3',
      avatarUrl: commentAvatar3,
      nickname: '월요병말기',
      createdAt: '12분 전',
      voteId: 'both',
      voteLabel: '투표 · 양쪽 모두',
      body: '작업자는 수정 횟수를 지켰고 의뢰인은 원하는 결과를 받지 못했으니까 어느 한쪽만의 잘못으로 보긴 어려움',
      likes: 3,
      dislikes: 1,
    },
    {
      id: 'jihoon-comment-4',
      avatarUrl: commentAvatar4,
      nickname: '판멍이는귀여워',
      createdAt: '11분 전',
      voteId: 'other',
      voteLabel: '투표 · 상대방 입장',
      body: '',
      stickerId: 'walgadak-joy',
      likes: 3,
      dislikes: 1,
    },
    {
      id: 'jihoon-comment-5',
      avatarUrl: commentAvatar5,
      nickname: '아아러버',
      createdAt: '15분 전',
      voteId: 'both',
      voteLabel: '투표 · 양쪽 모두',
      body: '잔금을 전부 미루기보다 일부를 지급하고 색감 수정 범위를 다시 합의하는 편이 좋았을 듯?',
      likes: 3,
      dislikes: 1,
    },
  ] satisfies JihoonSimilarComment[],
  afterStory: {
    quote: '요청한 색감으로 다시 수정했고,\n원본 파일과 최종본을 전달한 뒤\n잔금도 무사히 받았어요.',
    title: '카페 홍보영상 제작\n수정 범위와 잔금 갈등',
  },
} as const

const companyCommentOpenings: Array<{
  voteId: JihoonSimilarVoteId
  voteLabel: string
  text: string
}> = [
  { voteId: 'other', voteLabel: '투표 · 상대방 입장', text: '수정 횟수보다 처음 합의한 밝고 따뜻한 색감이 실제로 반영됐는지가 더 중요해 보여요.' },
  { voteId: 'other', voteLabel: '투표 · 상대방 입장', text: '같은 요청을 두 번 했는데 작업자 판단으로 다르게 작업했다면 완료라고 보기 어려워요.' },
  { voteId: 'writer', voteLabel: '투표 · 글쓴이 입장', text: '계약서에 수정 2회가 명확하다면 추가 작업은 별도 비용을 협의하는 것이 맞다고 봅니다.' },
  { voteId: 'both', voteLabel: '투표 · 양쪽 모두', text: '작업자는 횟수를 지켰고 의뢰인은 원하는 결과를 못 받았으니 완료 기준부터 다시 맞춰야겠어요.' },
  { voteId: 'other', voteLabel: '투표 · 상대방 입장', text: '광고 일정 때문에 먼저 게시한 것을 최종 승인으로 해석하는 건 무리가 있어 보여요.' },
  { voteId: 'other', voteLabel: '투표 · 상대방 입장', text: '전문가 의견도 중요하지만 의뢰인이 명확히 요청한 방향을 임의로 바꾼 점은 아쉽습니다.' },
  { voteId: 'writer', voteLabel: '투표 · 글쓴이 입장', text: '이미 결과물을 사용하고 있다면 잔금 전체를 보류하는 대응 역시 과하다고 생각해요.' },
  { voteId: 'both', voteLabel: '투표 · 양쪽 모두', text: '잔금 일부를 지급하고 색감 보완 범위를 새로 합의했으면 가장 현실적이었을 것 같아요.' },
  { voteId: 'other', voteLabel: '투표 · 상대방 입장', text: '원본 파일 제공도 계약에 포함됐다면 결과물과 함께 약속대로 전달해야 해요.' },
  { voteId: 'other', voteLabel: '투표 · 상대방 입장', text: '두 번의 수정이 모두 핵심 요청을 비껴갔다면 횟수만 채웠다고 말하기는 어렵습니다.' },
  { voteId: 'writer', voteLabel: '투표 · 글쓴이 입장', text: '추가 요구가 최초 계약 범위를 넘는 부분인지 작업 기록을 먼저 확인해야 할 것 같아요.' },
  { voteId: 'neither', voteLabel: '투표 · 양쪽 모두 아님', text: '요청과 승인 과정을 문서로 남기지 않은 채 서로 유리한 기준만 주장한 점이 가장 큰 문제 같아요.' },
]

const companyCommentConclusions = [
  '메신저 기록과 계약서를 기준으로 남은 작업을 구체적으로 정리해보면 좋겠습니다.',
  '감정적으로 대응하기보다 수정 범위와 잔금 지급 시점을 문서로 다시 합의해야 해요.',
  '다음 작업부터는 시안 승인 단계와 최종 완료 조건을 계약서에 더 자세히 적는 게 좋겠네요.',
  '사용 여부와 최종 승인 여부를 분리해서 판단해야 서로 억울하지 않을 것 같습니다.',
] as const

const companyCommentNicknames = [
  '계약서필수', '수정은두번', '프리랜서일기', '클라이언트입장', '영상쟁이', '잔금주세요',
  '기록이살길', '회의록요정', '색감중요해', '납기지킴이', '현실조언', '작업범위체크',
  '광고회사막내', '오늘도야근', '차분한배심원', '원본은별도',
] as const

const companyStickerIds = [
  'wallang-listen', 'walgadak-joy', 'wallang-thinking', 'walgadak-curious',
] as const satisfies readonly CommentStickerId[]

function formatCommentElapsedTime(totalMinutes: number) {
  if (totalMinutes <= 59) return `${totalMinutes}분 전`
  return `${Math.max(1, Math.floor(totalMinutes / 60))}시간 전`
}

/** 지난 사건 댓글도 페이지마다 서로 다른 내용이 보이도록 안정적으로 생성한다. */
export function createJihoonSimilarSeedComment(index: number): JihoonSimilarComment {
  const originalComment = jihoonSimilarResult.comments[index]
  if (originalComment) return originalComment

  const opening = companyCommentOpenings[index % companyCommentOpenings.length]
  const conclusion = companyCommentConclusions[Math.floor(index / companyCommentOpenings.length) % companyCommentConclusions.length]
  const stickerId = index % 9 === 0
    ? companyStickerIds[Math.floor(index / 9) % companyStickerIds.length]
    : undefined

  return {
    id: `company-seed-comment-${index + 1}`,
    avatarUrl: [commentAvatar1, commentAvatar2, commentAvatar3, commentAvatar4, commentAvatar5][index % 5],
    nickname: companyCommentNicknames[index % companyCommentNicknames.length],
    createdAt: formatCommentElapsedTime(index * 10 - 25),
    voteId: opening.voteId,
    voteLabel: opening.voteLabel,
    body: `${opening.text} ${conclusion}`,
    ...(stickerId ? { stickerId } : {}),
    likes: (index * 5) % 31,
    dislikes: (index * 2) % 5,
  }
}

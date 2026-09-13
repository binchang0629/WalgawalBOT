import commentAvatar1 from '../../assets/case/disagreement/comment-1.png'
import commentAvatar2 from '../../assets/case/disagreement/comment-2.png'
import commentAvatar3 from '../../assets/case/disagreement/comment-3.png'
import commentAvatar4 from '../../assets/case/disagreement/comment-4.png'
import commentAvatar5 from '../../assets/case/disagreement/comment-5.png'
import authorAvatar from '../../assets/case/jihoon/author.png'
import verdictArtwork from '../../assets/case/jihoon/verdict-artwork.png'

export type JihoonSimilarVoteId = 'other' | 'writer' | 'both' | 'neither'

export interface JihoonSimilarComment {
  id: string
  nickname: string
  createdAt: string
  voteId: JihoonSimilarVoteId
  voteLabel: string
  body: string
  likes: number
  dislikes: number
  avatarUrl?: string
}

export const jihoonSimilarCase = {
  id: 'case-company-874',
  category: '직장',
  author: {
    nickname: '원본은영업비밀',
    createdAt: '26/09/05 · 21:13',
    avatarUrl: authorAvatar,
  },
  title: '수정 2회를 마쳤는데, 의뢰인이 잔금 지급을 미루고 있어요.',
  caseNumber: 'CASE-COMPANY-874',
  age: '3일 전',
  participantCount: 450,
  paragraphs: [
    '카페 홍보영상을 180만 원에 제작했습니다. 계약에는 수정 2회와 원본 파일 제공이 포함됐고, 최종 승인 후 잔금 90만 원을 받기로 했어요.',
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
      '계약 범위를 벗어난 추가 수정과 원본 파일 제공을 잔금 지급 조건으로 새롭게 요구하는 것은 타당하지 않다고 판단했어요.',
    ],
    title: 'AI 판멍이는 글쓴이의 손을 들어줬어요.',
    reasons: [
      '계약서에 명시된 수정 2회를 모두 완료했고, 의뢰인이 영상을 실제 광고에 사용하고 있다는 점을 고려했어요.',
      '계약 범위를 벗어난 추가 수정과 원본 파일 제공을 잔금 지급 조건으로 새롭게 요구하는 것은 타당하지 않다고 판단했어요.',
      '다만 원본 파일 제공 범위와 결과물의 완성 기준은 계약 내용에 따라 달라질 수 있어, 계약서와 작업 기록을 바탕으로 당사자 간 확인이 필요해요.',
    ],
    confidence: 73,
    comparison: '판멍이는 글쓴이의 손을 들어줬지만,\n배심원 다수는 상대방의 입장이 더 타당하다고 판단했어요.',
  },
  commentCount: 46,
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
      body: '제작자의 해석과 의뢰인의 요구가 다를 수 있지만, 최종본은 합의된 방향에 맞아야 하지 않을까요?',
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

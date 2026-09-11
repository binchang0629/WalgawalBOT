import avatar1 from '../../assets/case/result/comment-avatar-1.png'
import avatar2 from '../../assets/case/result/comment-avatar-2.png'
import avatar3 from '../../assets/case/result/comment-avatar-3.png'
import avatar4 from '../../assets/case/result/comment-avatar-4.png'
import avatar5 from '../../assets/case/result/comment-avatar-5.png'
import resultArtwork from '../../assets/case/result/verdict-artwork.png'
import type { WeddingGiftVoteId } from './caseDetailContent'

export interface CaseResultComment {
  id: string
  avatarUrl: string
  nickname: string
  createdAt: string
  voteId: WeddingGiftVoteId
  voteLabel: string
  body: string
  likes: number
  dislikes: number
}

/**
 * Figma `축의금 사건 상세/로그인 후2`(1846:14556)의 결과·댓글 seed 데이터.
 * 서버 연결 전 시연용이며 새 댓글은 화면 상태에만 추가된다.
 */
export const weddingGiftResult = {
  deadline: '01:32:47',
  artworkUrl: resultArtwork,
  verdict: {
    label: '배심원의 한 줄 판결',
    title: '글쓴이의 입장이\n더 타당해요',
    description: '최근 교류가 뜸했다면\n10만 원은 무리 없는 축의금이라는 의견이에요.',
  },
  breakdown: [
    { id: 'writer', label: '글쓴이 입장이 더 타당해요', percent: 48 },
    { id: 'other', label: '상대방 입장이 더 타당해요', percent: 26 },
    { id: 'both', label: '양쪽 모두 일리가 있어요', percent: 22 },
    { id: 'neither', label: '양쪽 모두 타당하지 않아요', percent: 4 },
  ],
  aiReasons: [
    '유사 사례와 일반적인 축의금 범위를 분석한 결과, 결혼식에 참석한 경우 5만~10만 원이 가장 일반적인 범위로 나타났어요.',
    '두 사람이 10년간 알고 지냈더라도 최근 연락과 만남이 줄어든 상황이라면 10만 원은 충분히 통상적인 금액이에요.',
    '오랜 관계라는 이유만으로 더 큰 금액을 기대하거나 금액으로 우정을 평가하는 것은 상대방에게 부담을 줄 수 있다고 판단했어요.',
  ],
  confidence: 68,
  comparison: '배심원은 글쓴이의 손을, AI는 상대방의 손을 들어줬어요. AI와 배심원의 판단이 정반대로 갈렸어요.',
  comments: [
    {
      id: 'comment-1',
      avatarUrl: avatar1,
      nickname: '현실주의토끼',
      createdAt: '2분 전',
      voteId: 'writer',
      voteLabel: '투표 · 글쓴이 입장',
      body: '요즘 식대까지 생각하면 참석한 경우 10만 원은 무난한 금액이라고 봐요.',
      likes: 2,
      dislikes: 0,
    },
    {
      id: 'comment-2',
      avatarUrl: avatar2,
      nickname: '마음이먼저',
      createdAt: '4분 전',
      voteId: 'other',
      voteLabel: '투표 · 상대방 입장',
      body: '오랜 친구라면 금액보다 직접 와서 축하해준 마음이 더 중요하다고 생각해요.',
      likes: 3,
      dislikes: 1,
    },
    {
      id: 'comment-3',
      avatarUrl: avatar3,
      nickname: '선은지켜요',
      createdAt: '7분 전',
      voteId: 'writer',
      voteLabel: '투표 · 글쓴이 입장',
      body: '서운할 수는 있어도 축의금 액수를 직접 언급하는 순간 상대에게 부담을 주는 것 같아요.',
      likes: 1,
      dislikes: 2,
    },
    {
      id: 'comment-4',
      avatarUrl: avatar4,
      nickname: '경조사어려워',
      createdAt: '11분 전',
      voteId: 'other',
      voteLabel: '투표 · 상대방 입장',
      body: '오랜 친구이고 청첩장도 직접 전했다면 조금 더 기대할 수는 있다고 봐요. 상대방이 서운했던 마음도 이해돼요.',
      likes: 5,
      dislikes: 1,
    },
    {
      id: 'comment-5',
      avatarUrl: avatar5,
      nickname: '한번더생각',
      createdAt: '15분 전',
      voteId: 'both',
      voteLabel: '투표 · 양쪽 모두',
      body: '글쓴이는 일반적인 기준에 맞춰 냈고, 친구는 오랜 관계만큼 기대가 컸던 것 같아요. 서로의 기준이 달랐던 문제로 보여요.',
      likes: 8,
      dislikes: 4,
    },
  ] satisfies CaseResultComment[],
  afterStory: {
    quote: '솔직히 이야기해보니,\n축의금보다 서로의 기대가 달랐어요.\n서운함을 풀고 다시 잘 지내고 있어요.',
    title: '10년 지기 친구 결혼식\n축의금 10만 원 논쟁',
  },
} as const

export const voteDisplayById: Record<WeddingGiftVoteId, { label: string; tone: 'blue' | 'orange' }> = {
  writer: { label: '투표 · 글쓴이 입장', tone: 'blue' },
  other: { label: '투표 · 상대방 입장', tone: 'orange' },
  both: { label: '투표 · 양쪽 모두', tone: 'blue' },
  neither: { label: '투표 · 양쪽 모두 아님', tone: 'orange' },
}

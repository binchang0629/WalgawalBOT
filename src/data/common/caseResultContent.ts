import { profileAvatars } from './profileAvatars'
import resultArtwork from '../../assets/case/result/panmung-scale-first-frame.png'
import { weddingGiftCase } from './caseDetailContent'
import type { WeddingGiftVoteId } from './caseDetailContent'
import type { CommentStickerId } from './commentStickers'

export interface CaseResultComment {
  id: string
  avatarUrl: string
  nickname: string
  createdAt: string
  voteId: WeddingGiftVoteId
  voteLabel: string
  body: string
  stickerId?: CommentStickerId
  likes: number
  dislikes: number
}

/**
 * Figma `축의금 사건 상세/로그인 후2`(2064:16466)의 결과·댓글 seed 데이터.
 * 서버 연결 전 시연용이며 새 댓글은 화면 상태에만 추가된다.
 */
export const weddingGiftResult = {
  /** 사건 상세와 같은 마감 시각을 쓴다. 값은 `caseDetailContent.ts` 한 곳에서 관리한다. */
  deadline: weddingGiftCase.deadline,
  artworkUrl: resultArtwork,
  verdict: {
    label: '판멍이의 판단',
    title: '글쓴이의\n손을 들어줬어요',
    description: '축의금은 관계뿐 아니라\n개인의 상황도 함께 살펴야 해요.',
  },
  breakdown: [
    { id: 'writer', label: '글쓴이 입장이 더 타당해요', percent: 48 },
    { id: 'other', label: '상대방 입장이 더 타당해요', percent: 26 },
    { id: 'both', label: '양쪽 모두 일리가 있어요', percent: 22 },
    { id: 'neither', label: '양쪽 모두 타당하지 않아요', percent: 4 },
  ],
  aiVerdictLabel: '판멍이가 주목한 점',
  aiVerdictTitle: '10만 원은 통상적인 축의금이고,\n소원해진 관계라면 충분한 금액이에요',
  aiReasons: [
    '결혼식에 참석한 경우 축의금은 보통 5만~10만 원 선이에요. 최근 연락과 만남이 줄어든 관계라면 10만 원은 충분히 일반적인 금액이에요.',
    '오래 알고 지냈다는 이유만으로 더 큰 금액을 기대하거나, 축의금 액수로 우정을 판단하는 것은 상대방에게 부담을\n줄 수 있어요.',
  ],
  confidence: 68,
  comparison: '판멍이와 배심원 다수 모두\n글쓴이의 입장이 더 타당하다고 판단했어요.',
  /** 결과 댓글은 5개씩 5페이지를 제공하므로 전체 시연 데이터도 25개로 맞춘다. */
  commentCount: 25,
  comments: [
    {
      id: 'comment-1',
      avatarUrl: profileAvatars[0],
      nickname: '현실주의토끼',
      createdAt: '2분 전',
      voteId: 'writer',
      voteLabel: '투표 · 글쓴이 입장',
      body: '요즘 식대까지 생각하면 참석한 경우 10만 원은 무난한 금액이라고 봄',
      likes: 3,
      dislikes: 1,
    },
    {
      id: 'comment-2',
      avatarUrl: profileAvatars[1],
      nickname: '마음이먼저',
      createdAt: '4분 전',
      voteId: 'writer',
      voteLabel: '투표 · 글쓴이 입장',
      body: '오랜 친구라면 금액보다 직접 와서 축하해준 마음이 더 중요하다고 생각해요.',
      stickerId: 'wallang-empathy',
      likes: 3,
      dislikes: 1,
    },
    {
      id: 'comment-3',
      avatarUrl: profileAvatars[2],
      nickname: '선은지켜요',
      createdAt: '7분 전',
      voteId: 'writer',
      voteLabel: '투표 · 글쓴이 입장',
      body: '서운할 수는 있어도 축의금 액수를 직접 언급하는 순간 상대에게 부담을 주는 것 같아요.',
      likes: 3,
      dislikes: 1,
    },
    {
      id: 'comment-4',
      avatarUrl: profileAvatars[3],
      nickname: '경조사어려워',
      createdAt: '11분 전',
      voteId: 'other',
      voteLabel: '투표 · 상대방 입장',
      body: '오랜 친구이고 청첩장도 직접 전했다면 조금 더 기대할 수는 있다고 봐요. 상대방이 서운했던 마음도 이해돼요.',
      likes: 3,
      dislikes: 1,
    },
    {
      id: 'comment-5',
      avatarUrl: profileAvatars[4],
      nickname: '한번더생각',
      createdAt: '15분 전',
      voteId: 'both',
      voteLabel: '투표 · 양쪽 모두',
      body: '글쓴이는 일반적인 기준에 맞춰 냈고, 친구는 오랜 관계만큼 기대가 컸던 것 같아요. 서로의 기준이 달랐던 문제로 보여요.',
      stickerId: 'walgadak-thinking',
      likes: 3,
      dislikes: 1,
    },
  ] satisfies CaseResultComment[],
  afterStory: {
    quote: '친구는 선물 가격보다 제가 생일을 잊었다고 생각해 서운했던 거였어요.\n늦게라도 마음을 전하고 화해했어요.',
    title: '친한 친구의 생일\n선물 때문에 생긴 오해',
  },
} as const

export const voteDisplayById: Record<WeddingGiftVoteId, { label: string; tone: 'blue' | 'orange' }> = {
  writer: { label: '투표 · 글쓴이 입장', tone: 'blue' },
  other: { label: '투표 · 상대방 입장', tone: 'orange' },
  both: { label: '투표 · 양쪽 모두', tone: 'blue' },
  neither: { label: '투표 · 양쪽 모두 아님', tone: 'orange' },
}

const weddingCommentOpenings: Array<{ voteId: WeddingGiftVoteId; text: string }> = [
  { voteId: 'writer', text: '직접 참석해서 축하했고 10만 원을 냈다면 충분히 예의를 갖춘 것 같아요.' },
  { voteId: 'writer', text: '최근 왕래가 거의 없었다면 오래 알았다는 사실만으로 금액이 커질 필요는 없다고 봐요.' },
  { voteId: 'other', text: '십 년 넘게 가까웠던 친구라면 상대가 조금 서운할 수는 있다고 생각해요.' },
  { voteId: 'both', text: '두 사람 모두 관계의 친밀도를 다르게 기억하고 있었던 게 갈등의 시작 같아요.' },
  { voteId: 'writer', text: '축의금은 형편과 상황에 맞게 내는 것이지 우정의 점수표는 아니잖아요.' },
  { voteId: 'other', text: '친구 입장에서는 금액보다 예전만큼 가깝지 않다는 신호처럼 느꼈을 수도 있겠네요.' },
  { voteId: 'writer', text: '요즘 기준으로도 참석 축의금 10만 원이면 결코 적은 금액은 아니라고 생각합니다.' },
  { voteId: 'both', text: '기대한 마음과 부담을 느낀 마음이 둘 다 이해돼서 한쪽만 탓하기 어렵네요.' },
  { voteId: 'writer', text: '액수를 직접 따져 묻기보다 와준 것에 고마워하는 게 먼저였어야 해요.' },
  { voteId: 'other', text: '결혼 준비 중에는 작은 일도 크게 느껴질 수 있어서 친구의 반응도 조금은 이해돼요.' },
  { voteId: 'writer', text: '친분이 예전 같지 않았다면 현재 관계를 기준으로 판단한 글쓴이 선택이 자연스러워요.' },
  { voteId: 'both', text: '서로 생각한 친한 친구의 기준과 경조사 기준이 달랐던 문제로 보여요.' },
  { voteId: 'writer', text: '참석에 시간과 비용도 들었다는 점까지 함께 봐야 한다고 생각해요.' },
  { voteId: 'other', text: '청첩장을 직접 전할 정도였다면 친구가 특별한 관계라고 기대했을 가능성도 있어요.' },
  { voteId: 'writer', text: '경제 상황을 모른 채 금액만으로 진심을 판단하는 건 너무 가혹한 것 같아요.' },
  { voteId: 'neither', text: '축하보다 금액 비교가 앞선 순간 두 사람 모두 대화를 놓친 것 같아 아쉬워요.' },
]

const weddingCommentConclusions = [
  '서운함은 액수보다 관계가 달라진 이유를 차분히 이야기하며 푸는 게 좋겠어요.',
  '이번 일을 계기로 서로 기대한 선을 솔직하게 확인해보면 좋겠습니다.',
  '경조사에는 하나의 정답보다 각자의 사정을 존중하는 태도가 더 중요해 보여요.',
  '돈 이야기로 우정 전체를 판단하지 않았으면 좋겠네요.',
  '먼저 감정을 가라앉히고 축하의 뜻 자체를 봐주면 좋겠습니다.',
  '상대가 왜 그렇게 느꼈는지 묻는 대화가 있었다면 갈등이 훨씬 작았을 것 같아요.',
  '앞으로의 관계를 이어갈 마음이 있다면 금액보다 말로 풀어야 할 문제라고 봐요.',
  '서로의 기준이 다를 수 있다는 걸 인정하는 데서 시작하면 좋겠습니다.',
] as const

const weddingCommentNicknames = [
  '오늘도고민중', '관계는천천히', '축하가먼저', '냉정한참견러', '마음한스푼', '적당한거리',
  '대화가답', '경조사초보', '오래된친구', '선넘지말기', '현실적인곰', '따뜻한판결',
  '눈치백단', '기준은각자', '마음의온도', '친구생각중', '조용한배심원', '오늘의한표',
] as const

const weddingStickerIds = [
  'wallang-empathy', 'walgadak-thinking', 'wallang-curious', 'walgadak-listen',
] as const satisfies readonly CommentStickerId[]

function formatCommentElapsedTime(totalMinutes: number) {
  if (totalMinutes <= 59) return `${totalMinutes}분 전`
  return `${Math.max(1, Math.floor(totalMinutes / 60))}시간 전`
}

/** 페이지가 달라도 같은 댓글을 복제하지 않는 안정적인 시연 댓글을 만든다. */
export function createWeddingGiftSeedComment(index: number): CaseResultComment {
  const originalComment = weddingGiftResult.comments[index]
  if (originalComment) return originalComment

  const opening = weddingCommentOpenings[index % weddingCommentOpenings.length]
  const conclusion = weddingCommentConclusions[Math.floor(index / weddingCommentOpenings.length) % weddingCommentConclusions.length]
  const stickerId = index % 11 === 0
    ? weddingStickerIds[Math.floor(index / 11) % weddingStickerIds.length]
    : undefined

  return {
    id: `wedding-seed-comment-${index + 1}`,
    avatarUrl: profileAvatars[index % profileAvatars.length],
    nickname: weddingCommentNicknames[index % weddingCommentNicknames.length],
    createdAt: formatCommentElapsedTime(index * 9 - 20),
    voteId: opening.voteId,
    voteLabel: voteDisplayById[opening.voteId].label,
    body: `${opening.text} ${conclusion}`,
    ...(stickerId ? { stickerId } : {}),
    likes: (index * 7) % 38,
    dislikes: (index * 3) % 6,
  }
}

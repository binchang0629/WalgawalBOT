import authorWalang from '../../assets/case/author-hamster.png'
import voteWriter from '../../assets/case/vote-writer-updated.svg'
import voteOther from '../../assets/case/vote-other-updated.svg'
import voteBoth from '../../assets/case/vote-both-updated.svg'
import voteNeither from '../../assets/case/vote-neither-updated.svg'

/**
 * 축의금 사건 상세의 화면 데이터.
 * Figma `축의금 사건 상세/로그인 후`(1802:5912)의 문구와 에셋을 반영한다.
 * 서버 연결 전 seed이므로 화면 컴포넌트에서 직접 수정하지 않는다.
 */
export const weddingGiftCase = {
  id: 'case-wedding-gift',
  category: '친구',
  author: {
    nickname: '익명의 햄스터',
    createdAt: '26/09/08 · 00:08:34',
    avatarUrl: authorWalang,
  },
  title: '10년 지기 친구 결혼식에 축의금 10만 원을 냈는데, 적은 건가요?',
  caseNumber: '#CASE-MARRY-87',
  age: '7시간 전',
  participantCount: 611,
  deadline: '01:01',
  paragraphs: [
    '대학 때부터 10년간 알고 지낸 친구의 결혼식에 참석했습니다. 예전에는 자주 만났지만 졸업 후 서로 바빠지면서 최근 2년 동안은 일 년에 한두 번 연락하는 정도였어요.',
    '저는 현재 관계와 제 형편을 고려해 축의금 10만 원을 냈습니다. 그런데 친구가 “오래된 사이인데 조금 더 생각할 줄 알았다”며 서운함을 드러냈어요.',
    '요즘 기준으로 10만 원이면 충분하다고 생각했는데, 제가 친구와의 관계를 너무 가볍게 본 걸까요?',
  ],
  summary: [
    {
      title: '관계의 기간과 현재 친밀도',
      body: '10년간 알고 지냈지만 최근에는 연락과 만남이 줄어든 상태예요.',
    },
    {
      title: '축의금 10만 원의 적정성',
      body: '결혼식 참석 여부, 현재 관계, 개인의 경제 상황에 따라 판단이 달라질 수 있어요.',
    },
    {
      title: '축의금과 관계의 의미',
      body: '오랜 친구라는 이유로 더 많은 금액을 기대하거나, 금액으로 우정을 판단해도 되는지가 쟁점이에요.',
    },
  ],
  choices: [
    { id: 'writer', label: ['글쓴이 입장이', '더 타당해요'], imageUrl: voteWriter },
    { id: 'other', label: ['상대방 입장이', '더 타당해요'], imageUrl: voteOther },
    { id: 'both', label: ['양쪽 모두', '일리가 있어요'], imageUrl: voteBoth },
    { id: 'neither', label: ['양쪽 모두', '타당하지 않아요'], imageUrl: voteNeither },
  ],
} as const

export type WeddingGiftVoteId = (typeof weddingGiftCase.choices)[number]['id']

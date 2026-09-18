import { profileAvatars } from './profileAvatars'
import resultArtwork from '../../assets/case/result/panmung-scale-first-frame.png'
import { weddingGiftCase } from './caseDetailContent'
import { demoEventAt, formatDemoDateTime, formatElapsedMinutes, JURY_VOTE_DURATION } from './demoClock'
import { voteDisplayById, type CaseResultComment } from './caseResultContent'

/** 광장 첫 카드와 상세·결과가 공유하는 시연 사건. */
export const parentsCase = {
  id: 'case-parents-interfere',
  category: '가족',
  author: {
    nickname: '익명의 다람쥐',
    createdAt: formatDemoDateTime(demoEventAt(28)),
    avatarUrl: profileAvatars[5],
  },
  title: '부모님이 자꾸만 제 결정에 간섭하는데 해결 방안을 알려주세요.',
  cardSummary: '내 삶의 선택을 존중받고 싶은데 계속 설득하려 하세요.',
  caseNumber: '#CASE-FAMILY-125',
  age: formatElapsedMinutes(28),
  ageMinutes: 28,
  participantCount: 84,
  deadline: JURY_VOTE_DURATION,
  paragraphs: [
    '취업을 준비하면서 제가 관심 있는 분야의 회사에 지원하기로 했어요. 그런데 부모님은 안정적인 직장을 먼저 알아보라며 지원할 회사와 면접 일정까지 함께 정하려고 하세요.',
    '걱정해 주시는 마음은 알지만, 제가 다른 선택을 말할 때마다 “나중에 후회하면 어떡하니?”라는 대답이 돌아와요. 여러 번 제 계획과 준비한 이유를 설명했는데도 대화는 결국 부모님을 설득하는 자리가 됩니다.',
    '조언은 듣고 싶지만 최종 선택은 제가 하고 싶어요. 부모님의 걱정을 무시하지 않으면서도 제 결정의 경계를 어떻게 전하면 좋을까요?',
  ],
  summary: [
    { title: '부모님의 걱정', body: '취업의 안정성을 중요하게 생각해 지원 과정에도 관여하고 있어요.' },
    { title: '글쓴이의 선택권', body: '글쓴이는 조언을 들을 의향이 있지만 최종 결정은 직접 하고 싶어 해요.' },
    { title: '대화의 경계', body: '걱정을 인정하면서도 어디까지 조언을 받고 결정할지 정하는 게 핵심이에요.' },
  ],
  choices: weddingGiftCase.choices,
} as const

export const parentsResult = {
  deadline: parentsCase.deadline,
  artworkUrl: resultArtwork,
  verdict: {
    label: '판멍이의 판단',
    title: '글쓴이의\n손을 들어줬어요',
    description: '부모님의 걱정을 들으면서도\n진로의 최종 결정은 스스로 할 수 있어요.',
  },
  aiVerdictLabel: '판멍이가 주목한 점',
  aiVerdictTitle: '걱정을 표현하는 것과\n선택을 대신하는 것은 달라요',
  aiReasons: [
    '부모님이 안정적인 진로를 바라는 마음은 이해할 수 있어요. 다만 지원할 회사와 면접 일정까지 정하는 것은 글쓴이의 선택 공간을 좁힐 수 있어요.',
    '글쓴이가 준비한 계획을 구체적으로 공유하고, 조언은 듣되 지원 여부는 직접 결정하겠다는 경계를 차분히 전해 보세요.',
  ],
  commentCount: 14,
} as const

const commentBodies = [
  ['both', '부모님은 불안해서 그러시는 것 같아요. 걱정은 듣되 지원할 곳은 직접 고르겠다고 말씀해 보세요.'],
  ['writer', '면접 일정까지 정하려는 건 조언을 넘어선 것 같아요. 글쓴이의 선택을 존중해 주셨으면 해요.'],
  ['other', '취업이 급한 상황이라면 부모님이 안정성을 강조하는 이유도 이해돼요. 준비한 계획을 보여 드리면 어떨까요?'],
  ['writer', '결과를 책임질 사람은 본인이니 결정권도 본인에게 있어야 한다고 생각해요.'],
  ['both', '관심 분야에 지원하면서 부모님이 추천한 회사도 함께 살펴보는 절충안이 있을 것 같아요.'],
  ['writer', '설명할 때마다 설득해야 한다면 지치죠. 조언을 들을 때와 결정할 때를 분리해 보세요.'],
  ['both', '부모님께 지금까지 준비한 지원 목록과 일정표를 보여 드리면 걱정이 조금 줄지 않을까요?'],
  ['writer', '걱정해 주시는 마음은 고맙다고 먼저 말하고, 지원서 제출은 직접 하겠다고 정해 보세요.'],
  ['other', '부모님이 경험에서 우러나온 조언을 하시는 걸 수도 있으니 안정적인 선택지도 검토해 보면 좋겠어요.'],
  ['both', '서로 원하는 게 달라도 대화를 이어갈 수 있어요. 어느 부분에서 도움이 필요한지 구체적으로 부탁해 보세요.'],
  ['writer', '관심 분야에 도전할 기회 자체를 잃지 않았으면 해요. 선택과 책임은 같이 가는 거니까요.'],
  ['both', '부모님이 걱정하는 지점을 먼저 적어 보고 각각 어떻게 대비할지 이야기해 보세요.'],
  ['writer', '같은 설명을 반복하기보다 “의견은 참고할게요. 최종 지원은 제가 할게요”라고 짧게 전해도 돼요.'],
  ['neither', '서로를 설득하는 데만 집중하면 대화가 막혀요. 잠시 진로 이야기를 쉬는 것도 방법이에요.'],
] as const

const nicknames = [
  '진로찾는중', '내길은내가', '걱정많은곰', '한발씩천천히', '대화의온도',
  '취준동료', '계획표장인', '경계연습중', '현실적인토끼', '서로듣기',
  '도전하는마음', '차분한배심원', '선택은나의몫', '숨고르기',
] as const

export function createParentsSeedComment(index: number): CaseResultComment {
  const [voteId, body] = commentBodies[index]
  const minutes = index * 2 + 1
  return {
    id: `parents-seed-comment-${index + 1}`,
    avatarUrl: profileAvatars[index % profileAvatars.length],
    nickname: nicknames[index],
    createdAt: `${minutes}분 전`,
    voteId,
    voteLabel: voteDisplayById[voteId].label,
    body,
    likes: (index * 3 + 2) % 18,
    dislikes: index % 4,
  }
}

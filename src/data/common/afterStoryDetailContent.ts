import avatar1 from '../../assets/case/result/comment-avatar-1.png'
import avatar2 from '../../assets/case/result/comment-avatar-2.png'
import avatar3 from '../../assets/case/result/comment-avatar-3.png'
import avatar4 from '../../assets/case/result/comment-avatar-4.png'
import avatar5 from '../../assets/case/result/comment-avatar-5.png'
import type { ThreadComment } from '../../components/common/CommentThread'

/**
 * 공개 후일담 상세(AS06) 화면의 고정 데이터.
 *
 * 기준 시안: Figma `AS06 / 공개 후일담 상세 · 편지형` (노드 `2778:15991`)
 *
 * 서버가 없는 단계라 모두 시연용 예시다. 새로고침하면 처음 상태로 돌아간다.
 * (PROJECT_SPEC.md §1-5 — mock 데이터를 실제 응답처럼 보이게 하지 않는다)
 */

/** 후일담을 남긴 사람. 시안의 `Author / 익명의 왈가닥` 영역 값. */
export const afterStoryAuthor = {
  eyebrow: '판결 이후의 이야기들',
  titleLines: ['먼저 사과한 뒤,', '서로의 의견을 묻게 됐어요.'],
  lead: '다툼이 끝난 뒤에도, 관계는 계속되니까요.',
  name: '익명의 왈가닥',
  meta: '친구 · 후일담',
} as const

/**
 * 편지지에 적히는 후일담 본문.
 *
 * 시안의 편지지는 줄이 그어진 8칸이고 칸마다 한 줄씩 들어간다(`2778:16012`~`2778:16026`).
 * 그래서 문단이 아니라 줄 단위로 둔다. 줄바꿈 위치도 시안 그대로다.
 */
export const afterStoryLetter = {
  heading: '그날 이후',
  lines: [
    '처음에는 제가 사과하면 모든 잘못을 인정하는 것처럼',
    '느껴졌어요. 그런데 친구의 이야기를 차분히 듣고 보니,',
    '저도 모르게 앞에서 친구를 곤란하게 했더라고요.',
    '친구도 갑자기 노트북이 고장 나 당황했고, 어떻게 설명',
    '해야 할지 몰라 연락이 늦었다고 했어요.',
    '지금은 조별 과제를 할 때 서로의 의견을 먼저 묻고,',
    '일정이 어려워지면 바로 이야기하기로 했어요. 아직 가끔',
    '어색하지만, 예전보다 솔직하게 대화할 수 있게 됐어요.',
  ],
} as const

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5]

const voteLabels = {
  writer: '투표 · 글쓴이 입장',
  other: '투표 · 상대방 입장',
  both: '투표 · 양쪽 모두',
} as const

/** 배열에 적는 값만 추려서 쓰기 위한 중간 형태. 화면에 필요한 나머지는 아래에서 채운다. */
type CommentSeed = [minutesAgo: number, nickname: string, voteId: keyof typeof voteLabels | null, body: string, likes: number, dislikes: number]

/**
 * 후일담에 달린 댓글.
 *
 * 시안(`2778:16041`~`2778:16045`)에 있는 다섯 건은 다른 사건(영상 제작 잔금)의 문구라
 * 이 화면의 이야기와 맞지 않는다. 그래서 문구는 이 후일담의 흐름 —
 * 공개 지적 → 사과 → 노트북 고장이라는 사정 → 서로 의견 묻기 — 에 맞춰 새로 썼다.
 * 배지는 원래 사건(조별 과제 공개 지적)에서 그 사람이 어디에 투표했는지를 가리킨다.
 *
 * 글을 막 공개한 직후라는 흐름에 맞춰 댓글은 네 건만 둔다. 최신순 목록의 마지막 댓글도
 * `2분 전`이므로, 그 위 댓글들은 모두 그보다 최근에 남겨진 것으로 표시한다.
 * 한 페이지에 다 보이므로 아래 페이지네이션의 양쪽 화살표도 비활성 상태가 된다.
 */
const commentSeeds: CommentSeed[] = [
  [0, '귤한봉지', 'other', '지금이라도 서로 사정을 알게 돼서 다행이에요. 잘 풀렸다니 마음이 놓이네요.', 1, 0],
  [1, '퇴근은여섯시', 'writer', '공개적으로 말한 부분을 돌아보고 사과한 게 정말 멋져요.', 2, 0],
  [1, '주말엔이불속', 'both', '둘 다 조금씩 어긋났던 거였군요. 다음에는 더 편하게 이야기할 수 있겠어요.', 1, 0],
  [2, '산책중인감자', 'other', '서로 의견을 먼저 묻기로 한 약속이 오래 이어지면 좋겠어요.', 0, 0],
]

export const afterStoryComments: ThreadComment[] = commentSeeds.map(
  ([minutesAgo, nickname, voteId, body, likes, dislikes], index) => ({
    id: `afterstory-comment-${index + 1}`,
    nickname,
    minutesAgo,
    voteId,
    voteLabel: voteId ? voteLabels[voteId] : null,
    body,
    likes,
    dislikes,
    avatarUrl: avatars[index % avatars.length],
  }),
)

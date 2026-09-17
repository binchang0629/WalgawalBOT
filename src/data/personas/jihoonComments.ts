import type { ThreadComment } from '../../components/common/CommentThread'
import { toAfterStoryDetail, toCaseResult } from '../../routes/paths'
import type { WeddingGiftVoteId } from '../common/caseDetailContent'
import { COMMUNITY_AFTER_STORIES } from '../common/afterStoryList'
import { latestPlazaCaseIds, plazaCases } from '../common/plazaContent'
import { accountProfileAvatars } from '../common/profileAvatars'
import { DEMO_ACCOUNTS } from './index'

/**
 * 지훈(B) 계정이 예전에 남긴 댓글.
 *
 * 지훈은 기존 사용자라 MY > 내가 쓴 댓글이 처음부터 비어 있으면 앞뒤가 맞지 않는다.
 * 그래서 광장에 이미 있는 사건 12건에 지훈의 댓글을 미리 심어 둔다.
 * 사건을 새로 만들지 않고 기존 사건의 댓글 한 자리를 대신 쓰는 방식이라,
 * MY에서 누르면 그 사건 결과 화면의 댓글 목록에 같은 글이 실제로 있다.
 *
 * 문구는 지훈의 성격에 맞췄다 — 감정보다 사실·기록·기준을 먼저 확인하는 쪽이다.
 * (PROJECT_SPEC.md §0-5, 자료종합 퍼소나 메모)
 *
 * 서아(A)는 신규 가입이라 아무것도 심지 않는다. 직접 쓴 댓글만 쌓인다.
 * 서버가 없는 시연 데이터이며, 실제로 저장된 기록처럼 보이게 하지 않는다. (PROJECT_SPEC.md §1-5)
 */

interface JihoonCommentSeed {
  caseId: string
  voteId: WeddingGiftVoteId
  body: string
  /**
   * 몇 분 전에 쓴 댓글인지.
   *
   * 18분 전부터 10시간 전까지 고르게 벌려 뒀다. 한 값으로 계산해 두면 열두 건이
   * 두세 시간 안에 몰려 `2시간 전`만 줄줄이 나온다.
   * 사건 나이를 넘지 않도록 읽을 때 한 번 더 자른다(`jihoonCommentMinutesAgo`).
   */
  minutesAgo: number
}

/**
 * 광장 사건에 남긴 8건. 18분 전부터 6시간 전까지다.
 *
 * 광장 사건은 가장 오래된 것도 12시간 전 글이라, 그보다 오래된 댓글은 이 목록에 둘 수 없다.
 * 며칠 전 댓글은 아래 후일담 쪽(`afterStorySeeds`)에서 맡는다.
 *
 * 지훈 본인이 올린 `case-company-874`와, 별도 콘텐츠 파일을 쓰는 `case-parents-interfere`는 뺐다.
 * (두 사건은 `plazaCaseStories`의 공통 댓글 생성을 거치지 않는다)
 */
const seeds: JihoonCommentSeed[] = [
  {
    caseId: 'case-secret-told',
    voteId: 'writer',
    body: '걱정돼서 한 말이라도 옮기기 전에 한 번 물어봤다면 달랐을 거예요. 의도보다 순서의 문제로 보입니다.',
    minutesAgo: 140,
  },
  {
    caseId: 'case-invite-ex',
    voteId: 'both',
    body: '모임을 깨야 할 일도, 초대를 강행할 일도 아닌 것 같아요. 이번 한 번을 어떻게 할지만 먼저 정하면 됩니다.',
    minutesAgo: 95,
  },
  {
    caseId: 'case-dating-anniversary',
    voteId: 'writer',
    body: '서운함을 말하는 건 탓하는 것과 달라요. 그냥 넘기면 다음 기념일에 더 큰 일이 됩니다.',
    minutesAgo: 195,
  },
  {
    caseId: 'case-dating-travel-cost',
    voteId: 'other',
    body: '돈을 더 냈다고 결정권까지 따라오지는 않죠. 다만 부담이 한쪽에 몰린 건 따로 정산하는 게 맞습니다.',
    minutesAgo: 18,
  },
  {
    caseId: 'case-friend-loan',
    voteId: 'writer',
    body: '6개월이면 충분히 기다렸다고 봅니다. 사이가 더 상하기 전에 상환 일정만이라도 글로 남겨두세요.',
    minutesAgo: 375,
  },
  {
    caseId: 'case-friend-trip-cancel',
    voteId: 'both',
    body: '취소 수수료가 실제로 얼마 나갔는지부터 확인해야 해요. 전액이냐 아니냐는 그다음 이야기입니다.',
    minutesAgo: 250,
  },
  {
    caseId: 'case-friend-group-chat',
    voteId: 'writer',
    body: '한두 번은 우연일 수 있지만 반복되면 신호예요. 그래도 확인하기 전에 결론부터 내리진 않았으면 합니다.',
    minutesAgo: 47,
  },
  {
    caseId: 'case-family-living-expenses',
    voteId: 'both',
    body: '부모님 사정과 본인 생활을 같이 봐야죠. 전부냐 아니냐 대신 금액과 기간을 정해두는 편이 낫습니다.',
    minutesAgo: 310,
  },
]

/**
 * 후일담에 남긴 4건. 20시간 전부터 3일 전까지다.
 *
 * MY의 오래된 쪽을 이 네 건이 채운다. 후일담은 목록 뒤쪽이 2~5일 전이라
 * 글보다 오래된 댓글이 되지 않으면서도 `3일 전`까지 내려갈 수 있다.
 * 값은 각 글의 나이 안쪽으로 잡았다 — 5일 전 글의 3일 전 댓글 같은 식이다.
 */
interface JihoonAfterStorySeed {
  /** 라우트에서 쓰는 id. `COMMUNITY_AFTER_STORIES`의 id 앞에 `afterstory-`가 붙는다. */
  storyId: string
  body: string
  minutesAgo: number
}

const afterStorySeeds: JihoonAfterStorySeed[] = [
  {
    // 생활비 사건은 광장 쪽에 이미 지훈 댓글이 있어, MY에서 같은 제목이 두 번 나오지 않도록 다른 글을 쓴다.
    storyId: 'afterstory-study-presentation',
    body: '결국 결과물보다 절차 문제였네요. 저도 작업물을 넘기기 전에 한 번 더 확인받는 편이 마음 편하더라고요.',
    minutesAgo: 1250,
  },
  {
    storyId: 'afterstory-group-project-credit',
    body: '지적한 내용이 틀려서가 아니라 방식을 돌아본 거네요. 그 둘을 구분해내는 게 제일 어려운 일입니다.',
    minutesAgo: 1600,
  },
  {
    storyId: 'afterstory-birthday-gift',
    body: '오해는 사실보다 침묵에서 커지죠. 늦더라도 직접 말한 게 제일 나은 선택이었다고 봅니다.',
    minutesAgo: 2900,
  },
  {
    storyId: 'afterstory-team-dinner',
    body: '빠지는 게 문제가 아니라 기준이 없던 게 문제였던 거죠. 미리 정해두면 서로 눈치 볼 일이 줄어듭니다.',
    minutesAgo: 4400,
  },
]

export function findJihoonAfterStorySeed(storyId: string | undefined): JihoonAfterStorySeed | null {
  if (!storyId) return null
  return afterStorySeeds.find((seed) => seed.storyId === storyId) ?? null
}

/**
 * 후일담 댓글 목록의 한 자리를 지훈 댓글로 바꾼다.
 *
 * 광장 사건과 같은 이유로 새로 끼워 넣지 않고 한 건을 대신한다.
 * 화면 순서는 `CommentThread`가 `minutesAgo`로 다시 정하므로 배열 자리는 상관없다.
 */
export function withJihoonAfterStoryComment(storyId: string | undefined, comments: ThreadComment[]): ThreadComment[] {
  const seed = findJihoonAfterStorySeed(storyId)
  if (!seed || comments.length === 0) return comments

  const slot = Math.min(comments.length - 1, Math.floor(comments.length * 0.45))
  const next = [...comments]
  next[slot] = {
    ...next[slot],
    id: `${seed.storyId}-jihoon-comment`,
    nickname: jihoonCommentAuthor.nickname,
    avatarUrl: jihoonCommentAuthor.avatarUrl,
    minutesAgo: seed.minutesAgo,
    body: seed.body,
    stickerId: undefined,
    likes: 4,
    dislikes: 0,
  }
  return next
}

/** 사건 댓글 목록과 MY 기록이 같은 댓글임을 알아볼 수 있게 id를 한곳에서 만든다. */
export const jihoonCommentId = (caseId: string) => `${caseId}-jihoon-comment`

/**
 * 지훈의 댓글이 그 사건 안에서 몇 분 전 글인지.
 *
 * 값 자체는 위 목록에 적어 뒀다. 다만 사건이 올라오기도 전에 달린 댓글이 될 수는 없으므로,
 * 사건 나이(`plazaCaseStories`와 같은 `28 + 목록 순서 × 37`분)보다 안쪽으로 한 번 더 자른다.
 * 목록 순서가 바뀌어 사건이 더 최근 글이 되어도 이 규칙 덕분에 어긋나지 않는다.
 */
export function jihoonCommentMinutesAgo(caseId: string): number {
  const seed = findJihoonCommentSeed(caseId)
  const position = latestPlazaCaseIds.findIndex((id) => id === caseId)
  const caseAgeMinutes = 28 + Math.max(0, position) * 37
  // 사건 직후가 아니라 조금 지난 시점에 둬야 위아래로 다른 배심원 댓글이 함께 보인다.
  const fallback = Math.round(caseAgeMinutes * 0.45)
  return Math.max(1, Math.min(seed?.minutesAgo ?? fallback, caseAgeMinutes - 1))
}

export function findJihoonCommentSeed(caseId: string): JihoonCommentSeed | null {
  return seeds.find((seed) => seed.caseId === caseId) ?? null
}

/** 사건 댓글 목록에 넣을 때 쓰는 작성자 정보. 공개 댓글이라 계정의 익명 프로필을 쓴다. */
export const jihoonCommentAuthor = {
  nickname: DEMO_ACCOUNTS.B.nickname,
  avatarUrl: accountProfileAvatars.jihun,
} as const

export interface JihoonCommentRecord {
  id: string
  caseId: string
  caseTitle: string
  href: string
  body: string
  createdAt: number
}

/**
 * MY > 내가 쓴 댓글에 넣을 형태로 바꾼다.
 *
 * 시각은 화면을 연 시점에서 거꾸로 센다. 고정 날짜를 박아두면 시연을 며칠 뒤에 다시 열었을 때
 * `9월 8일`처럼 지난 날짜로 굳어 버린다.
 */
export function jihoonCommentRecords(now = Date.now()): JihoonCommentRecord[] {
  const caseRecords = seeds.flatMap((seed) => {
    const card = plazaCases.find((item) => item.id === seed.caseId)
    if (!card) return []

    return [{
      id: jihoonCommentId(seed.caseId),
      caseId: seed.caseId,
      // 목록 카드의 제목은 두 줄로 끊겨 있다. MY에서는 한 줄로 이어 붙인다.
      caseTitle: card.title.replace('\n', ' '),
      href: toCaseResult(seed.caseId),
      body: seed.body,
      createdAt: now - jihoonCommentMinutesAgo(seed.caseId) * 60_000,
    }]
  })

  const afterStoryRecords = afterStorySeeds.flatMap((seed) => {
    const story = COMMUNITY_AFTER_STORIES.find((item) => `afterstory-${item.id}` === seed.storyId)
    if (!story) return []

    return [{
      id: `${seed.storyId}-jihoon-comment`,
      caseId: seed.storyId,
      caseTitle: story.title,
      href: toAfterStoryDetail(seed.storyId),
      body: seed.body,
      createdAt: now - seed.minutesAgo * 60_000,
    }]
  })

  return [...caseRecords, ...afterStoryRecords]
}

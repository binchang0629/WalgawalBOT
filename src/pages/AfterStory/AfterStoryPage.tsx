import { Fragment, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import type { FormEvent, Ref } from 'react'
import useLoginGate from '../../hooks/useLoginGate'
import useSession from '../../hooks/useSession'
import EmptyCaseState from '../../components/common/EmptyCaseState'
import CaseFolderCard from '../../components/common/CaseFolderCard'
import CompletionScene from '../../components/common/CompletionScene'
import IconCloseButton from '../../components/common/IconCloseButton'
import { PATHS, toAfterStoryDetail, toCaseDetail } from '../../routes/paths'
import CaseSubmitProgress from '../Submit/components/CaseSubmitProgress'
import CaseSubmitDemoFill from '../Submit/components/CaseSubmitDemoFill'
import backIcon from '../../assets/my/back.svg'
import walgadakEmpathy from '../../assets/case/stickers/walgadak-empathy.png'
import { profileAvatars } from '../../data/common/profileAvatars'
import CommentThread from '../../components/common/CommentThread'
import Pagination from '../../components/common/Pagination'
import { afterStoryAuthor, afterStoryComments, afterStoryLetter } from '../../data/common/afterStoryDetailContent'
import { COMMUNITY_AFTER_STORIES } from '../../data/common/afterStoryList'
import { withJihoonAfterStoryComment } from '../../data/personas/jihoonComments'
import { afterStoryCardComments, parseElapsedMinutes, retimeComments } from '../../data/common/afterStoryCardComments'
import scrollBackground from '../../assets/afterstory/figma/scroll-background.png'
import letterPaper from '../../assets/afterstory/figma/letter-paper.png'
import detailBackground from '../../assets/afterstory/figma/detail-background.png'
import writePencil from '../../assets/afterstory/figma/write-pencil.png'
import readBook from '../../assets/afterstory/figma/read-book.png'
import walgadakFace from '../../assets/home/figma/close-call-mascot.svg'
import clickTapIcon from '../../assets/afterstory/figma/icon-park-click-tap.svg'
import searchIcon from '../../assets/plaza/search-field.svg'
import './AfterStoryPage.css'
import './AfterStoryDetailPage.css'

const CONNECTED_CASE = {
  category: '친구 · 투표 종료',
  title: '조별 과제에서 친구를 공개적으로\n지적한 제가 너무 예민했던 걸까요?',
  storyTitle: '먼저 사과한 뒤,\n서로의 의견을 묻게 됐어요.',
  context: '조별 과제에서 친구를 공개적으로 지적한 사건',
} as const

/*
 * 발표 시연용 예시 후일담.
 * `후일담 예시 한번에 채우기`를 누르면 본문 칸이 이 글로 채워진다.
 * 무대에서 타이핑할 시간이 없어서 넣은 장치다.
 */
// 좁은 편지 미리보기에서도 '가끔 어색하지만'이 서로 떨어지지 않게 줄을 나눈다.
const DEMO_STORY = afterStoryLetter.lines.join('\n').replace(
  ' 아직 가끔\n어색하지만, ',
  '\n아직 가끔\u00a0어색하지만, ',
)

const AFTER_STORY_DETAILS = {
  'afterstory-birthday-gift': {
    author: { ...afterStoryAuthor, titleLines: ['늦게라도 마음을 전하고,', '친구와 오해를 풀었어요.'], lead: '선물보다 서운했던 이유를 듣는 게 먼저였어요.', name: '늦은축하편지', avatarUrl: profileAvatars[7] },
    lines: [
      '친한 친구의 생일에 선물을 바로 전하지 못했어요.',
      '바쁜 일정이 지나면 제대로 챙겨주려고 했는데',
      '친구는 제가 생일을 잊은 줄 알고 서운해했어요.',
      '늦게 준비한 선물만 건네면 풀릴 거라 생각했지만',
      '먼저 왜 속상했는지 직접 물어봤어요.',
      '친구는 비싼 선물보다 생일에 연락 한마디라도',
      '받고 싶었다고 말했어요. 제 사정을 설명하고',
      '제때 마음을 전하지 못한 점을 사과했어요.',
      '뒤늦게 선물과 편지를 건넸고, 서로의 마음을',
      '확인한 뒤 다시 편하게 이야기하게 됐어요.',
    ],
  },
  'afterstory-video-payment': {
    author: { ...afterStoryAuthor, titleLines: ['요청한 색감으로 고친 뒤,', '잔금도 받을 수 있었어요.'], lead: '수정 범위를 다시 확인하고 약속한 결과물을 전달했어요.', meta: '직장 · 후일담', name: '색감다시보기', avatarUrl: profileAvatars[4] },
    lines: [
      '카페 홍보영상을 180만 원에 제작했어요.',
      '두 차례 수정했지만 의뢰인이 처음 요청한',
      '밝고 따뜻한 색감은 충분히 반영하지 못했어요.',
      '영상이 게시됐다는 이유만으로 잔금을 요구하기보다',
      '계약서와 주고받은 요청을 함께 다시 확인했어요.',
      '색감 보완 범위를 합의한 뒤 최종본을 수정했고,',
      '계약에 포함된 원본 파일도 함께 전달했어요.',
      '의뢰인이 최종 결과물을 확인하고 승인해',
      '남은 잔금 90만 원을 무사히 받을 수 있었어요.',
      '다음 작업부터는 수정 기준을 더 분명히 적어두려 해요.',
    ],
  },
  'afterstory-friend-loan': {
    author: { ...afterStoryAuthor, titleLines: ['직접 대화해보니,', '서로 오해를 풀었어요.'], lead: '돈 이야기를 피하지 않고 꺼내니 관계가 조금 달라졌어요.', name: '달력에동그라미', avatarUrl: profileAvatars[2] },
    lines: [
      '친구에게 300만 원을 빌려준 뒤 6개월 동안',
      '돌려받지 못했어요. 돈 이야기가 불편해서',
      '서로 연락을 피하다가 직접 만나기로 했어요.',
      '돈을 재촉하면 친구 사이마저 멀어질까 겁났어요.',
      '친구는 당장 갚기 어려운 사정이 있었다며',
      '말하지 않고 미뤄서 미안하다고 했어요.',
      '언제 얼마씩 갚을지 메시지로 남겼고,',
      '대화를 마친 뒤에는 서로의 상황을 먼저 말하자고 약속했어요.',
      '아직 다 해결된 건 아니지만 이제는',
      '피하지 않고 이야기할 수 있게 됐어요.',
    ],
  },
  'afterstory-idea-credit-card': {
    author: { ...afterStoryAuthor, titleLines: ['이메일 증거를 제출한 뒤,', '공동 기여를 인정받았어요.'], lead: '아이디어를 어떻게 만들었는지 차분히 설명했어요.', meta: '직장 · 후일담', name: '메일함탐정', avatarUrl: profileAvatars[6] },
    lines: [
      '회의에서 제가 준비한 아이디어를 직속 사수가',
      '자신의 제안처럼 발표해 당황했어요.',
      '제안 초안과 수정 기록, 팀에 보낸 이메일을',
      '날짜순으로 모아 팀장에게 면담을 요청했어요.',
      '면담 전에 누가 어떤 작업을 맡았는지 표로 정리해 두었어요.',
      '누가 옳은지 따지기보다 제가 만든 부분을',
      '차분히 설명했고, 기록도 함께 보여줬어요.',
      '팀장도 자료를 보니 제 기여가 분명하다고 말해줬어요.',
      '최종 보고서에 두 사람의 이름이 들어가',
      '공동 기여를 인정받을 수 있었습니다.',
    ],
  },
  'afterstory-secret-told': {
    author: { ...afterStoryAuthor, titleLines: ['친구와 다시 이야기하며,', '서로의 경계를 정했어요.'], lead: '사과를 받았지만 신뢰는 천천히 회복하고 있어요.', name: '잠긴일기장', avatarUrl: profileAvatars[3] },
    lines: [
      '친구에게만 털어놓은 이야기가 학교에서',
      '다른 친구들에게 전해졌다는 걸 알았어요.',
      '화가 났지만 먼저 어떻게 된 일인지 물어봤어요.',
      '친구는 가볍게 말해도 되는 얘기인 줄 알았다며',
      '미안하다고 했어요. 저는 그 말이 왜 상처였는지',
      '설명했고, 더는 제 이야기를 옮기지 말아 달라고 했어요.',
      '친구는 들은 사람들에게도 그만 이야기해 달라고',
      '전했어요. 예전처럼 바로 편해지진 않았지만,',
      '이제는 서로의 허락을 먼저 묻기로 했어요.',
    ],
  },
} as const

/**
 * `내 이야기 남기기` 화면에 올라오는 내 사건 목록. Figma 왈가왈후 시안 기준.
 * 실제 서버 데이터가 아니라 시연용 고정 데이터다.
 */
const MY_CLOSED_CASES = [
  {
    id: 'friend',
    category: '친구',
    tone: 'friend',
    titleLines: ['조별 과제에서 친구를 공개적으로 지적한', '제가 너무 예민했던 걸까요?'],
    opinionCount: 88,
    commentCount: 44,
  },
  {
    id: 'company',
    category: '직장',
    tone: 'company',
    titleLines: ['납품한 디자인을 사용하면서 잔금을 지급하지 않는', '의뢰인에게 어떻게 대응해야 할까요?'],
    opinionCount: 28,
    commentCount: 84,
  },
] as const

/**
 * 다른 사용자가 공개한 후일담.
 *
 * 태그(연인·친구·가족·직장·학업)마다 5건씩, 모두 25건이다.
 * 한 쪽에 5건씩 보이므로 `전체`는 정확히 5페이지가 되고,
 * 태그를 고르면 그 태그의 5건이 한 쪽에 들어온다.
 *
 * 되도록 광장에 이미 있는 시연 사건을 연결한다. 다만 광장 사건만으로는
 * 연인·가족·직장이 각각 한 건씩 모자라서, 그 세 건은 같은 결의 생활 갈등으로 새로 썼다.
 * (id에 광장 사건이 없으면 상세 화면이 공통 후일담 문구로 채운다.)
 */
const AFTER_STORY_CATEGORIES = ['전체', '연인', '친구', '가족', '직장', '학업'] as const
type AfterStoryCategory = (typeof AFTER_STORY_CATEGORIES)[number]

/*
 * 한 장에 4건. 후일담 16건을 5개씩 끊으면 마지막 장에 한 건만 남는다.
 * 광장 목록도 4개 단위라 페이지 모양이 서로 맞는다. (PROJECT_SPEC.md §9-14)
 */
const AFTER_STORIES_PER_PAGE = 4

interface AfterStoryLocationState {
  content?: string
  from?: string
  caseResultState?: Record<string, unknown> | null
  caseResultScrollTop?: number
}

/**
 * 왈가왈후 공통 헤더.
 *
 * `onBack`을 주면 왼쪽에 뒤로가기가 붙고, 안 주면 빈 칸이 들어간다.
 * 왈가왈후 홈은 하단 내비게이션으로 오가는 첫 화면이라 MY·광장처럼 뒤로가기를 두지 않는다.
 * 양옆 칸 너비가 같아서 버튼이 있든 없든 제목은 정중앙에 선다.
 */
function AfterStoryHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <header className="afterstory-header">
      {onBack ? (
        <button type="button" onClick={onBack} aria-label="이전 화면으로 돌아가기"><img src={backIcon} alt="" /></button>
      ) : (
        <span aria-hidden="true" />
      )}
      <h1>{title}</h1>
      <span aria-hidden="true" />
    </header>
  )
}

function CaseContextCard() {
  return (
    <section className="afterstory-case-context">
      <p>{CONNECTED_CASE.category}</p>
      <h2>{CONNECTED_CASE.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
    </section>
  )
}

function CaseContextFolder({ onOpen, isOpen, triggerRef }: {
  onOpen: () => void
  isOpen: boolean
  triggerRef: Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={triggerRef}
      className="afterstory-case-folder-trigger"
      role="button"
      tabIndex={0}
      aria-label="작성한 후일담 편지 미리보기"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
    >
      <CaseFolderCard className="afterstory-case-folder" paperClassName="afterstory-case-folder__paper">
        <h2>{CONNECTED_CASE.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
        <div className="afterstory-case-folder__status">
          <span>후일담 연결 사건</span>
          <strong>투표 종료</strong>
        </div>
      </CaseFolderCard>
    </div>
  )
}

export function AfterStoryHomePage() {
  const { requireLogin } = useLoginGate()
  const navigate = useNavigate()
  const communitySectionRef = useRef<HTMLElement>(null)
  const communityListRef = useRef<HTMLDivElement>(null)
  const peelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [peelingStoryId, setPeelingStoryId] = useState<string | null>(null)
  const [communityQuery, setCommunityQuery] = useState('')
  const [communityCategory, setCommunityCategory] = useState<AfterStoryCategory>('전체')
  const [communityPage, setCommunityPage] = useState(1)

  const normalizedCommunityQuery = communityQuery.trim().toLowerCase()
  const filteredCommunityStories = COMMUNITY_AFTER_STORIES.filter((story) => {
    const matchesCategory = communityCategory === '전체' || story.category === communityCategory
    const matchesQuery = !normalizedCommunityQuery || [story.title, story.summary, story.category]
      .join(' ')
      .toLowerCase()
      .includes(normalizedCommunityQuery)
    return matchesCategory && matchesQuery
  })
  const communityTotalPages = Math.max(1, Math.ceil(filteredCommunityStories.length / AFTER_STORIES_PER_PAGE))
  const safeCommunityPage = Math.min(communityPage, communityTotalPages)
  const visibleCommunityStories = filteredCommunityStories.slice(
    (safeCommunityPage - 1) * AFTER_STORIES_PER_PAGE,
    safeCommunityPage * AFTER_STORIES_PER_PAGE,
  )

  const handleCommunityPageChange = (page: number) => {
    if (page === safeCommunityPage) return
    setCommunityPage(page)

    const section = communitySectionRef.current
    const scrollRoot = section?.closest<HTMLElement>('.main-layout__scroll')
    if (!section || !scrollRoot) return

    const targetTop = scrollRoot.scrollTop + section.getBoundingClientRect().top - scrollRoot.getBoundingClientRect().top - 12
    scrollRoot.scrollTo({
      top: Math.max(0, targetTop),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  useEffect(() => () => {
    if (peelTimerRef.current) clearTimeout(peelTimerRef.current)
  }, [])

  const openCommunityStory = (storyId: string) => {
    if (peelingStoryId) return
    const destination = toAfterStoryDetail(`afterstory-${storyId}`)
    const state = { from: PATHS.afterStory }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate(destination, { state })
      return
    }
    setPeelingStoryId(storyId)
    peelTimerRef.current = setTimeout(() => navigate(destination, { state }), 400)
  }

  useEffect(() => {
    const list = communityListRef.current
    const scrollRoot = list?.closest<HTMLElement>('.main-layout__scroll')
    if (!list || !scrollRoot) return

    const cards = [...list.querySelectorAll<HTMLElement>('.afterstory-community-card')]
    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { root: scrollRoot, rootMargin: '0px 0px -100px 0px', threshold: 0.2 })

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [communityCategory, normalizedCommunityQuery, safeCommunityPage])

  return (
    <main className="afterstory-home">
      <AfterStoryHeader title="왈가왈후~" />
      <div className="afterstory-home__scroll" style={{ backgroundImage: `url(${scrollBackground})` }}>
        <section className="afterstory-hero">
          <p>왈가왈</p>
          <h2>그 이후의 이야기</h2>
          <span>투표가 끝난 뒤에도 이야기는 계속돼요</span>
        </section>

        <section className="afterstory-entry-cards" aria-label="후일담 둘러보기">
          {/*
            내 사건을 다루는 화면이라 로그인이 필요하다.
            비로그인이면 이동을 막고 보던 화면 위에 안내 팝업만 띄운다.
            라우트로 막지 않는 이유는 LoginGateProvider 주석 참고.
          */}
          <Link
            className="afterstory-entry-card afterstory-entry-card--write"
            to={PATHS.afterStoryMine}
            onClick={(event) => {
              if (!requireLogin('default', PATHS.afterStoryMine)) {
                event.preventDefault()
              }
            }}
          >
            <img className="afterstory-entry-card__art" src={writePencil} alt="" />
            <strong>내 이야기<br />남기기</strong>
            <small>내 사건의 그 후를 기록해요</small>
          </Link>
          <Link
            className="afterstory-entry-card afterstory-entry-card--read"
            to={PATHS.afterStoryMineStories}
            onClick={(event) => {
              if (!requireLogin('default', PATHS.afterStoryMineStories)) {
                event.preventDefault()
              }
            }}
          >
            <img className="afterstory-entry-card__art" src={readBook} alt="" />
            <strong>내가 쓴 후일담<br />보러가기</strong>
            <small>내가 남긴 이야기만 모아봐요</small>
          </Link>
        </section>

        <section ref={communitySectionRef} className="afterstory-community afterstory-community--board" id="community-stories" aria-label="다른 사용자의 후일담">
          <header className="afterstory-community__header">
            <div>
              <h2>다른 후일담</h2>
            </div>
          </header>
          <p className="afterstory-community__intro">방금 작성된 이야기를 확인해보세요.</p>

          <div className="afterstory-discovery">
            <div className="afterstory-discovery__search">
              <img src={searchIcon} alt="" width={24} height={24} />
              <input
                type="search"
                value={communityQuery}
                placeholder="후일담 키워드 검색..."
                aria-label="후일담 키워드 검색"
                onChange={(event) => {
                  setCommunityQuery(event.target.value)
                  setCommunityPage(1)
                }}
              />
              {communityQuery && (
                <button
                  type="button"
                  aria-label="검색어 지우기"
                  onClick={() => {
                    setCommunityQuery('')
                    setCommunityPage(1)
                  }}
                >×</button>
              )}
            </div>
            <div className="afterstory-discovery__categories" role="group" aria-label="후일담 카테고리">
              {AFTER_STORY_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={communityCategory === category ? 'is-active' : undefined}
                  aria-pressed={communityCategory === category}
                  onClick={() => {
                    setCommunityCategory(category)
                    setCommunityPage(1)
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div ref={communityListRef} className="afterstory-community__list">
            {visibleCommunityStories.map((story) => (
              <Link
                className={'afterstory-community-card afterstory-community-card--' + story.tone + ' is-pending' + (peelingStoryId === story.id ? ' is-peeling' : '')}
                key={story.id}
                to={toAfterStoryDetail(`afterstory-${story.id}`)}
                state={{ from: PATHS.afterStory }}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                  event.preventDefault()
                  openCommunityStory(story.id)
                }}
                aria-label={`${story.title} 후일담 전문 읽기`}
              >
                <span className="afterstory-community-card__tape" aria-hidden="true" />
                <header>
                  <span className="afterstory-community-card__category">{story.category}</span>
                  <span>{story.updatedAt} · 공감 {story.reactions}</span>
                </header>
                <h3 title={story.title}>{story.title}</h3>
                <p className="afterstory-community-card__outcome">{story.summary}</p>
              </Link>
            ))}
            {visibleCommunityStories.length === 0 && (
              <p className="afterstory-community__empty">조건에 맞는 후일담이 아직 없어요.</p>
            )}
          </div>
          <div className="afterstory-community__pagination">
            <Pagination
              currentPage={safeCommunityPage}
              totalPages={communityTotalPages}
              onPageChange={handleCommunityPageChange}
              ariaLabel="후일담 목록 페이지"
              neutralArrows
            />
          </div>
        </section>
      </div>
    </main>
  )
}

/**
 * 내가 직접 게시한 후일담만 모아 보는 목록 화면.
 *
 * 목록은 `내 이야기 남기기`에서 실제로 게시한 글만 담는다.
 * 아무것도 쓰지 않았는데 글이 한 건 있는 것처럼 보이면 시연 흐름이 앞뒤가 맞지 않는다.
 * 게시 기록은 세션이 들고 있다. (`publishedAfterStoryIds`)
 */
export function MyPublishedAfterStoryPage() {
  const navigate = useNavigate()
  const { publishedAfterStoryIds, activityStats } = useSession()
  const storyCount = publishedAfterStoryIds.length
  const hasStory = storyCount > 0
  const hasSubmittedCase = activityStats.submittedCases > 0
  const storyNoteRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const note = storyNoteRef.current
    if (!hasStory || !note) return

    const scrollRoot = note.closest<HTMLElement>('.main-layout__scroll')
    if (!scrollRoot || !('IntersectionObserver' in window)) {
      note.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      note.classList.add('is-visible')
      observer.disconnect()
    }, { root: scrollRoot, rootMargin: '0px 0px -10% 0px', threshold: 0.15 })

    observer.observe(note)
    return () => observer.disconnect()
  }, [hasStory])

  return (
    <main className={`afterstory-home afterstory-my-stories${hasStory ? '' : ' afterstory-my-stories--empty'}`}>
      <AfterStoryHeader title="내가 쓴 후일담" onBack={() => navigate(PATHS.afterStory)} />
      <div className="afterstory-home__scroll">
        <section className="afterstory-my-stories__intro">
          <h2>내가 쓴 후일담</h2>
          <p>사건이 끝난 뒤 내가 남긴 이야기를 모아봐요.</p>
        </section>

        {hasStory ? (
          <section className="afterstory-my-stories__list" aria-label="내가 쓴 후일담 목록">
            <p className="afterstory-my-stories__count">작성한 후일담 <b>{storyCount}</b>개</p>
            {/*
              메모지를 누르면 공개된 후일담 전문(AS06)으로 들어간다.
              돌아올 화면을 state로 같이 넘겨서, 상세의 뒤로가기가 여기로 되돌아오게 한다.
            */}
            <Link
              ref={storyNoteRef}
              className="afterstory-my-stories__item is-pending"
              to={toAfterStoryDetail('friend')}
              state={{ from: PATHS.afterStoryMineStories }}
              aria-label={CONNECTED_CASE.context + ' 후일담 전문 읽기'}
            >
              <span className="afterstory-my-stories__tape" aria-hidden="true" />
              <header><span>친구 · 내 후일담</span><time>방금 전</time></header>
              <h3>{CONNECTED_CASE.context}</h3>
              <p>{CONNECTED_CASE.storyTitle.replace('\n', ' ')}</p>
              <small>공개 범위 · 전체 공개</small>
            </Link>
          </section>
        ) : (
          <EmptyCaseState
            titleId="afterstory-my-stories-empty-title"
            title={hasSubmittedCase ? '아직 쓴 후일담이 없어요' : '아직 남길 후일담이 없어요'}
            description={hasSubmittedCase
              ? '판결이 끝난 사건에 후일담을 남기면 여기에 모여요.'
              : '사건을 접수하고 판결이 끝나면 이야기를 남길 수 있어요.'}
            actionLabel={hasSubmittedCase ? '내 이야기 남기기' : '사건 접수하기'}
            actionTo={hasSubmittedCase ? PATHS.afterStoryMine : PATHS.caseSubmit}
          />
        )}
      </div>
    </main>
  )
}

/**
 * 공개 후일담 전문 화면 (AS06).
 *
 * 기준 시안: Figma `AS06 / 공개 후일담 상세 · 편지형` (노드 `2778:15991`)
 * 히어로(제목·작성자·편지지) 아래에 공용 댓글 스레드가 이어진다.
 * 홈의 두 카드도 같은 화면을 사용하고, 사건별 본문만 바꿔 보여준다.
 */
export function AfterStoryDetailPage() {
  const { storyId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const variant = storyId ? AFTER_STORY_DETAILS[storyId as keyof typeof AFTER_STORY_DETAILS] : undefined
  const communityStory = storyId
    ? COMMUNITY_AFTER_STORIES.find((story) => `afterstory-${story.id}` === storyId)
    : undefined
  const author = variant?.author ?? (communityStory
    ? {
        ...afterStoryAuthor,
        titleLines: [communityStory.summary],
        lead: communityStory.title,
        meta: `${communityStory.category} · 후일담`,
      }
    : afterStoryAuthor)
  const lines = variant?.lines ?? (communityStory
    ? [
        '사건이 끝난 뒤 서로의 생각을 다시 이야기해 봤어요.',
        '처음에는 쉽게 꺼내기 어려웠지만,',
        '각자 어떤 점이 불편했는지 차분히 들었어요.',
        '이번 일을 계기로 다음에는 먼저 확인하고',
        '솔직하게 이야기하기로 했습니다.',
      ]
    : afterStoryLetter.lines)
  /*
   * 댓글은 글이 올라온 뒤에 달린 것이어야 한다.
   * 카드의 `5분 전` 같은 문구를 분으로 바꿔, 그 안으로 댓글 시각을 다시 배치한다.
   * 어느 글인지 못 찾으면(예: 예전 `friend` 경로) 원래 시각을 그대로 둔다.
   */
  const baseComments = storyId && storyId in afterStoryCardComments
    ? afterStoryCardComments[storyId as keyof typeof afterStoryCardComments]
    : afterStoryComments
  /*
   * 지훈 계정이 예전에 남긴 댓글은 이 목록의 한 자리를 대신한다.
   * MY > 내가 쓴 댓글에서 눌러 들어왔을 때 같은 글이 실제로 있어야 한다.
   */
  const comments = withJihoonAfterStoryComment(
    storyId,
    retimeComments(baseComments, parseElapsedMinutes(communityStory?.updatedAt)),
  )

  if (storyId !== 'friend' && !variant && !communityStory) return <Navigate to={PATHS.afterStory} replace />

  /*
   * 어느 화면에서 들어왔는지는 넘겨받은 state로만 판단한다.
   * history.length만 보고 앱 안에 이전 화면이 있다고 가정하지 않는다. (PROJECT_SPEC.md §7-7)
   */
  const detailState = location.state as AfterStoryLocationState | null
  const backTo = detailState?.from ?? PATHS.afterStory
  const backState = backTo === PATHS.home
    ? { restoreHomeScroll: true }
    : backTo.startsWith('/cases/') && backTo.endsWith('/result')
      ? {
          ...detailState?.caseResultState,
          restoreCaseResultScrollTop: detailState?.caseResultScrollTop,
        }
      : undefined

  return (
    <main className="afterstory-detail">
      <AfterStoryHeader
        title="왈가왈후~"
        onBack={() => navigate(backTo, { state: backState })}
      />
      <div className="afterstory-detail__scroll">
        <section
          className="afterstory-detail__hero"
          style={{ backgroundImage: `url(${detailBackground})` }}
        >
          <p className="afterstory-detail__eyebrow">{author.eyebrow}</p>
          <h1>
            {author.titleLines.map((line, index) => (
              <Fragment key={line}>{index > 0 ? <br /> : null}{line}</Fragment>
            ))}
          </h1>
          <p className="afterstory-detail__lead">{author.lead}</p>

          <div className="afterstory-detail__author">
            <img src={author.avatarUrl} alt="" />
            <div>
              <strong>{author.name}</strong>
              <span>{author.meta}</span>
            </div>
            {/*
              읽다가 `무슨 사건이었더라` 싶을 때 바로 돌아갈 곳을 둔다.
              광장 목록 밖으로 밀려난 예전 사건의 후일담은 갈 곳이 없어 버튼을 그리지 않는다.
            */}
            {communityStory?.caseId && (
              <Link
                className="afterstory-detail__case-link"
                to={toCaseDetail(communityStory.caseId)}
                aria-label={`${communityStory.title} 사건 상세로 이동`}
              >
                그날의 사건 보기<span aria-hidden="true">›</span>
              </Link>
            )}
          </div>

          <article className={`afterstory-detail__letter${variant && storyId !== 'afterstory-secret-told' ? ' afterstory-detail__letter--long' : ''}`} aria-label="후일담 전문">
            {/* Figma AS06의 편지지 원본 레이어. */}
            <div className="afterstory-detail__letter-paper" aria-hidden="true">
              <img src={letterPaper} alt="" />
            </div>
            <h2>{afterStoryLetter.heading}</h2>
            <div className={`afterstory-detail__letter-lines${variant ? ' afterstory-detail__letter-lines--flow' : ''}`}>
              {variant ? <p>{lines.join(' ')}</p> : lines.map((line) => <p key={line}>{line}</p>)}
            </div>
          </article>
        </section>

        <div className="afterstory-detail__comments">
          <CommentThread
            comments={comments}
            showVoteBadge={false}
            actionsInHeader
            headingId="afterstory-comments-title"
            /* 후일담에 단 댓글도 MY > 내가 쓴 댓글에 모인다. */
            commentRecord={{
              caseId: storyId ?? 'afterstory',
              caseTitle: author.titleLines.join(' '),
              href: location.pathname,
            }}
          />
        </div>
      </div>
    </main>
  )
}

/**
 * 내 이야기 남기기 — 판결이 끝난 내 사건을 골라 후일담 작성으로 들어가는 화면.
 * 왈가왈후 홈의 `내 이야기 남기기` 카드가 여기로 들어온다.
 */
export function MyAfterStoryPage() {
  const navigate = useNavigate()
  const { currentUser, activityStats } = useSession()
  const isSeoa = currentUser?.personaId === 'A'
  const closedCases = activityStats.submittedCases > 0
    ? MY_CLOSED_CASES.filter((item) => item.id === (isSeoa ? 'friend' : 'company'))
    : []
  const closedCount = closedCases.length

  return (
    <main className={`afterstory-home afterstory-mine${closedCount === 0 ? ' afterstory-mine--empty' : ''}`}>
      <AfterStoryHeader title="왈가왈후~" onBack={() => navigate(PATHS.afterStory)} />
      <div className="afterstory-home__scroll" style={closedCount > 0 ? { backgroundImage: `url(${scrollBackground})` } : undefined}>
        <section className="afterstory-mine__intro">
          <h2>내 이야기 남기기</h2>
          <p>판결 이후, 어떤 변화가 있었나요?</p>
        </section>

        {closedCount === 0 ? (
          <EmptyCaseState titleId="afterstory-mine-empty-title" description="사건을 먼저 접수하면 판결 이후 이야기를 남길 수 있어요." />
        ) : (
          <>
            <aside className="afterstory-mine__notice">
              <img src={walgadakFace} alt="" />
              <p>판결이 끝난 사건 <b>{closedCount}건</b>이 있어요.<br />당신의 다음 이야기를 써볼까요?</p>
            </aside>

            <section className="afterstory-mine__list">
              <header>
                <h3>내가 올린 사건</h3>
                <span>{closedCount}건</span>
              </header>

              {closedCases.map((item) => (
                <article className="afterstory-mine__card" key={item.id}>
                  <div className="afterstory-mine__tags">
                    <em className={'afterstory-mine__category afterstory-mine__category--' + item.tone}>{item.category}</em>
                    <span className="afterstory-mine__badge">판결 완료</span>
                  </div>
                  <h4>{item.titleLines.join(' ')}</h4>
                  <p>사건의 결말을 확인한 뒤, 그 이후의 변화와<br />당신의 선택을 들려주세요.</p>
                  <small>의견 {item.opinionCount} · 댓글 {item.commentCount}</small>
                  <button type="button" disabled={item.id === 'company'} onClick={() => navigate('/afterstory/write/' + item.id)}>후일담 작성하기</button>
                </article>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  )
}

export function WriteAfterStoryPage() {
  const navigate = useNavigate()
  const { personaId } = useSession()
  const [content, setContent] = useState('')
  const canPreview = content.trim().length > 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canPreview) return
    navigate(PATHS.afterStoryPreview, { state: { content } satisfies AfterStoryLocationState })
  }

  /* 예시 본문을 채우고 커서를 글 끝에 둔다. 발표 중 바로 이어서 고칠 수 있게. */
  function handleDemoFill() {
    const shouldClear = content === DEMO_STORY
    setContent(shouldClear ? '' : DEMO_STORY)
    window.requestAnimationFrame(() => {
      const field = document.getElementById('afterstory-content')
      if (field instanceof HTMLTextAreaElement) {
        field.focus()
        if (!shouldClear) field.setSelectionRange(DEMO_STORY.length, DEMO_STORY.length)
        field.scrollTop = 0
      }
    })
  }

  return (
    <form className="afterstory-flow" onSubmit={handleSubmit}>
      <AfterStoryHeader title="후일담 작성" onBack={() => navigate(PATHS.afterStoryMine)} />
      <div className="afterstory-flow__body afterstory-flow__body--with-progress">
        <CaseSubmitProgress step={1} totalSteps={2} label="후일담 작성" />
        <CaseContextCard />
        <section className="afterstory-flow__intro">
          <h1>그날 이후, 어떻게 달라졌나요?</h1>
          <p>어떤 행동을 했고, 무엇이 달라졌나요?<br />아직 해결되지 않은 이야기라도 괜찮아요.</p>
          <CaseSubmitDemoFill personaId={personaId} label="후일담" done={content === DEMO_STORY} onFill={handleDemoFill} />
        </section>
        <section className="afterstory-field">
          <div className="afterstory-field__head">
            <label htmlFor="afterstory-content">후일담 내용 <b>*</b></label>
          </div>
          <div className="afterstory-field__box"><textarea id="afterstory-content" value={content} maxLength={1000} placeholder={'예) 팀원에게 먼저 연락해 공개적으로 지적한 점을 사과했어요.\n\n서로의 사정을 듣고, 다음부터는 마감이 어려우면 미리 이야기하기로 했어요.'} onChange={(event) => setContent(event.target.value)} /><small>{content.length.toLocaleString()} / 1,000</small></div>
        </section>
        <aside className="afterstory-privacy"><img src={walgadakEmpathy} alt="" />이름·연락처 같은 개인정보는 빼주세요.</aside>
      </div>
      <footer className="afterstory-flow__footer"><button type="submit" disabled={!canPreview}>미리보기</button><small>게시 전, 내용과 개인정보를 다시 확인해요.</small></footer>
    </form>
  )
}

export function PreviewAfterStoryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { recordAfterStory } = useSession()
  const content = (location.state as AfterStoryLocationState | null)?.content ?? ''
  const [isLetterOpen, setIsLetterOpen] = useState(false)
  const folderRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const overlayRoot = document.getElementById('app-overlay-root')

  useEffect(() => {
    if (!isLetterOpen) return
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeLetter()
      } else if (event.key === 'Tab') {
        event.preventDefault()
        closeRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isLetterOpen])

  function closeLetter() {
    setIsLetterOpen(false)
    window.requestAnimationFrame(() => folderRef.current?.focus())
  }

  /*
   * 게시가 실제로 일어나는 지점은 여기다. 기록해 둬야 `내가 쓴 후일담`에 글이 생긴다.
   * 완료 화면이 아니라 이 버튼에서 기록하는 이유는, 완료 화면은 새로고침이나
   * 뒤로가기로도 다시 열릴 수 있어서 게시 행위와 1:1로 맞지 않기 때문이다.
   */
  function handlePublish() {
    recordAfterStory('friend')
    navigate(PATHS.afterStoryComplete, { state: { content } satisfies AfterStoryLocationState })
  }

  return (
    <main className="afterstory-flow">
      <div className="afterstory-preview__header" inert={isLetterOpen}>
        <AfterStoryHeader title="후일담 작성" onBack={() => navigate('/afterstory/write/friend')} />
      </div>
      <div className="afterstory-flow__body afterstory-flow__body--with-progress" inert={isLetterOpen}>
        <CaseSubmitProgress step={2} totalSteps={2} label="게시 확인" />
        <section className="afterstory-preview-intro"><h1>이 이야기로 게시할까요?</h1><p>게시될 내용과 연결된 사건을 확인해주세요.</p></section>
        <CaseContextFolder onOpen={() => setIsLetterOpen(true)} isOpen={isLetterOpen} triggerRef={folderRef} />
        <button type="button" className="afterstory-preview-hint" onClick={() => setIsLetterOpen(true)} aria-haspopup="dialog" aria-expanded={isLetterOpen}><img src={clickTapIcon} alt="" aria-hidden="true" />파일을 누르면 후일담을 미리 볼 수 있어요.</button>
        <aside className="afterstory-publish-notice"><img src={walgadakEmpathy} alt="" />게시하면 다른 사용자에게 공개돼요.<br />이름·연락처 등 개인정보를 다시 확인해주세요.</aside>
      </div>
      <footer className="afterstory-flow__footer" inert={isLetterOpen}><button type="button" onClick={handlePublish}>후일담 게시하기</button><small>게시 후에도 MY에서 공개 범위를 바꿀 수 있어요.</small></footer>
      {isLetterOpen && overlayRoot && createPortal(
        <div className="afterstory-letter-preview" onClick={(event) => {
          if (event.target === event.currentTarget) closeLetter()
        }}>
          <section className="afterstory-letter-preview__dialog" role="dialog" aria-modal="true" aria-labelledby="afterstory-letter-preview-title">
            <div className="afterstory-letter-preview__sheet">
              <img className="afterstory-letter-preview__paper" src={letterPaper} alt="" aria-hidden="true" />
              <div className="afterstory-letter-preview__contents">
                <span className="afterstory-letter-preview__eyebrow">게시할 후일담</span>
                <h2 id="afterstory-letter-preview-title">{CONNECTED_CASE.storyTitle.replace('\n', ' ')}</h2>
                <div className="afterstory-letter-preview__body">{content || '작성한 후일담이 없습니다.'}</div>
              </div>
            </div>
            <IconCloseButton ref={closeRef} className="afterstory-letter-preview__close" onClick={closeLetter} aria-label="편지 미리보기 닫기" />
          </section>
        </div>,
        overlayRoot,
      )}
    </main>
  )
}

export function CompleteAfterStoryPage() {
  const navigate = useNavigate()
  return (
    <main className="afterstory-flow afterstory-complete">
      <AfterStoryHeader title="후일담 작성" onBack={() => navigate(PATHS.afterStory)} />
      <div className="afterstory-complete__spacer" aria-hidden="true" />
      <CompletionScene
        title="후일담 작성 완료!"
        folderTitle={CONNECTED_CASE.storyTitle}
        detailLabel="공개 범위"
        detailValue="배심원 광장에 공개"
        reminder="공개 범위는 MY에서 변경할 수 있어요."
      />
      {/*
        방금 남긴 글을 바로 보여주는 쪽이 자연스러워서 홈 대신 `내가 쓴 후일담`으로 보낸다.
        replace를 써서 뒤로가기가 작성 완료 화면으로 되돌아오지 않게 한다. (PROJECT_SPEC.md §7-6)
      */}
      <footer className="afterstory-flow__footer afterstory-complete__footer"><button type="button" onClick={() => navigate(PATHS.afterStoryMineStories, { replace: true })}>내가 쓴 후일담 보기</button><small>방금 남긴 이야기를 바로 확인할 수 있어요.</small></footer>
    </main>
  )
}

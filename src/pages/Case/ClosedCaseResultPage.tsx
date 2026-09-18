import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import dislikeIcon from '../../assets/case/result/dislike.svg'
import emojiIcon from '../../assets/case/result/emoji.svg'
import likeIcon from '../../assets/case/result/like.svg'
import menuIcon from '../../assets/case/result/menu.svg'
import quoteDivider from '../../assets/case/result/quote-divider.svg'
import storyLinkIcon from '../../assets/case/result/story-link.svg'
import submitIcon from '../../assets/case/result/submit.svg'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import CommentThread from '../../components/common/CommentThread'
import DemoRelativeTime from '../../components/common/DemoRelativeTime'
import { COMMENT_TOAST_MESSAGES } from '../../components/common/commentToastMessages'
import Pagination from '../../components/common/Pagination'
import { commentStickerById, type CommentStickerId } from '../../data/common/commentStickers'
import {
  createJihoonSimilarSeedComment,
  jihoonSimilarCase,
  jihoonSimilarReasonComparison,
  jihoonSimilarResult,
} from '../../data/common/jihoonSimilarCaseContent'
import { findAfterStoryByCaseId, toAfterStoryId } from '../../data/common/afterStoryList'
import { getPlazaCaseStory, getPlazaJuryBreakdown } from '../../data/common/plazaCaseStories'
import type {
  JihoonSimilarComment,
  JihoonSimilarVoteId,
} from '../../data/common/jihoonSimilarCaseContent'
import useDetailSlide from '../../hooks/useDetailSlide'
import useFocusComment, { commentAnchorId } from '../../hooks/useFocusComment'
import useSession from '../../hooks/useSession'
import { readThreadComments, saveThreadComments } from '../../utils/plazaComments'
import { addMyComment, readMyCommentReactions, removeMyComment, seedCommentReactions, setMyCommentReaction } from '../../utils/myComments'
import useToast from '../../hooks/useToast'
import useLoginGate from '../../hooks/useLoginGate'
import { PATHS, toAfterStoryDetail } from '../../routes/paths'
import CaseHeader from './components/CaseHeader'
import CommentStickerPicker from './components/CommentStickerPicker'
import VerdictDisagreementHero from './components/VerdictDisagreementHero'
import VerdictReasonComparison from './components/VerdictReasonComparison'
import ResultBreakdown from './components/ResultBreakdown'
import './CaseResultPage.css'
import './ClosedCaseResultPage.css'
import '../My/MyPageTransitions.css'

/** 이 사건(카페 홍보영상 잔금)의 후일담. `afterStoryList.ts`의 `video-payment`와 같은 글이다. */
const JIHOON_AFTER_STORY_ID = 'afterstory-video-payment'

/*
 * 뒤로가기로 돌아갈 수 있는 화면.
 *
 * 넘겨받은 주소를 그대로 믿지 않고 이 목록 안의 것만 쓴다.
 * MY > 내가 쓴 댓글도 여기 있어야, 그 목록에서 들어왔을 때 광장이 아니라 목록으로 돌아간다.
 */
const RETURNABLE_PATHS: string[] = [PATHS.myJury, PATHS.my, PATHS.myComments, PATHS.home]

/*
 * MY 안에서 들어온 경우에만 MY 상세 화면과 같은 좌우 슬라이드를 쓴다.
 * 진행 중 사건 결과(CaseResultPage)와 같은 규칙이라, 내가 쓴 댓글에서 어떤 사건을 눌러도
 * 들어오고 나가는 모습이 같다. 광장이나 홈에서 들어올 때는 원래대로 전환 없이 뜬다.
 */
const MY_DETAIL_PATHS: string[] = [PATHS.my, PATHS.myComments]

const COMMENTS_PER_PAGE = 5
const MAX_COMMENT_PAGES = 5
const MAX_PAGINATED_COMMENTS = COMMENTS_PER_PAGE * MAX_COMMENT_PAGES
type CommentReaction = 'like' | 'dislike' | null

const voteDisplay: Record<JihoonSimilarVoteId, { tone: 'blue' | 'orange' | 'solid-orange' }> = {
  writer: { tone: 'blue' },
  other: { tone: 'orange' },
  both: { tone: 'solid-orange' },
  neither: { tone: 'orange' },
}


function CommentItem({ comment, reaction, isFocused, onReact, onEdit, onDelete }: {
  comment: JihoonSimilarComment
  reaction: CommentReaction
  /** MY > 내가 쓴 댓글에서 눌러 찾아온 댓글. 잠깐 배경을 밝혀 어느 것인지 알려준다. */
  isFocused: boolean
  onReact: (reaction: Exclude<CommentReaction, null>) => void
  onEdit?: (body: string) => void
  onDelete?: () => void
}) {
  const tone = comment.voteId ? voteDisplay[comment.voteId].tone : null
  const sticker = comment.stickerId ? commentStickerById[comment.stickerId] : null
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editDraft, setEditDraft] = useState(comment.body)
  const editRef = useRef<HTMLTextAreaElement>(null)

  const beginEdit = () => {
    setEditDraft(comment.body)
    setIsMenuOpen(false)
    setIsEditing(true)
    requestAnimationFrame(() => editRef.current?.focus())
  }

  const submitEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = editDraft.trim()
    if (!body || !onEdit) return
    onEdit(body)
    setIsEditing(false)
  }

  return (
    <article id={commentAnchorId(comment.id)} className={'result-comment' + (isFocused ? ' is-focused' : '')}>
      <div className="result-comment__head">
        <div className="result-comment__avatar" aria-hidden="true">
          <img src={comment.avatarUrl ?? jihoonSimilarResult.comments[0].avatarUrl} alt="" />
        </div>
        <span>{comment.nickname} · {comment.editedAtMs ? <><DemoRelativeTime timestamp={comment.editedAtMs} /> · 수정됨</> : comment.createdAtMs ? <DemoRelativeTime timestamp={comment.createdAtMs} /> : <DemoRelativeTime label={comment.createdAt} />}</span>
        {tone && comment.voteLabel && (
          <strong className={'result-comment__badge is-' + tone}>{comment.voteLabel}</strong>
        )}
        {onDelete && (
          <div className="result-comment__more">
            <button
              type="button"
              className="result-comment__menu"
              aria-label="댓글 더보기"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <img src={menuIcon} alt="" />
            </button>
            {isMenuOpen && (
              <div className="result-comment__menu-popover" role="menu">
                {onEdit && <button type="button" role="menuitem" onClick={beginEdit}>수정</button>}
                <button type="button" role="menuitem" className="is-delete" onClick={() => {
                  setIsMenuOpen(false)
                  onDelete()
                }}>삭제</button>
              </div>
            )}
          </div>
        )}
      </div>
      {isEditing ? (
        <form className="result-comment__edit" onSubmit={submitEdit}>
          <textarea
            ref={editRef}
            value={editDraft}
            onChange={(event) => setEditDraft(event.target.value)}
            maxLength={300}
            aria-label="댓글 수정 내용"
          />
          <div>
            <button type="button" onClick={() => setIsEditing(false)}>취소</button>
            <button type="submit" className="is-save" disabled={!editDraft.trim()}>저장</button>
          </div>
        </form>
      ) : (
        <>
          {comment.body && <p>{comment.body}</p>}
          {sticker && (
            <img
              className="result-comment__sticker"
              src={sticker.imageUrl}
              alt={`${sticker.characterLabel} ${sticker.expressionLabel} 스티커`}
            />
          )}
        </>
      )}
      <div className="result-comment__actions">
        <button
          type="button"
          className={reaction === 'like' ? 'is-active' : ''}
          onClick={() => onReact('like')}
          aria-pressed={reaction === 'like'}
        >
          <img src={likeIcon} alt="" /> 공감 {comment.likes + (reaction === 'like' ? 1 : 0)}
        </button>
        <button
          type="button"
          className={reaction === 'dislike' ? 'is-active' : ''}
          onClick={() => onReact('dislike')}
          aria-pressed={reaction === 'dislike'}
        >
          <img src={dislikeIcon} alt="" /> 반대 {comment.dislikes + (reaction === 'dislike' ? 1 : 0)}
        </button>
      </div>
    </article>
  )
}

function ClosedCaseResultPage() {
  const { caseId } = useParams()
  const plazaStory = getPlazaCaseStory(caseId)
  // 이 사건에 이어진 후일담. 없으면 맨 아래 후일담 카드를 그리지 않는다.
  const plazaAfterStory = findAfterStoryByCaseId(plazaStory?.id)
  const { currentUser, sessionStatus, personaId } = useSession()
  const { showToast } = useToast()
  const { requireLogin } = useLoginGate()
  const location = useLocation()
  const navigate = useNavigate()
  const routeState = location.state as { fromPlaza?: boolean; returnTo?: string; homeCaseId?: string } | null
  const fromMy = MY_DETAIL_PATHS.includes(routeState?.returnTo ?? '')
  const slide = useDetailSlide(fromMy)
  const [draft, setDraft] = useState('')
  const [selectedStickerId, setSelectedStickerId] = useState<CommentStickerId | null>(null)
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false)
  /*
   * 이 화면이 직접 들고 있는 댓글 목록.
   *
   * 공용 CommentThread를 쓰지 않는 사건이라 저장도 여기서 맡는다.
   * 저장하지 않으면 화면을 나갔다 오는 순간 방금 단 댓글이 사라지는데,
   * MY > 내가 쓴 댓글에는 남아 있어서 두 화면이 어긋난다.
   */
  const commentThreadId = caseId ?? 'case'
  const [addedComments, setAddedComments] = useState<JihoonSimilarComment[]>(
    () => readThreadComments<JihoonSimilarComment>(personaId, commentThreadId),
  )
  const [currentPage, setCurrentPage] = useState(1)
  /*
   * 댓글 정렬. 시안에는 `등록순 | 최신순`이 글자로만 있어 눌러도 반응이 없었다.
   * 공용 댓글 컴포넌트(CommentThread)와 같은 규칙으로 실제 정렬을 붙인다.
   * 기본값은 방금 쓴 댓글이 위로 오는 최신순이다.
   */
  const [sortKey, setSortKey] = useState<'latest' | 'registered'>('latest')
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  useEffect(() => {
    saveThreadComments(personaId, commentThreadId, addedComments)
  }, [addedComments, personaId, commentThreadId])
  // 내 댓글에 눌러 둔 공감/반대는 MY 기록에 남아 있어서 화면을 다시 들어와도 살아난다.
  const [commentReactions, setCommentReactions] = useState<Record<string, CommentReaction>>(() => readMyCommentReactions(personaId))
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const commentSectionRef = useRef<HTMLElement>(null)
  const nextCommentId = useRef(1)
  const isAuthenticated = sessionStatus === 'authenticated'

  const requestCommentLogin = () => {
    if (isAuthenticated) return true
    textareaRef.current?.blur()
    requireLogin('default', location.pathname)
    return false
  }


  const seededComments = Array.from(
    { length: plazaStory ? 0 : Math.min(jihoonSimilarResult.commentCount, MAX_PAGINATED_COMMENTS) },
    (_, index) => createJihoonSimilarSeedComment(index),
  )
  const allComments = [...addedComments, ...seededComments]
  /*
   * seed 댓글은 먼저 쓴 순서의 역순(최신 → 과거)으로 만들어져 있고,
   * 새로 쓴 댓글은 맨 앞에 붙는다. 등록순은 이 순서를 그대로 뒤집으면 된다.
   */
  const orderedComments = sortKey === 'latest' ? allComments : [...allComments].reverse()
  const totalPages = Math.min(
    MAX_COMMENT_PAGES,
    Math.max(1, Math.ceil(allComments.length / COMMENTS_PER_PAGE)),
  )
  const visibleComments = orderedComments.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE)
  /* MY에서 눌러 들어온 경우, 그 댓글이 있는 페이지로 넘기고 그 자리로 스크롤한다. */
  const focusedCommentId = useFocusComment(orderedComments.map((comment) => comment.id), COMMENTS_PER_PAGE, setCurrentPage)
  const juryBreakdown = plazaStory
    ? getPlazaJuryBreakdown(plazaStory.id) ?? jihoonSimilarResult.breakdown
    : jihoonSimilarResult.breakdown
  const comparison = plazaStory ? {
    eyebrow: plazaStory.aiSide === plazaStory.jurySide ? '왜 같은 판단이었을까요?' : '왜 달랐을까요?',
    title: plazaStory.aiSide === plazaStory.jurySide ? '같은 쟁점에\n주목했어요' : '서로 주목한\n점이 달랐어요',
    criteria: [
      { id: 'ai' as const, label: '판멍이가 본 기준', keyword: plazaStory.summary[0].title, description: plazaStory.summary[0].body },
      { id: 'jury' as const, label: '배심원 댓글의 기준', keyword: plazaStory.summary[1].title, description: plazaStory.summary[1].body },
    ],
  } : jihoonSimilarReasonComparison
  const aiVerdict = plazaStory ? {
    summary: plazaStory.aiReason,
    comparisonReasons: [plazaStory.summary[0].body, plazaStory.summary[2].body],
  } : jihoonSimilarResult.aiVerdict

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!requestCommentLogin()) return
    const body = draft.trim()
    if (!body && !selectedStickerId) return

    /* 댓글 화면과 MY가 같은 id를 써야 공감/반대 수가 두 화면에서 같아진다. */
    const commentId = `new-comment-${Date.now()}-${nextCommentId.current++}`
    setAddedComments((comments) => [
      {
        id: commentId,
        nickname: currentUser?.nickname ?? '익명의 배심원',
        avatarUrl: currentUser?.anonymousAvatarUrl ?? jihoonSimilarResult.comments[0].avatarUrl,
        createdAt: '방금 전',
        createdAtMs: Date.now(),
        voteId: null,
        voteLabel: null,
        body,
        stickerId: selectedStickerId ?? undefined,
        ...seedCommentReactions(commentId),
      },
      ...comments,
    ])
    /*
     * 댓글 UI가 화면마다 따로 있어서, 기록도 각 등록 지점에 붙여야 한다.
     * (광장 사건은 CommentThread가, 이 화면은 여기가 맡는다.)
     * 로그인한 계정만 여기까지 오므로 이 자리에서만 남긴다.
     */
    if (body) {
      addMyComment(personaId, {
        id: commentId,
        caseId: plazaStory?.id ?? jihoonSimilarCase.id,
        caseTitle: (plazaStory?.title ?? jihoonSimilarCase.resultTitle).replace(/\n/g, ' '),
        href: location.pathname,
        body,
      })
    }

    setDraft('')
    setSelectedStickerId(null)
    setIsStickerPickerOpen(false)
    setCurrentPage(1)
  }

  const handleEmoji = () => {
    if (!requestCommentLogin()) return
    setIsStickerPickerOpen((open) => !open)
  }

  const handleCommentPageChange = (nextPage: number) => {
    if (nextPage === currentPage) return

    setCurrentPage(nextPage)
    window.requestAnimationFrame(() => {
      commentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  /** 정렬을 바꾸면 첫 페이지부터 다시 본다. */
  const changeCommentSort = (nextSort: 'latest' | 'registered') => {
    if (nextSort === sortKey) return
    setSortKey(nextSort)
    setCurrentPage(1)
  }

  const backTo = RETURNABLE_PATHS.find((path) => path === routeState?.returnTo)
    ?? (plazaStory || routeState?.fromPlaza ? PATHS.plaza : undefined)

  return (
    <main className={`case-result case-result--closed${slide.className ? ` ${slide.className}` : ''}`}>
      <CaseHeader
        title="투표 결과"
        backTo={backTo}
        // MY에서 들어왔을 때만 나가는 모션을 재생한 뒤 이동한다.
        onBack={fromMy && backTo ? () => slide.leave(backTo) : undefined}
      />

      <div className="case-result__body case-result__body--closed">
        <section className="result-overview" aria-labelledby="result-case-title">
          <p className="result-overview__number">사건 번호 · {plazaStory ? plazaStory.caseNumber.replace(/^#/, '') : jihoonSimilarCase.caseNumber}</p>
          <h2 id="result-case-title">{plazaStory?.title ?? jihoonSimilarCase.resultTitle}</h2>
          <div className="result-overview__author">
            <p>{plazaStory?.author.nickname ?? jihoonSimilarCase.author.nickname} · <DemoRelativeTime minutesAgo={plazaStory?.ageMinutes ?? jihoonSimilarCase.ageMinutes} /></p>
          </div>
        </section>

        <VerdictDisagreementHero juryPercent={juryBreakdown[0].percent} aiSide={plazaStory?.aiSide} jurySide={plazaStory?.jurySide} />

        <VerdictReasonComparison
          comparison={comparison}
          verdict={aiVerdict}
        />

        <section className="vote-result" aria-labelledby="vote-result-title">
          <ResultBreakdown
            key={plazaStory?.id ?? jihoonSimilarCase.id}
            breakdown={juryBreakdown}
          />
        </section>

        <div className="case-result__section-divider case-result__section-divider--closed" />

        {plazaStory ? (
          <CommentThread
            key={plazaStory.id}
            comments={plazaStory.comments}
            headingId="comments-title"
            threadId={plazaStory.id}
            /* 이 화면의 인라인 댓글과 마찬가지로 MY > 내가 쓴 댓글에 남긴다. */
            commentRecord={{ caseId: plazaStory.id, caseTitle: plazaStory.title, href: location.pathname }}
          />
        ) : <section ref={commentSectionRef} className="comment-section" aria-labelledby="comments-title">
          <div className="comment-section__heading">
            <h2 id="comments-title">댓글 ({allComments.length})</h2>
            <span className="comment-section__sort">
              <button type="button" aria-pressed={sortKey === 'registered'} onClick={() => changeCommentSort('registered')}>등록순</button>
              <i />
              <button type="button" aria-pressed={sortKey === 'latest'} onClick={() => changeCommentSort('latest')}>최신순</button>
            </span>
          </div>

          <form className="comment-composer" onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onFocus={requestCommentLogin}
              placeholder="댓글을 입력해주세요."
              aria-label="댓글 내용"
              readOnly={!isAuthenticated}
              maxLength={300}
            />
            {selectedStickerId && (
              <div className="comment-composer__sticker-preview">
                <img
                  src={commentStickerById[selectedStickerId].imageUrl}
                  alt={`${commentStickerById[selectedStickerId].characterLabel} ${commentStickerById[selectedStickerId].expressionLabel} 스티커 선택됨`}
                />
                <button type="button" onClick={() => setSelectedStickerId(null)} aria-label="선택한 스티커 삭제">×</button>
              </div>
            )}
            <div className="comment-composer__controls">
              <button
                type="button"
                className="comment-composer__emoji"
                onClick={handleEmoji}
                aria-label="캐릭터 스티커 선택"
                aria-haspopup="dialog"
                aria-expanded={isStickerPickerOpen}
              >
                <img src={emojiIcon} alt="" />
              </button>
              <button
                type="submit"
                className="comment-composer__submit"
                disabled={isAuthenticated && !draft.trim() && !selectedStickerId}
                aria-label={isAuthenticated ? '댓글 등록' : '로그인하고 댓글 쓰기'}
              >
                <img src={submitIcon} alt="" /> 등록
              </button>
            </div>
            {isStickerPickerOpen && (
              <CommentStickerPicker
                defaultCharacter={personaId === 'A' ? 'walgadak' : 'wallang'}
                selectedStickerId={selectedStickerId}
                onClose={() => setIsStickerPickerOpen(false)}
                onSelect={(stickerId) => {
                  setSelectedStickerId(stickerId)
                  setIsStickerPickerOpen(false)
                  textareaRef.current?.focus()
                }}
              />
            )}
          </form>

          <div className="comment-list" aria-live="polite">
            {visibleComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                isFocused={focusedCommentId === comment.id}
                reaction={commentReactions[comment.id] ?? null}
                onReact={(reaction) => {
                  const next = commentReactions[comment.id] === reaction ? null : reaction
                  // 내 댓글이면 MY 기록에도 남겨서 두 화면이 같은 상태를 보게 한다.
                  setMyCommentReaction(personaId, comment.id, next)
                  setCommentReactions((previous) => ({ ...previous, [comment.id]: next }))
                }}
                onEdit={comment.id.startsWith('new-comment-') ? (body) => {
                  setAddedComments((comments) => comments.map((item) => (
                    item.id === comment.id ? { ...item, body, editedAtMs: Date.now() } : item
                  )))
                  showToast(COMMENT_TOAST_MESSAGES.edited)
                } : undefined}
                onDelete={comment.id.startsWith('new-comment-') ? () => setPendingDeleteId(comment.id) : undefined}
              />
            ))}
          </div>

          <div className="comment-pagination">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handleCommentPageChange} ariaLabel="댓글 페이지" />
          </div>
        </section>}

        {/*
          해결된 광장 사건의 후일담. `AppRoutes`가 status가 closed인 광장 사건 결과를
          모두 이 화면으로 보내므로, 후일담 카드도 여기서 그려야 한다.
          투표 중인 사건에는 후일담이 없어 이 자리가 비어 있다.
        */}
        {plazaAfterStory?.quote && <section className="after-story" aria-labelledby="after-story-title">
          <h2 id="after-story-title">이 사건의 후일담</h2>
          <Link
            className="after-story__link"
            to={toAfterStoryDetail(toAfterStoryId(plazaAfterStory.id))}
            state={{ from: location.pathname, caseResultState: routeState }}
            aria-label={`${plazaAfterStory.title} 후일담 보기`}
            onClick={(event) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
              event.preventDefault()
              const scrollTop = event.currentTarget.closest<HTMLElement>('.main-layout__scroll')?.scrollTop ?? 0
              navigate(toAfterStoryDetail(toAfterStoryId(plazaAfterStory.id)), {
                state: { from: location.pathname, caseResultState: routeState, caseResultScrollTop: scrollTop },
              })
            }}
          >
            <article>
              <blockquote>{plazaAfterStory.quote}</blockquote>
              <img className="after-story__divider" src={quoteDivider} alt="" />
              <div>
                <p>{plazaAfterStory.title}</p>
                <span><img src={storyLinkIcon} alt="" /></span>
              </div>
            </article>
          </Link>
        </section>}

        {/*
          카드 전체가 이 사건의 후일담으로 가는 링크다. 화살표만 눌리는 것처럼 보이지만
          실제로는 아무 데로도 가지 않던 자리라, 카드째 연결한다.
          돌아올 위치와 스크롤을 같이 넘겨서 뒤로가기가 보던 자리로 되돌아온다.
        */}
        {!plazaStory && <section className="after-story" aria-labelledby="after-story-title">
          <h2 id="after-story-title">이 사건의 후일담</h2>
          <Link
            className="after-story__link"
            to={toAfterStoryDetail(JIHOON_AFTER_STORY_ID)}
            state={{ from: location.pathname, caseResultState: routeState }}
            aria-label={`${jihoonSimilarResult.afterStory.title.replace('\n', ' ')} 후일담 보기`}
            onClick={(event) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
              event.preventDefault()
              const scrollTop = event.currentTarget.closest<HTMLElement>('.main-layout__scroll')?.scrollTop ?? 0
              navigate(toAfterStoryDetail(JIHOON_AFTER_STORY_ID), {
                state: { from: location.pathname, caseResultState: routeState, caseResultScrollTop: scrollTop },
              })
            }}
          >
            <article>
              <blockquote>{jihoonSimilarResult.afterStory.quote}</blockquote>
              <img className="after-story__divider" src={quoteDivider} alt="" />
              <div>
                <p>{jihoonSimilarResult.afterStory.title}</p>
                <span><img src={storyLinkIcon} alt="" /></span>
              </div>
            </article>
          </Link>
        </section>}
      </div>
      {pendingDeleteId && (
        <ConfirmDialog
          title="댓글을 삭제하시겠습니까?"
          confirmLabel="삭제"
          onClose={() => setPendingDeleteId(null)}
          onConfirm={() => {
            const commentId = pendingDeleteId
            setAddedComments((comments) => comments.filter((item) => item.id !== commentId))
            // 지운 댓글이 MY > 내가 쓴 댓글에 남으면 눌러도 갈 곳이 없다.
            removeMyComment(personaId, commentId)
            setCommentReactions((previous) => {
              const next = { ...previous }
              delete next[commentId]
              return next
            })
            setPendingDeleteId(null)
            showToast(COMMENT_TOAST_MESSAGES.deleted)
          }}
        />
      )}
    </main>
  )
}

export default ClosedCaseResultPage

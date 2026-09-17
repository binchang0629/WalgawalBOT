import { Fragment, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import juryStatusCharacter from '../../assets/case/vote-other-updated.svg'
import verdictVideo from '../../assets/case/result/panmung-scale-once.mp4'
import otherVerdictVideo from '../../assets/case/result/panmung-scale-left-once.mp4'
import dislikeIcon from '../../assets/case/result/dislike.svg'
import emojiIcon from '../../assets/case/result/emoji.svg'
import likeIcon from '../../assets/case/result/like.svg'
import menuIcon from '../../assets/case/result/menu.svg'
import quoteDivider from '../../assets/case/result/quote-divider.svg'
import storyLinkIcon from '../../assets/case/result/story-link.svg'
import submitIcon from '../../assets/case/result/submit.svg'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import CommentThread from '../../components/common/CommentThread'
import { COMMENT_TOAST_MESSAGES } from '../../components/common/commentToastMessages'
import Pagination from '../../components/common/Pagination'
import { commentStickerById, type CommentStickerId } from '../../data/common/commentStickers'
import { weddingGiftCase } from '../../data/common/caseDetailContent'
import { createParentsSeedComment, parentsCase, parentsResult } from '../../data/common/parentsCaseContent'
import { getPlazaCaseResultContent, getPlazaCaseStory } from '../../data/common/plazaCaseStories'
import { addMyComment } from '../../utils/myComments'
import type { WeddingGiftVoteId } from '../../data/common/caseDetailContent'
import {
  createWeddingGiftSeedComment,
  voteDisplayById,
  weddingGiftResult,
} from '../../data/common/caseResultContent'
import type { CaseResultComment } from '../../data/common/caseResultContent'
import useSession from '../../hooks/useSession'
import useToast from '../../hooks/useToast'
import { PATHS } from '../../routes/paths'
import CaseHeader from './components/CaseHeader'
import CommentStickerPicker from './components/CommentStickerPicker'
import ResultBreakdown from './components/ResultBreakdown'
import useDemoCountdown from './components/useDemoCountdown'
import useDetailSlide from '../../hooks/useDetailSlide'
import './CaseResultPage.css'
import '../My/MyPageTransitions.css'
import './WeddingGiftResultPage.css'

interface ResultRouteState {
  selectedVote?: WeddingGiftVoteId
  returnTo?: string
  fromPlaza?: boolean
  homeCaseId?: string
}

const COMMENTS_PER_PAGE = 5
const MAX_COMMENT_PAGES = 5
const MAX_PAGINATED_COMMENTS = COMMENTS_PER_PAGE * MAX_COMMENT_PAGES
type CommentReaction = 'like' | 'dislike' | null

function isVoteId(value: unknown): value is WeddingGiftVoteId {
  return weddingGiftCase.choices.some((choice) => choice.id === value)
}

function MissingCase() {
  return (
    <main className="case-missing">
      <h1>사건을 찾을 수 없어요</h1>
      <p>삭제되었거나 잘못된 사건 주소예요.</p>
      <Link to={PATHS.plaza}>배심원 광장으로 가기</Link>
    </main>
  )
}

function CommentItem({ comment, reaction, onReact, onEdit, onDelete }: {
  comment: CaseResultComment
  reaction: CommentReaction
  onReact: (reaction: Exclude<CommentReaction, null>) => void
  onEdit?: (body: string) => void
  onDelete?: () => void
}) {
  const badge = voteDisplayById[comment.voteId]
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
    <article className="result-comment">
      <div className="result-comment__head">
        <div className="result-comment__avatar">
          <img src={comment.avatarUrl} alt="" />
        </div>
        <span>{comment.nickname} · {comment.createdAt}</span>
        <strong className={`result-comment__badge is-${badge.tone}`}>{comment.voteLabel}</strong>
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

function CaseResultPage() {
  const { caseId } = useParams()
  const location = useLocation()
  /*
   * MY의 `참여한 사건`에서 들어온 경우에만 MY 상세 화면과 같은 좌우 슬라이드를 쓴다.
   * 광장이나 홈에서 들어올 때는 원래대로 전환 없이 뜬다.
   */
  const fromMy = (location.state as ResultRouteState | null)?.returnTo === PATHS.my
  const slide = useDetailSlide(fromMy)
  const { sessionStatus, currentUser, personaId } = useSession()
  const { showToast } = useToast()
  const [draft, setDraft] = useState('')
  const [selectedStickerId, setSelectedStickerId] = useState<CommentStickerId | null>(null)
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false)
  const [addedComments, setAddedComments] = useState<CaseResultComment[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  /*
   * 댓글 정렬. 시안에는 `등록순 | 최신순`이 글자로만 있어 눌러도 반응이 없었다.
   * 공용 댓글 컴포넌트(CommentThread)와 같은 규칙으로 실제 정렬을 붙인다.
   * 기본값은 방금 쓴 댓글이 위로 오는 최신순이다.
   */
  const [sortKey, setSortKey] = useState<'latest' | 'registered'>('latest')
  const [playingCaseId, setPlayingCaseId] = useState<string | null>(null)
  const [speechCaseId, setSpeechCaseId] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  // 페이지가 바뀌어 댓글이 언마운트되어도 공감/반대 선택을 유지한다.
  const [commentReactions, setCommentReactions] = useState<Record<string, CommentReaction>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const commentSectionRef = useRef<HTMLElement>(null)
  const verdictVideoRef = useRef<HTMLVideoElement>(null)
  const nextCommentId = useRef(1)
  const plazaStory = getPlazaCaseStory(caseId)
  const plazaResult = getPlazaCaseResultContent(caseId)
  const caseContent = caseId === parentsCase.id ? parentsCase : plazaStory ?? weddingGiftCase
  const resultContent = caseId === parentsCase.id ? parentsResult : plazaResult ?? weddingGiftResult
  const isParentsCase = caseId === parentsCase.id
  const isClosedPlazaCase = plazaStory?.status === 'closed'
  const countdown = useDemoCountdown(resultContent.deadline, caseContent.id)

  useEffect(() => {
    const video = verdictVideoRef.current
    if (!video) return

    video.pause()
    video.load()
    video.playbackRate = 0.8
    const timer = window.setTimeout(() => {
      void video.play().catch(() => {})
    }, 1000)

    return () => {
      window.clearTimeout(timer)
      video.pause()
    }
  }, [caseId])

  if (caseId !== weddingGiftCase.id && !isParentsCase && !plazaStory) return <MissingCase />

  const loginPath = `${PATHS.login}?from=${encodeURIComponent(location.pathname)}`
  if (sessionStatus !== 'authenticated' && !isClosedPlazaCase) return <Navigate to={loginPath} replace />

  const routeState = location.state as ResultRouteState | null
  const returnTo = routeState?.returnTo === PATHS.my ? PATHS.my : routeState?.returnTo === PATHS.home ? PATHS.home : isParentsCase || plazaStory ? PATHS.plaza : PATHS.home
  const selectedVote = isVoteId(routeState?.selectedVote) ? routeState.selectedVote : 'writer'
  const seededComments = Array.from(
    { length: plazaStory ? 0 : Math.min(resultContent.commentCount, MAX_PAGINATED_COMMENTS) },
    (_, index) => isParentsCase ? createParentsSeedComment(index) : createWeddingGiftSeedComment(index),
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
  const juryVoteIds: WeddingGiftVoteId[] = ['writer', 'other', 'both', 'neither']
  const juryBreakdown = plazaStory ? [plazaStory.jurySide, ...juryVoteIds.filter((id) => id !== plazaStory.jurySide)]
    .map((id, index) => ({
      id,
      label: weddingGiftCase.choices.find((choice) => choice.id === id)?.label.join(' ') ?? '',
      percent: [58, 22, 13, 7][index],
    })) : []

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = draft.trim()
    if ((!body && !selectedStickerId) || !currentUser) return

    const voteDisplay = voteDisplayById[selectedVote]
    setAddedComments((comments) => [
      {
        id: `new-comment-${nextCommentId.current++}`,
        avatarUrl: currentUser.anonymousAvatarUrl,
        nickname: currentUser.nickname,
        createdAt: '방금 전',
        voteId: selectedVote,
        voteLabel: voteDisplay.label,
        body,
        stickerId: selectedStickerId ?? undefined,
        likes: 0,
        dislikes: 0,
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
        caseId: caseContent.id,
        caseTitle: caseContent.title.replace(/\n/g, ' '),
        href: location.pathname,
      })
    }

    setDraft('')
    setSelectedStickerId(null)
    setIsStickerPickerOpen(false)
    setCurrentPage(1)
  }

  const handleEmoji = () => {
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

  return (
    <main className={`case-result case-result--wedding${slide.className ? ` ${slide.className}` : ''}`}>
      <CaseHeader
        title={isParentsCase || plazaStory ? '사건 결과' : undefined}
        backTo={returnTo}
        onBack={fromMy ? () => slide.leave(returnTo) : undefined}
      />

      <div className="case-result__body">
        <section className="result-overview" aria-labelledby="result-case-title">
          <p className="result-overview__number">사건 번호 · {caseContent.caseNumber.replace('#', '')}</p>
          <h2 id="result-case-title">{caseContent.title}</h2>
          <div className="result-overview__author">
            <p>{caseContent.author.nickname} · {caseContent.age}</p>
          </div>
        </section>

        <section className="vote-result" aria-labelledby="vote-result-title">
          {!isClosedPlazaCase && <p className="vote-result__deadline">투표 마감까지&nbsp;&nbsp;{countdown}</p>}
          <div className="vote-result__status">
            <img src={juryStatusCharacter} alt="" />
            <div>
              <strong>{isClosedPlazaCase ? '2심 배심원 투표가 끝났어요' : '2심 배심원 투표 집계 중'}</strong>
              <p>{isClosedPlazaCase ? '아래에서 1심과 2심의 판단을 비교해 보세요.' : '투표 종료 후 1심과 2심의 판단을 비교할 수 있어요.'}</p>
            </div>
          </div>
          <div className="vote-result__heading">
            <h2 id="vote-result-title">1심 · 판멍이의 판단</h2>
          </div>
          <div className="vote-result__artwork">
            <video
              ref={verdictVideoRef}
              src={plazaStory?.aiSide === 'other' ? otherVerdictVideo : verdictVideo}
              poster={resultContent.artworkUrl}
              aria-label="판멍이가 저울 위에서 판결 결과를 발표하는 영상"
              muted
              playsInline
              preload="auto"
              onLoadStart={() => {
                setPlayingCaseId(null)
                setSpeechCaseId(null)
              }}
              onPlaying={() => setPlayingCaseId(caseId ?? null)}
              onTimeUpdate={(event) => {
                const video = event.currentTarget
                if (Number.isFinite(video.duration) && video.duration - video.currentTime <= 0.8) {
                  setSpeechCaseId(caseId ?? null)
                }
              }}
              onEnded={() => setSpeechCaseId(caseId ?? null)}
            />
            <img
              className={`vote-result__first-frame${playingCaseId === caseId ? ' vote-result__first-frame--hidden' : ''}`}
              src={resultContent.artworkUrl}
              alt=""
              aria-hidden="true"
            />
            <div className="vote-result__summary">
              <span>{resultContent.verdict.label}</span>
              <h3>{resultContent.verdict.title}</h3>
              <p>{resultContent.verdict.description}</p>
            </div>
            {speechCaseId === caseId && (
              <div className={`vote-result__speech${plazaStory?.aiSide === 'other' ? ' vote-result__speech--other' : ''}`} aria-hidden="true">
                <svg viewBox="0 0 84 48" focusable="false">
                  <path d="M17 2h52q11 0 11 11v14q0 11-11 11H24L5 46l7-10q-7-3-7-9V13Q5 2 17 2Z" />
                </svg>
                <span>이쪽!</span>
              </div>
            )}
          </div>
        </section>

        <section className="ai-verdict ai-verdict--wedding" aria-labelledby="ai-verdict-title">
          <h2 id="ai-verdict-title">{resultContent.aiVerdictLabel}</h2>
          <div className="ai-verdict__card">
            <h3>{resultContent.aiVerdictTitle}</h3>
            <div>
              {resultContent.aiReasons.map((reason) => (
                <p key={reason}>
                  {reason.split('\n').map((line, index) => (
                    <Fragment key={`${line}-${index}`}>
                      {index > 0 && <br />}
                      {line}
                    </Fragment>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </section>

        {isClosedPlazaCase && plazaStory ? (
          <ResultBreakdown
            key={plazaStory.id}
            breakdown={juryBreakdown}
            headingId="jury-result-title"
          />
        ) : <section className="jury-verdict-pending" aria-label="2심 배심원 투표 진행 상태">
          <div className="jury-verdict-pending__marker" aria-hidden="true">
            <i />
            <span />
            <i />
          </div>
          <strong>2심 배심원 투표는 아직 진행 중이에요</strong>
          <p>투표 종료 후<br />AI와 배심원의 판단을 비교할 수 있어요.</p>
        </section>}

        <div className="case-result__section-divider case-result__section-divider--wedding" />

        {plazaStory ? (
          <CommentThread
            key={plazaStory.id}
            comments={plazaStory.comments}
            headingId="comments-title"
            plazaCaseId={plazaStory.id}
            /* 여기서 단 댓글은 MY > 내가 쓴 댓글에 사건 제목과 함께 남는다. */
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
              placeholder="댓글을 입력해주세요."
              aria-label="댓글 내용"
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
              <button type="submit" className="comment-composer__submit" disabled={!draft.trim() && !selectedStickerId}>
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
                reaction={commentReactions[comment.id] ?? null}
                onReact={(reaction) => setCommentReactions((previous) => ({
                  ...previous,
                  [comment.id]: previous[comment.id] === reaction ? null : reaction,
                }))}
                onEdit={comment.id.startsWith('new-comment-') ? (body) => {
                  setAddedComments((comments) => comments.map((item) => (
                    item.id === comment.id ? { ...item, body, createdAt: '방금 전 · 수정됨' } : item
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

        {!isParentsCase && !plazaStory && <section className="after-story" aria-labelledby="after-story-title">
          <h2 id="after-story-title">비슷한 사건의 후일담</h2>
          <article>
            <blockquote>{weddingGiftResult.afterStory.quote}</blockquote>
            <img className="after-story__divider" src={quoteDivider} alt="" />
            <div>
              <p>{weddingGiftResult.afterStory.title}</p>
              <span><img src={storyLinkIcon} alt="" /></span>
            </div>
          </article>
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

export default CaseResultPage

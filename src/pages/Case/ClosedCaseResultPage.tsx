import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useParams } from 'react-router-dom'

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
import {
  createJihoonSimilarSeedComment,
  jihoonSimilarCase,
  jihoonSimilarReasonComparison,
  jihoonSimilarResult,
} from '../../data/common/jihoonSimilarCaseContent'
import { getPlazaCaseStory, getPlazaJuryBreakdown } from '../../data/common/plazaCaseStories'
import type {
  JihoonSimilarComment,
  JihoonSimilarVoteId,
} from '../../data/common/jihoonSimilarCaseContent'
import useSession from '../../hooks/useSession'
import { addMyComment } from '../../utils/myComments'
import useToast from '../../hooks/useToast'
import useLoginGate from '../../hooks/useLoginGate'
import { PATHS } from '../../routes/paths'
import CaseHeader from './components/CaseHeader'
import CommentStickerPicker from './components/CommentStickerPicker'
import VerdictDisagreementHero from './components/VerdictDisagreementHero'
import VerdictReasonComparison from './components/VerdictReasonComparison'
import ResultBreakdown from './components/ResultBreakdown'
import './CaseResultPage.css'
import './ClosedCaseResultPage.css'

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


function CommentItem({ comment, reaction, onReact, onEdit, onDelete }: {
  comment: JihoonSimilarComment
  reaction: CommentReaction
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
    <article className="result-comment">
      <div className="result-comment__head">
        <div className="result-comment__avatar" aria-hidden="true">
          <img src={comment.avatarUrl ?? jihoonSimilarResult.comments[0].avatarUrl} alt="" />
        </div>
        <span>{comment.nickname} · {comment.createdAt}</span>
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
  const { currentUser, sessionStatus, personaId } = useSession()
  const { showToast } = useToast()
  const { requireLogin } = useLoginGate()
  const location = useLocation()
  const routeState = location.state as { fromPlaza?: boolean; returnTo?: string; homeCaseId?: string } | null
  const [draft, setDraft] = useState('')
  const [selectedStickerId, setSelectedStickerId] = useState<CommentStickerId | null>(null)
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false)
  const [addedComments, setAddedComments] = useState<JihoonSimilarComment[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  /*
   * 댓글 정렬. 시안에는 `등록순 | 최신순`이 글자로만 있어 눌러도 반응이 없었다.
   * 공용 댓글 컴포넌트(CommentThread)와 같은 규칙으로 실제 정렬을 붙인다.
   * 기본값은 방금 쓴 댓글이 위로 오는 최신순이다.
   */
  const [sortKey, setSortKey] = useState<'latest' | 'registered'>('latest')
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [commentReactions, setCommentReactions] = useState<Record<string, CommentReaction>>({})
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

    setAddedComments((comments) => [
      {
        id: 'new-comment-' + nextCommentId.current++,
        nickname: currentUser?.nickname ?? '익명의 배심원',
        avatarUrl: currentUser?.anonymousAvatarUrl ?? jihoonSimilarResult.comments[0].avatarUrl,
        createdAt: '방금 전',
        voteId: null,
        voteLabel: null,
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

  return (
    <main className="case-result case-result--closed">
      <CaseHeader title="투표 결과" backTo={routeState?.returnTo === PATHS.home ? PATHS.home : plazaStory || routeState?.fromPlaza ? PATHS.plaza : undefined} />

      <div className="case-result__body case-result__body--closed">
        <section className="result-overview" aria-labelledby="result-case-title">
          <p className="result-overview__number">사건 번호 · {plazaStory ? plazaStory.caseNumber.replace(/^#/, '') : jihoonSimilarCase.caseNumber}</p>
          <h2 id="result-case-title">{plazaStory?.title ?? jihoonSimilarCase.resultTitle}</h2>
          <div className="result-overview__author">
            <p>{plazaStory?.author.nickname ?? jihoonSimilarCase.author.nickname} · {plazaStory?.age ?? jihoonSimilarCase.age}</p>
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
          <CommentThread key={plazaStory.id} comments={plazaStory.comments} headingId="comments-title" plazaCaseId={plazaStory.id} />
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

        {!plazaStory && <section className="after-story" aria-labelledby="after-story-title">
          <h2 id="after-story-title">이 사건의 후일담</h2>
          <article>
            <blockquote>{jihoonSimilarResult.afterStory.quote}</blockquote>
            <img className="after-story__divider" src={quoteDivider} alt="" />
            <div>
              <p>{jihoonSimilarResult.afterStory.title}</p>
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

export default ClosedCaseResultPage

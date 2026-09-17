import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation } from 'react-router-dom'

import chevronIcon from '../../assets/case/disagreement/vote-chevron.svg'
import dislikeIcon from '../../assets/case/result/dislike.svg'
import emojiIcon from '../../assets/case/result/emoji.svg'
import likeIcon from '../../assets/case/result/like.svg'
import menuIcon from '../../assets/case/result/menu.svg'
import quoteDivider from '../../assets/case/result/quote-divider.svg'
import storyLinkIcon from '../../assets/case/result/story-link.svg'
import submitIcon from '../../assets/case/result/submit.svg'
import customProfileAvatar from '../../assets/my/custom-walgadak-avatar.svg'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Pagination from '../../components/common/Pagination'
import { commentStickerById, type CommentStickerId } from '../../data/common/commentStickers'
import {
  createJihoonSimilarSeedComment,
  jihoonSimilarCase,
  jihoonSimilarReasonComparison,
  jihoonSimilarResult,
} from '../../data/common/jihoonSimilarCaseContent'
import type {
  JihoonSimilarComment,
  JihoonSimilarVoteId,
} from '../../data/common/jihoonSimilarCaseContent'
import useSession from '../../hooks/useSession'
import useLoginGate from '../../hooks/useLoginGate'
import CaseHeader from './components/CaseHeader'
import CommentStickerPicker from './components/CommentStickerPicker'
import VerdictDisagreementHero from './components/VerdictDisagreementHero'
import VerdictReasonComparison from './components/VerdictReasonComparison'
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


function ResultBreakdown() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [animationProgress, setAnimationProgress] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0
  ))
  const breakdownListRef = useRef<HTMLUListElement>(null)
  const hasAnimatedRef = useRef(false)
  const panelId = useId()

  useEffect(() => {
    const breakdownList = breakdownListRef.current
    if (!breakdownList || hasAnimatedRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hasAnimatedRef.current = true
      return
    }

    const scrollRoot = breakdownList.closest<HTMLElement>('.main-layout__scroll')
    if (!scrollRoot) return

    let animationFrameId: number | null = null
    let hasScrollIntent = false

    const startAnimation = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true

      const duration = 1100
      let startedAt: number | null = null

      const animate = (timestamp: number) => {
        startedAt ??= timestamp
        const elapsed = Math.min((timestamp - startedAt) / duration, 1)
        const easedProgress = 1 - Math.pow(1 - elapsed, 3)

        setAnimationProgress(easedProgress)

        if (elapsed < 1) {
          animationFrameId = window.requestAnimationFrame(animate)
        }
      }

      animationFrameId = window.requestAnimationFrame(animate)
    }

    const markScrollIntent = () => {
      hasScrollIntent = true
    }

    const handleScroll = () => {
      if (!hasScrollIntent || hasAnimatedRef.current) return

      const rootRect = scrollRoot.getBoundingClientRect()
      const listRect = breakdownList.getBoundingClientRect()
      const triggerLine = rootRect.top + rootRect.height * 0.78

      if (listRect.top <= triggerLine && listRect.bottom > rootRect.top) {
        startAnimation()
      }
    }

    scrollRoot.addEventListener('wheel', markScrollIntent, { passive: true })
    scrollRoot.addEventListener('touchstart', markScrollIntent, { passive: true })
    scrollRoot.addEventListener('pointerdown', markScrollIntent, { passive: true })
    scrollRoot.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', markScrollIntent)

    return () => {
      scrollRoot.removeEventListener('wheel', markScrollIntent)
      scrollRoot.removeEventListener('touchstart', markScrollIntent)
      scrollRoot.removeEventListener('pointerdown', markScrollIntent)
      scrollRoot.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', markScrollIntent)
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="result-breakdown">
      <h2 id="vote-result-title" className="result-breakdown__heading">
        <button
          type="button"
          className="result-breakdown__toggle"
          onClick={() => setIsExpanded((value) => !value)}
          aria-expanded={isExpanded}
          aria-controls={panelId}
        >
          <span>2심 배심원 투표 결과</span>
          <img className={isExpanded ? 'is-open' : ''} src={chevronIcon} alt="" />
        </button>
      </h2>

      <div
        id={panelId}
        className={'result-breakdown__panel' + (isExpanded ? ' is-open' : '')}
        aria-hidden={!isExpanded}
        inert={!isExpanded}
      >
        <div className="result-breakdown__clip">
          <ul ref={breakdownListRef} className="result-breakdown__list">
            {jihoonSimilarResult.breakdown.map((item, index) => (
              <li key={item.id} className={index === 0 ? 'is-leading' : undefined}>
                <div>
                  <span>{item.label}</span>
                  <strong>{Math.round(item.percent * animationProgress)}%</strong>
                </div>
                <span className={'result-breakdown__track' + (index === 0 ? ' result-breakdown__track--leader' : '')}>
                  <i style={{ width: `${item.percent * animationProgress}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
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
        <div className={`result-comment__avatar${comment.avatarUrl === customProfileAvatar ? ' result-comment__avatar--custom' : ''}`} aria-hidden="true">
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
  const { currentUser, sessionStatus, personaId } = useSession()
  const { requireLogin } = useLoginGate()
  const location = useLocation()
  const [draft, setDraft] = useState('')
  const [selectedStickerId, setSelectedStickerId] = useState<CommentStickerId | null>(null)
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false)
  const [addedComments, setAddedComments] = useState<JihoonSimilarComment[]>([])
  const [currentPage, setCurrentPage] = useState(1)
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
    { length: Math.min(jihoonSimilarResult.commentCount, MAX_PAGINATED_COMMENTS) },
    (_, index) => createJihoonSimilarSeedComment(index),
  )
  const allComments = [...addedComments, ...seededComments]
  const totalPages = Math.min(
    MAX_COMMENT_PAGES,
    Math.max(1, Math.ceil(allComments.length / COMMENTS_PER_PAGE)),
  )
  const visibleComments = allComments.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE)

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

  return (
    <main className="case-result case-result--closed">
      <CaseHeader title="투표 결과" />

      <div className="case-result__body case-result__body--closed">
        <section className="result-overview" aria-labelledby="result-case-title">
          <p className="result-overview__number">사건 번호 · {jihoonSimilarCase.caseNumber}</p>
          <h2 id="result-case-title">{jihoonSimilarCase.resultTitle}</h2>
          <div className="result-overview__author">
            <p>{jihoonSimilarCase.author.nickname} · {jihoonSimilarCase.age}</p>
          </div>
        </section>

        <VerdictDisagreementHero juryPercent={jihoonSimilarResult.breakdown[0].percent} />

        <VerdictReasonComparison
          comparison={jihoonSimilarReasonComparison}
          verdict={jihoonSimilarResult.aiVerdict}
        />

        <section className="vote-result" aria-labelledby="vote-result-title">
          <ResultBreakdown />
        </section>

        <div className="case-result__section-divider case-result__section-divider--closed" />

        <section ref={commentSectionRef} className="comment-section" aria-labelledby="comments-title">
          <div className="comment-section__heading">
            <h2 id="comments-title">댓글 ({allComments.length})</h2>
            <span>등록순 <i /> 최신순</span>
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
                } : undefined}
                onDelete={comment.id.startsWith('new-comment-') ? () => setPendingDeleteId(comment.id) : undefined}
              />
            ))}
          </div>

          <div className="comment-pagination">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handleCommentPageChange} ariaLabel="댓글 페이지" />
          </div>
        </section>

        <section className="after-story" aria-labelledby="after-story-title">
          <h2 id="after-story-title">이 사건의 후일담</h2>
          <article>
            <blockquote>{jihoonSimilarResult.afterStory.quote}</blockquote>
            <img className="after-story__divider" src={quoteDivider} alt="" />
            <div>
              <p>{jihoonSimilarResult.afterStory.title}</p>
              <span><img src={storyLinkIcon} alt="" /></span>
            </div>
          </article>
        </section>
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
          }}
        />
      )}
    </main>
  )
}

export default ClosedCaseResultPage

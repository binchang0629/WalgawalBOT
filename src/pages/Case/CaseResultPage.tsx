import { Fragment, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import juryStatusCharacter from '../../assets/case/vote-other-updated.svg'
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
import { weddingGiftCase } from '../../data/common/caseDetailContent'
import { createParentsSeedComment, parentsCase, parentsResult } from '../../data/common/parentsCaseContent'
import type { WeddingGiftVoteId } from '../../data/common/caseDetailContent'
import {
  createWeddingGiftSeedComment,
  voteDisplayById,
  weddingGiftResult,
} from '../../data/common/caseResultContent'
import type { CaseResultComment } from '../../data/common/caseResultContent'
import useSession from '../../hooks/useSession'
import { PATHS } from '../../routes/paths'
import CaseHeader from './components/CaseHeader'
import CommentStickerPicker from './components/CommentStickerPicker'
import useDemoCountdown from './components/useDemoCountdown'
import './CaseResultPage.css'
import './WeddingGiftResultPage.css'

interface ResultRouteState {
  selectedVote?: WeddingGiftVoteId
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
        <div className={`result-comment__avatar${comment.avatarUrl === customProfileAvatar ? ' result-comment__avatar--custom' : ''}`}>
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
  const { sessionStatus, currentUser, personaId } = useSession()
  const [draft, setDraft] = useState('')
  const [selectedStickerId, setSelectedStickerId] = useState<CommentStickerId | null>(null)
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false)
  const [addedComments, setAddedComments] = useState<CaseResultComment[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  // 페이지가 바뀌어 댓글이 언마운트되어도 공감/반대 선택을 유지한다.
  const [commentReactions, setCommentReactions] = useState<Record<string, CommentReaction>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const commentSectionRef = useRef<HTMLElement>(null)
  const nextCommentId = useRef(1)
  const caseContent = caseId === parentsCase.id ? parentsCase : weddingGiftCase
  const resultContent = caseId === parentsCase.id ? parentsResult : weddingGiftResult
  const isParentsCase = caseId === parentsCase.id
  const countdown = useDemoCountdown(resultContent.deadline, caseContent.id)

  if (caseId !== weddingGiftCase.id && !isParentsCase) return <MissingCase />

  const loginPath = `${PATHS.login}?from=${encodeURIComponent(location.pathname)}`
  if (sessionStatus !== 'authenticated') return <Navigate to={loginPath} replace />

  const routeState = location.state as ResultRouteState | null
  const selectedVote = isVoteId(routeState?.selectedVote) ? routeState.selectedVote : 'writer'
  const seededComments = Array.from(
    { length: Math.min(resultContent.commentCount, MAX_PAGINATED_COMMENTS) },
    (_, index) => isParentsCase ? createParentsSeedComment(index) : createWeddingGiftSeedComment(index),
  )
  const allComments = [...addedComments, ...seededComments]
  const totalPages = Math.min(
    MAX_COMMENT_PAGES,
    Math.max(1, Math.ceil(allComments.length / COMMENTS_PER_PAGE)),
  )
  const visibleComments = allComments.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE)

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

  return (
    <main className="case-result case-result--wedding">
      <CaseHeader title={isParentsCase ? '사건 결과' : undefined} backTo={isParentsCase ? PATHS.plaza : PATHS.home} />

      <div className="case-result__body">
        <section className="result-overview" aria-labelledby="result-case-title">
          <p className="result-overview__number">사건 번호 · {caseContent.caseNumber.replace('#', '')}</p>
          <h2 id="result-case-title">{caseContent.title}</h2>
          <div className="result-overview__author">
            <p>{caseContent.author.nickname} · {caseContent.age}</p>
          </div>
        </section>

        <section className="vote-result" aria-labelledby="vote-result-title">
          <p className="vote-result__deadline">투표 마감까지&nbsp;&nbsp;{countdown}</p>
          <div className="vote-result__status">
            <img src={juryStatusCharacter} alt="" />
            <div>
              <strong>2심 배심원 투표 집계 중</strong>
              <p>투표 종료 후 1심과 2심의 판단을 비교할 수 있어요.</p>
            </div>
          </div>
          <div className="vote-result__heading">
            <h2 id="vote-result-title">1심 · 판멍이의 판단</h2>
          </div>
          <div className="vote-result__artwork">
            <img src={resultContent.artworkUrl} alt="판멍이가 판결 결과를 발표하는 모습" />
            <div className="vote-result__summary">
              <span>{resultContent.verdict.label}</span>
              <h3>{resultContent.verdict.title}</h3>
              <p>{resultContent.verdict.description}</p>
            </div>
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

        <section className="jury-verdict-pending" aria-label="2심 배심원 투표 진행 상태">
          <div className="jury-verdict-pending__marker" aria-hidden="true">
            <i />
            <span />
            <i />
          </div>
          <strong>2심 배심원 투표는 아직 진행 중이에요</strong>
          <p>투표 종료 후<br />AI와 배심원의 판단을 비교할 수 있어요.</p>
        </section>

        <div className="case-result__section-divider case-result__section-divider--wedding" />

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
                } : undefined}
                onDelete={comment.id.startsWith('new-comment-') ? () => setPendingDeleteId(comment.id) : undefined}
              />
            ))}
          </div>

          <div className="comment-pagination">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handleCommentPageChange} ariaLabel="댓글 페이지" />
          </div>
        </section>

        {!isParentsCase && <section className="after-story" aria-labelledby="after-story-title">
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
          }}
        />
      )}
    </main>
  )
}

export default CaseResultPage

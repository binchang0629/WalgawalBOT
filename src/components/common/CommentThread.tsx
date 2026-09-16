import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation } from 'react-router-dom'

import dislikeIcon from '../../assets/case/result/dislike.svg'
import emojiIcon from '../../assets/case/result/emoji.svg'
import likeIcon from '../../assets/case/result/like.svg'
import menuIcon from '../../assets/case/result/menu.svg'
import submitIcon from '../../assets/case/result/submit.svg'
import { commentStickerById, type CommentStickerId } from '../../data/common/commentStickers'
import useLoginGate from '../../hooks/useLoginGate'
import useSession from '../../hooks/useSession'
/*
 * 스티커 고르는 창은 사건 결과 화면에서 먼저 만들어 둔 것을 그대로 쓴다.
 * 공용 컴포넌트가 화면 폴더 안을 가리키는 건 정리 대상이지만,
 * 지금 옮기면 이미 동작하는 사건 결과 화면까지 건드려야 해서 나중으로 미룬다.
 */
import CommentStickerPicker from '../../pages/Case/components/CommentStickerPicker'
import Pagination from './Pagination'
import ConfirmDialog from './ConfirmDialog'
import './CommentThread.css'

/** 댓글 한 건. 사건 결과 화면과 왈가왈후 후일담 상세 화면이 같은 모양을 쓴다. */
export interface ThreadComment {
  id: string
  nickname: string
  /** 몇 분 전에 남긴 댓글인지. 화면에 보이는 문구는 이 값에서 만든다. */
  minutesAgo: number
  /** 원래 사건에서 이 사람이 어느 쪽에 투표했는지. 없으면 배지를 표시하지 않는다. */
  voteId: 'other' | 'writer' | 'both' | 'neither' | null
  voteLabel: string | null
  body: string
  stickerId?: CommentStickerId
  likes: number
  dislikes: number
  avatarUrl: string
  /** `방금 전`처럼 문구를 직접 정해야 하는 경우에만 쓴다. */
  createdAtLabel?: string
}

type CommentReaction = 'like' | 'dislike' | null
type SortKey = 'latest' | 'registered'

/**
 * 투표 결과에 따라 배지 색이 다르다. AS06 시안(`2778:16041`~`2778:16045`) 기준이다.
 *
 * - 글쓴이 입장  : 파랑 연한 배경 (Blue/050 + Blue/700)
 * - 상대방 입장  : 주황 연한 배경 (Orange/100 #FFF6DC + Secondary #FF9524)
 * - 양쪽 모두 / 양쪽 모두 아님 : 주황 채운 배경 (Orange/600 #FFA748 + gray/50 #FAFAFA)
 *
 * 시안에서 `양쪽 모두`만 채운 배지로 그려져 있어 색 단계를 따로 둔다.
 */
const badgeTone: Record<NonNullable<ThreadComment['voteId']>, 'blue' | 'orange' | 'orange-solid'> = {
  writer: 'blue',
  other: 'orange',
  both: 'orange-solid',
  neither: 'orange-solid',
}

function elapsedLabel(minutesAgo: number) {
  if (minutesAgo <= 0) return '방금 전'
  if (minutesAgo <= 59) return `${minutesAgo}분 전`
  if (minutesAgo < 1440) return `${Math.floor(minutesAgo / 60)}시간 전`
  return `${Math.floor(minutesAgo / 1440)}일 전`
}

function CommentRow({ comment, reaction, showReply, showVoteBadge, onReact, onEdit, onDelete }: {
  comment: ThreadComment
  reaction: CommentReaction
  showReply: boolean
  showVoteBadge: boolean
  onReact: (reaction: Exclude<CommentReaction, null>) => void
  onEdit?: (body: string) => void
  onDelete?: () => void
}) {
  const tone = comment.voteId ? badgeTone[comment.voteId] : null
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
          <img src={comment.avatarUrl} alt="" />
        </div>
        <span>{comment.nickname} · {comment.createdAtLabel ?? elapsedLabel(comment.minutesAgo)}</span>
        {showVoteBadge && tone && comment.voteLabel && (
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
        {/*
          시안에 있는 `대댓글 달기`. 대댓글 기능 자체는 아직 없어서 글자만 둔다.
          누를 수 있는 것처럼 보이면 발표 중에 눌렀다가 아무 일도 안 일어나므로,
          버튼이 아니라 안내 문구로 표시한다.
        */}
        {showReply && <span className="result-comment__reply">대댓글 달기</span>}
      </div>
    </article>
  )
}

interface CommentThreadProps {
  /** 미리 준비한 댓글. 화면에 보이는 개수와 페이지 수는 이 목록에서 나온다. */
  comments: ThreadComment[]
  /** 한 페이지에 보여줄 개수. 시안 기준 5개다. */
  perPage?: number
  /** AS06 시안에만 있는 `대댓글 달기` 문구를 표시할지. */
  showReply?: boolean
  /** 원래 사건의 투표 선택 배지를 댓글 머리말에 표시할지. */
  showVoteBadge?: boolean
  /** 스티커 창에서 처음 보여줄 캐릭터를 정할 때 쓰는 제목 id. */
  headingId?: string
}

/**
 * 댓글 스레드.
 *
 * 목록·입력창·페이지네이션을 한 덩어리로 묶는다.
 * 새로 쓴 댓글은 맨 앞에 붙고 1페이지로 돌아간다. 내가 쓴 댓글만 수정·삭제할 수 있다.
 * 공감·반대는 댓글 ID별로 이 컴포넌트가 들고 있어서 페이지를 넘겨도 유지된다.
 *
 * 서버가 없으므로 새로고침하면 사라진다. 실제로 저장되는 것처럼 보이게 하지 않는다.
 * (PROJECT_SPEC.md — mock 응답을 실제인 것처럼 표시하지 않는다)
 */
function CommentThread({ comments, perPage = 5, showReply = false, showVoteBadge = true, headingId = 'comment-thread-title' }: CommentThreadProps) {
  const { currentUser, sessionStatus, personaId } = useSession()
  const { requireLogin } = useLoginGate()
  const location = useLocation()

  const [draft, setDraft] = useState('')
  const [selectedStickerId, setSelectedStickerId] = useState<CommentStickerId | null>(null)
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false)
  const [addedComments, setAddedComments] = useState<ThreadComment[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>('latest')
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [reactions, setReactions] = useState<Record<string, CommentReaction>>({})

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const nextCommentId = useRef(1)
  const isAuthenticated = sessionStatus === 'authenticated'

  const requestCommentLogin = () => {
    if (isAuthenticated) return true
    textareaRef.current?.blur()
    requireLogin('default', location.pathname)
    return false
  }

  const allComments = [...addedComments, ...comments]
  /*
   * 최신순은 방금 쓴 댓글이 위로, 등록순은 먼저 쓴 댓글이 위로 간다.
   * 원본 배열을 그대로 뒤집지 않고 minutesAgo로 정렬해야 새 댓글도 제자리에 들어간다.
   */
  const sortedComments = [...allComments].sort((a, b) => (
    sortKey === 'latest' ? a.minutesAgo - b.minutesAgo : b.minutesAgo - a.minutesAgo
  ))
  const totalPages = Math.max(1, Math.ceil(sortedComments.length / perPage))
  const safePage = Math.min(currentPage, totalPages)
  const visibleComments = sortedComments.slice((safePage - 1) * perPage, safePage * perPage)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!requestCommentLogin()) return
    const body = draft.trim()
    if (!body && !selectedStickerId) return

    setAddedComments((current) => [
      {
        id: 'new-comment-' + nextCommentId.current++,
        nickname: currentUser?.nickname ?? '익명의 배심원',
        avatarUrl: currentUser?.anonymousAvatarUrl ?? comments[0].avatarUrl,
        minutesAgo: 0,
        createdAtLabel: '방금 전',
        voteId: null,
        voteLabel: null,
        body,
        ...(selectedStickerId ? { stickerId: selectedStickerId } : {}),
        likes: 0,
        dislikes: 0,
      },
      ...current,
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

  const handlePageChange = (nextPage: number) => {
    if (nextPage === safePage) return
    setCurrentPage(nextPage)
    window.requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const changeSort = (nextSort: SortKey) => {
    if (nextSort === sortKey) return
    setSortKey(nextSort)
    setCurrentPage(1)
  }

  return (
    <section ref={sectionRef} className="comment-section" aria-labelledby={headingId}>
      <div className="comment-section__heading">
        <h2 id={headingId}>댓글 ({allComments.length})</h2>
        <span className="comment-section__sort">
          <button type="button" aria-pressed={sortKey === 'registered'} onClick={() => changeSort('registered')}>등록순</button>
          <i />
          <button type="button" aria-pressed={sortKey === 'latest'} onClick={() => changeSort('latest')}>최신순</button>
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
          <CommentRow
            key={comment.id}
            comment={comment}
            showReply={showReply}
            showVoteBadge={showVoteBadge}
            reaction={reactions[comment.id] ?? null}
            onReact={(reaction) => setReactions((previous) => ({
              ...previous,
              [comment.id]: previous[comment.id] === reaction ? null : reaction,
            }))}
            onEdit={comment.id.startsWith('new-comment-') ? (body) => {
              setAddedComments((current) => current.map((item) => (
                item.id === comment.id ? { ...item, body, createdAtLabel: '방금 전 · 수정됨' } : item
              )))
            } : undefined}
            onDelete={comment.id.startsWith('new-comment-') ? () => setPendingDeleteId(comment.id) : undefined}
          />
        ))}
      </div>

      <div className="comment-pagination">
        <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={handlePageChange} ariaLabel="댓글 페이지" />
      </div>

      {pendingDeleteId && (
        <ConfirmDialog
          title="댓글을 삭제하시겠습니까?"
          confirmLabel="삭제"
          onClose={() => setPendingDeleteId(null)}
          onConfirm={() => {
            const commentId = pendingDeleteId
            setAddedComments((current) => current.filter((item) => item.id !== commentId))
            setReactions((previous) => {
              const next = { ...previous }
              delete next[commentId]
              return next
            })
            setPendingDeleteId(null)
          }}
        />
      )}
    </section>
  )
}

export default CommentThread

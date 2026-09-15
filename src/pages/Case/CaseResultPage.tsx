import { useRef, useState } from 'react'
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
import Pagination from '../../components/common/Pagination'
import { weddingGiftCase } from '../../data/common/caseDetailContent'
import type { WeddingGiftVoteId } from '../../data/common/caseDetailContent'
import {
  voteDisplayById,
  weddingGiftResult,
} from '../../data/common/caseResultContent'
import type { CaseResultComment } from '../../data/common/caseResultContent'
import useSession from '../../hooks/useSession'
import { PATHS } from '../../routes/paths'
import CaseHeader from './components/CaseHeader'
import useDemoCountdown from './components/useDemoCountdown'
import './CaseResultPage.css'
import './WeddingGiftResultPage.css'

interface ResultRouteState {
  selectedVote?: WeddingGiftVoteId
}

const COMMENTS_PER_PAGE = 5
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

function CommentItem({ comment, reaction, onReact }: {
  comment: CaseResultComment
  reaction: CommentReaction
  onReact: (reaction: Exclude<CommentReaction, null>) => void
}) {
  const badge = voteDisplayById[comment.voteId]

  return (
    <article className="result-comment">
      <div className="result-comment__head">
        <div className="result-comment__avatar">
          <img src={comment.avatarUrl} alt="" />
        </div>
        <span>{comment.nickname} · {comment.createdAt}</span>
        <strong className={`result-comment__badge is-${badge.tone}`}>{comment.voteLabel}</strong>
        <img className="result-comment__menu" src={menuIcon} alt="" aria-hidden="true" />
      </div>
      <p>{comment.body}</p>
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
        <span>대댓글 달기</span>
      </div>
    </article>
  )
}

function CaseResultPage() {
  const { caseId } = useParams()
  const location = useLocation()
  const { sessionStatus, currentUser } = useSession()
  const [draft, setDraft] = useState('')
  const [addedComments, setAddedComments] = useState<CaseResultComment[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  // 페이지가 바뀌어 댓글이 언마운트되어도 공감/반대 선택을 유지한다.
  const [commentReactions, setCommentReactions] = useState<Record<string, CommentReaction>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const nextCommentId = useRef(1)
  const countdown = useDemoCountdown(weddingGiftResult.deadline, weddingGiftCase.id)

  if (caseId !== weddingGiftCase.id) return <MissingCase />

  const loginPath = `${PATHS.login}?from=${encodeURIComponent(location.pathname)}`
  if (sessionStatus !== 'authenticated') return <Navigate to={loginPath} replace />

  const routeState = location.state as ResultRouteState | null
  const selectedVote = isVoteId(routeState?.selectedVote) ? routeState.selectedVote : 'writer'
  const seededComments = Array.from({ length: weddingGiftResult.commentCount }, (_, index) => {
    const comment = weddingGiftResult.comments[index % weddingGiftResult.comments.length]
    return index < weddingGiftResult.comments.length
      ? comment
      : { ...comment, id: comment.id + '-page-' + index }
  })
  const allComments = [...addedComments, ...seededComments]
  const totalPages = Math.max(1, Math.ceil(allComments.length / COMMENTS_PER_PAGE))
  const visibleComments = allComments.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = draft.trim()
    if (!body || !currentUser) return

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
        likes: 0,
        dislikes: 0,
      },
      ...comments,
    ])
    setDraft('')
    setCurrentPage(1)
  }

  const handleEmoji = () => {
    setDraft((value) => `${value}🙂`)
    textareaRef.current?.focus()
  }

  return (
    <main className="case-result case-result--wedding">
      <CaseHeader />

      <div className="case-result__body">
        <section className="result-overview" aria-labelledby="result-case-title">
          <p className="result-overview__number">사건 번호 · {weddingGiftCase.caseNumber.replace('#', '')}</p>
          <h2 id="result-case-title">{weddingGiftCase.title}</h2>
          <div className="result-overview__author">
            <p>{weddingGiftCase.author.nickname} · {weddingGiftCase.age}</p>
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
            <img src={weddingGiftResult.artworkUrl} alt="판멍이가 판결 결과를 발표하는 모습" />
            <div className="vote-result__summary">
              <span>{weddingGiftResult.verdict.label}</span>
              <h3>{weddingGiftResult.verdict.title}</h3>
              <p>{weddingGiftResult.verdict.description}</p>
            </div>
          </div>
        </section>

        <section className="ai-verdict ai-verdict--wedding" aria-labelledby="ai-verdict-title">
          <h2 id="ai-verdict-title">{weddingGiftResult.aiVerdictLabel}</h2>
          <div className="ai-verdict__card">
            <h3>{weddingGiftResult.aiVerdictTitle}</h3>
            <div>
              {weddingGiftResult.aiReasons.map((reason) => <p key={reason}>{reason}</p>)}
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

        <section className="comment-section" aria-labelledby="comments-title">
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
            <div>
              <button type="button" className="comment-composer__emoji" onClick={handleEmoji} aria-label="이모지 추가">
                <img src={emojiIcon} alt="" />
              </button>
              <button type="submit" className="comment-composer__submit" disabled={!draft.trim()}>
                <img src={submitIcon} alt="" /> 등록
              </button>
            </div>
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
              />
            ))}
          </div>

          <div className="comment-pagination">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} ariaLabel="댓글 페이지" />
          </div>
        </section>

        <section className="after-story" aria-labelledby="after-story-title">
          <h2 id="after-story-title">비슷한 사건의 후일담</h2>
          <article>
            <blockquote>{weddingGiftResult.afterStory.quote}</blockquote>
            <img className="after-story__divider" src={quoteDivider} alt="" />
            <div>
              <p>{weddingGiftResult.afterStory.title}</p>
              <span><img src={storyLinkIcon} alt="" /></span>
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}

export default CaseResultPage

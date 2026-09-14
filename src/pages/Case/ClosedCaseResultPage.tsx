import { useId, useRef, useState } from 'react'
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
import Pagination from '../../components/common/Pagination'
import {
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
import VerdictDisagreementHero from './components/VerdictDisagreementHero'
import VerdictReasonComparison from './components/VerdictReasonComparison'
import './CaseResultPage.css'
import './ClosedCaseResultPage.css'

const COMMENTS_PER_PAGE = 5
type CommentReaction = 'like' | 'dislike' | null

const voteDisplay: Record<JihoonSimilarVoteId, { tone: 'blue' | 'orange' | 'solid-orange' }> = {
  writer: { tone: 'blue' },
  other: { tone: 'orange' },
  both: { tone: 'solid-orange' },
  neither: { tone: 'orange' },
}


function ResultBreakdown() {
  const [isExpanded, setIsExpanded] = useState(true)
  const panelId = useId()

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
          <ul className="result-breakdown__list">
            {jihoonSimilarResult.breakdown.map((item, index) => (
              <li key={item.id} className={index === 0 ? 'is-leading' : undefined}>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.percent}%</strong>
                </div>
                <span className={'result-breakdown__track' + (index === 0 ? ' result-breakdown__track--leader' : '')}>
                  <i style={{ width: String(item.percent) + '%' }} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function CommentItem({ comment, reaction, onReact }: {
  comment: JihoonSimilarComment
  reaction: CommentReaction
  onReact: (reaction: Exclude<CommentReaction, null>) => void
}) {
  const tone = comment.voteId ? voteDisplay[comment.voteId].tone : null

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

function ClosedCaseResultPage() {
  const { currentUser, sessionStatus } = useSession()
  const { requireLogin } = useLoginGate()
  const location = useLocation()
  const [draft, setDraft] = useState('')
  const [addedComments, setAddedComments] = useState<JihoonSimilarComment[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [commentReactions, setCommentReactions] = useState<Record<string, CommentReaction>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const nextCommentId = useRef(1)
  const isAuthenticated = sessionStatus === 'authenticated'

  const requestCommentLogin = () => {
    if (isAuthenticated) return true
    textareaRef.current?.blur()
    requireLogin('default', location.pathname)
    return false
  }


  const seededComments = Array.from({ length: jihoonSimilarResult.commentCount }, (_, index) => {
    const comment = jihoonSimilarResult.comments[index % jihoonSimilarResult.comments.length]
    return index < jihoonSimilarResult.comments.length
      ? comment
      : { ...comment, id: comment.id + '-page-' + index }
  })
  const allComments = [...addedComments, ...seededComments]
  const totalPages = Math.max(1, Math.ceil(allComments.length / COMMENTS_PER_PAGE))
  const visibleComments = allComments.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!requestCommentLogin()) return
    const body = draft.trim()
    if (!body) return

    setAddedComments((comments) => [
      {
        id: 'new-comment-' + nextCommentId.current++,
        nickname: currentUser?.nickname ?? '익명의 배심원',
        avatarUrl: currentUser?.anonymousAvatarUrl ?? jihoonSimilarResult.comments[0].avatarUrl,
        createdAt: '방금 전',
        voteId: null,
        voteLabel: null,
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
    if (!requestCommentLogin()) return
    setDraft((value) => value + '🙂')
    textareaRef.current?.focus()
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
              onFocus={requestCommentLogin}
              placeholder="댓글을 입력해주세요."
              aria-label="댓글 내용"
              readOnly={!isAuthenticated}
              maxLength={300}
            />
            <div>
              <button type="button" className="comment-composer__emoji" onClick={handleEmoji} aria-label="이모지 추가">
                <img src={emojiIcon} alt="" />
              </button>
              <button
                type="submit"
                className="comment-composer__submit"
                disabled={isAuthenticated && !draft.trim()}
                aria-label={isAuthenticated ? '댓글 등록' : '로그인하고 댓글 쓰기'}
              >
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
    </main>
  )
}

export default ClosedCaseResultPage

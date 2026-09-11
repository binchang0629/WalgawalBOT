import { useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'

import chevronIcon from '../../assets/case/result/breakdown-toggle.svg'
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
  jihoonSimilarResult,
} from '../../data/common/jihoonSimilarCaseContent'
import type {
  JihoonSimilarComment,
  JihoonSimilarVoteId,
} from '../../data/common/jihoonSimilarCaseContent'
import useSession from '../../hooks/useSession'
import CaseHeader from './components/CaseHeader'
import './CaseResultPage.css'
import './ClosedCaseResultPage.css'

const COMMENTS_PER_PAGE = 5
type CommentReaction = 'like' | 'dislike' | null

const voteDisplay: Record<JihoonSimilarVoteId, { tone: 'blue' | 'orange' }> = {
  writer: { tone: 'blue' },
  other: { tone: 'orange' },
  both: { tone: 'blue' },
  neither: { tone: 'orange' },
}


function ResultBreakdown() {
  const [isExpanded, setIsExpanded] = useState(true)
  const panelId = useId()

  return (
    <div className="result-breakdown">
      <button
        type="button"
        className="result-breakdown__toggle"
        onClick={() => setIsExpanded((value) => !value)}
        aria-expanded={isExpanded}
        aria-controls={panelId}
      >
        <span>전체 결과 보기</span>
        <img className={isExpanded ? 'is-open' : ''} src={chevronIcon} alt="" />
      </button>

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
  const tone = voteDisplay[comment.voteId].tone

  return (
    <article className="result-comment">
      <div className="result-comment__head">
        <div className="result-comment__avatar result-comment__avatar--placeholder" aria-hidden="true">{comment.nickname.slice(0, 1)}</div>
        <span>{comment.nickname} · {comment.createdAt}</span>
        <strong className={'result-comment__badge is-' + tone}>{comment.voteLabel}</strong>
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
  const { currentUser } = useSession()
  const [draft, setDraft] = useState('')
  const [addedComments, setAddedComments] = useState<JihoonSimilarComment[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [commentReactions, setCommentReactions] = useState<Record<string, CommentReaction>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const nextCommentId = useRef(1)


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
    const body = draft.trim()
    if (!body) return

    setAddedComments((comments) => [
      {
        id: 'new-comment-' + nextCommentId.current++,
        nickname: currentUser?.nickname ?? '익명의 배심원',
        createdAt: '방금 전',
        voteId: 'both',
        voteLabel: '의견 남김',
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
    setDraft((value) => value + '🙂')
    textareaRef.current?.focus()
  }

  return (
    <main className="case-result case-result--closed">
      <CaseHeader title="투표 결과" />

      <div className="case-result__body case-result__body--closed">
        <section className="result-overview" aria-labelledby="result-case-title">
          <p className="result-overview__number">사건 번호 · {jihoonSimilarCase.caseNumber}</p>
          <h2 id="result-case-title">{jihoonSimilarCase.title}</h2>
          <div className="result-overview__author">
            <p>{jihoonSimilarCase.author.nickname} · {jihoonSimilarCase.age}</p>
          </div>
        </section>

        <section className="vote-result" aria-labelledby="vote-result-title">
          <div className="vote-result__heading">
            <h2 id="vote-result-title">배심원 2심 결과</h2>
          </div>
          <div className="vote-result__artwork">
            <img src={jihoonSimilarResult.artworkUrl} alt="판멍이가 배심원 결과를 발표하는 모습" />
            <div className="vote-result__summary">
              <span>{jihoonSimilarResult.verdict.label}</span>
              <h3>{jihoonSimilarResult.verdict.title}</h3>
              <p>{jihoonSimilarResult.verdict.description}</p>
            </div>
          </div>
          <ResultBreakdown />
        </section>

        <section className="ai-verdict ai-verdict--closed" aria-labelledby="ai-verdict-title">
          <h2 id="ai-verdict-title">AI 1심 판결</h2>
          <div className="ai-verdict__card">
            <span>판멍이의 판단</span>
            <h3>{jihoonSimilarResult.aiVerdict.title}</h3>
            <div>
              {jihoonSimilarResult.aiVerdict.reasons.map((reason) => <p key={reason}>{reason}</p>)}
            </div>
            <footer>
              <span>판단 확신도 </span>
              <strong>{jihoonSimilarResult.aiVerdict.confidence}%</strong>
            </footer>
          </div>
          <div className="ai-verdict__comparison">
            <strong>판단 비교</strong>
            <p>{jihoonSimilarResult.aiVerdict.comparison}</p>
          </div>
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

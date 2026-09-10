import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { weddingGiftCase } from '../../data/common/caseDetailContent'
import type { WeddingGiftVoteId } from '../../data/common/caseDetailContent'
import { PATHS, toCaseResult } from '../../routes/paths'
import CaseHeader from './components/CaseHeader'
import './CaseDetailPage.css'

function VoteCountdown({ value }: { value: string }) {
  const digits = value.replace(':', '').split('')

  return (
    <span className="vote-countdown" aria-label={`남은 시간 ${value}`}>
      {digits.map((digit, index) => (
        <span key={`${index}-${digit}`}>
          {index === 2 && <i aria-hidden="true">:</i>}
          <b aria-hidden="true">{digit}</b>
        </span>
      ))}
    </span>
  )
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

function CaseDetailPage() {
  const { caseId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { sessionStatus } = useSession()
  const [selectedVote, setSelectedVote] = useState<WeddingGiftVoteId | null>(null)
  const [voteMessage, setVoteMessage] = useState('')

  if (caseId !== weddingGiftCase.id) return <MissingCase />

  const isAuthenticated = sessionStatus === 'authenticated'
  const loginPath = `${PATHS.login}?from=${encodeURIComponent(location.pathname)}`

  const handleVoteChoice = (choiceId: WeddingGiftVoteId) => {
    setSelectedVote(choiceId)
    setVoteMessage('')
  }

  const handleVoteSubmit = () => {
    if (!selectedVote) {
      setVoteMessage('투표를 먼저 해주세요.')
      return
    }

    navigate(toCaseResult(weddingGiftCase.id), { state: { selectedVote } })
  }

  return (
    <main className="case-detail">
      <CaseHeader />

      <div className="case-detail__body">
        <section className="case-overview" aria-labelledby="case-title">
          <div className="case-overview__deadline">
            <span>투표 마감까지</span>
            <VoteCountdown value={weddingGiftCase.deadline} />
          </div>

          <div className="case-overview__category">
            <i aria-hidden="true" />
            {weddingGiftCase.category}
          </div>

          <div className="case-author">
            <span className="case-author__avatar">
              <img src={weddingGiftCase.author.avatarUrl} alt="" />
            </span>
            <div>
              <strong>{weddingGiftCase.author.nickname}</strong>
              <time>{weddingGiftCase.author.createdAt}</time>
            </div>
          </div>

          <h2 id="case-title" className="case-overview__title">{weddingGiftCase.title}</h2>
          <p className="case-overview__meta">
            사건 번호 · {weddingGiftCase.caseNumber} · {weddingGiftCase.age} · 배심원{' '}
            {weddingGiftCase.participantCount}명 참여
          </p>
        </section>

        <div className="case-detail__divider" />

        <section className="case-story" aria-label="사건 내용">
          {weddingGiftCase.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section className="ai-summary" aria-labelledby="ai-summary-title">
          <h2 id="ai-summary-title">AI 핵심요약</h2>
          <ol>
            {weddingGiftCase.summary.map((item, index) => (
              <li key={item.title}>
                <span>{index + 1}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="case-vote" aria-labelledby="case-vote-title">
          <div className="case-vote__heading">
            <h2 id="case-vote-title">당신의 판단은?</h2>
            <p>나의 판단은 익명으로 반영돼요.</p>
          </div>

          <div className="case-vote__grid">
            {weddingGiftCase.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className={selectedVote === choice.id ? 'vote-choice is-selected' : 'vote-choice'}
                onClick={() => handleVoteChoice(choice.id)}
                disabled={!isAuthenticated}
                aria-pressed={selectedVote === choice.id}
              >
                <img src={choice.imageUrl} alt="" width={62} height={62} />
                <span>{choice.label[0]}<br />{choice.label[1]}</span>
              </button>
            ))}
          </div>

          {!isAuthenticated && (
            <div className="case-vote__login">
              <div>
                <p>로그인 후 투표할 수 있어요</p>
                <Link to={loginPath}>로그인하고 나도 투표하기</Link>
              </div>
            </div>
          )}

          {isAuthenticated && (
            <>
              <button type="button" className="case-vote__submit" onClick={handleVoteSubmit}>
                투표하기
              </button>
              {voteMessage && (
                <p
                  className={
                    selectedVote ? 'case-vote__message is-success' : 'case-vote__message'
                  }
                  role="status"
                >
                  {voteMessage}
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default CaseDetailPage

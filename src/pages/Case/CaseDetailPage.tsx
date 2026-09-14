import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { weddingGiftCase } from '../../data/common/caseDetailContent'
import type { WeddingGiftVoteId } from '../../data/common/caseDetailContent'
import { PATHS, toCaseResult } from '../../routes/paths'
import CaseHeader from './components/CaseHeader'
import CaseVoteSection from './components/CaseVoteSection'
import useDemoCountdown from './components/useDemoCountdown'
import './CaseDetailPage.css'

function VoteCountdown({ value }: { value: string }) {
  const countdown = useDemoCountdown(value)
  const digits = countdown.replace(':', '').split('')

  return (
    <span className="vote-countdown" aria-label={`남은 시간 ${countdown}`}>
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
  const { sessionStatus, recordJuryVote } = useSession()
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

    recordJuryVote(weddingGiftCase.id)
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

        <CaseVoteSection
          isAuthenticated={isAuthenticated}
          loginPath={loginPath}
          selectedVote={selectedVote}
          voteMessage={voteMessage}
          onSelect={handleVoteChoice}
          onSubmit={handleVoteSubmit}
        />
      </div>
    </main>
  )
}

export default CaseDetailPage

import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { weddingGiftCase } from '../../data/common/caseDetailContent'
import type { WeddingGiftVoteId } from '../../data/common/caseDetailContent'
import { PATHS, toCaseResult } from '../../routes/paths'
import CaseHeader from './components/CaseHeader'
import CaseVoteSection from './components/CaseVoteSection'
import useToast from '../../hooks/useToast'
import useDemoCountdown from './components/useDemoCountdown'
import { getRememberedCaseParticipantCount } from '../../utils/caseParticipantCount'
import './CaseDetailPage.css'

/**
 * 투표 마감까지 남은 시간.
 * 사건 결과 화면(`CaseResultPage`의 `.vote-result__deadline`)과 같은 알약 한 덩어리로 맞췄다.
 * 예전에는 숫자를 칸칸이 나눠 그렸다. (2026-09-14 팀 요청)
 */
function VoteDeadline({ value, caseId }: { value: string; caseId: string }) {
  const countdown = useDemoCountdown(value, caseId)

  return (
    <p className="case-overview__deadline" aria-label={`투표 마감까지 ${countdown}`}>
      <span aria-hidden="true">투표 마감까지&nbsp;&nbsp;{countdown}</span>
    </p>
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
  const { showToast } = useToast()
  const [selectedVote, setSelectedVote] = useState<WeddingGiftVoteId | null>(null)
  const [isSummaryVisible, setIsSummaryVisible] = useState(
    () => !('IntersectionObserver' in window),
  )
  const summaryRef = useRef<HTMLElement>(null)
  const [participantCount] = useState(() => getRememberedCaseParticipantCount(
    weddingGiftCase.id,
    weddingGiftCase.participantCount,
  ))

  useEffect(() => {
    const summary = summaryRef.current
    if (!summary) return

    if (!('IntersectionObserver' in window)) return

    const appViewport = summary.closest('.app-viewport')
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsSummaryVisible(true)
      observer.disconnect()
    }, {
      root: appViewport,
      /* 박스가 기기 내부 화면의 가운데 16% 영역을 통과할 때 재생한다. */
      rootMargin: '-42% 0px -42% 0px',
      threshold: 0.01,
    })

    observer.observe(summary)
    return () => observer.disconnect()
  }, [])

  if (caseId !== weddingGiftCase.id) return <MissingCase />

  const isAuthenticated = sessionStatus === 'authenticated'
  const loginPath = `${PATHS.login}?from=${encodeURIComponent(location.pathname)}`
  const shouldSlideIn = (location.state as { entryMotion?: string } | null)?.entryMotion === 'slide-forward'

  const handleVoteChoice = (choiceId: WeddingGiftVoteId) => {
    setSelectedVote(choiceId)
  }

  const handleVoteSubmit = () => {
    if (!selectedVote) {
      showToast('투표를 먼저 해주세요.')
      return
    }

    recordJuryVote(weddingGiftCase.id)
    navigate(toCaseResult(weddingGiftCase.id), { state: { selectedVote } })
  }

  return (
    <main className={`case-detail${shouldSlideIn ? ' case-detail--slide-forward' : ''}`}>
      <CaseHeader />

      <div className="case-detail__body">
        <section className="case-overview" aria-labelledby="case-title">
          <VoteDeadline value={weddingGiftCase.deadline} caseId={weddingGiftCase.id} />

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
            {participantCount.toLocaleString()}명 참여
          </p>
        </section>

        <div className="case-detail__divider" />

        <section className="case-story" aria-label="사건 내용">
          {weddingGiftCase.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section
          ref={summaryRef}
          className={`ai-summary ai-summary--reveal${isSummaryVisible ? ' is-visible' : ''}`}
          aria-labelledby="ai-summary-title"
        >
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
          onSelect={handleVoteChoice}
          onSubmit={handleVoteSubmit}
        />
      </div>
    </main>
  )
}

export default CaseDetailPage

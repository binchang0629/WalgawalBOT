import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { weddingGiftCase } from '../../data/common/caseDetailContent'
import { parentsCase } from '../../data/common/parentsCaseContent'
import { getPlazaCaseStory } from '../../data/common/plazaCaseStories'
import type { WeddingGiftVoteId } from '../../data/common/caseDetailContent'
import { PATHS, toCaseResult } from '../../routes/paths'
import CaseHeader from './components/CaseHeader'
import CaseVoteSection from './components/CaseVoteSection'
import AiSummary from './components/AiSummary'
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
  const { sessionStatus, votedCaseIds, juryVotes, recordJuryVote } = useSession()
  const { showToast } = useToast()
  const [selectedVote, setSelectedVote] = useState<WeddingGiftVoteId | null>(null)
  const [confirmedVote, setConfirmedVote] = useState<WeddingGiftVoteId | null>(null)
  const plazaStory = getPlazaCaseStory(caseId)
  const caseContent = caseId === parentsCase.id ? parentsCase : plazaStory ?? weddingGiftCase
  const isClosed = plazaStory?.status === 'closed'
  const [participantCount] = useState(() => getRememberedCaseParticipantCount(
    caseContent.id,
    caseContent.participantCount,
  ))

  const isAuthenticated = sessionStatus === 'authenticated'
  const hasVoted = isAuthenticated && votedCaseIds.includes(caseContent.id)
  const savedVote = juryVotes[caseContent.id]
  const savedChoice = caseContent.choices.find((choice) => choice.id === savedVote)
  const loginPath = `${PATHS.login}?from=${encodeURIComponent(location.pathname)}`
  const entryState = location.state as { entryMotion?: string; returnTo?: string; fromPlaza?: boolean; homeCaseId?: string } | null
  const shouldSlideIn = entryState?.entryMotion === 'slide-forward'
  const overlayRoot = document.getElementById('app-overlay-root')

  useEffect(() => {
    if (!confirmedVote) return
    const timer = window.setTimeout(() => {
      navigate(toCaseResult(caseContent.id), {
        state: {
          selectedVote: confirmedVote,
          fromPlaza: caseContent.id !== weddingGiftCase.id,
          returnTo: entryState?.returnTo,
          homeCaseId: entryState?.homeCaseId,
        },
      })
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [caseContent.id, confirmedVote, entryState?.homeCaseId, entryState?.returnTo, navigate])

  if (caseId !== weddingGiftCase.id && caseId !== parentsCase.id && !plazaStory) return <MissingCase />

  const handleVoteChoice = (choiceId: WeddingGiftVoteId) => {
    setSelectedVote(choiceId)
  }

  const handleVoteSubmit = () => {
    if (confirmedVote || hasVoted) return
    if (!selectedVote) {
      showToast('투표를 먼저 해주세요.')
      return
    }

    recordJuryVote(caseContent.id, selectedVote)
    setConfirmedVote(selectedVote)
  }

  return (
    <main className={`case-detail${caseContent.id === parentsCase.id ? ' case-detail--family' : ''}${isClosed ? ' case-detail--closed' : ''}${shouldSlideIn ? ' case-detail--slide-forward' : ''}`}>
      <CaseHeader
        title={plazaStory ? (isClosed ? '지난 사건' : '사건 상세') : caseContent.id === parentsCase.id ? '사건 상세' : undefined}
        backTo={entryState?.returnTo === PATHS.home ? PATHS.home : plazaStory ? PATHS.plaza : undefined}
      />

      <div className="case-detail__body">
        <section className="case-overview" aria-labelledby="case-title">
          {!isClosed && <VoteDeadline value={caseContent.deadline} caseId={caseContent.id} />}

          <div className="case-overview__category">
            <i aria-hidden="true" />
            {caseContent.category}
          </div>

          <div className="case-author">
            <span className="case-author__avatar">
              <img src={caseContent.author.avatarUrl} alt="" />
            </span>
            <div>
              <strong>{caseContent.author.nickname}</strong>
              <time>{caseContent.author.createdAt}</time>
            </div>
          </div>

          <h2 id="case-title" className="case-overview__title">{caseContent.title}</h2>
          <p className="case-overview__meta">
            사건 번호 · {caseContent.caseNumber} · {caseContent.age} · 배심원{' '}
            {participantCount.toLocaleString()}명 참여
          </p>
        </section>

        <div className="case-detail__divider" />

        <section className="case-story" aria-label="사건 내용">
          {caseContent.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <AiSummary items={caseContent.summary} />

        {isClosed ? (
          <Link className="closed-case-result-link" to={toCaseResult(caseContent.id)} state={{ fromPlaza: entryState?.fromPlaza, returnTo: entryState?.returnTo, homeCaseId: entryState?.homeCaseId }}>
            투표 결과보기
          </Link>
        ) : hasVoted ? (
          <section className="case-vote-complete" aria-labelledby="case-vote-complete-title">
            <span className="case-vote-complete__check" aria-hidden="true">✓</span>
            <div>
              <h2 id="case-vote-complete-title">이미 투표했어요</h2>
              <p>{savedChoice ? `나의 선택 · ${savedChoice.label.join(' ')}` : '이 사건에 투표한 기록이 있어요.'}</p>
            </div>
            <Link
              to={toCaseResult(caseContent.id)}
              state={{ selectedVote: savedVote, fromPlaza: entryState?.fromPlaza, returnTo: entryState?.returnTo, homeCaseId: entryState?.homeCaseId }}
            >
              투표 결과 보기
            </Link>
          </section>
        ) : <CaseVoteSection
          choices={caseContent.choices}
          isAuthenticated={isAuthenticated}
          loginPath={loginPath}
          selectedVote={selectedVote}
          onSelect={handleVoteChoice}
          onSubmit={handleVoteSubmit}
        />}
      </div>
      {confirmedVote && overlayRoot && createPortal(
        <div className="case-vote-confirmation" role="status" aria-live="polite" aria-atomic="true">
          <div className="case-vote-confirmation__card">
            <span className="case-vote-confirmation__check" aria-hidden="true">✓</span>
            <strong>투표 완료!</strong>
            <p>결과를 보여드릴게요.</p>
          </div>
        </div>,
        overlayRoot,
      )}
    </main>
  )
}

export default CaseDetailPage

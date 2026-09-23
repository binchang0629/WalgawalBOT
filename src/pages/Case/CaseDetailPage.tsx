import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { weddingGiftCase } from '../../data/common/caseDetailContent'
import { parentsCase } from '../../data/common/parentsCaseContent'
import { getPlazaCaseStory } from '../../data/common/plazaCaseStories'
import DemoRelativeTime from '../../components/common/DemoRelativeTime'
import type { WeddingGiftVoteId } from '../../data/common/caseDetailContent'
import { PATHS, toAuthEntry, toCaseResult } from '../../routes/paths'
import CaseHeader from './components/CaseHeader'
import CaseVoteSection from './components/CaseVoteSection'
import AiSummary from './components/AiSummary'
import useToast from '../../hooks/useToast'
import useDemoCountdown from './components/useDemoCountdown'
import { getRememberedCaseParticipantCount } from '../../utils/caseParticipantCount'
import { recordCaseView } from '../../utils/recentViewedCases'
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
  const { personaId, sessionStatus, votedCaseIds, juryVotes, recordJuryVote } = useSession()
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
  /*
   * 방금 투표해 `투표 완료!` 팝업이 떠 있는 동안에는 뒤 화면을 그대로 둔다.
   * 투표는 이미 저장돼 hasVoted가 참이 되지만, 그때 `이미 투표한 사건이에요`로 바뀌면
   * 팝업과 뒤 화면이 동시에 움직여 시선이 흩어진다. 재방문 때만 완료 안내를 보여준다.
   */
  const showVotedNotice = hasVoted && !confirmedVote
  const savedVote = juryVotes[caseContent.id]
  const savedChoice = caseContent.choices.find((choice) => choice.id === savedVote)
  const loginPath = toAuthEntry(personaId, location.pathname)
  const entryState = location.state as { entryMotion?: string; returnTo?: string; navContext?: string; fromPlaza?: boolean; homeCaseId?: string } | null
  const shouldSlideIn = entryState?.entryMotion === 'slide-forward'
  const overlayRoot = document.getElementById('app-overlay-root')
  /** 이미 열람 기록을 남긴 사건. 계정 전환으로 효과가 다시 돌 때 중복 기록을 막는다. */
  const recordedCaseRef = useRef<string | null>(null)
  const isKnownCase = caseId === weddingGiftCase.id || caseId === parentsCase.id || Boolean(plazaStory)

  /*
   * 홈 `최근 본 사건`에 남길 열람 기록.
   * 로그인 여부를 따지지 않는다 — 둘러보다 가입하는 서아의 흐름에서 가입 전에 본 사건도 본인이 본 것이다.
   * 없는 사건 주소로 들어온 경우는 아래 `MissingCase`로 빠지므로 여기까지 오지 않는다.
   */
  useEffect(() => {
    if (!isKnownCase) return
    /*
     * 한 사건은 한 번만 남긴다. 사건을 보는 도중 계정을 전환하면 이 효과가 다시 도는데,
     * 그때 기록하면 서아가 보던 사건이 지훈 홈의 `최근 본 사건`에 올라온다.
     * 사건 주소만 바뀌어 같은 화면이 다시 쓰이는 경우(`/cases/a` → `/cases/b`)는 id가 달라 기록된다.
     */
    if (recordedCaseRef.current === caseContent.id) return
    recordedCaseRef.current = caseContent.id
    recordCaseView(personaId, caseContent.id)
  }, [isKnownCase, personaId, caseContent.id])

  useEffect(() => {
    if (!confirmedVote) return
    const timer = window.setTimeout(() => {
      navigate(toCaseResult(caseContent.id), {
        state: {
          selectedVote: confirmedVote,
          navContext: entryState?.navContext,
          fromPlaza: caseContent.id !== weddingGiftCase.id,
          returnTo: entryState?.returnTo,
          homeCaseId: entryState?.homeCaseId,
        },
      })
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [caseContent.id, confirmedVote, entryState?.homeCaseId, entryState?.navContext, entryState?.returnTo, navigate])

  if (!isKnownCase) return <MissingCase />

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
        backTo={entryState?.returnTo === PATHS.myJury
          ? PATHS.myJury
          : entryState?.returnTo === PATHS.home
            ? PATHS.home
            : entryState?.returnTo === PATHS.afterStory
              ? PATHS.afterStory
              : plazaStory
                ? PATHS.plaza
                : undefined}
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
            사건 번호 · {caseContent.caseNumber} · <DemoRelativeTime minutesAgo={caseContent.ageMinutes} /> · 배심원{' '}
            {participantCount.toLocaleString()}명 참여
          </p>
        </section>

        <div className="case-detail__divider" />

        <section className="case-story" aria-label="사건 내용">
          {caseContent.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <AiSummary items={caseContent.summary} />

        {isClosed ? (
          <Link className="closed-case-result-link" to={toCaseResult(caseContent.id)} state={{ fromPlaza: entryState?.fromPlaza, returnTo: entryState?.returnTo, navContext: entryState?.navContext, homeCaseId: entryState?.homeCaseId }}>
            투표 결과보기
          </Link>
        ) : showVotedNotice ? (
          <section className="case-vote-complete" aria-labelledby="case-vote-complete-title">
            <span className="case-vote-complete__check" aria-hidden="true">✓</span>
            <div>
              <h2 id="case-vote-complete-title">이미 투표한 사건이에요.</h2>
              <p>{savedChoice ? `나의 선택 : ${savedChoice.label.join(' ')}` : '이 사건에 투표한 기록이 있어요.'}</p>
            </div>
            <Link
              to={toCaseResult(caseContent.id)}
              state={{ selectedVote: savedVote, fromPlaza: entryState?.fromPlaza, returnTo: entryState?.returnTo, navContext: entryState?.navContext, homeCaseId: entryState?.homeCaseId }}
            >
              판결 다시 보기
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

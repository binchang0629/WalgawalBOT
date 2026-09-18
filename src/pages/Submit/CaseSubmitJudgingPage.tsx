import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import CaseSubmitHeader from './components/CaseSubmitHeader'
import useCaseSubmitDraft from './useCaseSubmitDraft'
import panmungJudging from '../../assets/submit/panmung-judging.png'
import './CaseSubmit.css'
import './CaseSubmitJudgingPage.css'

/**
 * AI 1심 대기 — `이렇게 정리했어요`와 `판멍이는 이렇게 봤어요` 사이의 연결 화면.
 *
 * 다음 화면의 1심 의견은 고정 예시라 사실 기다릴 이유가 없지만,
 * 요약을 확인하자마자 판결문이 튀어나오면 AI가 읽고 판단했다는 느낌이 사라진다.
 * 그래서 판멍이가 지금 무엇을 하고 있는지 세 줄로 보여주며 잠깐 머문다.
 *
 * 퍼센트 숫자는 쓰지 않는다. 실제 진행률이 아니라서, 숫자가 빠르게 지나가면
 * 오히려 만들어 낸 티가 난다. 단계 문구가 `무엇을 하는 중인지`를 대신 알려준다. (PROJECT_SPEC.md §6)
 *
 * 뒤로 가기로 이 화면에 다시 들어오지 않도록 다음 화면으로는 replace로 넘어간다. (PROJECT_SPEC.md §7-6)
 */

/*
 * 이 화면에 머무는 시간 = STEP_INTERVAL × 3줄 + TAIL_DELAY.
 * 지금은 850 × 3 + 450 = 3,000ms(3초)다.
 *
 *   · 더 빨리 넘기고 싶으면 STEP_INTERVAL을 줄인다 (700이면 2.55초).
 *   · 마지막 줄이 체크되자마자 넘어가는 게 급해 보이면 TAIL_DELAY만 늘린다.
 * 링이 도는 속도는 CSS(CaseSubmitJudgingPage.css) 쪽에 있다.
 */
const STEP_INTERVAL = 1100
const TAIL_DELAY = 600

const JUDGING_STEPS = [
  '사건 내용 확인 중',
  '쟁점 정리 중',
  '참고 의견 작성 중',
] as const

function CaseSubmitJudgingPage() {
  const { personaId, content, answers, summary } = useCaseSubmitDraft()
  const navigate = useNavigate()
  const isSeoa = personaId === 'A'
  // 몇 줄까지 체크됐는지. 화면에 들어온 순간부터 센다.
  const [doneCount, setDoneCount] = useState(0)

  const canJudge = content.trim().length > 0
    && (isSeoa || (answers.deliveryRecord !== null && answers.contractTerms !== null && answers.revisionScope !== null))
    && summary.title.trim().length > 0
    && summary.facts.trim().length > 0

  useEffect(() => {
    if (!canJudge) return

    const timers = JUDGING_STEPS.map((_, index) => window.setTimeout(
      () => setDoneCount(index + 1),
      STEP_INTERVAL * (index + 1),
    ))
    const toOpinion = window.setTimeout(
      () => navigate(PATHS.caseSubmitOpinion, { replace: true }),
      STEP_INTERVAL * JUDGING_STEPS.length + TAIL_DELAY,
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      window.clearTimeout(toOpinion)
    }
  }, [canJudge, navigate])

  // 앞 단계를 건너뛰고 들어온 경우에는 기다릴 내용이 없다.
  if (!content.trim()) return <Navigate to={PATHS.caseSubmit} replace />
  if (!isSeoa && (answers.deliveryRecord === null || answers.contractTerms === null || answers.revisionScope === null)) {
    return <Navigate to={PATHS.caseSubmitQuestions} replace />
  }
  if (!summary.title.trim() || !summary.facts.trim()) {
    return <Navigate to={PATHS.caseSubmitSummary} replace />
  }

  return (
    <div className={`case-submit case-submit--judging${isSeoa ? ' case-submit--seoa' : ''}`}>
      <CaseSubmitHeader onBack={() => navigate(PATHS.caseSubmitSummary, { replace: true })} showTempSave={false} />

      <div className="case-submit__body case-judging" role="status" aria-live="polite">
        <div className="case-judging__stage">
          {/* 테두리를 도는 파란 링. AI가 일하는 중이라는 표시로 다른 AI 카드와 같은 규칙을 쓴다. */}
          <span className="case-judging__ring" aria-hidden="true" />
          <img className="case-judging__mascot" src={panmungJudging} alt="" aria-hidden="true" />
        </div>

        <div className="case-judging__copy">
          <h2 className="case-judging__title">판멍이가 사건을 읽고 있어요</h2>
          <p className="case-judging__description">잠시만 기다려 주세요. 곧 1심 의견을 보여드릴게요.</p>
        </div>

        <ol className="case-judging__steps">
          {JUDGING_STEPS.map((step, index) => {
            const isDone = index < doneCount
            const isCurrent = index === doneCount

            return (
              <li
                key={step}
                className={`case-judging__step${isDone ? ' is-done' : ''}${isCurrent ? ' is-current' : ''}`}
              >
                <span className="case-judging__step-mark" aria-hidden="true" />
                {step}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

export default CaseSubmitJudgingPage

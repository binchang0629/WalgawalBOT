import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import CaseSubmitHeader from './components/CaseSubmitHeader'
import CaseSubmitProgress from './components/CaseSubmitProgress'
import CaseSubmitFooter from './components/CaseSubmitFooter'
import useCaseSubmitDraft from './useCaseSubmitDraft'
import useWizardBack from '../../hooks/useWizardBack'
import './CaseSubmit.css'
import './CaseSubmitSummaryPage.css'

/**
 * 사건 접수 3단계 — 지훈03 / 요약 확인.
 * Figma node 1446:10011 기준.
 *
 * `사건 요약`(제목·확인된 내용)만 실제로 고쳐 쓸 수 있게 했다.
 * `확인이 필요한 쟁점`·`원하는 도움`은 AI가 정리한 결과라 이 화면에서 직접 고치지 않는다.
 * 실제로는 mock 데이터라 1단계에서 무엇을 적었든 같은 예시 사연으로 보인다 — Figma 시안 그대로다. (PROJECT_SPEC.md §6)
 */
function CaseSubmitSummaryPage() {
  const { content, answers, summary, setSummary } = useCaseSubmitDraft()
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()
  const handleBack = useWizardBack(PATHS.caseSubmitQuestions)

  if (!content.trim()) {
    return <Navigate to={PATHS.caseSubmit} replace />
  }
  if (answers.deliveryRecord === null || answers.contractTerms === null || answers.revisionScope === null) {
    return <Navigate to={PATHS.caseSubmitQuestions} replace />
  }

  const canProceed = summary.title.trim().length > 0 && summary.facts.trim().length > 0

  const handleSubmit = () => {
    if (!canProceed) return
    navigate(PATHS.caseSubmitOpinion)
  }

  return (
    <div className="case-submit">
      <CaseSubmitHeader onBack={handleBack} />
      <CaseSubmitProgress step={3} label="요약 확인" />

      <div className="case-submit__body">
        <div className="case-submit__intro">
          <h2 className="case-submit__heading">이렇게 정리했어요</h2>
          <p className="case-submit__description">내용이 맞는지 확인하고, 다른 부분은 수정해 주세요.</p>
        </div>

        <div className="case-submit__summary">
          <div className="case-submit__summary-header">
            <span className="case-submit__label">사건 요약</span>
            <button
              type="button"
              className="case-submit__summary-edit"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? '완료' : '수정하기'}
            </button>
          </div>
          <div className="case-submit__divider" />

          {isEditing ? (
            <textarea
              className="case-submit__summary-title-input"
              value={summary.title}
              onChange={(event) => setSummary((prev) => ({ ...prev, title: event.target.value }))}
              rows={2}
              aria-label="사건 제목"
            />
          ) : (
            <h3 className="case-submit__summary-title">{summary.title}</h3>
          )}

          <p className="case-submit__summary-label">확인된 내용</p>
          {isEditing ? (
            <textarea
              className="case-submit__summary-facts-input"
              value={summary.facts}
              onChange={(event) => setSummary((prev) => ({ ...prev, facts: event.target.value }))}
              rows={4}
              aria-label="확인된 내용"
            />
          ) : (
            <p className="case-submit__summary-text">{summary.facts}</p>
          )}

          <div className="case-submit__divider" />
          <p className="case-submit__summary-label">확인이 필요한 쟁점</p>
          <p className="case-submit__summary-text">{summary.issues}</p>

          <div className="case-submit__divider" />
          <p className="case-submit__summary-label">원하는 도움</p>
          <p className="case-submit__summary-text">{summary.help}</p>
        </div>
      </div>

      <CaseSubmitFooter
        type="button"
        primaryLabel="이 내용으로 AI 참고 의견 보기"
        helperText="잘못 정리된 부분은 언제든 수정할 수 있어요."
        disabled={!canProceed}
        onPrimaryClick={handleSubmit}
      />
    </div>
  )
}

export default CaseSubmitSummaryPage

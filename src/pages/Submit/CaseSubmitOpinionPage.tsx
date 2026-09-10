import { Navigate, useNavigate } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import CaseSubmitHeader from './components/CaseSubmitHeader'
import CaseSubmitProgress from './components/CaseSubmitProgress'
import CaseSubmitFooter from './components/CaseSubmitFooter'
import useCaseSubmitDraft from './useCaseSubmitDraft'
import useWizardBack from './useWizardBack'
import { SUBMIT_SCENARIOS } from './caseSubmitContent'
import radioSelected from '../../assets/submit/figma/imgRadioSelected.svg'
import radioDefault from '../../assets/submit/figma/imgRadioDefault.svg'
import './CaseSubmit.css'
import './CaseSubmitOpinionPage.css'

/**
 * AI 참고 의견·접수 — 서아03(1446:10178) / 지훈04(1446:10041).
 *
 * 시안 주석대로 서아는 광장 공개만, 지훈은 나만 보기만 활성화한다.
 * 처음 진입은 모두 미선택이며 허용된 범위를 선택한 뒤에만 시연 접수가 가능하다.
 */
function CaseSubmitOpinionPage() {
  const { personaId, content, answers, summary, visibility, setVisibility, setIsSubmitted } = useCaseSubmitDraft()
  const isSeoa = personaId === 'A'
  const scenario = SUBMIT_SCENARIOS[personaId]
  const opinion = scenario.opinion
  const navigate = useNavigate()
  const handleBack = useWizardBack(PATHS.caseSubmitSummary)

  if (!content.trim()) {
    return <Navigate to={PATHS.caseSubmit} replace />
  }
  if (!isSeoa && (answers.deliveryRecord === null || answers.contractTerms === null || answers.revisionScope === null)) {
    return <Navigate to={PATHS.caseSubmitQuestions} replace />
  }
  if (!summary.title.trim() || !summary.facts.trim()) {
    return <Navigate to={PATHS.caseSubmitSummary} replace />
  }

  const isPrivateSelected = visibility === 'private'
  const isCommunitySelected = visibility === 'community'
  const canSubmit = visibility === scenario.allowedVisibility

  const handleSubmit = () => {
    if (!canSubmit) return
    setIsSubmitted(true)
    navigate(PATHS.caseSubmitComplete)
  }

  return (
    <div className={`case-submit${isSeoa ? ' case-submit--seoa' : ''}`}>
      <CaseSubmitHeader onBack={handleBack} />
      <CaseSubmitProgress step={isSeoa ? 3 : 4} totalSteps={scenario.totalSteps} label="접수" />

      <div className="case-submit__body">
        <div className="case-submit__intro">
          <h2 className="case-submit__heading">접수 전 마지막 확인</h2>
          <p className="case-submit__description">판멍이의 1심과 공개 범위를 확인해 주세요.</p>
        </div>

        <div className="case-submit__ai-opinion">
          <p className="case-submit__ai-opinion-eyebrow">{opinion.eyebrow}</p>
          <p className="case-submit__ai-opinion-headline">{opinion.headline}</p>
          <ul className="case-submit__ai-opinion-reasons">
            {opinion.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <p className="case-submit__ai-opinion-disclaimer">{opinion.disclaimer}</p>
        </div>

        <div className="case-submit__privacy">
          <h3 className="case-submit__privacy-heading">누구에게 공개할까요?</h3>

          <button
            type="button"
            className="case-submit__privacy-option"
            aria-pressed={isPrivateSelected}
            disabled={isSeoa}
            onClick={() => setVisibility('private')}
          >
            <span className="case-submit__privacy-label">
              <img src={isPrivateSelected ? radioSelected : radioDefault} alt="" width={15} height={15} />
              <span className={isPrivateSelected ? 'case-submit__privacy-option-title--selected' : 'case-submit__privacy-option-title'}>
                나만 보기
              </span>
            </span>
            <span className="case-submit__privacy-description">접수 내용과 AI 참고 의견을 나만 확인해요.</span>
          </button>

          <div className="case-submit__divider" />

          <button type="button" className="case-submit__privacy-option" disabled={!isSeoa} aria-pressed={isCommunitySelected} onClick={() => setVisibility('community')}>
            <span className="case-submit__privacy-label">
              <img src={isCommunitySelected ? radioSelected : radioDefault} alt="" width={15} height={15} />
              <span className={isCommunitySelected ? 'case-submit__privacy-option-title--selected' : 'case-submit__privacy-option-title'}>배심원 광장에 공개</span>
            </span>
            <span className="case-submit__privacy-description">다른 배심원의 의견을 받아볼 수 있어요.</span>
          </button>
        </div>
      </div>

      <CaseSubmitFooter
        type="button"
        primaryLabel="사건 접수하기"
        helperText="선택한 공개 범위로 접수돼요."
        disabled={!canSubmit}
        onPrimaryClick={handleSubmit}
      />
    </div>
  )
}

export default CaseSubmitOpinionPage

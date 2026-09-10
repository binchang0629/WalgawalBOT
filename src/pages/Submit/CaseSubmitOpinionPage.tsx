import { Navigate, useNavigate } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import CaseSubmitHeader from './components/CaseSubmitHeader'
import CaseSubmitProgress from './components/CaseSubmitProgress'
import CaseSubmitFooter from './components/CaseSubmitFooter'
import useCaseSubmitDraft from './useCaseSubmitDraft'
import useWizardBack from './useWizardBack'
import { AI_OPINION } from './caseSubmitContent'
import radioSelected from '../../assets/submit/figma/imgRadioSelected.svg'
import radioDefault from '../../assets/submit/figma/imgRadioDefault.svg'
import './CaseSubmit.css'
import './CaseSubmitOpinionPage.css'

/**
 * 사건 접수 4단계 — 지훈04 / AI 참고 의견·접수.
 * Figma node 1446:10041 기준.
 *
 * `배심원 광장에 공개`는 디자이너 주석대로 이번 구현에서 고를 수 없게 뒀다 —
 * "처음 진입 시 둘 다 회색, 배심원 광장은 비활성화, 나만보기만 클릭 시 주황"(node 1446:10059 주석).
 * 공개 범위를 어디까지 열지는 아직 미정이라 임의로 활성화하지 않았다. (PROJECT_SPEC.md §9-9)
 */
function CaseSubmitOpinionPage() {
  const { content, answers, summary, visibility, setVisibility, setIsSubmitted } = useCaseSubmitDraft()
  const navigate = useNavigate()
  const handleBack = useWizardBack(PATHS.caseSubmitSummary)

  if (!content.trim()) {
    return <Navigate to={PATHS.caseSubmit} replace />
  }
  if (answers.deliveryRecord === null || answers.contractTerms === null || answers.revisionScope === null) {
    return <Navigate to={PATHS.caseSubmitQuestions} replace />
  }
  if (!summary.title.trim() || !summary.facts.trim()) {
    return <Navigate to={PATHS.caseSubmitSummary} replace />
  }

  const isPrivateSelected = visibility === 'private'

  const handleSubmit = () => {
    if (!isPrivateSelected) return
    setIsSubmitted(true)
    navigate(PATHS.caseSubmitComplete)
  }

  return (
    <div className="case-submit">
      <CaseSubmitHeader onBack={handleBack} />
      <CaseSubmitProgress step={4} label="접수" />

      <div className="case-submit__body">
        <div className="case-submit__intro">
          <h2 className="case-submit__heading">접수 전 마지막 확인</h2>
          <p className="case-submit__description">판멍이의 1심과 공개 범위를 확인해 주세요.</p>
        </div>

        <div className="case-submit__ai-opinion">
          <p className="case-submit__ai-opinion-eyebrow">{AI_OPINION.eyebrow}</p>
          <p className="case-submit__ai-opinion-headline">{AI_OPINION.headline}</p>
          <ul className="case-submit__ai-opinion-reasons">
            {AI_OPINION.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <p className="case-submit__ai-opinion-disclaimer">{AI_OPINION.disclaimer}</p>
        </div>

        <div className="case-submit__privacy">
          <h3 className="case-submit__privacy-heading">누구에게 공개할까요?</h3>

          <button
            type="button"
            className="case-submit__privacy-option"
            aria-pressed={isPrivateSelected}
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

          <div className="case-submit__privacy-option" aria-disabled="true" title="아직 열려 있지 않은 공개 범위예요">
            <span className="case-submit__privacy-label">
              <img src={radioDefault} alt="" width={15} height={15} />
              <span className="case-submit__privacy-option-title">배심원 광장에 공개</span>
            </span>
            <span className="case-submit__privacy-description">다른 배심원의 의견을 받아볼 수 있어요.</span>
          </div>
        </div>
      </div>

      <CaseSubmitFooter
        type="button"
        primaryLabel="사건 접수하기"
        helperText="선택한 공개 범위로 접수돼요."
        disabled={!isPrivateSelected}
        onPrimaryClick={handleSubmit}
      />
    </div>
  )
}

export default CaseSubmitOpinionPage

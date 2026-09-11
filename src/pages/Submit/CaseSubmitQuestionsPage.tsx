import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import CaseSubmitHeader from './components/CaseSubmitHeader'
import CaseSubmitProgress from './components/CaseSubmitProgress'
import CaseSubmitFooter from './components/CaseSubmitFooter'
import useCaseSubmitDraft from './useCaseSubmitDraft'
import useWizardBack from '../../hooks/useWizardBack'
import type { TriAnswer } from './types'
import checkMark from '../../assets/submit/figma/imgCheck.svg'
import walangJoy from '../../assets/submit/figma/imgCharacterWalangJoy.svg'
import './CaseSubmit.css'
import './CaseSubmitQuestionsPage.css'

/**
 * 사건 접수 2단계 — 지훈02 / 추가 질문.
 * Figma node 1446:9956 기준. 1단계에서 적은 내용을 보완하는 3개 문항이다.
 *
 * 문항 문구는 지훈03·04에 이어지는 고정 예시 사연(디자이너 잔금 미지급) 기준이다.
 * 실제 AI가 1단계 내용을 읽고 만든 질문이 아니라 Figma 시안 그대로다. (PROJECT_SPEC.md §6)
 */

const YES_NO_UNSURE: { value: TriAnswer; label: string }[] = [
  { value: 'yes', label: '있어요' },
  { value: 'no', label: '없어요' },
  { value: 'unsure', label: '모르겠어요' },
]

const DECIDED_UNSURE: { value: TriAnswer; label: string }[] = [
  { value: 'yes', label: '정했어요' },
  { value: 'no', label: '안 정했어요' },
  { value: 'unsure', label: '모르겠어요' },
]

interface TriAnswerRowProps {
  value: TriAnswer | null
  options: { value: TriAnswer; label: string }[]
  onChange: (value: TriAnswer) => void
}

function TriAnswerRow({ value, options, onChange }: TriAnswerRowProps) {
  return (
    <div className="case-submit__choice-row">
      {options.map((option) => {
        const isSelected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            className={`case-submit__choice${isSelected ? ' case-submit__choice--selected' : ''}`}
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
          >
            {option.label}
            {isSelected && (
              <img src={checkMark} alt="" className="case-submit__choice-check" width={9.5} height={7} />
            )}
          </button>
        )
      })}
    </div>
  )
}

function CaseSubmitQuestionsPage() {
  const { personaId, content, answers, setAnswers } = useCaseSubmitDraft()
  const navigate = useNavigate()
  const handleBack = useWizardBack(PATHS.caseSubmit)

  if (personaId === 'A') {
    return <Navigate to={content.trim() ? PATHS.caseSubmitSummary : PATHS.caseSubmit} replace />
  }

  // 1단계를 거치지 않고 바로 들어온 경우 빈 상태로 보여주지 않는다.
  if (!content.trim()) {
    return <Navigate to={PATHS.caseSubmit} replace />
  }

  const canProceed =
    answers.deliveryRecord !== null && answers.contractTerms !== null && answers.revisionScope !== null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canProceed) return
    navigate(PATHS.caseSubmitSummary)
  }

  return (
    <form className="case-submit" onSubmit={handleSubmit}>
      <CaseSubmitHeader onBack={handleBack} />
      <CaseSubmitProgress step={2} label="추가 질문" />

      <div className="case-submit__body">
        <div className="case-submit__intro">
          <h2 className="case-submit__heading">몇 가지만 더 알려주세요</h2>
          <p className="case-submit__description">작성한 내용에서 빠진 정보만 확인해요.</p>
        </div>

        <div className="case-submit__field">
          <p className="case-submit__label">최종 파일을 전달한 기록이 있나요?</p>
          <TriAnswerRow
            value={answers.deliveryRecord}
            options={YES_NO_UNSURE}
            onChange={(value) => setAnswers((prev) => ({ ...prev, deliveryRecord: value }))}
          />
          {answers.deliveryRecord === 'yes' && (
            <div className="case-submit__optional-detail">
              <textarea
                className="case-submit__optional-detail-input"
                placeholder="이메일로 최종 파일을 보낸 내역이 있어요."
                value={answers.deliveryDetail}
                onChange={(event) =>
                  setAnswers((prev) => ({ ...prev, deliveryDetail: event.target.value }))
                }
              />
              <span className="case-submit__optional-detail-label">추가 설명 · 선택</span>
            </div>
          )}
        </div>

        <div className="case-submit__field">
          <p className="case-submit__label">잔금 지급일이 계약서에 적혀 있나요?</p>
          <TriAnswerRow
            value={answers.contractTerms}
            options={YES_NO_UNSURE}
            onChange={(value) => setAnswers((prev) => ({ ...prev, contractTerms: value }))}
          />
        </div>

        <div className="case-submit__field">
          <p className="case-submit__label">수정 횟수나 범위를 정해두었나요?</p>
          <TriAnswerRow
            value={answers.revisionScope}
            options={DECIDED_UNSURE}
            onChange={(value) => setAnswers((prev) => ({ ...prev, revisionScope: value }))}
          />
        </div>

        <div className="case-submit__panmung">
          <img src={walangJoy} alt="" className="case-submit__panmung-art" width={40} height={40} />
          <p>기억나지 않는 내용은 &lsquo;모르겠어요&rsquo;를 골라도 돼요.</p>
        </div>
      </div>

      <CaseSubmitFooter
        primaryLabel="AI 요약 확인하기"
        helperText="아직 접수되지 않았어요. 정리한 내용을 먼저 확인해요."
        disabled={!canProceed}
      />
    </form>
  )
}

export default CaseSubmitQuestionsPage

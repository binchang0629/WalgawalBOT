import '../CaseSubmit.css'

interface CaseSubmitProgressProps {
  /** 서아 1~3 / 지훈 1~4단계. 접수 완료 화면에서는 진행률을 표시하지 않는다. */
  step: 1 | 2 | 3 | 4
  label: string
  totalSteps?: 3 | 4
}

/** 계정별 전체 단계 수를 받는 공통 진행률. */
function CaseSubmitProgress({ step, label, totalSteps = 4 }: CaseSubmitProgressProps) {
  return (
    <div className="case-submit__progress">
      <p className="case-submit__step-label">
        {step} / {totalSteps}&nbsp;&nbsp;&nbsp;&nbsp;{label}
      </p>
      <div className="case-submit__progress-track">
        {Array.from({ length: totalSteps }, (_, index) => (
          <span
            key={index}
            className={`case-submit__progress-segment${index < step ? ' case-submit__progress-segment--active' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default CaseSubmitProgress

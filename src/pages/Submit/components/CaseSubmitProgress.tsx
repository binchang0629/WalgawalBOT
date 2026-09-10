import '../CaseSubmit.css'

interface CaseSubmitProgressProps {
  /** 1~4단계. 지훈05(접수 완료)는 이 컴포넌트를 쓰지 않는다 — Figma에서도 진행률이 비어 있다. */
  step: 1 | 2 | 3 | 4
  label: string
}

const TOTAL_STEPS = 4

/** 지훈01~04 공통 진행률 표시. */
function CaseSubmitProgress({ step, label }: CaseSubmitProgressProps) {
  return (
    <div className="case-submit__progress">
      <p className="case-submit__step-label">
        {step} / {TOTAL_STEPS}&nbsp;&nbsp;&nbsp;&nbsp;{label}
      </p>
      <div className="case-submit__progress-track">
        {Array.from({ length: TOTAL_STEPS }, (_, index) => (
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

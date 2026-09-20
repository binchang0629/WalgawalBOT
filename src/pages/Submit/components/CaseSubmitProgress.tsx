import type { CSSProperties } from 'react'
import '../CaseSubmit.css'

interface CaseSubmitProgressProps {
  /** 후일담 1~2 / 서아 1~3 / 지훈 1~4단계. 완료 화면에서는 진행률을 표시하지 않는다. */
  step: 1 | 2 | 3 | 4
  label: string
  totalSteps?: 2 | 3 | 4
}

/** 계정별 전체 단계 수를 받는 공통 진행률. */
function CaseSubmitProgress({ step, label, totalSteps = 4 }: CaseSubmitProgressProps) {
  const previousProgress = Math.max(0, ((step - 1) / totalSteps) * 100)
  const currentProgress = Math.min(100, (step / totalSteps) * 100)
  const progressStyle = {
    '--case-progress-from': `${previousProgress}%`,
    '--case-progress-to': `${currentProgress}%`,
  } as CSSProperties

  return (
    <div className="case-submit__progress">
      <p className="case-submit__step-label">{label}</p>
      <div className="case-submit__progress-track" role="img" aria-label={`${label} 진행 중`}>
        <span className="case-submit__progress-fill" style={progressStyle} />
      </div>
    </div>
  )
}

export default CaseSubmitProgress

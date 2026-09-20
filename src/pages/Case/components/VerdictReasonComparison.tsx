import { useId, useState } from 'react'

import completeIcon from '../../../assets/case/disagreement/criterion-complete.svg'
import requestIcon from '../../../assets/case/disagreement/criterion-request.svg'
import chevronIcon from '../../../assets/case/disagreement/reason-chevron.svg'
import './VerdictReasonComparison.css'

interface VerdictReasonComparisonProps {
  comparison: {
    eyebrow: string
    title: string
    criteria: readonly {
      id: 'ai' | 'jury'
      label: string
      keyword: string
      description: string
    }[]
  }
  verdict: {
    summary: string
    comparisonReasons: readonly string[]
  }
}

const criterionIcons = { ai: completeIcon, jury: requestIcon }

function VerdictReasonComparison({ comparison, verdict }: VerdictReasonComparisonProps) {
  // 근거와 투표 집계는 서로 독립적으로 열고 닫는다.
  const [isExpanded, setIsExpanded] = useState(false)
  const comparisonTitleId = useId()
  const detailsId = useId()
  const detailsTitleId = useId()

  return (
    <section className="verdict-reason-comparison" aria-labelledby={comparisonTitleId}>
      <div className="verdict-reason-comparison__heading">
        <p>{comparison.eyebrow}</p>
        <h2 id={comparisonTitleId}>{comparison.title}</h2>
      </div>

      <div className="verdict-reason-comparison__criteria">
        {comparison.criteria.map((criterion) => (
          <div key={criterion.id} className={'verdict-criterion verdict-criterion--' + criterion.id}>
            <p className="verdict-criterion__label">{criterion.label}</p>
            <img className="verdict-criterion__icon" src={criterionIcons[criterion.id]} alt="" />
            <h3>{criterion.keyword}</h3>
            <p className="verdict-criterion__description">{criterion.description}</p>
          </div>
        ))}
      </div>

      <div className="reason-details">
        <button
          type="button"
          className="reason-details__toggle"
          onClick={() => setIsExpanded((value) => !value)}
          aria-expanded={isExpanded}
          aria-controls={detailsId}
        >
          <span>1심 판멍이의 판단 근거 {isExpanded ? '접기' : '자세히 보기'}</span>
          <img className={isExpanded ? 'is-open' : ''} src={chevronIcon} alt="" />
        </button>

        <div
          id={detailsId}
          className={'reason-details__panel' + (isExpanded ? ' is-open' : '')}
          role="region"
          aria-labelledby={detailsTitleId}
          aria-hidden={!isExpanded}
          inert={!isExpanded}
        >
          <div className="reason-details__clip">
            <div className="reason-details__content">
              <h3 id={detailsTitleId}>1심 판멍이의 판단 근거</h3>
              <div className="reason-details__card">
                <p className="reason-details__summary">{verdict.summary}</p>
                <div className="reason-details__body">
                  {verdict.comparisonReasons.map((reason) => <p key={reason}>{reason}</p>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VerdictReasonComparison

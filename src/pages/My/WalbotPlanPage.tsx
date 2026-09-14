import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import useWizardBack from '../../hooks/useWizardBack'
import { PATHS } from '../../routes/paths'
import CaseSubmitHeader from '../Submit/components/CaseSubmitHeader'
import WalbotPlanManagePage from './WalbotPlanManagePage'
import selectedIcon from '../../assets/my/plan/radio-selected.svg'
import adFreeIcon from '../../assets/my/plan/benefit-ad-free.svg'
import unlimitedIcon from '../../assets/my/plan/benefit-unlimited.svg'
import reportIcon from '../../assets/my/plan/benefit-report.svg'
import './WalbotPlanPage.css'

const plans = [
  { id: 'annual', name: '연간', price: '￦39,000', accessiblePrice: '39,000원', billing: '7일 무료 체험 / 1년마다 결제', originalPrice: '￦49,000' },
  { id: 'monthly', name: '월간', price: '￦4,900', accessiblePrice: '4,900원', billing: '1개월마다 결제', originalPrice: null },
] as const

const benefits = [
  { id: 'ad-free', label: '광고 없이 사건 보기', icon: adFreeIcon },
  { id: 'unlimited', label: '재판 이용권 무제한', icon: unlimitedIcon },
  { id: 'report', label: '판멍이 AI 심층리포트', icon: reportIcon },
]

function WalbotPlanSelectionPage() {
  const navigate = useNavigate()
  const handleBack = useWizardBack(PATHS.my)
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[number]['id']>('annual')
  const [showNotice, setShowNotice] = useState(false)

  return (
    <main className="case-submit walbot-plan">
      <CaseSubmitHeader title="왈봇 플랜" showTempSave={false} onBack={handleBack} />

      <form className="walbot-plan__form" onSubmit={(event) => { event.preventDefault(); setShowNotice(true) }}>
        <div className="case-submit__body walbot-plan__body">
          <div className="case-submit__intro walbot-plan__intro">
            <h2 className="case-submit__heading">7일 무료체험으로<br />시작해보세요</h2>
            <p className="case-submit__description">광고 없이 사건을 보고, AI 심층리포트까지 확인해요.</p>
          </div>

          <div className="walbot-plan__selection">
            <fieldset className="walbot-plan__options">
              <legend className="walbot-plan__visually-hidden">이용 기간 선택</legend>
              {plans.map((plan) => (
                <label className="walbot-plan__option" key={plan.id}>
                  <input
                    type="radio"
                    name="plan-period"
                    value={plan.id}
                    checked={selectedPlan === plan.id}
                    onChange={() => { setSelectedPlan(plan.id); setShowNotice(false) }}
                    aria-label={`${plan.name} ${plan.accessiblePrice}`}
                    aria-describedby={`plan-${plan.id}-billing`}
                  />
                  <span className="walbot-plan__option-heading">
                    <span className="walbot-plan__identity">
                      <span className="walbot-plan__name">
                        {selectedPlan === plan.id && <img src={selectedIcon} width={15} height={15} alt="" />}
                        <strong>{plan.name}</strong>
                      </span>
                      {plan.id === 'annual' && <span className="walbot-plan__recommended">추천</span>}
                    </span>
                    <b>{plan.price}</b>
                  </span>
                  <span className="walbot-plan__billing" id={`plan-${plan.id}-billing`}>
                    <span>{plan.billing}</span>
                    {plan.originalPrice && <s>{plan.originalPrice}</s>}
                  </span>
                </label>
              ))}
            </fieldset>

            <ul className="walbot-plan__benefits" aria-label="플랜 혜택">
              {benefits.map((benefit) => (
                <li key={benefit.id}>
                  <span className={`walbot-plan__benefit-icon walbot-plan__benefit-icon--${benefit.id}`} aria-hidden="true"><img src={benefit.icon} alt="" /></span>
                  <span>{benefit.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="case-submit__footer walbot-plan__footer">
          {showNotice && <p className="walbot-plan__notice" role="status">무료체험 신청 기능은 준비 중이에요.</p>}
          <button type="submit" className="case-submit__primary">무료체험 시작하기</button>
          <button type="button" className="case-submit__footer-helper walbot-plan__skip" onClick={() => navigate(PATHS.my)}>다음에 할게요</button>
        </footer>
      </form>
    </main>
  )
}

export default function WalbotPlanPage() {
  const { personaId, sessionStatus } = useSession()
  return personaId === 'B' && sessionStatus === 'authenticated'
    ? <WalbotPlanManagePage key={`${personaId}:${sessionStatus}`} />
    : <WalbotPlanSelectionPage key={`${personaId}:${sessionStatus}`} />
}

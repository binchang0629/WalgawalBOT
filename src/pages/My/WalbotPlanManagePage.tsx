import SectionTitle from '../../components/common/SectionTitle'
import useToast from '../../hooks/useToast'
import useWizardBack from '../../hooks/useWizardBack'
import { PATHS } from '../../routes/paths'
import CaseSubmitHeader from '../Submit/components/CaseSubmitHeader'
import kakaoSymbol from '../../assets/my/plan/kakao-symbol.svg'
import kakaoMark from '../../assets/my/plan/kakao-mark.svg'
import kakaoP from '../../assets/my/plan/kakao-p.svg'
import kakaoA from '../../assets/my/plan/kakao-a.svg'
import kakaoY from '../../assets/my/plan/kakao-y.svg'
import chevron from '../../assets/my/plan/chevron.svg'
import { formatDemoMonthOffset } from '../../data/common/demoClock'
import './WalbotPlanManagePage.css'

/*
 * 결제일은 사용자가 처음 접속한 날을 기준으로 한 달씩 반복된다.
 * 첫 접속일이 이번 결제일이다. 다음 결제일 = 한 달 뒤, 결제 내역 = 이번 달(첫 접속일) · 지난달.
 * (예: 9/18 접속 → 다음 10/18, 내역 9/18 · 8/18) 시연용 값이며 실제 결제 기록이 아니다.
 * 시연 초기화로 첫 접속일이 바뀔 수 있어 렌더할 때 계산한다.
 */
const getPlanDates = () => ({
  nextPaymentDate: formatDemoMonthOffset(1),
  paymentHistory: [formatDemoMonthOffset(0), formatDemoMonthOffset(-1)],
})

function KakaoPayLogo() {
  return (
    <span className="walbot-plan-manage__kakao" aria-hidden="true">
      <img className="walbot-plan-manage__kakao-symbol" src={kakaoSymbol} alt="" />
      <img className="walbot-plan-manage__kakao-mark" src={kakaoMark} alt="" />
      <img className="walbot-plan-manage__kakao-p" src={kakaoP} alt="" />
      <img className="walbot-plan-manage__kakao-a" src={kakaoA} alt="" />
      <img className="walbot-plan-manage__kakao-y" src={kakaoY} alt="" />
    </span>
  )
}

export default function WalbotPlanManagePage() {
  const handleBack = useWizardBack(PATHS.my)
  const { showToast } = useToast()
  const { nextPaymentDate, paymentHistory } = getPlanDates()

  return (
    <main className="case-submit walbot-plan-manage my-detail-slide-enter">
      <CaseSubmitHeader title="왈봇 플랜" showTempSave={false} onBack={handleBack} />

      <div className="case-submit__body walbot-plan-manage__body">
        <div className="walbot-plan-manage__sections">
          <section className="walbot-plan-manage__section" aria-label="이용 중인 플랜">
            <SectionTitle title="이용 중인 플랜" />
            <div className="walbot-plan-manage__current">
              <div className="walbot-plan-manage__summary">
                <div className="walbot-plan-manage__details">
                  <div className="walbot-plan-manage__plan-title">
                    <span className="walbot-plan-manage__badge">이용 중</span>
                    <h3>월간 왈봇 플랜</h3>
                  </div>
                  <p className="walbot-plan-manage__benefits">광고 제거 · 재판 이용권 무제한 · AI 심층리포트</p>
                </div>
                <p className="walbot-plan-manage__price">4,900원 / 월</p>
              </div>
              <dl className="walbot-plan-manage__billing">
                <dt>다음 결제일</dt>
                <dd>{nextPaymentDate}</dd>
              </dl>
            </div>
          </section>

          <section className="walbot-plan-manage__section" aria-label="결제수단">
            <SectionTitle title="결제수단" />
            <button
              type="button"
              className="walbot-plan-manage__payment"
              aria-label="카카오페이 결제수단 변경"
              onClick={() => showToast('결제수단 변경은 준비 중이에요.')}
            >
              <KakaoPayLogo />
              <span className="walbot-plan-manage__payment-info">
                <strong>카카오페이</strong>
                <span>연결된 결제수단</span>
              </span>
              <span className="walbot-plan-manage__payment-action">변경<img src={chevron} width={6} height={10} alt="" /></span>
            </button>
          </section>

          <section className="walbot-plan-manage__section" aria-label="결제 내역">
            <SectionTitle
              title="결제 내역"
              action="전체보기"
              onActionClick={() => showToast('결제 내역 2건을 모두 표시했어요.')}
            />
            <ul className="walbot-plan-manage__history">
              {paymentHistory.map((date) => (
                <li key={date}>
                  <time dateTime={date.replaceAll('.', '-')}>{date}</time>
                  <span className="walbot-plan-manage__history-details">
                    <span className="walbot-plan-manage__payment-status">결제 완료</span>
                    <strong>4,900원</strong>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="walbot-plan-manage__section" aria-label="플랜 관리">
            <SectionTitle title="플랜 관리" />
            <div className="walbot-plan-manage__actions">
              <button
                type="button"
                onClick={() => showToast('연간 플랜 변경은 준비 중이에요.')}
              >
                <span>연간 플랜으로 변경</span>
                <img src={chevron} width={6} height={10} alt="" />
              </button>
              <button
                type="button"
                className="walbot-plan-manage__cancel"
                onClick={() => showToast('구독 해지는 준비 중이에요.')}
              >
                <span>구독 해지</span>
                <img src={chevron} width={6} height={10} alt="" />
              </button>
            </div>
          </section>
        </div>

        <p className="walbot-plan-manage__helper">구독은 다음 결제일 전까지 언제든 변경하거나 해지할 수 있어요.</p>
      </div>
    </main>
  )
}

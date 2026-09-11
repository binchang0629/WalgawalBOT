import { useState } from 'react'
import SectionTitle from '../../components/common/SectionTitle'
import useWizardBack from '../../hooks/useWizardBack'
import { PATHS } from '../../routes/paths'
import CaseSubmitHeader from '../Submit/components/CaseSubmitHeader'
import kakaoSymbol from '../../assets/my/plan/kakao-symbol.svg'
import kakaoMark from '../../assets/my/plan/kakao-mark.svg'
import kakaoP from '../../assets/my/plan/kakao-p.svg'
import kakaoA from '../../assets/my/plan/kakao-a.svg'
import kakaoY from '../../assets/my/plan/kakao-y.svg'
import chevron from '../../assets/my/plan/chevron.svg'
import './WalbotPlanManagePage.css'

const paymentHistory = ['2026.08.25', '2026.07.25'] as const

type Notice = { section: 'payment' | 'history' | 'management'; message: string }

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
  const [notice, setNotice] = useState<Notice | null>(null)

  return (
    <main className="case-submit walbot-plan-manage">
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
                <dd>2026.09.25</dd>
              </dl>
            </div>
          </section>

          <section className="walbot-plan-manage__section" aria-label="결제수단">
            <SectionTitle title="결제수단" />
            <button
              type="button"
              className="walbot-plan-manage__payment"
              aria-label="카카오페이 결제수단 변경"
              onClick={() => setNotice({ section: 'payment', message: '결제수단 변경 기능은 준비 중이에요. 현재 연결된 결제수단은 유지됩니다.' })}
            >
              <KakaoPayLogo />
              <span className="walbot-plan-manage__payment-info">
                <strong>카카오페이</strong>
                <span>연결된 결제수단</span>
              </span>
              <span className="walbot-plan-manage__payment-action">변경<img src={chevron} width={6} height={10} alt="" /></span>
            </button>
            {notice?.section === 'payment' && <p className="walbot-plan-manage__notice" role="status">{notice.message}</p>}
          </section>

          <section className="walbot-plan-manage__section" aria-label="결제 내역">
            <SectionTitle
              title="결제 내역"
              action="전체보기"
              onActionClick={() => setNotice({ section: 'history', message: '현재 확인할 수 있는 결제 내역 2건을 모두 표시하고 있어요.' })}
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
            {notice?.section === 'history' && <p className="walbot-plan-manage__notice" role="status">{notice.message}</p>}
          </section>

          <section className="walbot-plan-manage__section" aria-label="플랜 관리">
            <SectionTitle title="플랜 관리" />
            <div className="walbot-plan-manage__actions">
              <button
                type="button"
                onClick={() => setNotice({ section: 'management', message: '연간 플랜 변경 기능은 준비 중이에요. 현재 월간 플랜은 유지됩니다.' })}
              >
                <span>연간 플랜으로 변경</span>
                <img src={chevron} width={6} height={10} alt="" />
              </button>
              <button
                type="button"
                className="walbot-plan-manage__cancel"
                onClick={() => setNotice({ section: 'management', message: '구독 해지 기능은 준비 중이에요. 현재 구독은 해지되지 않았어요.' })}
              >
                <span>구독 해지</span>
                <img src={chevron} width={6} height={10} alt="" />
              </button>
            </div>
            {notice?.section === 'management' && <p className="walbot-plan-manage__notice" role="status">{notice.message}</p>}
          </section>
        </div>

        <p className="walbot-plan-manage__helper">구독은 다음 결제일 전까지 언제든 변경하거나 해지할 수 있어요.</p>
      </div>
    </main>
  )
}

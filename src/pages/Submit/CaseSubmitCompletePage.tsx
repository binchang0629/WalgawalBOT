import { Navigate, useNavigate } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import CaseSubmitHeader from './components/CaseSubmitHeader'
import CaseSubmitFooter from './components/CaseSubmitFooter'
import useCaseSubmitDraft from './useCaseSubmitDraft'
import panMungyeeJudge from '../../assets/submit/figma/imgPanMungyeeJudge.png'
import './CaseSubmit.css'
import './CaseSubmitCompletePage.css'

/**
 * 사건 접수 5단계 — 지훈05 / 접수 완료.
 * Figma node 1446:10071 기준. 진행률 바가 없고 헤더도 뒤로가기만 남는다.
 */
function CaseSubmitCompletePage() {
  const { isSubmitted, summary } = useCaseSubmitDraft()
  const navigate = useNavigate()

  // 실제로 접수를 마치지 않고 URL로 바로 들어온 경우 완료 화면을 보여주지 않는다.
  if (!isSubmitted) {
    return <Navigate to={PATHS.caseSubmit} replace />
  }

  const handleBack = () => navigate(PATHS.home, { replace: true })

  return (
    <div className="case-submit">
      <CaseSubmitHeader onBack={handleBack} title="" showTempSave={false} />

      <div className="case-submit__complete-body">
        <img
          src={panMungyeeJudge}
          alt="판사 옷을 입은 판멍이 캐릭터"
          className="case-submit__complete-art"
          width={150}
          height={122}
        />
        <div className="case-submit__complete-message">
          <h2 className="case-submit__heading">사건 접수 완료!</h2>
          <p className="case-submit__description">이제 내 사건에서 내용을 다시 확인할 수 있어요.</p>
        </div>

        <div className="case-submit__receipt">
          <h3 className="case-submit__receipt-title">{summary.title}</h3>
          <p className="case-submit__receipt-visibility">공개 범위&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;나만 보기</p>
        </div>

        <p className="case-submit__complete-reminder">공개 범위는 내 사건에서 변경할 수 있어요.</p>
      </div>

      <CaseSubmitFooter type="button" primaryLabel="홈으로 돌아가기" onPrimaryClick={handleBack} />
    </div>
  )
}

export default CaseSubmitCompletePage

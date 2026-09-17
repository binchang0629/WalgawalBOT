import { Navigate, useNavigate } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import CaseSubmitHeader from './components/CaseSubmitHeader'
import CaseSubmitFooter from './components/CaseSubmitFooter'
import useCaseSubmitDraft from './useCaseSubmitDraft'
import CompletionScene from '../../components/common/CompletionScene'
import './CaseSubmit.css'
import './CaseSubmitCompletePage.css'

/**
 * 접수 완료 — 서아04(1446:10207) / 지훈05(1446:10071).
 * 계정별 제목·공개 범위를 표시하며 헤더는 뒤로가기만 남긴다.
 */
function CaseSubmitCompletePage() {
  const { personaId, isSubmitted, summary, visibility, returnHistoryIndex } = useCaseSubmitDraft()
  const navigate = useNavigate()

  // 실제로 접수를 마치지 않고 URL로 바로 들어온 경우 완료 화면을 보여주지 않는다.
  if (!isSubmitted) {
    return <Navigate to={PATHS.caseSubmit} replace />
  }

  const handleBack = () => {
    const currentIndex = (window.history.state as { idx?: unknown } | null)?.idx
    if (returnHistoryIndex !== null && typeof currentIndex === 'number' && currentIndex > returnHistoryIndex) {
      navigate(returnHistoryIndex - currentIndex)
      return
    }
    navigate(PATHS.home, { replace: true })
  }
  const handlePrimaryClick = () => {
    navigate(PATHS.myCases, { replace: true })
  }

  return (
    <div className={`case-submit case-submit--complete${personaId === 'A' ? ' case-submit--seoa' : ''}`}>
      <CaseSubmitHeader onBack={handleBack} title="" showTempSave={false} />
      <div className="case-submit__complete-spacer" aria-hidden="true" />

      <CompletionScene
        title="사건 접수 완료!"
        folderTitle={summary.title}
        detailLabel="공개 범위"
        detailValue={visibility === 'community' ? '배심원 광장에 공개' : '나만 보기'}
        reminder="공개 범위는 내 사건에서 변경할 수 있어요."
      />

      <CaseSubmitFooter
        type="button"
        primaryLabel="접수한 내용 확인하기"
        onPrimaryClick={handlePrimaryClick}
      />
    </div>
  )
}

export default CaseSubmitCompletePage

import chevronLeft from '../../../assets/submit/figma/imgChevronLeft.svg'
import '../CaseSubmit.css'

interface CaseSubmitHeaderProps {
  onBack: () => void
  /** 지훈05(접수 완료)는 제목·임시저장 없이 뒤로가기만 보여준다. */
  title?: string
  showTempSave?: boolean
}

/**
 * 지훈01~05 공통 헤더. Figma `Header` 컴포넌트 설명대로
 * 좌·우 슬롯을 항상 같은 너비로 유지해 제목이 가운데에서 밀리지 않게 한다. (node 1446:9890)
 */
function CaseSubmitHeader({ onBack, title = '사건 접수', showTempSave = true }: CaseSubmitHeaderProps) {
  return (
    <header className="case-submit__header">
      <button type="button" className="case-submit__back" onClick={onBack} aria-label="뒤로 가기">
        <img src={chevronLeft} alt="" width={8} height={16} />
      </button>
      <h1 className="case-submit__title">{title}</h1>
      {showTempSave ? (
        <button
          type="button"
          className="case-submit__temp-save"
          disabled
          title="임시저장은 아직 준비 중이에요"
        >
          임시저장
        </button>
      ) : (
        <span className="case-submit__temp-save" aria-hidden="true" />
      )}
    </header>
  )
}

export default CaseSubmitHeader

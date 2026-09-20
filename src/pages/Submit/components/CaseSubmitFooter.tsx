import '../CaseSubmit.css'

interface CaseSubmitFooterProps {
  primaryLabel: string
  /** 지훈05(접수 완료)는 버튼 아래 안내 문구가 없다. */
  helperText?: string
  disabled?: boolean
  type?: 'button' | 'submit'
  onPrimaryClick?: () => void
}

/** 지훈01~05 공통 하단 고정 CTA. */
function CaseSubmitFooter({
  primaryLabel,
  helperText,
  disabled = false,
  type = 'submit',
  onPrimaryClick,
}: CaseSubmitFooterProps) {
  return (
    <footer className="case-submit__footer">
      <button type={type} className="case-submit__primary" disabled={disabled} onClick={onPrimaryClick}>
        {primaryLabel}
      </button>
      {helperText && <p className="case-submit__footer-helper">{helperText}</p>}
    </footer>
  )
}

export default CaseSubmitFooter

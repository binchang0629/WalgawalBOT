import chevronRight from '../../../assets/icons/chevron-right.svg'
import './CompactSwitchButton.css'

interface CompactSwitchButtonProps {
  current: number
  total: number
  label: string
  ariaLabel: string
  onClick: () => void
}

/** 홈 섹션에서 콘텐츠 묶음을 바꾸는 공통 compact pagination 버튼. */
function CompactSwitchButton({ current, total, label, ariaLabel, onClick }: CompactSwitchButtonProps) {
  return (
    <button type="button" className="compact-switch" onClick={onClick} aria-label={ariaLabel}>
      <span className="compact-switch__pager" aria-live="polite">
        <b>{current}</b><span>/{total}</span>
      </span>
      <span className="compact-switch__label">{label}</span>
      <img src={chevronRight} alt="" aria-hidden="true" />
    </button>
  )
}

export default CompactSwitchButton

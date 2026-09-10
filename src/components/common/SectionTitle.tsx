import type { ReactNode } from 'react'
import chevronRight from '../../assets/icons/chevron-right.svg'
import './SectionTitle.css'

/**
 * 섹션 제목.
 *
 * Figma의 `SectionTitle` 컴포넌트를 그대로 옮긴 것이다.
 * 홈의 여섯 섹션과 광장에서 같은 구조가 쓰여 공통 폴더에 둔다. (PROJECT_SPEC.md §7-2)
 *
 * - 제목: Paperlogy 7 Bold. 기본 20px, 오늘의 사건만 22px(`size="lg"`)
 * - 액션: 텍스트만 있는 형태(`더보기 +`)와 화살표가 붙는 형태(`자세히 보기 ›`) 두 가지
 */

interface SectionTitleProps {
  title: ReactNode
  description?: string
  /** 오른쪽 액션 문구. 없으면 그리지 않는다. */
  action?: string
  /** 액션 오른쪽에 화살표를 붙일지. 시안의 `더보기 +`는 화살표가 없다. */
  actionArrow?: boolean
  /** 제목 오른쪽에 붙는 요소 (밸런스 게임의 새로고침 버튼 등) */
  titleSuffix?: ReactNode
  /** 액션 자리에 임의 요소를 넣을 때 (밸런스 게임의 `1/4` 표시) */
  actionSlot?: ReactNode
  size?: 'md' | 'lg'
  onActionClick?: () => void
}

function SectionTitle({
  title,
  description,
  action,
  actionArrow = true,
  titleSuffix,
  actionSlot,
  size = 'md',
  onActionClick,
}: SectionTitleProps) {
  return (
    <div className={`section-title section-title--${size}`}>
      <div className="section-title__row">
        <div className="section-title__heading">
          <h2>{title}</h2>
          {titleSuffix}
        </div>
        {actionSlot}
        {!actionSlot && action && (
          <button type="button" className="section-title__action" onClick={onActionClick}>
            {action}
            {actionArrow && <img src={chevronRight} alt="" aria-hidden="true" />}
          </button>
        )}
      </div>
      {description && <p className="section-title__desc">{description}</p>}
    </div>
  )
}

export default SectionTitle

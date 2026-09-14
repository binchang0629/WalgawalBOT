import { useState } from 'react'
import previousAbleIcon from '../../assets/icons/pagination/prev-able.svg'
import previousClickIcon from '../../assets/icons/pagination/prev-click.svg'
import previousDefaultIcon from '../../assets/icons/pagination/prev-default.svg'
import nextAbleIcon from '../../assets/icons/pagination/next-able.svg'
import nextClickIcon from '../../assets/icons/pagination/next-click.svg'
import nextDefaultIcon from '../../assets/icons/pagination/next-default.svg'
import './Pagination.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  ariaLabel?: string
  /** 광장 시안은 이동 가능한 화살표도 기본 회색으로 표시한다. */
  neutralArrows?: boolean
}

type ArrowDirection = 'previous' | 'next'
type ArrowState = 'default' | 'able' | 'click'

const arrowIcons: Record<ArrowDirection, Record<ArrowState, string>> = {
  previous: {
    default: previousDefaultIcon,
    able: previousAbleIcon,
    click: previousClickIcon,
  },
  next: {
    default: nextDefaultIcon,
    able: nextAbleIcon,
    click: nextClickIcon,
  },
}

/** Figma 페이지네이션: 이동 불가·이동 가능·누르는 순간의 화살표 상태를 모두 제공한다. */
function Pagination({ currentPage, totalPages, onPageChange, ariaLabel = '페이지 선택', neutralArrows = false }: PaginationProps) {
  const [pressedArrow, setPressedArrow] = useState<ArrowDirection | null>(null)
  const pageCount = Number.isFinite(totalPages) ? Math.max(0, Math.floor(totalPages)) : 0
  if (pageCount === 0) return null

  const activePage = Number.isFinite(currentPage)
    ? Math.min(pageCount, Math.max(1, Math.floor(currentPage)))
    : 1
  const firstPage = Math.floor((activePage - 1) / 5) * 5 + 1
  const pages = Array.from({ length: Math.min(5, pageCount - firstPage + 1) }, (_, index) => firstPage + index)

  const arrowState = (direction: ArrowDirection, disabled: boolean): ArrowState => {
    if (disabled) return 'default'
    if (neutralArrows && pressedArrow !== direction) return 'default'
    return pressedArrow === direction ? 'click' : 'able'
  }

  const renderArrow = (direction: ArrowDirection) => {
    const isPrevious = direction === 'previous'
    const isDisabled = isPrevious ? activePage === 1 : activePage === pageCount
    const nextPage = isPrevious ? activePage - 1 : activePage + 1
    const state = arrowState(direction, isDisabled)

    return (
      <button
        type="button"
        className={
          isPrevious
            ? 'app-pagination__arrow'
            : 'app-pagination__arrow app-pagination__arrow--next'
        }
        aria-label={isPrevious ? '이전 페이지' : '다음 페이지'}
        disabled={isDisabled}
        onClick={() => onPageChange(nextPage)}
        onPointerDown={() => setPressedArrow(direction)}
        onPointerUp={() => setPressedArrow(null)}
        onPointerLeave={() => setPressedArrow(null)}
        onPointerCancel={() => setPressedArrow(null)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') setPressedArrow(direction)
        }}
        onKeyUp={() => setPressedArrow(null)}
      >
        <img
          className={isPrevious ? 'app-pagination__arrow-icon' : 'app-pagination__arrow-icon app-pagination__arrow-icon--next'}
          src={arrowIcons[direction][state]}
          alt=""
        />
      </button>
    )
  }

  return (
    <nav className="app-pagination" aria-label={ariaLabel}>
      {renderArrow('previous')}
      <div className="app-pagination__pages">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className="app-pagination__page"
            aria-label={String(page) + '페이지'}
            aria-current={activePage === page ? 'page' : undefined}
            onClick={() => { if (page !== activePage) onPageChange(page) }}
          >
            {page}
          </button>
        ))}
      </div>
      {renderArrow('next')}
    </nav>
  )
}

export default Pagination

import previousIcon from '../../assets/icons/pagination-prev.svg'
import nextIcon from '../../assets/icons/pagination-next.svg'
import './Pagination.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  ariaLabel?: string
}

/** Controlled pagination with up to five page buttons in the shared Figma layout. */
function Pagination({ currentPage, totalPages, onPageChange, ariaLabel = '페이지 선택' }: PaginationProps) {
  const pageCount = Number.isFinite(totalPages) ? Math.max(0, Math.floor(totalPages)) : 0
  if (pageCount === 0) return null

  const activePage = Number.isFinite(currentPage)
    ? Math.min(pageCount, Math.max(1, Math.floor(currentPage)))
    : 1
  const firstPage = Math.floor((activePage - 1) / 5) * 5 + 1
  const pages = Array.from({ length: Math.min(5, pageCount - firstPage + 1) }, (_, index) => firstPage + index)

  return (
    <nav className="app-pagination" aria-label={ariaLabel}>
      <button
        type="button"
        className="app-pagination__arrow"
        aria-label="이전 페이지"
        disabled={activePage === 1}
        onClick={() => onPageChange(activePage - 1)}
      >
        <img src={previousIcon} alt="" />
      </button>
      <div className="app-pagination__pages">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className="app-pagination__page"
            aria-label={`${page}페이지`}
            aria-current={activePage === page ? 'page' : undefined}
            onClick={() => { if (page !== activePage) onPageChange(page) }}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="app-pagination__arrow app-pagination__arrow--next"
        aria-label="다음 페이지"
        disabled={activePage === pageCount}
        onClick={() => onPageChange(activePage + 1)}
      >
        <img src={nextIcon} alt="" />
      </button>
    </nav>
  )
}

export default Pagination

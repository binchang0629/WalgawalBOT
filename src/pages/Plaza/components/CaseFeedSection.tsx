import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  caseCategories,
  categoryDotColor,
  latestPlazaCaseIds,
  plazaCases,
  plazaViewOptions,
} from '../../../data/common/plazaContent'
import type { PlazaViewKey } from '../../../data/common/plazaContent'
import type { CaseCategory } from '../../../types'
import useSession from '../../../hooks/useSession'
import { MY_CASES } from '../../../data/personas/myCases'
import Pagination from '../../../components/common/Pagination'
import { toCaseDetail } from '../../../routes/paths'
import searchIcon from '../../../assets/plaza/search-field.svg'
import chevronDown from '../../../assets/icons/chevron-down.svg'

type CategoryFilter = CaseCategory | '전체'

const CASES_PER_PAGE = 4

function CaseFeedSection() {
  const [category, setCategory] = useState<CategoryFilter>('전체')
  const [view, setView] = useState<PlazaViewKey>('latest')
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const viewRef = useRef<HTMLDivElement>(null)

  const { personaId } = useSession()
  /** 추천사건은 내가 올린 사건과 같은 분야를 보여준다. 서아는 친구, 지훈은 직장이다. */
  const myCategory = MY_CASES[personaId].category

  const currentView = plazaViewOptions.find((option) => option.key === view) ?? plazaViewOptions[0]

  /*
   * 보기 기준은 목록을 고르거나 순서를 바꾼다.
   * 최신사건은 조회·댓글 수가 아닌 시연용 게시 순서를 따른다.
   */
  const viewedCases = useMemo(() => {
    switch (view) {
      case 'popular':
        return [...plazaCases].sort((a, b) => b.viewCount - a.viewCount)
      case 'voting':
        return plazaCases.filter((item) => item.status === 'voting')
      case 'closed':
        return plazaCases.filter((item) => item.status === 'closed')
      case 'recommended':
        return plazaCases.filter((item) => item.category === myCategory)
      default:
        return [...plazaCases].sort(
          (a, b) => latestPlazaCaseIds.indexOf(a.id as typeof latestPlazaCaseIds[number])
            - latestPlazaCaseIds.indexOf(b.id as typeof latestPlazaCaseIds[number]),
        )
    }
  }, [view, myCategory])

  const filteredCases =
    category === '전체' ? viewedCases : viewedCases.filter((item) => item.category === category)
  const totalPages = Math.max(1, Math.ceil(filteredCases.length / CASES_PER_PAGE))
  const pageCases = filteredCases.slice(
    (currentPage - 1) * CASES_PER_PAGE,
    currentPage * CASES_PER_PAGE,
  )

  // 바깥을 누르거나 Esc를 누르면 메뉴를 닫는다. 열려 있을 때만 듣는다.
  useEffect(() => {
    if (!isViewOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!viewRef.current?.contains(event.target as Node)) setIsViewOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsViewOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isViewOpen])

  const handleCategoryChange = (nextCategory: CategoryFilter) => {
    setCategory(nextCategory)
    setCurrentPage(1)
  }

  const handleViewChange = (nextView: PlazaViewKey) => {
    setView(nextView)
    setIsViewOpen(false)
    setCurrentPage(1)
  }

  return (
    <section className="case-feed">
      <div className="case-feed__header">
        <div>
          <h2 className="case-feed__title">전체 사건</h2>
          <p className="case-feed__description">다른 배심원들의 판단을 기다리는 이야기</p>
        </div>

        <div className={isViewOpen ? 'case-feed__view is-open' : 'case-feed__view'} ref={viewRef}>
          <button
            type="button"
            className="case-feed__sort"
            aria-haspopup="listbox"
            aria-expanded={isViewOpen}
            onClick={() => setIsViewOpen((open) => !open)}
          >
            {currentView.label}
            <img src={chevronDown} alt="" width={18} height={18} />
          </button>

          {isViewOpen && (
            <div className="case-feed__view-menu" role="listbox" aria-label="사건 보기 기준">
              {plazaViewOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  role="option"
                  aria-selected={option.key === view}
                  className={
                    option.key === view
                      ? 'case-feed__view-item is-current'
                      : 'case-feed__view-item'
                  }
                  onClick={() => handleViewChange(option.key)}
                >
                  <b>{option.label}</b>
                  <small>{option.description}</small>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="case-search">
        <img src={searchIcon} alt="" width={24} height={24} />
        <input
          type="search"
          className="case-search__input"
          placeholder="사연, 사건 키워드 또는 AI 추천 검색..."
          disabled
          title="검색 동작은 시안 확정 후 연결됩니다"
        />
      </div>

      <div className="case-feed__body">
        <div className="case-feed__list-wrap">
          <div className="category-filter" role="group" aria-label="카테고리 필터">
            {caseCategories.map((item) => (
              <button
                key={item}
                type="button"
                className={category === item ? 'category-chip is-active' : 'category-chip'}
                aria-pressed={category === item}
                onClick={() => handleCategoryChange(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <ul className="case-list">
            {pageCases.map((item) => {
              const cardContent = (
                <>
                  <div className="case-card__meta">
                    <span className="case-card__category">
                      <i style={{ background: categoryDotColor[item.category] }} aria-hidden="true" />
                      <span style={{ color: categoryDotColor[item.category] }}>{item.tag}</span>
                    </span>
                    <span
                      className={
                        (item.verdictTone ?? (item.isVerdictAligned ? 'blue' : 'orange')) === 'blue'
                          ? 'case-card__verdict is-blue'
                          : 'case-card__verdict'
                      }
                    >
                      AI와 배심원 의견 {item.isVerdictAligned ? '일치' : '불일치'}
                    </span>
                  </div>

                  <h3 className="case-card__title">
                    {item.title.split('\n').map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h3>
                  <p className="case-card__summary">{item.summary}</p>

                  <div className="case-card__info">
                    <span>조회수 {item.viewCount}</span>
                    <span>댓글 {item.commentCount}</span>
                  </div>
                </>
              )

              return (
                <li className="case-card" key={item.id}>
                  {item.id === 'case-company-874' ? (
                    <Link
                      className="case-card__link"
                      to={toCaseDetail(item.id)}
                      aria-label={item.title.replace('\n', ' ') + ' 사건 상세 보기'}
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <div className="case-card__content">{cardContent}</div>
                  )}
                </li>
              )
            })}
          </ul>

          {pageCases.length === 0 && (
            <p className="case-list__empty">아직 이 조건에 맞는 사건이 없어요.</p>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          ariaLabel="사건 목록 페이지"
          neutralArrows
        />
      </div>
    </section>
  )
}

export default CaseFeedSection

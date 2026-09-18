import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  caseCategories,
  latestPlazaCaseIds,
  plazaCases,
  plazaViewOptions,
} from '../../../data/common/plazaContent'
import type { PlazaViewKey } from '../../../data/common/plazaContent'
import type { CaseCategory } from '../../../types'
import useSession from '../../../hooks/useSession'
import { MY_CASES } from '../../../data/personas/myCases'
import Pagination from '../../../components/common/Pagination'
import CaseFeedCard from '../../../components/common/CaseFeedCard'
import {
  savePlazaReturnState,
  type PlazaReturnState,
} from '../../../utils/plazaReturnState'
import searchIcon from '../../../assets/plaza/search-field.svg'
import chevronDown from '../../../assets/icons/chevron-down.svg'

type CategoryFilter = CaseCategory | '전체'

const CASES_PER_PAGE = 4
function CaseFeedSection({ restoreState }: { restoreState?: PlazaReturnState | null }) {
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState<CategoryFilter>(restoreState?.category ?? '전체')
  const [view, setView] = useState<PlazaViewKey>(() => (
    restoreState?.view ?? (searchParams.get('view') === 'closed' ? 'closed' : 'latest')
  ))
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(restoreState?.currentPage ?? 1)
  const routeSearchQuery = searchParams.get('q') ?? ''
  const [searchQuery, setSearchQuery] = useState(restoreState?.searchQuery ?? routeSearchQuery)
  const caseFeedRef = useRef<HTMLElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
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
        return [...plazaCases].sort((a, b) => b.viewCount - a.viewCount
          || latestPlazaCaseIds.indexOf(a.id as typeof latestPlazaCaseIds[number])
          - latestPlazaCaseIds.indexOf(b.id as typeof latestPlazaCaseIds[number]))
      case 'voting':
        return latestPlazaCaseIds.map((id) => plazaCases.find((item) => item.id === id))
          .filter((item): item is (typeof plazaCases)[number] => Boolean(item && item.status === 'voting'))
      case 'closed':
        return latestPlazaCaseIds.map((id) => plazaCases.find((item) => item.id === id))
          .filter((item): item is (typeof plazaCases)[number] => Boolean(item && item.status === 'closed'))
      case 'recommended':
        return latestPlazaCaseIds.map((id) => plazaCases.find((item) => item.id === id))
          .filter((item): item is (typeof plazaCases)[number] => Boolean(item && item.category === myCategory))
      default:
        return [...plazaCases].sort(
          (a, b) => latestPlazaCaseIds.indexOf(a.id as typeof latestPlazaCaseIds[number])
            - latestPlazaCaseIds.indexOf(b.id as typeof latestPlazaCaseIds[number]),
        )
    }
  }, [view, myCategory])

  const filteredCases =
    category === '전체' ? viewedCases : viewedCases.filter((item) => item.category === category)
  const normalizedSearchQuery = searchQuery.trim()
  const exactSearchCategory = caseCategories.find((item) => item === normalizedSearchQuery)
  const searchCases = useMemo(() => {
    if (!normalizedSearchQuery) return []

    if (exactSearchCategory) {
      return exactSearchCategory === '전체'
        ? viewedCases
        : viewedCases.filter((item) => item.category === exactSearchCategory)
    }

    const query = normalizedSearchQuery.replace(/\s+/g, ' ').toLocaleLowerCase()
    return filteredCases.filter((item) => (
      `${item.title} ${item.summary} ${item.category} ${item.tag}`
        .replace(/\s+/g, ' ')
        .toLocaleLowerCase()
        .includes(query)
    ))
  }, [exactSearchCategory, filteredCases, normalizedSearchQuery, viewedCases])
  const activeCategory = exactSearchCategory ?? category
  const displayedCases = normalizedSearchQuery ? searchCases : filteredCases
  const totalPages = Math.max(1, Math.ceil(displayedCases.length / CASES_PER_PAGE))
  const pageCases = displayedCases.slice(
    (currentPage - 1) * CASES_PER_PAGE,
    currentPage * CASES_PER_PAGE,
  )

  useLayoutEffect(() => {
    if (!restoreState) return

    let secondFrame = 0
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        const scrollContainer = caseFeedRef.current?.closest<HTMLElement>('.main-layout__scroll')
        const clickedCard = caseFeedRef.current?.querySelector<HTMLElement>(
          `[data-case-id="${restoreState.cardId}"]`,
        )

        if (scrollContainer && clickedCard) {
          scrollContainer.scrollTo({ top: restoreState.scrollTop, behavior: 'auto' })
        }
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
    }
  }, [restoreState])

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
    setSearchQuery('')
    setCategory(nextCategory)
    setCurrentPage(1)
  }

  const handleViewChange = (nextView: PlazaViewKey) => {
    setSearchQuery('')
    setView(nextView)
    setIsViewOpen(false)
    setCurrentPage(1)
  }

  const handlePageChange = (nextPage: number) => {
    if (nextPage === currentPage) return

    setCurrentPage(nextPage)
    requestAnimationFrame(() => {
      caseFeedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <section className="case-feed" ref={caseFeedRef}>
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

          <div
            className={isViewOpen ? 'case-feed__view-menu is-open' : 'case-feed__view-menu'}
            role="listbox"
            aria-label="사건 보기 기준"
            aria-hidden={!isViewOpen}
          >
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
                tabIndex={isViewOpen ? 0 : -1}
              >
                <b>{option.label}</b>
                <small>{option.description}</small>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="case-search">
        <img src={searchIcon} alt="" width={24} height={24} />
        <input
          ref={searchInputRef}
          type="search"
          className="case-search__input"
          placeholder="사연, 사건 키워드 또는 AI 추천 검색..."
          value={searchQuery}
          aria-label="사연 및 사건 키워드 검색"
          onChange={(event) => {
            setSearchQuery(event.target.value)
            setCategory('전체')
            setCurrentPage(1)
          }}
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            className="case-search__clear"
            aria-label="검색어 지우기"
            onClick={() => {
              setSearchQuery('')
              setCategory('전체')
              setCurrentPage(1)
              window.requestAnimationFrame(() => searchInputRef.current?.focus())
            }}
          >
            <span className="search-close-mark" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="case-feed__body">
        <div className="case-feed__list-wrap">
          <div className="category-filter" role="group" aria-label="카테고리 필터">
            {caseCategories.map((item) => (
              <button
                key={item}
                type="button"
                className={activeCategory === item ? 'category-chip is-active' : 'category-chip'}
                aria-pressed={activeCategory === item}
                onClick={() => handleCategoryChange(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {normalizedSearchQuery && (
            <p className="case-search__result" aria-live="polite">
              <b>‘{normalizedSearchQuery}’</b> 관련 사건을 모아봤어요
            </p>
          )}

          <ul className="case-list" key={`case-list-${activeCategory}-${normalizedSearchQuery}`}>
            {pageCases.map((item, index) => (
              <CaseFeedCard
                key={item.id}
                item={item}
                index={index}
                fromPlaza
                onOpen={() => {
                  const scrollContainer = caseFeedRef.current
                    ?.closest<HTMLElement>('.main-layout__scroll')
                  savePlazaReturnState({
                    cardId: item.id,
                    category,
                    currentPage,
                    searchQuery,
                    scrollTop: scrollContainer?.scrollTop ?? 0,
                    view,
                  })
                }}
              />
            ))}
          </ul>

          {pageCases.length === 0 && (
            <p className="case-list__empty">아직 이 조건에 맞는 사건이 없어요.</p>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          ariaLabel="사건 목록 페이지"
        />
      </div>
    </section>
  )
}

export default CaseFeedSection
